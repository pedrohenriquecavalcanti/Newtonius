const canvas = document.getElementById('ink-canvas');
if (!canvas) {
  throw new Error('ink-canvas element not found');
}

const ctx = canvas.getContext('2d', { alpha: true });
const STATE = {
  points: [],
  lastDrawnIndex: 0,
  drawing: false,
  pointerId: null,
};

const MAX_POINTS = 64;
const TENSION = 0.5; // Catmull-Rom tension parameter
const JITTER_DISTANCE_SQ = 0.36; // 0.6px squared
const STROKE_STYLE = '#101820';
const LINE_WIDTH = 2.6;

function getRelativePoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

export function resizeCanvas() {
  const cssWidth = canvas.clientWidth;
  const cssHeight = canvas.clientHeight;
  if (cssWidth === 0 || cssHeight === 0) {
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  const previousWidth = canvas.width;
  const previousHeight = canvas.height;

  let snapshot = null;
  if (previousWidth && previousHeight) {
    snapshot = document.createElement('canvas');
    snapshot.width = previousWidth;
    snapshot.height = previousHeight;
    const snapshotCtx = snapshot.getContext('2d');
    snapshotCtx.drawImage(canvas, 0, 0);
  }

  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (snapshot) {
    ctx.drawImage(
      snapshot,
      0,
      0,
      previousWidth,
      previousHeight,
      0,
      0,
      canvas.width,
      canvas.height,
    );
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = STROKE_STYLE;
  ctx.lineWidth = LINE_WIDTH;
  ctx.fillStyle = STROKE_STYLE;
}

function trimBufferIfNeeded() {
  if (STATE.points.length <= MAX_POINTS) {
    return;
  }
  const overflow = STATE.points.length - MAX_POINTS;
  STATE.points.splice(0, overflow);
  STATE.lastDrawnIndex = Math.max(0, STATE.lastDrawnIndex - overflow);
}

export function pushPoint(event) {
  const point = getRelativePoint(event);
  const previous = STATE.points[STATE.points.length - 1];
  if (previous) {
    const dx = point.x - previous.x;
    const dy = point.y - previous.y;
    if (dx * dx + dy * dy < JITTER_DISTANCE_SQ) {
      return false;
    }
  }

  STATE.points.push(point);
  trimBufferIfNeeded();
  return true;
}

export function drawSmooth(finalize = false) {
  const points = STATE.points;
  if (points.length < 2) {
    return;
  }

  const tensionFactor = TENSION / 6;
  let index = STATE.lastDrawnIndex;
  const limit = finalize ? points.length - 1 : points.length - 2;

  while (index < limit) {
    const p0 = points[index - 1] ?? points[index];
    const p1 = points[index];
    const p2 = points[index + 1];
    const p3 = points[index + 2] ?? (finalize ? points[index + 1] : undefined);

    if (!p2) {
      break;
    }
    if (!p3) {
      // Without a forward reference the Catmull-Rom segment is not stable yet.
      break;
    }

    // Catmull-Rom -> Bézier conversion: control points sit at 1/6 of the
    // tangent vectors scaled by the chosen tension (0.5 here).
    const c1x = p1.x + (p2.x - p0.x) * tensionFactor;
    const c1y = p1.y + (p2.y - p0.y) * tensionFactor;
    const c2x = p2.x - (p3.x - p1.x) * tensionFactor;
    const c2y = p2.y - (p3.y - p1.y) * tensionFactor;

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.bezierCurveTo(c1x, c1y, c2x, c2y, p2.x, p2.y);
    ctx.stroke();

    index += 1;
  }

  STATE.lastDrawnIndex = index;

  const drop = Math.max(0, STATE.lastDrawnIndex - 1);
  if (drop > 0) {
    STATE.points.splice(0, drop);
    STATE.lastDrawnIndex -= drop;
  }

  if (finalize) {
    STATE.points.length = 0;
    STATE.lastDrawnIndex = 0;
  }
}

export function endStroke() {
  if (!STATE.drawing) {
    return;
  }

  const lastPoint = STATE.points[STATE.points.length - 1];
  drawSmooth(true);

  if (lastPoint) {
    ctx.beginPath();
    ctx.arc(lastPoint.x, lastPoint.y, ctx.lineWidth / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  STATE.drawing = false;
  STATE.pointerId = null;
  STATE.points.length = 0;
  STATE.lastDrawnIndex = 0;
}

function onPointerDown(event) {
  if (STATE.drawing) {
    endStroke();
  }

  STATE.drawing = true;
  STATE.pointerId = event.pointerId;
  canvas.setPointerCapture(event.pointerId);

  STATE.points.length = 0;
  STATE.lastDrawnIndex = 0;
  pushPoint(event);
}

function onPointerMove(event) {
  if (!STATE.drawing || event.pointerId !== STATE.pointerId) {
    return;
  }

  if (pushPoint(event)) {
    drawSmooth(false);
  }
}

function onPointerUp(event) {
  if (event.pointerId !== STATE.pointerId) {
    return;
  }
  endStroke();
  try {
    canvas.releasePointerCapture(event.pointerId);
  } catch (err) {
    // Ignore if capture was already released.
  }
}

canvas.addEventListener('pointerdown', onPointerDown);
canvas.addEventListener('pointermove', onPointerMove);
canvas.addEventListener('pointerup', onPointerUp);
canvas.addEventListener('pointercancel', onPointerUp);
canvas.addEventListener('lostpointercapture', () => {
  if (STATE.drawing) {
    endStroke();
  }
});

window.addEventListener('resize', resizeCanvas, { passive: true });
resizeCanvas();
