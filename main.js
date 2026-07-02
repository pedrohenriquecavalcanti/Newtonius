if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js";
} else {
  console.warn("pdf.js não carregado – PDFs indisponíveis");
}
/* ================================================================
   1. CONSTANTES & CONFIGURAÇÕES GLOBAIS
   ----------------------------------------------------------------
   - Nenhuma delas sofre alteração em tempo de execução.
   ============================================================== */
/* Quantidade de assuntos por disciplina (usado para montar estrelas
   vazias mesmo que ainda não existam questões carregadas)           */
const SUBJECT_TOTALS = {
  Biologia: 26,
  Química: 24,
  Física: 20,
  Matemática: 22,
  'Linguagens': 23,
  'Geografia e Sociologia': 26,
  'História e Filosofia': 28,
  'Redação': 1,
};

/* Lista “amigável” dos assuntos: índice → nome completo.
   Mantém separada da lógica para facilitar troca/edição.            */
const SUBJECT_NAMES = {
  Biologia: [
    '1. Ecologia Básica', '2. Ecologia Avançada', '3. Evolução', '4.  Impacto Ambiental',
    '5. Moléculas Orgânicas', '6. Transporte de Moléculas (Difusão e Osmose)', '7. Citologia',
    '8. Energia Celular', '9. Origem da Vida', '10. Bactérias (Procariontes), Algas e Fungos',
    '11. Filogenia e Indrodução à Botânica', '12. Morfologia e Reprodução de Plantas',
    '13. Transporte de Seiva e de Sementes', '14. Invertebrados', '15. Parasitoses e Doenças Endêmicas',
    '16. Vertebrados e Conquista Terrestre', '17. Sistema Digestório, Endócrino e Excretor',
    '18. Sistema Reprodutor e Reprodução Humana', '19. Sistema Cardiorrespiratório e Sangue',
    '20. Sistema Nervoso e Musculoesquelético', '21. Estrutura do DNA e Dogma Central', '22. Genética',
    '23. Hereditariedade', '24. Genética Avançada', '25. Vírus e Imunidade', '26. Neoplasia e Farmacologia'
  ],
  Química: [
    '1. Modelos Atômicos', '2. Camadas Eletrônicas', '3. Tabela Periódica', '4. Ligações Químicas',
    '5. Forças Intermoleculares', '6. Sistemas e Misturas', '7. Fórmulas Químicas', '8. Reações Químicas',
    '9. Ácidos e Bases', '10. Reações com Ácidos', '11. Sais e Óxidos', '12. Estequiometria',
    '13. Termoquímica', '14. Equilíbrio Químico', '15. Reação de Oxirredução', '16. Pilha',
    '17. Química Orgânica', '18. Cadeias Orgânicas', '19. Isomeria', '20. Reações Orgânicas',
    '21. Ciclos da Matéria', '22. Derivados do Petróleo', '23. Descarte de Materiais', '24. Reações Nucleares'
  ],
  Física: [
    '1. Eletricidade', '2. Potencial Elétrico', '3. Eletrodinâmica Básica', '4. Eletrodinâmica Avançada',
    '5. Eletromagnetismo', '6. Óptica Básica', '7. Fenômenos Ópticos', '8. Óptica Avançada',
    '9. Ondulatória', '10. Ondulatória Avançada e Acústica', '11. Termologia',
    '12. Dilatação e Escalas de Temperatura', '13. Energia, Potência e Termodinâmica',
    '14. Estudo dos Gases', '15. Cinemática', '16. Momento Linear (Quantidade de Movimento)',
    '17. Dinâmica', '18. Gravitação', '19. Molas e Estática', '20. Hidrostática'
  ],
  Matemática: [
    '1. Matemática Básica', '2. Potenciação', '3. Porcentagem e Conversões', '4. Razão e Matemática Financeira',
    '5. Sistemas e Vazão', '6. Equação do 1º Grau', '7. Estatística Básica', '8. Progressões Matemáticas',
    '9. Equações do 2º Grau', '10. Outras Equações (Equação da Circunferência)', '11. Logaritmo',
    '12. Trigonometria (Ciclo Trigonométrico)', '13. Diagramas (Venn) e Mapas', '14. Análise de Gráficos',
    '15. Paralelogramos', '16. Triângulos', '17. Cículos e Projeção', '18. Prismas e Pirâmides',
    '19. Esferas e Cones', '20. Análise Combinatória', '21. Probabilidade', '22. Matriz e Determinante'
  ],
  'Linguagens': [
    '1. Funções de Linguagem',
    '2. Gêneros Textuais',
    '3. Linguística e Formação do Português',
    '4. Variantes Linguísticas',
    '5. Linguagem Formal e Informal',
    '6. Argumentação e Progressão Temática',
    '7. Recursos Expressivos',
    '8. Figuras de Linguagem',
    '9. Seleção Lexical',
    '10. Texto Literário e Utilitário',
    '11. Modos e Tempos Verbais',
    '12. Concordância',
    '13. Estrutura Sintática',
    '14. Análise de Poemas',
    '15. Romantismo e Realismo',
    '16. Vanguardas Europeias e Pré-Modernismo',
    '17. Modernismo',
    '18. Artes e Expressão Artística no Brasil',
    '19. Mundo Globalizado e Tecnologia',
    '20. Direitos Humanos e Luta Social',
    '21. Preconceito e Violência contra a Mulher',
    '22. Educação Física, Saúde e Estética',
    '23. Interpretação de Temas Diversos'
  ],
  'Geografia e Sociologia': [
    '1. Cartografia e Meteorologia',
    '2. Tectonismo',
    '3. Estrutura Geológica e Formação de Rochas',
    '4. Relevo Brasileiro',
    '5. Clima Brasileiro',
    '6. Massas de Ar e Correntes Marítimas',
    '7. Geografia Mundo',
    '8. Demografia',
    '9. Urbanização',
    '10. Agricultura Moderna',
    '11. Sistemas Agrários e Solos',
    '12. Impacto Ambiental',
    '13. Hidrografia Brasileira',
    '14. Preservação do Meio Ambiente',
    '15. ONU e Direitos Humanos',
    '16. Conflitos do Oriente Médio',
    '17. Conceitos de Sociologia',
    '18. Segregação Racial e Lutas Sociais',
    '19. Questões de Gênero',
    '20. Globalização e Precarização do Trabalho',
    '21. Tecnologia',
    '22. Pós-Modernidade',
    '23. Indústria Cultural',
    '24. Modelos de Produção',
    '25. Economia Mundial Recente',
    '26. Blocos Econômicos e Separatismo'
  ],
  'História e Filosofia': [
    '1. Antiguidade Oriental',
    '2. Mundo Grego',
    '3. Surgimento da Filosofia',
    '4. Império Romano',
    '5. História do Direito e da Democracia',
    '6. Ascensão do Feudalismo',
    '7. Queda do Feudalismo',
    '8. Revolução Científica',
    '9. Era Pré-Colombiana e América Espanhola',
    '10. Escravidão e Pacto Colonial',
    '11. Ciclos Econômicos Brasileiros',
    '12. Contratualismo e Estados Modernos',
    '13. Antigo Regime e Iluminismo',
    '14. Revolução Francesa',
    '15. Revolução Industrial',
    '16. Kant e Nietzsche',
    '17. Brasil Imperial',
    '18. República Velha',
    '19. Revoltas e Guerras do Brasil',
    '20. Imperialismo',
    '21. História dos EUA e da Rússia',
    '22. Era Vargas',
    '23. Industrialização Brasileira',
    '24. Segunda Grande Guerra e Totalitarismo',
    '25. Guerra Fria',
    '26. República Populista',
    '27. Ditadura e Nova República',
    '28. Constituições Brasileiras'
  ],
  'Redação': ['1. Redação']
};

/* Ranking de incidência (com base no ENEM) para mostrar badge.      */
const INCIDENCE_RANKINGS = {
  Biologia: {
    "01": '17º', "02": '10º', "03": '6º',  "04": '1º',  "05": '25º',
    "06": '19º', "07": '21º', "08": '2º',  "09": '26º', "10": '20º',
    "11": '23º', "12": '3º',  "13": '13º', "14": '22º', "15": '18º',
    "16": '5º',  "17": '7º',  "18": '24º', "19": '16º', "20": '12º',
    "21": '9º',  "22": '15º', "23": '4º',  "24": '14º', "25": '8º',
    "26": '11º'
  },
  Química: {
    "01": '23º', "02": '15º', "03": '17º', "04": '18º', "05": '7º',
    "06": '1º',  "07": '24º', "08": '4º',  "09": '5º',  "10": '19º',
    "11": '13º', "12": '2º',  "13": '22º', "14": '21º', "15": '8º',
    "16": '6º',  "17": '12º', "18": '3º',  "19": '20º', "20": '10º',
    "21": '14º', "22": '16º', "23": '11º', "24": '9º'
  },
  Física: {
    "01": '13º', "02": '10º', "03": '1º',  "04": '18º', "05": '7º',
    "06": '4º',  "07": '15º', "08": '19º', "09": '8º',  "10": '5º',
    "11": '2º',  "12": '20º', "13": '6º',  "14": '14º', "15": '3º',
    "16": '11º', "17": '9º',  "18": '16º', "19": '12º', "20": '17º'
  },
  Matemática: {
    "01": '7º',  "02": '17º', "03": '1º',  "04": '6º',  "05": '3º',
    "06": '20º', "07": '2º',  "08": '15º', "09": '12º', "10": '22º',
    "11": '16º', "12": '14º', "13": '19º', "14": '5º',  "15": '18º',
    "16": '9º',  "17": '4º',  "18": '13º', "19": '10º', "20": '11º',
    "21": '8º',  "22": '21º'
  },
  'Linguagens': {
    "01": '13º', "02": '6º',  "03": '8º',  "04": '7º',  "05": '14º',
    "06": '12º', "07": '10º', "08": '11º', "09": '19º', "10": '22º',
    "11": '20º', "12": '23º', "13": '21º', "14": '4º',  "15": '15º',
    "16": '17º', "17": '18º', "18": '1º',  "19": '2º',  "20": '9º',
    "21": '5º',  "22": '3º',  "23": '16º'
  },
  'Geografia e Sociologia': {
    "01": '11º', "02": '19º', "03": '10º', "04": '21º', "05": '14º',
    "06": '16º', "07": '25º', "08": '1º',  "09": '6º',  "10": '8º',
    "11": '17º', "12": '7º',  "13": '23º', "14": '13º', "15": '5º',
    "16": '22º', "17": '26º', "18": '3º',  "19": '4º',  "20": '2º',
    "21": '9º',  "22": '20º', "23": '15º', "24": '12º', "25": '24º',
    "26": '18º'
  },
  'História e Filosofia': {
    "01": '21º', "02": '26º', "03": '1º',  "04": '24º', "05": '3º',
    "06": '5º',  "07": '11º', "08": '4º',  "09": '13º', "10": '2º',
    "11": '22º', "12": '23º', "13": '17º', "14": '25º', "15": '14º',
    "16": '15º', "17": '9º',  "18": '20º', "19": '18º', "20": '19º',
    "21": '27º', "22": '7º',  "23": '28º', "24": '6º',  "25": '8º',
    "26": '12º', "27": '10º', "28": '16º'
  },
  'Redação': { "01": '1º' }
};

/* Mapeia cada disciplina para a classe CSS que define sua cor.      */
const discClasses = {
  Biologia:   "biologia",
  Química:    "quimica",
  Física:     "fisica",
  Matemática: "matematica",
  'Linguagens': "linguagens",
  'Geografia e Sociologia': "geografia-sociologia",
  'História e Filosofia': "historia-filosofia",
  'Redação': "redacao",
  'Sem Assunto (Natureza)': 'sem-assunto-nat',
  'Sem Assunto (Linguagens)': 'sem-assunto-lin',
  'Sem Assunto (Humanas)': 'sem-assunto-hum',
  'Sem Assunto (Matemática)': 'sem-assunto-mat',
};
const discColors = {
  Biologia: "var(--c-bio)",
  Química:  "var(--c-qui)",
  Física:   "var(--c-fis)",
  Matemática: "var(--c-mat)",
  'Linguagens': "var(--c-lin)",
  'Geografia e Sociologia': "var(--c-geo-soc)",
  'História e Filosofia': "var(--c-his-fil)",
  'Redação': "var(--c-reda)",
  'Sem Assunto (Natureza)': 'var(--c-sem-assunto)',
  'Sem Assunto (Linguagens)': 'var(--c-sem-assunto)',
  'Sem Assunto (Humanas)': 'var(--c-sem-assunto)',
  'Sem Assunto (Matemática)': 'var(--c-sem-assunto)',
};

// Valor especial usado para representar a disciplina inteira
const ALL_SUB = '__all__';
const UNCLASSIFIED_SUBJECT_CODE = '__sem_assunto__';

const D1_DISCIPLINES = ['Linguagens','História e Filosofia','Geografia e Sociologia','Redação','Sem Assunto (Linguagens)','Sem Assunto (Humanas)'];
const D1_DISPLAY_DISCIPLINES = D1_DISCIPLINES.filter(
  disc => !disc.startsWith('Sem Assunto')
);

const DISCIPLINES_BY_MODE = {
  lin: ['Linguagens', 'Redação', 'Sem Assunto (Linguagens)'],
  hum: ['Geografia e Sociologia', 'História e Filosofia', 'Sem Assunto (Humanas)'],
  nat: ['Biologia', 'Química', 'Física', 'Sem Assunto (Natureza)'],
  mat: ['Matemática', 'Sem Assunto (Matemática)']
};

const UNCLASSIFIED_DISCIPLINES_BY_MODE = {
  lin: 'Sem Assunto (Linguagens)',
  hum: 'Sem Assunto (Humanas)',
  nat: 'Sem Assunto (Natureza)',
  mat: 'Sem Assunto (Matemática)'
};

function getReviewDisciplineOptions(mode){
  const list = DISCIPLINES_BY_MODE[mode] || [];
  const unclassified = UNCLASSIFIED_DISCIPLINES_BY_MODE[mode];
  return list.filter(disc => disc !== unclassified && disc !== 'Redação');
}

const REVIEW_DEFAULT_MODES = ['nat', 'mat'];
const REVIEW_MODE_LABELS = { lin: 'Linguagens', hum: 'Humanas', nat: 'Natureza', mat: 'Matemática' };
const REVIEW_MODES = Object.keys(REVIEW_MODE_LABELS);
const REVIEW_ALL_DISC = '__review_all__';

function getReviewDisciplinesForModes(modes = REVIEW_DEFAULT_MODES) {
  return [...new Set(modes.flatMap(mode => getReviewDisciplineOptions(mode)))];
}

function normalizeReviewModes(modes) {
  const normalized = Array.isArray(modes)
    ? modes.filter(mode => REVIEW_MODES.includes(mode))
    : [];
  return [...new Set(normalized)];
}

function normalizeReviewDiscs(discs, modes) {
  const allowed = new Set(getReviewDisciplinesForModes(modes));
  const normalized = Array.isArray(discs)
    ? discs.filter(disc => allowed.has(disc))
    : [];
  return [...new Set(normalized)];
}

const NAT_REVIEW_HIDDEN_PREFIX = 'natReviewHidden_';
const NAT_REVIEW_AUTO_HIDDEN_PREFIX = 'natReviewAutoHidden_';
const NAT_REVIEW_FAVORITE_PREFIX = 'natReviewFav_';
const NAT_REVIEW_SOON_PREFIX = 'natReviewSoon_';
const NAT_REVIEW_SHOW_HIDDEN_STORAGE_KEY = 'natReviewShowHidden';
const natReviewDeferredAutoHide = new Set();

const REVIEW_MODE_STORAGE_KEY = 'postReviewModeEnabled';

const DEFAULT_NAT_REVIEW_STATE = {
  modes: REVIEW_DEFAULT_MODES.slice(),
  discs: getReviewDisciplinesForModes(REVIEW_DEFAULT_MODES),
  disc: REVIEW_ALL_DISC,
  sub: null,
  kind: 'wrong',
  showHidden: localStorage.getItem(NAT_REVIEW_SHOW_HIDDEN_STORAGE_KEY) === '1',
};

let natReviewState = { ...DEFAULT_NAT_REVIEW_STATE };
let reviewSettingsBtn = null;
let reviewSettingsMenu = null;

let postReviewMode = localStorage.getItem(REVIEW_MODE_STORAGE_KEY) === '1';
let postReviewModeRestore = null;

let d1Enabled = JSON.parse(localStorage.getItem('d1Enabled') || 'false');

// Data prevista do exame no fuso de Brasília (-03)
const EXAM_DATE = new Date('2026-11-08T00:00:00-03:00');
// Segunda aplicação do ENEM (D2) e data final exibida na trilha
const SECOND_EXAM_DATE = new Date('2026-11-15T00:00:00-03:00');
const TRAIL_END_DATE = SECOND_EXAM_DATE;

/* ================================================================
   2. REFERÊNCIAS FIXAS DA INTERFACE (cache de seletores)
   ----------------------------------------------------------------
   - Evita repetir `document.getElementById` ao longo do código.
   ============================================================== */
const app          = document.getElementById("app");
const importFile   = document.getElementById("importFile");
const backBtn      = document.getElementById("backBtn");
const header       = document.getElementById("header");
const headerTitle  = document.getElementById("headerTitle");
const summaryBtn   = document.getElementById("summaryBtn");
const pdfContainer = document.getElementById("pdfViewerContainer");
const pdfPagesWrapper = document.getElementById("pdfPagesWrapper");
const pdfHandBtn   = document.getElementById("pdfHandBtn");
const pdfPenBtn    = document.getElementById("pdfPenBtn");
const pdfEraserBtn = document.getElementById("pdfEraserBtn");
const pdfPageMenuToggleBtn = document.getElementById("pdfPageMenuToggleBtn");
const pdfPrevPageBtn = document.getElementById("pdfPrevPageBtn");
const pdfNextPageBtn = document.getElementById("pdfNextPageBtn");
const pdfPageNav = document.getElementById("pdfPageNav");
const pdfPageIndicator = document.getElementById("pdfPageIndicator");
const closeBtn     = document.getElementById("closePdfBtn");
const imgContainer = document.getElementById("imgPreviewContainer");
const closeImgBtn  = document.getElementById("closeImgBtn");
const previewImg   = document.getElementById("imgPreview");
const summaryContainer = document.getElementById("summaryContainer");
const summaryFrame     = document.getElementById("summaryFrame");

const settingsBtn   = document.getElementById("settingsBtn");
const settingsMenu  = document.getElementById("settingsMenu");
const exportBtn     = document.getElementById("exportBtn");
const exportHandBtn = document.getElementById("exportHandBtn");
const importBtn     = document.getElementById("importBtn");
const importHandBtn = document.getElementById("importHandBtn");
const trilhaBtn     = document.getElementById("trilhaBtn");
const examsBtn      = document.getElementById("examsBtn");
const natReviewBtn  = document.getElementById("natReviewBtn");
const favReviewBtn  = document.getElementById("favReviewBtn");
const reviewMenuBtn = document.getElementById("reviewMenuBtn");
const reviewMenu = document.getElementById("reviewMenu");
const backupMenuBtn = document.getElementById("backupMenuBtn");
const backupMenu = document.getElementById("backupMenu");
const reviewModeBtn = document.getElementById("reviewModeBtn");
const clearManuscriptsBtn = document.getElementById("clearManuscriptsBtn");
const clearCacheBtn = document.getElementById("clearCacheBtn");
const programmerBtn = document.getElementById("programmerBtn");
const programmerMenu = document.getElementById("programmerMenu");
const clearQuestionsBtn = document.getElementById("clearQuestionsBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const pickerModal   = document.getElementById("subjectPickerModal");
const pickerDisc    = document.getElementById("pickerDisc");
const pickerReviewDisc = document.getElementById("pickerReviewDisc");
const pickerSub     = document.getElementById("pickerSub");
const pickerExamMode= document.getElementById("pickerExamMode");
const pickerExam    = document.getElementById("pickerExam");
const pickerComment = document.getElementById("pickerComment");
const pickerAdd     = document.getElementById("pickerAdd");
const pickerMicro   = document.getElementById("pickerMicro");
const pickerCancel  = document.getElementById("pickerCancel");
const orderHint     = document.getElementById("orderHint");
const toggleD1Btn   = document.getElementById("toggleD1Btn");
const searchNotesBtn = document.getElementById("searchNotesBtn");
const searchOverlay  = document.getElementById("searchOverlay");
const searchForm     = document.getElementById("searchForm");
const searchInput    = document.getElementById("searchInput");
const searchResultsList = document.getElementById("searchResults");
const searchFeedbackEl  = document.getElementById("searchFeedback");
const searchCloseBtn = document.getElementById("searchCloseBtn");

function setNatReviewState(partial = {}) {
  const next = { ...natReviewState };
  if (partial.modes !== undefined || partial.mode !== undefined) {
    const requestedModes = partial.modes !== undefined ? partial.modes : [partial.mode];
    next.modes = normalizeReviewModes(requestedModes);
    next.discs = normalizeReviewDiscs(partial.discs !== undefined ? partial.discs : next.discs, next.modes);
    next.disc = REVIEW_ALL_DISC;
    next.sub = null;
  }
  if (partial.discs !== undefined) {
    const modes = normalizeReviewModes(next.modes);
    next.discs = normalizeReviewDiscs(partial.discs, modes);
    next.disc = REVIEW_ALL_DISC;
    next.sub = null;
  }
  if (partial.disc !== undefined) {
    next.disc = partial.disc;
    if (partial.disc === REVIEW_ALL_DISC) {
      next.sub = null;
    } else {
      const modes = normalizeReviewModes(next.modes);
      const allowed = new Set(getReviewDisciplinesForModes(modes));
      if (allowed.has(partial.disc) && !next.discs.includes(partial.disc)) {
        next.discs = [...next.discs, partial.disc];
      }
      if (partial.sub === undefined && natReviewState.disc !== partial.disc) {
        next.sub = null;
      }
    }
  }
  if (partial.sub !== undefined) {
    next.sub = partial.sub;
  }
  if (partial.kind !== undefined) {
    next.kind = partial.kind === 'favorite' ? 'favorite' : 'wrong';
  }
  if (partial.showHidden !== undefined) {
    next.showHidden = !!partial.showHidden;
  }
  next.modes = normalizeReviewModes(next.modes);
  next.discs = normalizeReviewDiscs(next.discs, next.modes);
  natReviewState = next;
  localStorage.setItem(
    NAT_REVIEW_SHOW_HIDDEN_STORAGE_KEY,
    natReviewState.showHidden ? '1' : '0'
  );
  return natReviewState;
}

function resetNatReviewState(kind = 'wrong') {
  setNatReviewState({
    modes: REVIEW_DEFAULT_MODES.slice(),
    discs: getReviewDisciplinesForModes(REVIEW_DEFAULT_MODES),
    disc: REVIEW_ALL_DISC,
    sub: null,
    kind
  });
}

function ensureReviewSettingsUI() {
  if (reviewSettingsBtn && reviewSettingsMenu) return;
  const headerEl = header;
  if (!headerEl) return;

  if (!reviewSettingsBtn) {
    reviewSettingsBtn = document.createElement('button');
    reviewSettingsBtn.id = 'reviewSettingsBtn';
    reviewSettingsBtn.type = 'button';
    reviewSettingsBtn.setAttribute('aria-label', 'Filtros da revisão');
    reviewSettingsBtn.setAttribute('aria-haspopup', 'true');
    reviewSettingsBtn.setAttribute('aria-expanded', 'false');
    reviewSettingsBtn.innerHTML = '<i class="fas fa-cog"></i>';
    reviewSettingsBtn.addEventListener('click', e => {
      e.stopPropagation();
      ensureReviewSettingsUI();
      if (!reviewSettingsMenu) return;
      const isOpen = reviewSettingsMenu.style.display === 'flex';
      reviewSettingsMenu.style.display = isOpen ? 'none' : 'flex';
      reviewSettingsBtn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    });
    const pomodoroBtn = document.getElementById('pomodoroBtn');
    if (pomodoroBtn && pomodoroBtn.parentElement === headerEl) {
      pomodoroBtn.insertAdjacentElement('afterend', reviewSettingsBtn);
    } else {
      headerEl.appendChild(reviewSettingsBtn);
    }
  }

  if (!reviewSettingsMenu) {
    reviewSettingsMenu = document.createElement('div');
    reviewSettingsMenu.id = 'reviewSettingsMenu';
    reviewSettingsMenu.className = 'review-menu';
    reviewSettingsMenu.setAttribute('role', 'menu');
    reviewSettingsMenu.style.display = 'none';
    headerEl.appendChild(reviewSettingsMenu);
  }
}

function toggleReviewSettingsVisibility(show) {
  ensureReviewSettingsUI();
  if (!reviewSettingsBtn || !reviewSettingsMenu) return;
  reviewSettingsBtn.style.display = show ? 'flex' : 'none';
  if (show) {
    reviewSettingsBtn.setAttribute('aria-expanded', 'false');
  } else {
    reviewSettingsMenu.style.display = 'none';
    reviewSettingsBtn.setAttribute('aria-expanded', 'false');
  }
}

function renderReviewSettingsMenu() {
  ensureReviewSettingsUI();
  if (!reviewSettingsMenu || !reviewSettingsBtn) return;
  const wasOpen = reviewSettingsMenu.style.display === 'flex';
  reviewSettingsMenu.innerHTML = '';

  const title = document.createElement('p');
  title.className = 'review-menu-title';
  title.textContent = 'Área';
  reviewSettingsMenu.appendChild(title);

  const areaWrap = document.createElement('div');
  areaWrap.className = 'review-menu-options';
  const currentModes = normalizeReviewModes(natReviewState.modes);
  REVIEW_MODES.forEach(mode => {
    const btn = document.createElement('button');
    btn.className = 'review-menu-option';
    btn.type = 'button';
    btn.textContent = REVIEW_MODE_LABELS[mode] || mode;
    if (currentModes.includes(mode)) btn.classList.add('active');
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const nextModes = currentModes.includes(mode)
        ? currentModes.filter(item => item !== mode)
        : [...currentModes, mode];
      const nextDiscs = getReviewDisciplinesForModes(nextModes);
      setNatReviewState({ modes: nextModes, discs: nextDiscs });
      showNatReview();
    });
    areaWrap.appendChild(btn);
  });
  reviewSettingsMenu.appendChild(areaWrap);

  const discTitle = document.createElement('p');
  discTitle.className = 'review-menu-title';
  discTitle.textContent = 'Disciplina';
  reviewSettingsMenu.appendChild(discTitle);

  const optionsWrap = document.createElement('div');
  optionsWrap.className = 'review-menu-options';
  const disciplineOptions = getReviewDisciplinesForModes(currentModes);
  const selectedDisciplines = normalizeReviewDiscs(natReviewState.discs, currentModes);
  disciplineOptions.forEach(value => {
    const btn = document.createElement('button');
    btn.className = 'review-menu-option';
    btn.type = 'button';
    btn.textContent = value;
    if (selectedDisciplines.includes(value)) btn.classList.add('active');
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const nextDiscs = selectedDisciplines.includes(value)
        ? selectedDisciplines.filter(item => item !== value)
        : [...selectedDisciplines, value];
      setNatReviewState({ discs: nextDiscs });
      showNatReview();
    });
    optionsWrap.appendChild(btn);
  });
  reviewSettingsMenu.appendChild(optionsWrap);

  if (wasOpen) {
    reviewSettingsMenu.style.display = 'flex';
    reviewSettingsBtn.setAttribute('aria-expanded', 'true');
  } else {
    reviewSettingsMenu.style.display = 'none';
    reviewSettingsBtn.setAttribute('aria-expanded', 'false');
  }
}

/* ================================================================
   3. ESTADO MUTÁVEL
   ============================================================== */
let currentDisc = null;   // Nome da disciplina selecionada
let currentSub  = null;   // Código do assunto selecionado
// Modo de ordenação por disciplina ('normal' ou 'ranking')
let subjectsOrder = {};
let trailReturn  = null;  // data da trilha para voltar após questões
let starReturn   = false; // flag para voltar à Home ao sair de um assunto aberto pela estrela
let trailReturnSub = false; // flag para voltar direto à Trilha se abriu sub específico
let examListOpen = false; // menu Provas e Simulados aberto
let currentExam  = null; // nome do exame em exibicao
let currentExamMode = 'nat'; // 'lin', 'hum', 'nat' ou 'mat'
let openTrailDays = new Set(); // dias abertos na Trilha Estratégica
const AGENDA_DAY = 'agenda'; // Dia fixo "Agenda, Planejamento e Metodologia"

let currentView = 'home';
let currentMicroSimEntry = null;
let pendingSearchFocus = null;

// Metadados do PDF aberto no modal
let lastPdfName = null;
let lastPdfTotalPages = 0;
let isFullPdfLoaded = false;
let isFullPdfLoading = false;
let pdfKeyListenerAttached = false;
let pdfDrawingTool = 'pen';
let pdfIpadMode = false;
let pdfPageMenuOpen = false;
const PDF_RENDER_QUALITY = 2;
const PDF_DEFAULT_ZOOM = 1.75;
const PDF_MIN_ZOOM = 0.75;
const PDF_MAX_ZOOM = 3;
const PDF_PEN_COLOR = '#000000';
const PDF_PEN_REFERENCE_WIDTH = 7; // espessura real (em pixels do canvas) no zoom padrão em um iPad (≈ DPR 2)
const PDF_PEN_WIDTH = PDF_PEN_REFERENCE_WIDTH;
const PDF_REFERENCE_DEVICE_PIXEL_RATIO = 2; // usado para normalizar a espessura entre dispositivos
const PDF_ERASER_WIDTH = 7;
const PDF_ERASER_HIGHLIGHT_COLOR = 'rgba(168, 168, 168, 0.9)';
const PDF_ERASER_HIT_RADIUS = PDF_ERASER_WIDTH * 0.65;
const PDF_DRAW_PREFIX = 'pdfDraw::';
const PDF_DRAW_LAST_CLEAN_KEY = `${PDF_DRAW_PREFIX}lastCleanupDate`;
const PDF_DRAW_STROKES_SUFFIX = '::strokes';
const PDF_DRAW_METADATA_VERSION = 3;
const IMPORT_WRAPPER_TYPE = 'newtonius-import-v1';
const PDF_AUTOSAVE_DELAY = 500;
const PDF_DRAW_LEGACY_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const STYLUS_TAP_TIMEOUT = 600;
const STYLUS_TAP_DISTANCE = 36;

const PDF_STROKE_SMOOTHING_BASE = 0.12;
const PDF_STROKE_SMOOTHING_MAX = 0.45;
const PDF_STROKE_SMOOTHING_DISTANCE_SCALE = 10;

let currentPdfZoom = PDF_DEFAULT_ZOOM;
let lastPdfRenderedPages = [];
let pdfPinchState = null;
let currentPdfDocument = null;
let currentPdfDocumentName = null;
let pdfAutosaveTimeout = null;
let pdfStorageQuotaAlertShown = false;

function smoothPdfPoint(target, previous, rawPrevious) {
  if (!target) return previous || rawPrevious || null;
  if (!previous) {
    return { x: target.x, y: target.y };
  }
  const reference = rawPrevious || target;
  const dx = target.x - reference.x;
  const dy = target.y - reference.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const distanceFactor = Math.max(0, Math.min(1, distance / PDF_STROKE_SMOOTHING_DISTANCE_SCALE));
  const smoothingFactor = PDF_STROKE_SMOOTHING_BASE +
    (PDF_STROKE_SMOOTHING_MAX - PDF_STROKE_SMOOTHING_BASE) * distanceFactor;
  return {
    x: previous.x + (target.x - previous.x) * smoothingFactor,
    y: previous.y + (target.y - previous.y) * smoothingFactor
  };
}

function getPdfEffectivePenWidth(zoom = currentPdfZoom) {
  const activeZoom = Number.isFinite(zoom) ? zoom : PDF_DEFAULT_ZOOM;
  const rawDpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
  const effectiveDpr = Number.isFinite(rawDpr) && rawDpr > 0 ? rawDpr : 1;
  const desiredCssWidth = PDF_PEN_REFERENCE_WIDTH / (PDF_RENDER_QUALITY * PDF_REFERENCE_DEVICE_PIXEL_RATIO);
  const cssWidth = desiredCssWidth * (activeZoom / PDF_DEFAULT_ZOOM);
  return cssWidth * PDF_RENDER_QUALITY * effectiveDpr;
}

function getPdfCanvasState(canvas) {
  if (!(canvas instanceof HTMLCanvasElement)) return null;
  if (!canvas._pdfState) {
    canvas._pdfState = {
      strokes: [],
      selectedStrokeIds: new Set(),
      nextId: 1,
      backgroundImage: null,
      canvasWidth: Number.isFinite(canvas?.width) ? canvas.width : null,
      canvasHeight: Number.isFinite(canvas?.height) ? canvas.height : null
    };
  }
  return canvas._pdfState;
}

function renderPdfStroke(ctx, stroke, highlight = false) {
  if (!ctx || !stroke) return;
  const points = Array.isArray(stroke.points) ? stroke.points : [];
  if (!points.length) return;

  const color = highlight ? PDF_ERASER_HIGHLIGHT_COLOR : (stroke.color || PDF_PEN_COLOR);
  const baseWidth = Number.isFinite(stroke.width)
    ? stroke.width
    : Number.isFinite(stroke.baseWidth)
      ? stroke.baseWidth
      : PDF_PEN_REFERENCE_WIDTH;
  const width = Number.isFinite(baseWidth) ? baseWidth : PDF_PEN_REFERENCE_WIDTH;

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = width;
  ctx.strokeStyle = color;

  if (points.length === 1) {
    const radius = Math.max(width / 2, 1);
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(points[0].x, points[0].y, radius, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  let lastSmoothed = { x: points[0].x, y: points[0].y };
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) {
    const current = points[i];
    const rawPrevious = points[i - 1];
    const previousSmoothed = lastSmoothed || current;
    const smoothedPoint = smoothPdfPoint(current, lastSmoothed, rawPrevious);
    const midPoint = {
      x: (previousSmoothed.x + smoothedPoint.x) / 2,
      y: (previousSmoothed.y + smoothedPoint.y) / 2
    };
    ctx.quadraticCurveTo(previousSmoothed.x, previousSmoothed.y, midPoint.x, midPoint.y);
    lastSmoothed = smoothedPoint;
  }
  ctx.stroke();
}

function renderPdfCanvas(canvas) {
  const ctx = canvas?.getContext('2d');
  const state = getPdfCanvasState(canvas);
  if (!ctx || !state) return;
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (state.backgroundImage instanceof HTMLImageElement) {
    try {
      ctx.drawImage(state.backgroundImage, 0, 0, canvas.width, canvas.height);
    } catch (err) {
      console.warn('Falha ao desenhar imagem base das anotações do PDF.', err);
    }
  }
  const selected = state.selectedStrokeIds || new Set();
  state.strokes.forEach(stroke => {
    renderPdfStroke(ctx, stroke, selected.has(stroke.id));
  });
  ctx.restore();
}

function scalePdfDrawingState(state, scaleX, scaleY, newSize = {}) {
  if (!state || (!Number.isFinite(scaleX) && !Number.isFinite(scaleY))) return;
  const sx = Number.isFinite(scaleX) ? scaleX : 1;
  const sy = Number.isFinite(scaleY) ? scaleY : 1;
  const shouldScale = Math.abs(sx - 1) >= 0.001 || Math.abs(sy - 1) >= 0.001;

  if (shouldScale && Array.isArray(state.strokes)) {
    const widthScaleRaw = (Math.abs(sx) + Math.abs(sy)) / 2;
    const widthScale = Number.isFinite(widthScaleRaw) && widthScaleRaw > 0 ? widthScaleRaw : 1;
    state.strokes.forEach(stroke => {
      if (!stroke) return;
      if (Array.isArray(stroke.points)) {
        stroke.points.forEach(point => {
          if (!point) return;
          point.x *= sx;
          point.y *= sy;
        });
      }
      const previousWidth = Number.isFinite(stroke.width)
        ? stroke.width
        : Number.isFinite(stroke.baseWidth)
          ? stroke.baseWidth
          : PDF_PEN_REFERENCE_WIDTH;
      const scaledWidth = Number.isFinite(previousWidth) ? previousWidth * widthScale : PDF_PEN_REFERENCE_WIDTH * widthScale;
      stroke.width = scaledWidth;
      stroke.baseWidth = Number.isFinite(stroke.baseWidth)
        ? stroke.baseWidth * widthScale
        : scaledWidth;
    });
  }

  if (Number.isFinite(newSize?.width)) {
    state.canvasWidth = newSize.width;
  } else if (shouldScale && Number.isFinite(state.canvasWidth)) {
    state.canvasWidth *= sx;
  }

  if (Number.isFinite(newSize?.height)) {
    state.canvasHeight = newSize.height;
  } else if (shouldScale && Number.isFinite(state.canvasHeight)) {
    state.canvasHeight *= sy;
  }
}

function serializePdfStrokes(strokes, metadata = {}) {
  try {
    const storedWidth = Number.isFinite(metadata?.width) ? metadata.width : null;
    const storedHeight = Number.isFinite(metadata?.height) ? metadata.height : null;
    const payload = {
      v: 2,
      strokes: (strokes || []).map((stroke, index) => {
        const width = Number.isFinite(stroke?.width)
          ? stroke.width
          : Number.isFinite(stroke?.baseWidth)
            ? stroke.baseWidth
            : PDF_PEN_REFERENCE_WIDTH;
        return {
          id: Number.isFinite(stroke?.id) ? stroke.id : index + 1,
          t: stroke?.type || 'pen',
          c: stroke?.color || PDF_PEN_COLOR,
          w: Number.isFinite(width) ? width : PDF_PEN_REFERENCE_WIDTH,
          pts: Array.isArray(stroke?.points)
            ? stroke.points.map(pt => [Number(pt?.x ?? 0), Number(pt?.y ?? 0)])
            : []
        };
      })
    };
    if (Number.isFinite(storedWidth)) {
      payload.w = storedWidth;
    }
    if (Number.isFinite(storedHeight)) {
      payload.h = storedHeight;
    }
    return JSON.stringify(payload);
  } catch (err) {
    console.error('Falha ao serializar anotações do PDF', err);
    return null;
  }
}

function deserializePdfStrokes(serialized) {
  if (!serialized) return { strokes: [], width: null, height: null };
  try {
    const data = JSON.parse(serialized);
    const list = Array.isArray(data?.strokes) ? data.strokes : [];
    const strokes = list
      .map((item, index) => {
        const rawPoints = Array.isArray(item?.pts) ? item.pts : [];
        const points = rawPoints
          .map(pt => {
            if (Array.isArray(pt)) {
              return { x: Number(pt[0]) || 0, y: Number(pt[1]) || 0 };
            }
            if (pt && typeof pt === 'object') {
              return { x: Number(pt.x) || 0, y: Number(pt.y) || 0 };
            }
            return null;
          })
          .filter(Boolean);
        const width = Number.isFinite(item?.w) ? item.w : PDF_PEN_REFERENCE_WIDTH;
        return {
          id: Number.isFinite(item?.id) ? item.id : index + 1,
          type: item?.t || 'pen',
          color: item?.c || PDF_PEN_COLOR,
          width,
          baseWidth: Number.isFinite(width) ? width : PDF_PEN_REFERENCE_WIDTH,
          points
        };
      })
      .filter(stroke => Array.isArray(stroke.points) && stroke.points.length);
    const storedWidth = Number.isFinite(data?.w)
      ? data.w
      : Number.isFinite(data?.width)
        ? data.width
        : null;
    const storedHeight = Number.isFinite(data?.h)
      ? data.h
      : Number.isFinite(data?.height)
        ? data.height
        : null;
    return { strokes, width: storedWidth, height: storedHeight };
  } catch (err) {
    console.error('Falha ao desserializar anotações do PDF', err);
    return { strokes: [], width: null, height: null };
  }
}

function distancePointToSegment(point, start, end) {
  if (!point || !start || !end) return Infinity;
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) {
    const diffX = point.x - start.x;
    const diffY = point.y - start.y;
    return Math.hypot(diffX, diffY);
  }
  const t = Math.max(0, Math.min(1,
    ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared));
  const projX = start.x + t * dx;
  const projY = start.y + t * dy;
  return Math.hypot(point.x - projX, point.y - projY);
}

function findPdfStrokeHits(strokes, point, radius) {
  if (!Array.isArray(strokes) || !point) return [];
  const hits = new Set();
  const effectiveRadius = Math.max(radius, 1);
  strokes.forEach(stroke => {
    if (!stroke || hits.has(stroke.id)) return;
    const points = Array.isArray(stroke.points) ? stroke.points : [];
    if (!points.length) return;
    const tolerance = (Number.isFinite(stroke.width) ? stroke.width : PDF_PEN_WIDTH) / 2 + effectiveRadius;
    if (points.length === 1) {
      const diffX = point.x - points[0].x;
      const diffY = point.y - points[0].y;
      if (diffX * diffX + diffY * diffY <= tolerance * tolerance) {
        hits.add(stroke.id);
      }
      return;
    }
    for (let i = 1; i < points.length; i += 1) {
      if (distancePointToSegment(point, points[i - 1], points[i]) <= tolerance) {
        hits.add(stroke.id);
        break;
      }
    }
  });
  return Array.from(hits);
}

let currentPdfPage = null;
let stylusTapHistory = [];
const pdfDirtyLayers = new Set();
const pdfActivePointerIds = new Set();
let pdfAutosaveSuspended = false;
let pdfStylusDrawingActive = false;
let pdfPersistListenersAttached = false;

/* Constrói a estrutura { Disciplina → Assunto → [Questões] }        */
const questoesData = buildBancoQuestoes([
  ...(window.listaQuestoes || []),
  ...(window.listaQuestoesD1 || []),
  ...(window.listaQuestoesNaoClassificadas || [])
]);
const allQuestoes = [
  ...(window.listaQuestoes || []),
  ...(window.listaQuestoesD1 || []),
  ...(window.listaQuestoesNaoClassificadas || [])
];
const { map: examsDataLin, order: examOrderLin } = buildExamMap(allQuestoes, 'lin');
const { map: examsDataHum, order: examOrderHum } = buildExamMap(allQuestoes, 'hum');
const { map: examsDataNat, order: examOrderNat } = buildExamMap(allQuestoes, 'nat');
const { map: examsDataMat, order: examOrderMat } = buildExamMap(allQuestoes, 'mat');

const examsDataByMode = {
  lin: examsDataLin,
  hum: examsDataHum,
  nat: examsDataNat,
  mat: examsDataMat
};

const examOrderByMode = {
  lin: examOrderLin,
  hum: examOrderHum,
  nat: examOrderNat,
  mat: examOrderMat
};

/* ================================================================
   4. FUNÇÕES UTILITÁRIAS (não tocam no DOM)
   ============================================================== */

/** Retorna o nome legível do assunto ou fallback. */
function getFriendlyName(disc, sub) {
  if (sub === UNCLASSIFIED_SUBJECT_CODE || sub === null || sub === undefined) {
    return 'Sem assunto';
  }
  const list = SUBJECT_NAMES[disc] || [];
  const idx  = parseInt(sub, 10) - 1;   // "01" -> 0
  return list[idx] ?? `Assunto ${sub}`;
}

/** Agrupa lista plana de questões em estrutura por disciplina/assunto. */
function buildBancoQuestoes(listaFlat) {
  const banco = {};

  // 1) Agrupamento real de questões existentes
  listaFlat.forEach(({ Disciplina, Assunto, ...rest }) => {
    (banco[Disciplina] ||= {})[Assunto] ||= [];
    banco[Disciplina][Assunto].push(rest);
  });

  // 2) Preenche assuntos vazios (para aparecerem no mapa)
  for (const [disc, total] of Object.entries(SUBJECT_TOTALS)) {
    const indices = Array.from({ length: total },
      (_, i) => String(i + 1).padStart(2, "0"));
    banco[disc] ||= {};
    indices.forEach(sub => banco[disc][sub] ||= []);
  }
  return banco;
}

function getModeFromDiscName(disc){
  if (!disc) return null;
  if (DISCIPLINES_BY_MODE.lin.includes(disc)) return 'lin';
  if (DISCIPLINES_BY_MODE.hum.includes(disc)) return 'hum';
  if (DISCIPLINES_BY_MODE.nat.includes(disc)) return 'nat';
  if (DISCIPLINES_BY_MODE.mat.includes(disc)) return 'mat';
  return null;
}

function getModeFromQuestionNumber(number){
  if (!Number.isFinite(number)) return null;
  if (number >= 1 && number <= 45) return 'lin';
  if (number >= 46 && number <= 90) return 'hum';
  if (number >= 91 && number <= 135) return 'nat';
  if (number >= 136 && number <= 180) return 'mat';
  return null;
}

function buildExamMap(list, mode='nat'){
  const exams = {};
  const order = [];
  const allowed = new Set(DISCIPLINES_BY_MODE[mode] || []);
  list.forEach(item => {
    if(!item || !item.label) return;
    const m = item.label.match(/^(.*)-Q-(\d+)/);
    if (!m) return;
    const exam = m[1];
    const questionNumber = parseInt(m[2], 10);
    const inferredModeFromDisc = getModeFromDiscName(item.Disciplina);
    const inferredModeFromNumber = Number.isFinite(questionNumber)
      ? getModeFromQuestionNumber(questionNumber)
      : null;
    const itemMode = item.area || item.mode || inferredModeFromDisc || inferredModeFromNumber || mode;
    if (itemMode && itemMode !== mode) {
      if (allowed.size && allowed.has(item.Disciplina)) {
        // disciplina pertence a outra área mas faz parte do modo atual
      } else {
        return;
      }
    }
    let disc = item.Disciplina;
    let sub = item.Assunto;
    if (!disc || (allowed.size && !allowed.has(disc))) {
      const fallbackDisc = UNCLASSIFIED_DISCIPLINES_BY_MODE[mode];
      if (!fallbackDisc || (allowed.size && !allowed.has(fallbackDisc))) {
        return;
      }
      disc = fallbackDisc;
      sub = UNCLASSIFIED_SUBJECT_CODE;
    }
    if (!sub) {
      sub = UNCLASSIFIED_SUBJECT_CODE;
    }
    if (!exams[exam]) {
      exams[exam] = [];
      order.push(exam);
    }
    exams[exam].push({
      disc,
      sub,
      q: {
        label: item.label,
        QPDFName: item.QPDFName,
        page: item.page,
        GPDFName: item.GPDFName,
        gabaritoPage: item.gabaritoPage,
        gabaritoAnswer: item.gabaritoAnswer,
        area: mode,
        unclassified: sub === UNCLASSIFIED_SUBJECT_CODE
      }
    });
  });
  const normalizedOrder = reorderExamsByFamily(order);
  for (const ex of normalizedOrder) {
    exams[ex].sort((a,b)=>{
      const na = parseInt(a.q.label.match(/Q-(\d+)/)[1],10);
      const nb = parseInt(b.q.label.match(/Q-(\d+)/)[1],10);
      return na-nb;
    });
  }
  return { map: exams, order: normalizedOrder };
}

function reorderExamsByFamily(order){
  if(!Array.isArray(order) || order.length === 0) return [];
  const groups = new Map();
  const familyOrder = [];
  order.forEach(exam => {
    const family = getExamFamily(exam);
    if(!groups.has(family)){
      groups.set(family, []);
      familyOrder.push(family);
    }
    groups.get(family).push(exam);
  });
  const normalized = [];
  familyOrder.forEach(family => {
    const exams = groups.get(family);
    if(Array.isArray(exams)){
      exams
        .slice()
        .sort(compareExamRecency)
        .forEach(exam => normalized.push(exam));
    }
  });
  return normalized;
}

function parseExamOrderParts(exam){
  if(typeof exam !== 'string') return null;
  const match = exam.match(/^(.*?)[-\s](\d{4})(?:[-\s]([A-Za-z]+|\d+))?/);
  if(!match) return null;
  const year = Number(match[2]);
  if(!Number.isFinite(year)) return null;
  const editionRaw = match[3] || '';
  const editionNumber = /^\d+$/.test(editionRaw) ? Number(editionRaw) : null;
  return {
    year,
    editionNumber: Number.isFinite(editionNumber) ? editionNumber : -1,
    editionText: editionRaw.toUpperCase()
  };
}

function compareExamRecency(a, b){
  const pa = parseExamOrderParts(a);
  const pb = parseExamOrderParts(b);
  if(pa && pb){
    if(pa.year !== pb.year) return pb.year - pa.year;
    if(pa.editionNumber !== pb.editionNumber) return pb.editionNumber - pa.editionNumber;
    const textCmp = pb.editionText.localeCompare(pa.editionText, 'pt-BR', { numeric: true });
    if(textCmp !== 0) return textCmp;
  }else if(pa || pb){
    return pa ? -1 : 1;
  }
  return String(a).localeCompare(String(b), 'pt-BR', { numeric: true });
}

function getExamFamily(exam){
  if(typeof exam !== 'string') return '';
  const trimmed = exam.trim();
  if(!trimmed) return '';
  const hyphenIdx = trimmed.indexOf('-');
  if(hyphenIdx > 0){
    return trimmed.slice(0, hyphenIdx).toUpperCase();
  }
  const spaceIdx = trimmed.indexOf(' ');
  if(spaceIdx > 0){
    return trimmed.slice(0, spaceIdx).toUpperCase();
  }
  return trimmed.toUpperCase();
}

function getExamCategory(disc){
  const mode = getModeFromDiscName(disc);
  if (!mode) return null;
  if (mode === 'lin') return 'Lin';
  if (mode === 'hum') return 'Hum';
  if (mode === 'nat') return 'Nat';
  if (mode === 'mat') return 'Mat';
  return null;
}

function isHandwritingStorageKey(key) {
  return typeof key === 'string' && key.startsWith(PDF_DRAW_PREFIX);
}

function shouldIncludeKeyForExport(key, mode) {
  const handwriting = isHandwritingStorageKey(key);
  if (mode === 'handwriting') return handwriting;
  return true;
}

function shouldIncludeKeyForImport(key, mode) {
  return shouldIncludeKeyForExport(key, mode);
}

function removeHandwritingEntriesFromLocalStorage() {
  if (typeof localStorage === 'undefined') return;
  const toRemove = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (isHandwritingStorageKey(key)) {
      toRemove.push(key);
    }
  }
  toRemove.forEach((key) => {
    localStorage.removeItem(key);
  });
}


function clearQuestionDataFromLocalStorage() {
  if (typeof localStorage === 'undefined') return 0;
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (!isHandwritingStorageKey(key) && !key.startsWith('summary_')) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key));
  return keysToRemove.length;
}


function attachFavoriteQuestionMenu(row, qBtn, disc, sub, label, onChange = null) {
  const key = qKey(disc, sub, label);
  const favoriteKey = `${NAT_REVIEW_FAVORITE_PREFIX}${key}`;
  let isFavorite = localStorage.getItem(favoriteKey) === '1';

  qBtn.classList.add('question-btn--with-menu');
  row.classList.toggle('review-favorite', isFavorite);

  const menuToggle = document.createElement('span');
  menuToggle.className = 'question-menu-toggle';
  menuToggle.textContent = '▾';
  menuToggle.title = 'Ações da questão';
  menuToggle.setAttribute('aria-haspopup', 'menu');
  menuToggle.setAttribute('aria-expanded', 'false');
  qBtn.appendChild(menuToggle);

  const actionMenu = document.createElement('div');
  actionMenu.className = 'question-action-menu';
  actionMenu.style.display = 'none';

  const favoriteOption = document.createElement('button');
  favoriteOption.type = 'button';
  favoriteOption.className = 'question-action-option';
  actionMenu.appendChild(favoriteOption);
  row.appendChild(actionMenu);

  const updateMenuToggle = () => {
    menuToggle.classList.toggle('menu-active', isFavorite);
  };

  const paintFavorite = () => {
    favoriteOption.textContent = isFavorite ? 'Desfavoritar' : 'Favoritar';
    favoriteOption.classList.toggle('active', isFavorite);
    row.classList.toggle('review-favorite', isFavorite);
    updateMenuToggle();
  };

  let menuOpen = false;
  const onOutsideClick = event => {
    if (!row.contains(event.target)) closeMenu();
  };
  const closeMenu = () => {
    if (!menuOpen) return;
    menuOpen = false;
    actionMenu.style.display = 'none';
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', onOutsideClick);
    row.style.zIndex = '';
  };
  const openMenu = () => {
    if (menuOpen) return;
    menuOpen = true;
    row.style.zIndex = '30';
    actionMenu.style.display = 'block';
    actionMenu.style.visibility = 'hidden';
    const toggleRect = menuToggle.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    const menuRect = actionMenu.getBoundingClientRect();
    const maxLeft = Math.max(rowRect.width - menuRect.width, 0);
    const desiredLeft = Math.max(toggleRect.right - rowRect.left - menuRect.width, 0);
    actionMenu.style.left = `${Math.min(desiredLeft, maxLeft)}px`;
    actionMenu.style.top = `${toggleRect.bottom - rowRect.top + 4}px`;
    actionMenu.style.visibility = 'visible';
    menuToggle.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.addEventListener('click', onOutsideClick);
  };

  menuToggle.addEventListener('click', e => {
    e.stopPropagation();
    e.preventDefault();
    if (menuOpen) closeMenu();
    else openMenu();
  });

  favoriteOption.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    isFavorite = !isFavorite;
    if (isFavorite) localStorage.setItem(favoriteKey, '1');
    else localStorage.removeItem(favoriteKey);
    paintFavorite();
    if (typeof onChange === 'function') onChange(isFavorite, { row, closeMenu });
    closeMenu();
  });

  qBtn.addEventListener('click', () => {
    if (menuOpen) closeMenu();
  });

  paintFavorite();
  return { closeMenu, paintFavorite, get isFavorite() { return isFavorite; } };
}

function getExportFilenamePrefix(mode) {
  return mode === 'handwriting' ? 'Newtonius_handwriting' : 'Newtonius';
}

async function doExport({ mode = 'general' } = {}) {
  /* 1 ▸ lê tudo do localStorage e joga num array  [key,value] */
  const pares = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!shouldIncludeKeyForExport(k, mode)) continue;
    pares.push([k, localStorage.getItem(k)]);
  }

  /* 2 ▸ ordena:  summary_ → star_ → comment_ → log_ → resto alfabético */
  const ordemCustom = k =>
        k.startsWith("summary_")  ? "0_"+k :
        k.startsWith("star_")     ? "1_"+k :
        k.startsWith("comment_")  ? "2_"+k :
        k.startsWith("log_")      ? "3_"+k :
                                    "4_"+k;

  pares.sort((a, b) => ordemCustom(a[0]).localeCompare(ordemCustom(b[0])));

  /* 3 ▸ reconstrói o objeto já ordenado */
  const objOrdenado = Object.fromEntries(pares);

  /* 4 ▸ salva com indentação bonitinha */
  const data = JSON.stringify(objOrdenado, null, 2);

  /* 5 ▸ gera nome Newtonius_AAAA_MM_DD_HH_mm (hora de Brasília) */
  const opts = {
    timeZone: 'America/Sao_Paulo',
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  };
  const parts = new Intl.DateTimeFormat('en-GB', opts)
                    .formatToParts(new Date());
  const dateMap = {};
  for (const p of parts) {
    if (p.type !== 'literal') dateMap[p.type] = p.value;
  }
  const stamp = `${dateMap.year}_${dateMap.month}_${dateMap.day}` +
                `_${dateMap.hour}_${dateMap.minute}`;
  const filename = `${getExportFilenamePrefix(mode)}_${stamp}.json`;

  /* 6 ▸ tenta usar File System Access. Se falhar, baixa direto */
  let saved = false;
  if (window.showSaveFilePicker) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: "JSON",
          accept: { "application/json": [".json"] }
        }]
      });
      const writable = await handle.createWritable();
      await writable.write(data);
      await writable.close();
      saved = true;
    } catch (err) {
      console.error("Export falhou", err);
    }
  }

  if (!saved) {
    const blob = new Blob([data], { type: "application/json" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }
}


/** Faz backup do progresso (estrelas + status + comentários). */
function exportData(mode = 'general') {
  const normalizedMode = mode === 'handwriting' ? 'handwriting' : 'general';

  /* 1 ▸ força o iframe a descarregar para salvar o resumo */
  if (summaryContainer.style.display !== "none") {
    summaryFrame.src = "about:blank";      // dispara o unload do editor
  }

  const flagKey = "__exportReady__";
  const hasSession = typeof sessionStorage !== 'undefined';
  const pending = hasSession ? sessionStorage.getItem(flagKey) : null;
  const legacyMatch = normalizedMode === 'general' && pending === 'yes';

  /* 2 ▸ já estamos de volta do reload? */
  if (hasSession && (pending === normalizedMode || legacyMatch)) {
    sessionStorage.removeItem(flagKey);
    doExport({ mode: normalizedMode });     // faz o download
    return;
  }

  /* 3 ▸ primeira chamada: marca a flag, recarrega a página */
  if (hasSession) {
    sessionStorage.setItem(flagKey, normalizedMode);
    location.reload();                     // equivale ao F5
  }
}

  /* ================================================================
   (NOVO) Gera a chave estável de uma questão
   ============================================================== */
function qKey(disc, sub, label) {
  return `${disc}_${sub}_${encodeURIComponent(label)}`;
}

const cssEscape = typeof CSS !== 'undefined' && CSS.escape
  ? CSS.escape.bind(CSS)
  : (str) => String(str).replace(/[\0-\x1f\x7f-\x9f!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g, '\\$&');

const htmlTextHelper = document.createElement('div');

function htmlToPlainText(html) {
  if (!html) return '';
  htmlTextHelper.innerHTML = html;
  const text = htmlTextHelper.textContent || '';
  htmlTextHelper.textContent = '';
  return text;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, ch => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[ch] || ch));
}

function buildSearchExcerpt(text, startIndex, matchLength) {
  if (startIndex < 0 || !text) return '';
  const context = 60;
  const start = Math.max(0, startIndex - context);
  const end = Math.min(text.length, startIndex + matchLength + context);
  const prefix = start > 0 ? '…' : '';
  const suffix = end < text.length ? '…' : '';
  const before = escapeHtml(text.slice(start, startIndex));
  const match = escapeHtml(text.slice(startIndex, startIndex + matchLength));
  const after = escapeHtml(text.slice(startIndex + matchLength, end));
  return `${prefix}${before}<mark>${match}</mark>${after}${suffix}`;
}

function parseCommentKey(key) {
  if (!key || !key.startsWith('comment_')) return null;
  const parts = key.split('_');
  if (parts.length < 4) return null;
  const disc = parts[1];
  const sub = parts[2];
  const label = decodeURIComponent(parts.slice(3).join('_'));
  return { disc, sub, label };
}

function parseSummaryKey(key) {
  if (!key || !key.startsWith('summary_')) return null;
  const parts = key.split('_');
  if (parts.length < 3) return null;
  const disc = parts[1];
  const sub = parts.slice(2).join('_');
  return { disc, sub };
}

function describeSubjectForSearch(disc, sub) {
  if (!sub) return '';
  if (sub === '00') return 'Resumo da disciplina';
  if (sub === 'micro') return 'Micro Simulado';
  const friendly = getFriendlyName(disc, sub);
  return friendly || `Assunto ${sub}`;
}
    /* ---------------------------------------------------------------
   Recebe um texto e devolve:
   { aliased: texto com URLs → 'Link', links: [array de URLs] }
   ---------------------------------------------------------------*/
function parseLinks(text) {
  const urls  = [];
  const alias = text.replace(/https?:\/\/\S+/gi, url => {
    urls.push(url);
    return 'Link';           // sempre a mesma palavra
  });
  return { aliased: alias, links: urls };
}

function isImageUrl(url) {
  return (/\.(jpe?g|png|gif|bmp|webp)$/i.test(url) ||
          /^https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^/]+\/o\/.+\?alt=media.*$/i.test(url));
}

// Substitui a notação "-->" por "→" mantendo o cursor no lugar.
// Quando `global` é true, faz varredura completa (usado ao carregar/pastar texto).
function replaceArrows(div, global = false){
  if(global){
    const walker=document.createTreeWalker(div,NodeFilter.SHOW_TEXT,null);
    let node;
    while((node=walker.nextNode())){
      if(node.textContent.includes('-->')){
        node.textContent=node.textContent.replace(/-->/g,'→');
      }
    }
    return;
  }

  const sel=window.getSelection();
  if(!sel.rangeCount || !div.contains(sel.anchorNode)) return;
  const range=sel.getRangeAt(0);
  const node=range.startContainer;
  if(node.nodeType!==Node.TEXT_NODE) return;

  const text=node.textContent;
  const pos=range.startOffset;
  const before=text.slice(0,pos);
  if(before.endsWith('-->')){
    node.textContent = before.slice(0,-3)+'→'+text.slice(pos);
    const newPos=pos-2; // remove 3 chars, add 1
    range.setStart(node,newPos);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

/* ================================================================
   5. FUNÇÕES DE RENDERIZAÇÃO / LAYOUT (manipulam DOM)
   ============================================================== */
/* ajusta a altura vertical do editor (até um máximo)  */
function fitHeight(div, maxPx = 240){
  // zera para recalcular; precisa do setTimeout para pegar o scrollHeight correto
  div.style.maxHeight = 'auto';
  const needed = Math.min(div.scrollHeight + 2, maxPx); // +2 evita corte de borda
  div.style.maxHeight = needed + 'px';
}
/* Remove todo o conteúdo renderizado. */
const clear = () => (app.innerHTML = "");

/** Atualiza cabeçalho e visibilidade do botão Voltar. */
function updateHeader(show, title = "") {
  header.style.display = show ? "flex" : "none";
  header.querySelector(".header-top").style.display = show ? "flex" : "none";
  document.getElementById("headerStats").style.display = show ? "block" : "none";

  /* botão voltar */
  backBtn.style.visibility = title ? "visible" : "hidden";

  /* título */
  headerTitle.textContent = title;

  headerTitle.style.cursor         = "default";
  headerTitle.style.textDecoration = "none";
  headerTitle.title                = "";
  headerTitle.onclick              = null;
}

/** Sincroniza a imagem/cor de uma estrela quando seu estado muda. */
function updateStar(el, state) {
  const PNG  = ["Black","Red","Orange","Green","Blue"][state] + ".png";
  let img    = el.querySelector("img");
  if (!img) {
    img = document.createElement("img");
    img.style.cssText = "width:45px;height:45px;display:block;pointer-events:none";
    el.prepend(img);
  }
  img.src = `Stars/${PNG}`;
}

function getStoredQuestionState(disc, sub, label) {
  return +localStorage.getItem(qKey(disc, sub, label)) || 0;
}

function getEffectiveStateFromKey(key, baseState) {
  if (!postReviewMode || baseState !== 2) {
    return baseState;
  }
  const reviewState = +localStorage.getItem(`natReview_${key}`) || 0;
  return reviewState === 1 ? 1 : baseState;
}

function getEffectiveQuestionState(disc, sub, label) {
  const key = qKey(disc, sub, label);
  const baseState = getStoredQuestionState(disc, sub, label);
  return getEffectiveStateFromKey(key, baseState);
}

function updateReviewModeButton() {
  if (!reviewModeBtn) return;
  reviewModeBtn.textContent = postReviewMode ? 'Estatísticas Pré-Revisão' : 'Estatísticas Pós-Revisão';
}

function refreshReviewModeUI() {
  switch (currentView) {
    case 'home':
      showMenu();
      break;
    case 'subjects':
      if (currentDisc) {
        showSubjects(currentDisc);
      } else {
        showMenu();
      }
      break;
    case 'questions':
      if (currentDisc && currentSub) {
        showQuestions(currentDisc, currentSub, false, trailReturnSub);
      } else if (currentDisc) {
        showSubjects(currentDisc);
      } else {
        showMenu();
      }
      break;
    case 'trail':
      showTrail(undefined, true);
      break;
    case 'examMenu':
      showExamMenu();
      break;
    case 'examList':
      if (currentExamMode) {
        showExamList(currentExamMode);
      } else {
        showExamMenu();
      }
      break;
    case 'exam':
      if (currentExam) {
        showExam(currentExam);
      } else if (currentExamMode) {
        showExamList(currentExamMode);
      } else {
        showExamMenu();
      }
      break;
    case 'review':
      showNatReview();
      break;
    case 'microSim':
      if (currentMicroSimEntry) {
        showMicroSim(currentMicroSimEntry);
      } else {
        showSubjects('Matemática');
      }
      break;
    default:
      showMenu();
  }
}

function setPostReviewMode(enabled) {
  postReviewMode = !!enabled;
  if (postReviewMode) {
    localStorage.setItem(REVIEW_MODE_STORAGE_KEY, '1');
  } else {
    localStorage.removeItem(REVIEW_MODE_STORAGE_KEY);
  }
  updateReviewModeButton();
  refreshReviewModeUI();
}

// Calcula automaticamente a estrela de um assunto
function calcStarState(disc, sub) {
  const qs = questoesData[disc][sub] || [];
  let correct = 0, answered = 0;
  qs.forEach(q => {
    const st = getEffectiveQuestionState(disc, sub, q.label);
    if (st === 1) correct++;
    if (st === 1 || st === 2) answered++;
  });
  const total = qs.length;
  if (total === 0) return 0; // nenhuma questão cadastrada
  if (answered < 10 && answered / total < 0.75) return 0; // ainda sem dados suficientes
  const pct = answered ? correct / answered : 0;
  return pct >= 0.9 ? 4
       : pct >= 0.8 ? 3
       : pct >= 0.6 ? 2
       : 1;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Conta quantas questões ainda não resolvidas existem em uma disciplina
function countRemainingQuestions(disc){
  let count=0;
  for(const sub in questoesData[disc]){
    questoesData[disc][sub].forEach(q=>{
      const st=+localStorage.getItem(qKey(disc,sub,q.label))||0;
      if(st===0) count++;
    });
  }
  return count;
}

// Sorteia questões de Matemática conforme quantidade desejada
function generateMicroQuestions(total=10){
  const disc='Matemática';
  const subs=Object.keys(questoesData[disc]);

  // Mapeia questões não respondidas por assunto
  const pool={};
  subs.forEach(sub=>{
    const list=questoesData[disc][sub].filter(q=>{
      const st=+localStorage.getItem(qKey(disc,sub,q.label))||0;
      return st===0;
    });
    if(list.length>0) pool[sub]=list;
  });

  const availableSubs=Object.keys(pool);
  if(availableSubs.length===0) return [];

  // limita pelo total possível
  let totalAvailable=0;
  availableSubs.forEach(s=>{ totalAvailable+=pool[s].length; });
  total=Math.min(total,totalAvailable);

  const result=[];
  shuffle(availableSubs);

  if(total<=availableSubs.length){
    const chosenSubs=availableSubs.slice(0,total);
    chosenSubs.forEach(sub=>{
      const list=pool[sub];
      const q=list[Math.floor(Math.random()*list.length)];
      result.push({sub,label:q.label});
    });
    return result;
  }

  // Distribui 1 questão para cada assunto disponível inicialmente
  availableSubs.forEach(sub=>{
    if(result.length>=total) return;
    const list=pool[sub];
    const idx=Math.floor(Math.random()*list.length);
    const q=list.splice(idx,1)[0];
    result.push({sub,label:q.label});
  });

  let remaining=total-result.length;
  while(remaining>0){
    const candidates=availableSubs.filter(s=>pool[s].length>0);
    if(candidates.length===0) break;
    const sub=candidates[Math.floor(Math.random()*candidates.length)];
    const list=pool[sub];
    const idx=Math.floor(Math.random()*list.length);
    const q=list.splice(idx,1)[0];
    result.push({sub,label:q.label});
    remaining--;
  }
  return result;
}

// Verifica overflow horizontal no campo de comentário
function atualizaIndicadorOverflow(editDiv) {
  // se estiver expandido, não exibimos indicador
  if (editDiv.classList.contains('expanded')) {
    editDiv.classList.remove('has-overflow');
    return;
  }
  // compara largura real do conteúdo com a largura visível
  if (editDiv.scrollWidth > editDiv.clientWidth) {
    editDiv.classList.add('has-overflow');
  } else {
    editDiv.classList.remove('has-overflow');
  }
}
function getTodayStr() {
  return new Date().toLocaleDateString('en-CA', {
    timeZone: 'America/Fortaleza'
  });
}
function getTodayDateBR() {
  return new Date(`${getTodayStr()}T00:00:00-03:00`);
}
 /* -------- contador de feitas hoje -------- */
function getTodaySolvedCount() {
  const today = getTodayStr();
  let count = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(`log_${today}_`)) count++;
  }
  return count;
}

function getTotalXPCount() {
  let count = 0;
  for (const disc in questoesData) {
    if (D1_DISCIPLINES.includes(disc)) continue;
    for (const sub in questoesData[disc]) {
      const qs = questoesData[disc][sub];
      qs.forEach(q => {
        const st = +localStorage.getItem(qKey(disc, sub, q.label)) || 0;
        if (st === 1 || st === 2) count++;
      });
    }
  }
  return count;
}

/** Retorna o total de questões disponíveis no banco */
function getTotalQuestionsCount() {
  return Object.entries(questoesData)
    .filter(([d]) => !D1_DISCIPLINES.includes(d))
    .flatMap(([, subs]) => Object.values(subs))
    .reduce((sum, arr) => sum + arr.length, 0);
}
if (typeof sessionStorage !== 'undefined') {
  const pendingExport = sessionStorage.getItem("__exportReady__");
  if (pendingExport) {
    const mode = pendingExport === 'yes' ? 'general' : pendingExport;
    exportData(mode);        // cai direto no ramo que baixa o arquivo
  }
}
/* ---------------- MENU PRINCIPAL ---------------- */
function getDisciplineQuestionStats(disc) {
  const subjects = questoesData[disc] || {};
  let correct = 0;
  let answered = 0;
  let total = 0;

  Object.entries(subjects).forEach(([sub, questions]) => {
    questions.forEach((q) => {
      total += 1;
      const state = getEffectiveQuestionState(disc, sub, q.label);
      if (state === 1 || state === 2) answered += 1;
      if (state === 1) correct += 1;
    });
  });

  return { correct, answered, total };
}

function showMenu () {
  examListOpen=false;
  currentExam=null;
  currentView = 'home';
  currentMicroSimEntry = null;
  if (postReviewModeRestore !== null) {
    if (postReviewMode !== postReviewModeRestore) {
      postReviewMode = postReviewModeRestore;
      if (postReviewMode) {
        localStorage.setItem(REVIEW_MODE_STORAGE_KEY, '1');
      } else {
        localStorage.removeItem(REVIEW_MODE_STORAGE_KEY);
      }
    }
    updateReviewModeButton();
    postReviewModeRestore = null;
  }
  /* 1 ▸ devolve o xpModal para <body> antes que clear() o remova        */
  const xpModalEl = document.getElementById('xpModal');
  if (xpModalEl && xpModalEl.parentElement !== document.body) {
    document.body.appendChild(xpModalEl);   // salva o modal
  }

  /* 2 ▸ layout padrão */
  currentDisc = currentSub = null;
  trailReturnSub = false;
  summaryBtn.style.display = 'none';
  summaryBtn.onclick = null;
  orderHint.style.display = 'none';
  headerTitle.onmouseenter = null;
  headerTitle.onmouseleave = null;
  headerTitle.onclick = null;
  enterHome();            // aplica o visual preto + ajustes
  updateHeader(true);
  document.getElementById('headerStats').style.visibility='visible';
  clear();                   // <- apaga o conteúdo de #app sem afetar xpModal

  /* 3 ▸ Introdução */
  app.insertAdjacentHTML("beforeend", `
    <div class="intro-block">
      <div class="intro-left">
        <img src="Arcano_Newtonius.jpg" alt="Arcano Newtonius" class="intro-img">
        <div id="xp-hoje">
          🔮 Hoje: +${getTodaySolvedCount()}XP |
          Total: ${getTotalXPCount()}XP |
          ${Math.round(getTotalXPCount() / getTotalQuestionsCount() * 100)}%
        </div>
      </div>
      <div class="intro-text">
        <p>Seja bem-vindo(a), jovem aprendiz do conhecimento!</p><br/>
        <p>Eu sou <strong>Arcano Newtonius</strong>, o Mago das Ciências da Natureza e da Matemática!<br/>
        Guardião dos segredos do universo, e teu guia nesta jornada rumo à aprovação em Medicina no ENEM.</p><br/>
        <p>Cumpre tuas missões, conquista tuas estrelas e avança de nível até alcançar o topo!</p>
      </div>
    </div>`);

  /* 4 ▸ reinstala o listener no botão "🔮 Hoje" recém-criado           */
  window.bindXpTrigger();

  /* 5 ▸ Lista de disciplinas (código original)                          */
  const lines = app.appendChild(Object.assign(
    document.createElement("div"), { className: "metacog-lines" }));

  const discList = ["Biologia","Química","Física","Matemática"];
  if(d1Enabled) discList.push(...D1_DISPLAY_DISCIPLINES);
  for (const disc of discList) {
    const line = lines.appendChild(Object.assign(
      document.createElement("div"), { className: "disc-line" }));
    const btn = Object.assign(
      document.createElement("button"), {
        className: `disc-btn ${discClasses[disc]}`,
        onclick: () => {
          if(disc === 'Redação') {
            currentDisc = disc;
            currentSub = '01';
            openDisciplineSummary(disc);
          } else {
            showSubjects(disc);
          }
        },
      });
    btn.appendChild(Object.assign(
      document.createElement('span'),
      { className: 'disc-btn-label', textContent: disc }
    ));
    const { correct, answered, total } = getDisciplineQuestionStats(disc);
    btn.appendChild(Object.assign(
      document.createElement('span'),
      { className: 'disc-btn-stats', textContent: `${correct}/${answered}[${total}]` }
    ));
    if(disc === 'Geografia e Sociologia') btn.style.padding='0 4px';
    line.appendChild(btn);

    if (disc !== 'Redação') {
      const stars = line.appendChild(Object.assign(
        document.createElement("div"), { className: "stars-container" }));
      for (const sub of Object.keys(questoesData[disc]).sort()) {
        const star = stars.appendChild(Object.assign(
          document.createElement("span"), { className: "star" }));
        star.innerHTML = `<span class="star-index">${sub}</span>`;
        let st = calcStarState(disc, sub);
        updateStar(star, st);
        star.onclick = () => {
          showQuestions(disc, sub, true, false); // se veio da estrela, volta para Home
        };
      }
    }
  }
  toggleSettingsVisibility(true);   // mostra engrenagem
}

function closeSubmenu(menu, button) {
  if (!menu || !button) return;
  menu.style.display = 'none';
  button.setAttribute('aria-expanded', 'false');
}

function closeProgrammerMenu() {
  closeSubmenu(programmerMenu, programmerBtn);
}

function closeSettingsSubmenus() {
  closeSubmenu(reviewMenu, reviewMenuBtn);
  closeSubmenu(backupMenu, backupMenuBtn);
  closeProgrammerMenu();
}

function closeSettingsMenu() {
  settingsMenu.style.display = "none";
  closeSettingsSubmenus();
}

function toggleSettingsSubmenu(menu, button) {
  if (!menu || !button) return;
  const expanded = menu.style.display === 'flex';
  closeSettingsSubmenus();
  menu.style.display = expanded ? 'none' : 'flex';
  button.setAttribute('aria-expanded', expanded ? 'false' : 'true');
}

// Abre/fecha ao clicar na engrenagem
settingsBtn.onclick = e => {
  e.stopPropagation();   // evita fechar imediatamente
  if (settingsMenu.style.display === "flex") {
    closeSettingsMenu();
  } else {
    closeSettingsSubmenus();
    settingsMenu.style.display = "flex";
  }
};

// Fecha se clicar fora do menu
document.addEventListener("click", e=>{
  if(!settingsMenu.contains(e.target) && e.target!==settingsBtn){
    closeSettingsMenu();
  }
  if(
    reviewSettingsMenu && reviewSettingsBtn &&
    !reviewSettingsMenu.contains(e.target) &&
    e.target !== reviewSettingsBtn
  ){
    reviewSettingsMenu.style.display = 'none';
    reviewSettingsBtn.setAttribute('aria-expanded', 'false');
  }
});

function toggleSettingsVisibility(showHome){
  settingsBtn.style.display  = showHome ? 'block' : 'none';
  /* se saiu da home, fecha o menu para não ficar solto */
  if (!showHome) closeSettingsMenu();
  toggleReviewSettingsVisibility(false);
}

function isSearchOverlayOpen(){
  return !!(searchOverlay && searchOverlay.classList.contains('open'));
}

function openSearchOverlay(){
  if(!searchOverlay || !searchInput || !searchResultsList) return;
  searchOverlay.classList.add('open');
  searchOverlay.setAttribute('aria-hidden', 'false');
  setBodyScrollLocked(true);
  searchResultsList.innerHTML = '';
  updateSearchFeedback('Digite um termo para buscar em comentários e resumos.');
  requestAnimationFrame(() => {
    searchInput.focus();
    searchInput.select();
  });
}

function closeSearchOverlay(){
  if(!searchOverlay) return;
  searchOverlay.classList.remove('open');
  searchOverlay.setAttribute('aria-hidden', 'true');
  const pdfOpen = pdfContainer && pdfContainer.style.display === 'flex';
  const summaryOpen = summaryContainer && summaryContainer.style.display !== 'none';
  if(!pdfOpen && !summaryOpen){
    setBodyScrollLocked(false);
  }
}

function updateSearchFeedback(message, isError = false){
  if(!searchFeedbackEl) return;
  searchFeedbackEl.textContent = message;
  searchFeedbackEl.classList.toggle('search-feedback--error', !!isError);
}

function focusQuestionFromSearch(match){
  if(!match) return;
  const selector = `[data-question-key="${cssEscape(match.key)}"]`;
  const row = app.querySelector(selector);
  if(!row) return;
  const comment = row.querySelector('.comment-edit');
  row.classList.add('search-hit');
  if(comment) comment.classList.add('search-hit');
  row.scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => {
    row.classList.remove('search-hit');
    if(comment) comment.classList.remove('search-hit');
  }, 4500);
}

function navigateToQuestionFromSearch(disc, sub, label){
  pendingSearchFocus = {
    disc,
    sub,
    label,
    key: qKey(disc, sub, label)
  };
  showQuestions(disc, sub, false, false);
}

function performSearch(rawTerm){
  if(!searchResultsList) return;
  const term = (rawTerm || '').trim();
  if(!term){
    searchResultsList.innerHTML = '';
    updateSearchFeedback('Digite um termo para buscar em comentários e resumos.');
    return;
  }
  if(term.length < 2){
    searchResultsList.innerHTML = '';
    updateSearchFeedback('Digite pelo menos 2 caracteres.', true);
    return;
  }

  const normalized = term.toLocaleLowerCase('pt-BR');
  const results = [];

  for(let i = 0; i < localStorage.length; i += 1){
    const key = localStorage.key(i);
    if(!key) continue;

    if(key.startsWith('comment_')){
      const parsed = parseCommentKey(key);
      if(!parsed) continue;
      const html = localStorage.getItem(key) || '';
      const text = htmlToPlainText(html);
      if(!text.trim()) continue;
      const lower = text.toLocaleLowerCase('pt-BR');
      const idx = lower.indexOf(normalized);
      if(idx === -1) continue;
      results.push({
        type: 'comment',
        disc: parsed.disc,
        sub: parsed.sub,
        label: parsed.label,
        key: qKey(parsed.disc, parsed.sub, parsed.label),
        excerpt: buildSearchExcerpt(text, idx, term.length)
      });
    } else if(key.startsWith('summary_')){
      const parsed = parseSummaryKey(key);
      if(!parsed) continue;
      const html = localStorage.getItem(key) || '';
      const text = htmlToPlainText(html);
      if(!text.trim()) continue;
      const lower = text.toLocaleLowerCase('pt-BR');
      const idx = lower.indexOf(normalized);
      if(idx === -1) continue;
      results.push({
        type: 'summary',
        disc: parsed.disc,
        sub: parsed.sub,
        excerpt: buildSearchExcerpt(text, idx, term.length)
      });
    }
  }

  results.sort((a, b) => {
    if(a.type !== b.type) return a.type === 'comment' ? -1 : 1;
    const discCmp = a.disc.localeCompare(b.disc, 'pt-BR');
    if(discCmp !== 0) return discCmp;
    const subA = a.sub || '';
    const subB = b.sub || '';
    const subCmp = subA.localeCompare(subB, 'pt-BR');
    if(subCmp !== 0) return subCmp;
    if(a.type === 'comment' && b.type === 'comment'){
      return a.label.localeCompare(b.label, 'pt-BR');
    }
    return 0;
  });

  if(results.length === 0){
    searchResultsList.innerHTML = '';
    updateSearchFeedback('Nenhum resultado encontrado.', true);
    return;
  }

  updateSearchFeedback(`${results.length} resultado${results.length>1?'s':''} encontrado${results.length>1?'s':''}.`);
  renderSearchResults(results);
}

function renderSearchResults(results){
  if(!searchResultsList) return;
  searchResultsList.innerHTML = '';
  results.forEach(result => {
    const item = document.createElement('li');
    item.className = 'search-result';

    const main = document.createElement('button');
    main.type = 'button';
    main.className = 'search-result-main';

    const pathParts = [result.disc];
    if(result.type === 'comment'){
      const subject = describeSubjectForSearch(result.disc, result.sub);
      if(subject) pathParts.push(subject);
    } else {
      if(result.sub === '00'){
        pathParts.push('Resumo da disciplina');
      } else {
        const subject = describeSubjectForSearch(result.disc, result.sub);
        if(subject) pathParts.push(subject);
      }
    }

    const path = document.createElement('span');
    path.className = 'search-result-path';
    path.textContent = pathParts.filter(Boolean).join(' • ');
    main.appendChild(path);

    const target = document.createElement('span');
    target.className = 'search-result-target';
    target.textContent = result.type === 'comment'
      ? result.label
      : 'Resumo';
    main.appendChild(target);

    const excerpt = document.createElement('span');
    excerpt.className = 'search-result-excerpt';
    excerpt.innerHTML = result.excerpt;
    main.appendChild(excerpt);

    main.addEventListener('click', () => {
      closeSearchOverlay();
      if(result.type === 'comment'){
        navigateToQuestionFromSearch(result.disc, result.sub, result.label);
      } else {
        openSummaryFor(result.disc, result.sub);
      }
    });

    const tag = document.createElement('span');
    tag.className = 'search-result-tag';
    tag.textContent = result.type === 'comment' ? 'Comentário' : 'Resumo';

    item.appendChild(main);
    item.appendChild(tag);
    searchResultsList.appendChild(item);
  });
}

if(searchNotesBtn){
  searchNotesBtn.onclick = () => {
    closeSettingsMenu();
    openSearchOverlay();
  };
}

if(searchCloseBtn){
  searchCloseBtn.addEventListener('click', closeSearchOverlay);
}

if(searchOverlay){
  searchOverlay.addEventListener('click', e => {
    if(e.target === searchOverlay){
      closeSearchOverlay();
    }
  });
}

if(searchForm){
  searchForm.addEventListener('submit', e => {
    e.preventDefault();
    performSearch(searchInput ? searchInput.value : '');
  });
}

document.addEventListener('keydown', e => {
  if(e.key === 'Escape' && isSearchOverlayOpen()){
    closeSearchOverlay();
  }
});

exportBtn.onclick = () => {
  closeSettingsMenu();
  exportData('general');
};
if (exportHandBtn) {
  exportHandBtn.onclick = () => {
    closeSettingsMenu();
    exportData('handwriting');
  };
}
importBtn.onclick = () => {
  closeSettingsMenu();
  importFile.value = '';
  importFile.dataset.mode = 'general';
  importFile.click();
};
if (importHandBtn) {
  importHandBtn.onclick = () => {
    closeSettingsMenu();
    importFile.value = '';
    importFile.dataset.mode = 'handwriting';
    importFile.click();
  };
}



async function clearBrowserCaches() {
  if (!("caches" in window)) return;
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name).catch(() => {})));
}

if (reviewMenuBtn && reviewMenu) {
  reviewMenuBtn.onclick = (event) => {
    event.stopPropagation();
    toggleSettingsSubmenu(reviewMenu, reviewMenuBtn);
  };
}

if (backupMenuBtn && backupMenu) {
  backupMenuBtn.onclick = (event) => {
    event.stopPropagation();
    toggleSettingsSubmenu(backupMenu, backupMenuBtn);
  };
}

if (programmerBtn && programmerMenu) {
  programmerBtn.onclick = (event) => {
    event.stopPropagation();
    toggleSettingsSubmenu(programmerMenu, programmerBtn);
  };
}


if (clearAllBtn) {
  clearAllBtn.onclick = async () => {
    closeSettingsMenu();
    const confirmed = confirm(
      'Deseja apagar tudo? Isso remove questões, comentários, revisões, resumos, manuscritos e cache. Essa ação não pode ser desfeita.'
    );
    if (!confirmed) return;

    try {
      pdfDirtyLayers.clear();
    } catch (err) {
      console.warn('Falha ao limpar a fila de camadas do PDF antes da limpeza total.', err);
    }

    try {
      localStorage.clear();
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.clear();
      }
      await clearBrowserCaches();
    } catch (err) {
      console.error('Erro ao limpar todos os dados', err);
      alert('Não foi possível concluir a limpeza total. Verifique o console para mais detalhes.');
      return;
    }

    window.location.reload();
  };
}

if (clearQuestionsBtn) {
  clearQuestionsBtn.onclick = () => {
    closeSettingsMenu();
    const confirmed = confirm(
      'Deseja apagar todos os dados de questões, comentários e revisão? Manuscritos e cache não serão apagados por esta ação.'
    );
    if (!confirmed) return;

    const removedCount = clearQuestionDataFromLocalStorage();
    alert(`${removedCount} dado(s) de questões foram apagados.`);
    window.location.reload();
  };
}

if (clearManuscriptsBtn) {
  clearManuscriptsBtn.onclick = () => {
    closeSettingsMenu();
    const confirmed = confirm(
      'Deseja apagar todos os manuscritos salvos nos PDFs? Essa ação não pode ser desfeita.'
    );
    if (!confirmed) return;

    try {
      pdfDirtyLayers.clear();
    } catch (err) {
      console.warn('Falha ao limpar a fila de camadas do PDF antes da remoção.', err);
    }

    const pagesCleared = clearPdfDrawings();
    if (pagesCleared === null) {
      alert('Não foi possível limpar os manuscritos. Verifique o console para mais detalhes.');
      return;
    }
    if (pagesCleared === 0) {
      alert('Nenhum manuscrito encontrado.');
    } else {
      alert(`${pagesCleared} página(s) com manuscritos foram apagadas.`);
    }
  };
}

if (clearCacheBtn) {
  clearCacheBtn.onclick = async () => {
    closeSettingsMenu();
    const confirmed = confirm(
      "Deseja limpar o cache?\nIsso faz o navegador baixar a versão mais recente sem apagar seu progresso."
    );
    if (!confirmed) return;

    clearCacheBtn.disabled = true;
    clearCacheBtn.textContent = "Limpando...";

    try {
      await clearBrowserCaches();

      const resources = new Set();
      const addLocalResource = url => {
        if (!url) return;
        const absolute = new URL(url, window.location.href);
        if (absolute.origin === window.location.origin) {
          resources.add(absolute.href);
        }
      };

      addLocalResource(window.location.href);
      document
        .querySelectorAll('link[rel="stylesheet"]')
        .forEach(link => addLocalResource(link.getAttribute('href')));
      document
        .querySelectorAll('script[src]')
        .forEach(script => addLocalResource(script.getAttribute('src')));

      await Promise.all(
        [...resources].map(url =>
          fetch(url, { cache: 'reload' }).catch(err =>
            console.warn('Falha ao atualizar recurso', url, err)
          )
        )
      );
    } catch (err) {
      console.error('Erro ao limpar cache', err);
    }

    window.location.reload();
  };
}

/* ---------------- TRILHA ESTRATÉGICA ---------------- */
trilhaBtn.onclick = () => {
  closeSettingsMenu();
  showTrail();
};

examsBtn.onclick = () => {
  closeSettingsMenu();
  showExamMenu();
};

natReviewBtn.onclick = () => {
  closeSettingsMenu();
  resetNatReviewState('wrong');
  showNatReview();
};

if (favReviewBtn) {
  favReviewBtn.onclick = () => {
    closeSettingsMenu();
    resetNatReviewState('favorite');
    showNatReview();
  };
}

if (reviewModeBtn) {
  updateReviewModeButton();
  reviewModeBtn.onclick = () => {
    closeSettingsMenu();
    setPostReviewMode(!postReviewMode);
  };
}

function updateD1Btn(){
  toggleD1Btn.textContent = d1Enabled ? 'Esconder - D1' : 'Exibir - D1';
}

toggleD1Btn.onclick = () => {
  d1Enabled = !d1Enabled;
  localStorage.setItem('d1Enabled', JSON.stringify(d1Enabled));
  closeSettingsMenu();
  updateD1Btn();
  if(currentDisc === null) showMenu();
};


function loadTrail(dayStr){
  const raw = localStorage.getItem(`trail_${dayStr}`);
  const data = raw ? JSON.parse(raw) : {};
  data.novo ||= [];
  return data;
}
function saveTrail(dayStr,data){
  localStorage.setItem(`trail_${dayStr}`, JSON.stringify(data));
}

function migratePastTrailToAgenda(){
  const today = getTodayStr();
  const last = localStorage.getItem('trail_last_day') || today;
  if(last < today){
    const agendaData = loadTrail(AGENDA_DAY);
    let d = new Date(`${last}T00:00:00-03:00`);
    const todayDate = new Date(`${today}T00:00:00-03:00`);
    while(d < todayDate){
      const dStr = d.toLocaleDateString('en-CA',{timeZone:'America/Fortaleza'});
      const dayData = loadTrail(dStr);
      for(const key in dayData){
        agendaData[key] = agendaData[key] || [];
        agendaData[key].push(...dayData[key]);
      }
      localStorage.removeItem(`trail_${dStr}`);
      d.setDate(d.getDate()+1);
    }
    saveTrail(AGENDA_DAY, agendaData);
  }
  localStorage.setItem('trail_last_day', today);
}

function moveTrailItem(fromDay, fromKey, fromIdx, toDay, toKey, toIdx){
  if(!fromDay || !toDay) return;
  const fromData = loadTrail(fromDay);
  const item = fromData[fromKey].splice(fromIdx,1)[0];
  saveTrail(fromDay, fromData);
  const toData = fromDay===toDay ? fromData : loadTrail(toDay);
  if(toIdx<0 || toIdx>toData[toKey].length) toIdx = toData[toKey].length;
  toData[toKey].splice(toIdx,0,item);
  saveTrail(toDay, toData);
}

function getDragAfterElement(container, y){
  const els=[...container.querySelectorAll('.trail-item:not(.dragging)')];
  return els.reduce((closest,el)=>{
    const box=el.getBoundingClientRect();
    const offset=y - box.top - box.height/2;
    if(offset<0 && offset>closest.offset){
      return {offset, element: el};
    }
    return closest;
  }, {offset:Number.NEGATIVE_INFINITY}).element;
}
function countDailySolved(dateStr, disc, sub){
  const prefix = sub==='micro'
    ? `logmicro_${dateStr}_${disc}_`
    : `log_${dateStr}_${disc}_${sub}_`;
  let c = 0;
  for(let i=0;i<localStorage.length;i++){
    const k = localStorage.key(i);
    if(k.startsWith(prefix)) c++;
  }
  return c;
}

// Soma o progresso do dia em todas as matérias de uma disciplina
function countDailySolvedDisc(dateStr, disc){
  let tot=0;
  for(const sub of Object.keys(questoesData[disc]||{})){
    tot += countDailySolved(dateStr,disc,sub);
  }
  return tot;
}

// Conta quantas questões de um micro simulado já foram respondidas
function countMicroProgress(entry){
  if(!entry || !Array.isArray(entry.qs)) return 0;
  let a=0;
  entry.qs.forEach(({sub,label})=>{
    const st = +localStorage.getItem(qKey('Matemática', sub, label)) || 0;
    if(st===1 || st===2) a++;
  });
  return a;
}

function countDailyReviewed(dateStr, filter) {
  if (!dateStr) return 0;
  return collectNatReviewItems(filter).reduce((total, item) => {
    const key = qKey(item.disc, item.sub, item.q.label);
    return total + (localStorage.getItem(`reviewLog_${dateStr}_${key}`) === '1' ? 1 : 0);
  }, 0);
}

function openPicker(callback){
  pickerDisc.innerHTML = '';
  pickerReviewDisc.innerHTML = '';
  pickerSub.innerHTML  = '';
  pickerExamMode.innerHTML='';
  pickerExam.innerHTML='';
  pickerExamMode.style.display='none';
  pickerExam.style.display='none';
  pickerAdd.disabled = false;
  for(const d of Object.keys(SUBJECT_NAMES)){
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = d;
    pickerDisc.appendChild(opt);
  }
  const optExam=document.createElement('option');
  optExam.value='__exams__';
  optExam.textContent='Provas e Simulados';
  pickerDisc.appendChild(optExam);
  const optReview=document.createElement('option');
  optReview.value='__review__';
  optReview.textContent='Revisão';
  pickerDisc.appendChild(optReview);
  const optComment=document.createElement('option');
  optComment.value='__comment__';
  optComment.textContent='Comentário';
  pickerDisc.appendChild(optComment);
  pickerDisc.onchange = () => {
    const selected = pickerDisc.value;
    const hideReviewSelectors = () => {
      pickerReviewDisc.style.display = 'none';
      pickerReviewDisc.onchange = null;
    };

    if(selected==='__comment__'){
      hideReviewSelectors();
      pickerSub.style.display='none';
      pickerComment.style.display='inline-block';
      pickerMicro.style.display='none';
      pickerExamMode.style.display='none';
      pickerExam.style.display='none';
    }else if(selected==='__exams__'){
      hideReviewSelectors();
      pickerSub.style.display='none';
      pickerComment.style.display='none';
      pickerMicro.style.display='none';
      pickerExamMode.style.display='';
      pickerExam.style.display='';
      pickerExamMode.innerHTML=
        '<option value="lin">Linguagens</option>'+
        '<option value="hum">Humanas</option>'+
        '<option value="nat">Natureza</option>'+
        '<option value="mat">Matemática</option>';
      const populateExam=()=>{
        const order=examOrderByMode[pickerExamMode.value]||[];
        pickerExam.innerHTML='';
        order.forEach(ex=>{
          const o=document.createElement('option');
          o.value=ex;
          o.textContent=ex;
          pickerExam.appendChild(o);
        });
      };
      pickerExamMode.onchange=populateExam;
      populateExam();
    }else if(selected==='__review__'){
      pickerComment.style.display='none';
      pickerMicro.style.display='none';
      pickerExamMode.style.display='';
      pickerExam.style.display='none';
      pickerReviewDisc.style.display='none';
      pickerSub.style.display='none';
      pickerReviewDisc.innerHTML='';
      pickerSub.innerHTML='';
      pickerExamMode.innerHTML =
        '<option value="wrong">Erradas</option>'+
        '<option value="favorite">Favoritas</option>';
      pickerAdd.disabled = false;
    }else{
      hideReviewSelectors();
      pickerSub.style.display='';
      pickerComment.style.display='none';
      pickerSub.innerHTML = '';
      const optAll=document.createElement('option');
      optAll.value=ALL_SUB;
      optAll.textContent='Disciplina Inteira';
      pickerSub.appendChild(optAll);
      SUBJECT_NAMES[selected].forEach((n,i)=>{
        const o=document.createElement('option');
        o.value=String(i+1).padStart(2,'0');
        o.textContent=n;
        pickerSub.appendChild(o);
      });
      pickerMicro.style.display =
        selected==='Matemática'? 'inline-block' : 'none';
      pickerExamMode.style.display='none';
      pickerExam.style.display='none';
    }
  };
  pickerDisc.onchange();
  pickerAdd.onclick = () => {
    if(pickerDisc.value==='__comment__'){
      const txt=pickerComment.value.trim().replace(/-->/g,'→');
      if(txt) callback({comment:txt});
      pickerComment.value='';
    }else if(pickerDisc.value==='__exams__'){
      callback({exam:pickerExam.value,mode:pickerExamMode.value});
    }else if(pickerDisc.value==='__review__'){
      callback({review:true, kind: pickerExamMode.value === 'favorite' ? 'favorite' : 'wrong'});
    }else{
      callback({disc: pickerDisc.value, sub: pickerSub.value});
    }
    pickerModal.style.display='none';
  };
  pickerMicro.onclick = () => {
    const max = countRemainingQuestions('Matemática');
    if(max===0){
      alert('Todas as questões de Matemática foram concluídas.');
      return;
    }
    const inp = prompt(`Quantas questões deseja? (1-${max})`, '10');
    if(inp === null) return; // cancelado
    const n = Math.max(1, Math.min(parseInt(inp,10)||0, max));
    const qs = generateMicroQuestions(n);
    if(qs.length===0) return;
    callback({disc:'Matemática', sub:'micro', qs});
    pickerModal.style.display='none';
  };
  pickerCancel.onclick = () => pickerModal.style.display='none';
  pickerModal.style.display='flex';
}

function renderTrailDay(day,expand){
  const isAgenda = day === AGENDA_DAY;
  const dayStr = isAgenda
    ? AGENDA_DAY
    : day.toLocaleDateString('en-CA',{timeZone:'America/Fortaleza'});
  const btn = document.createElement('button');
  btn.className='day-btn';
  if(isAgenda){
    btn.innerHTML=`<span class="day-label">Agenda, Planejamento e Metodologia</span>`+
      `<i class="day-arrow fas fa-chevron-down"></i>`;
  }else{
    const weekDay = day.toLocaleDateString('pt-BR',{weekday:'long'});
    const dateFmt = day.toLocaleDateString('pt-BR');
    const isD1 = day.getTime() === EXAM_DATE.getTime();
    const isD2 = day.getTime() === SECOND_EXAM_DATE.getTime();
    if(isD1){
      btn.innerHTML=`<span class="day-label">ENEM - D1 (${weekDay} - ${dateFmt})</span>`+
        `<i class="day-arrow fas fa-chevron-down"></i>`;
    }else if(isD2){
      btn.innerHTML=`<span class="day-label">ENEM - D2 (${weekDay} - ${dateFmt})</span>`+
        `<i class="day-arrow fas fa-chevron-down"></i>`;
    }else{
      const targetDate = day > EXAM_DATE ? SECOND_EXAM_DATE : EXAM_DATE;
      const diffDays = Math.ceil((targetDate - day)/(86400000));
      btn.innerHTML=`<span class="day-label">${weekDay} - ${dateFmt} - ${diffDays} dias</span>`+
        `<i class="day-arrow fas fa-chevron-down"></i>`;
    }
  }

  const content=document.createElement('div');
  content.className='day-content';
  if(expand) btn.classList.add('open'), content.style.display='flex';

  const data=loadTrail(dayStr);
  const makeSection=(label,key)=>{
    const sec=document.createElement('div');
    sec.className='trail-section';
    sec.dataset.day=dayStr;
    sec.dataset.key=key;
    sec.addEventListener('dragover',e=>{
      e.preventDefault();
      const after=getDragAfterElement(sec,e.clientY);
      const dragging=document.querySelector('.dragging');
      if(!dragging) return;
      if(after==null) sec.appendChild(dragging); else sec.insertBefore(dragging,after);
    });
    sec.addEventListener('drop',e=>{
      e.preventDefault();
      sec.classList.remove('dragover');
      const dataTrans=e.dataTransfer.getData('text/plain');
      if(!dataTrans) return;
      const info=JSON.parse(dataTrans);
      const items=[...sec.querySelectorAll('.trail-item')];
      const dragging=document.querySelector('.dragging');
      const destIdx=items.indexOf(dragging);
      moveTrailItem(info.day,info.key,info.idx,dayStr,key,destIdx);
      showTrail(dayStr,true);
    });
    sec.addEventListener('dragenter',()=>sec.classList.add('dragover'));
    sec.addEventListener('dragleave',e=>{if(!sec.contains(e.relatedTarget)) sec.classList.remove('dragover');});
    const wrap=document.createElement('div');
    wrap.className='trail-section-header';
    const btnAdd=document.createElement('button');
    btnAdd.textContent=label;
    btnAdd.onclick=()=>{
      openPicker(sel=>{
        data[key].push(sel);
        saveTrail(dayStr,data);
        showTrail(dayStr, true); // re-render preservando scroll
      });
    };
    wrap.appendChild(btnAdd);
    sec.appendChild(wrap);
    data[key] ||= [];
    data[key].forEach((s,idx)=>{
      const item=document.createElement('div');
      item.className='trail-item';
      item.draggable=true;
      item.dataset.day=dayStr;
      item.dataset.key=key;
      item.dataset.idx=idx;
      item.addEventListener('dragstart',e=>{
        e.dataTransfer.setData('text/plain',JSON.stringify({day:dayStr,key,idx}));
        item.classList.add('dragging');
      });
      item.addEventListener('dragend',()=>item.classList.remove('dragging'));

      if(s.comment){
        const subj=document.createElement('span');
        subj.className='trail-comment';
        subj.textContent=s.comment;
        subj.onclick=()=>{
          const txt=prompt('Editar comentário:', s.comment);
          if(txt!==null){
            const val=txt.trim().replace(/-->/g,'→');
            if(val){
              data[key][idx].comment=val;
            }else{
              data[key].splice(idx,1);
            }
            saveTrail(dayStr,data);
            showTrail(dayStr, true);
          }
        };
        const rm=document.createElement('button');
        rm.className='trail-remove';
        rm.textContent='\u00D7';
        rm.onclick=()=>{
          data[key].splice(idx,1);
          saveTrail(dayStr,data);
          showTrail(dayStr, true);
        };
        item.appendChild(subj);
        item.appendChild(rm);
        sec.appendChild(item);
        return;
      }

      if(s.review){
        const subj=document.createElement('button');
        subj.className='trail-subject trail-review';
        const reviewKind = s.kind === 'favorite' ? 'favorite' : 'wrong';
        subj.classList.add(reviewKind === 'favorite' ? 'trail-review-favorite' : 'trail-review-wrong');
        subj.textContent = reviewKind === 'favorite' ? 'Revisão (Favoritas)' : 'Revisão (Erradas)';
        subj.onclick=()=>{
          trailReturn=dayStr;
          trailReturnSub=false;
          resetNatReviewState(reviewKind);
          showNatReview();
        };
        const count=document.createElement('span');
        count.className='trail-count';
        const defaultModes = REVIEW_DEFAULT_MODES.slice();
        const countFilter = {
          kind: reviewKind,
          modes: defaultModes,
          discs: getReviewDisciplinesForModes(defaultModes)
        };
        count.textContent=countDailyReviewed(dayStr, countFilter).toString();
        const rm=document.createElement('button');
        rm.className='trail-remove';
        rm.textContent='\u00D7';
        rm.onclick=()=>{
          data[key].splice(idx,1);
          saveTrail(dayStr,data);
          showTrail(dayStr, true);
        };
        item.appendChild(subj);
        item.appendChild(count);
        item.appendChild(rm);
        sec.appendChild(item);
        return;
      }

      if(s.exam){
        const subj=document.createElement('button');
        subj.className='trail-subject';
        const areaTitles={lin:'Linguagens',hum:'Humanas',nat:'Natureza',mat:'Matemática'};
        const area=areaTitles[s.mode]||'';
          subj.textContent=area?`${s.exam}: ${area}`:s.exam;
          const m=s.exam.match(/ENEM|SAS|BERNOULLI|POLIEDRO|SOMOS|EVOLUCIONAL/i);
          if(m) subj.classList.add(`exam-${m[0].toLowerCase()}`);
          subj.onclick=()=>{ trailReturn=dayStr; currentExamMode=s.mode; showExam(s.exam); };
          const rm=document.createElement('button');
          rm.className='trail-remove';
          rm.textContent='\u00D7';
          rm.onclick=()=>{
            data[key].splice(idx,1);
            saveTrail(dayStr,data);
            showTrail(dayStr, true);
          };
          item.appendChild(subj);
          item.appendChild(rm);
          sec.appendChild(item);
          return;
        }

      const isMicro = s.sub==='micro';
      const isDisc  = s.sub===ALL_SUB;
      const label = isMicro
        ? 'Simulado de Matemática'
        : isDisc
          ? s.disc
          : `${s.disc}: ${getFriendlyName(s.disc,s.sub)}`;
      const qcount = isMicro
        ? countMicroProgress(s)
        : isDisc
          ? countDailySolvedDisc(dayStr,s.disc)
          : countDailySolved(dayStr,s.disc,s.sub);

      const subj=document.createElement('button');
      subj.className=`trail-subject ${discClasses[s.disc]}`;
      subj.textContent=label;
      subj.onclick=()=>{
        trailReturn=dayStr;
        trailReturnSub = !isDisc && !isMicro;
        if(isMicro) showMicroSim(s);
        else if(isDisc) showSubjects(s.disc);
        else showQuestions(s.disc,s.sub,false,true);
      };

      const count=document.createElement('span');
      count.className='trail-count';
      count.textContent=qcount;

      const rm=document.createElement('button');
      rm.className='trail-remove';
      rm.textContent='×';
      rm.onclick=()=>{
        data[key].splice(idx,1);
        saveTrail(dayStr,data);
        showTrail(dayStr, true);
      };

      item.appendChild(subj);
      item.appendChild(count);
      item.appendChild(rm);
      sec.appendChild(item);
    });
    return sec;
  };
  content.appendChild(makeSection('Novo','novo'));

  btn.onclick=()=>{
    const open=btn.classList.toggle('open');
    content.style.display=open?'flex':'none';
    if(open) openTrailDays.add(dayStr); else openTrailDays.delete(dayStr);
  };

  app.appendChild(btn);
  app.appendChild(content);
}

function showTrail(expandDay, preserveScroll=false){
  migratePastTrailToAgenda();
  examListOpen=false;
  currentExam=null;
  currentDisc=currentSub=null;
  trailReturn=null;
  trailReturnSub=false;
  currentView = 'trail';
  currentMicroSimEntry = null;
  leaveHome();
  toggleSettingsVisibility(false);
  updateHeader(true,'Trilha Estratégica');
  summaryBtn.style.display='none';
  const stats=document.getElementById('headerStats');
  stats.style.display='block';
  stats.style.visibility='hidden';
  const prevY = preserveScroll ? window.scrollY : 0;
  clear();
  if(!preserveScroll) window.scrollTo(0,0);
  if(expandDay) openTrailDays.add(expandDay);
  const agendaOpen = openTrailDays.has(AGENDA_DAY);
  renderTrailDay(AGENDA_DAY, agendaOpen);
  const start=getTodayDateBR();
  for(let d=new Date(start);d<=TRAIL_END_DATE;d.setDate(d.getDate()+1)){
    const dStr=d.toLocaleDateString('en-CA',{timeZone:'America/Fortaleza'});
    const open=openTrailDays.has(dStr);
    renderTrailDay(new Date(d), open);
  }
  if(preserveScroll) window.scrollTo(0,prevY);
}

function computeExamStats(){
  const exams={};
  for(const disc in questoesData){
    const cat=getExamCategory(disc);
    if(!cat) continue;
    for(const sub in questoesData[disc]){
      questoesData[disc][sub].forEach(q=>{
        const m=q.label.match(/^(.*)-Q-(\d+)/);
        if(!m) return;
        const exam=m[1];
        exams[exam] ||= {
          Lin:{c:0,a:0,t:0},
          Hum:{c:0,a:0,t:0},
          Nat:{c:0,a:0,t:0},
          Mat:{c:0,a:0,t:0}
        };
        const st = getEffectiveQuestionState(disc, sub, q.label);
        const e=exams[exam][cat];
        e.t++; if(st===1) e.c++; if(st===1||st===2) e.a++;
      });
    }
  }
  return exams;
}

function renderExamSummary(){
  const exams=computeExamStats();
  const container=document.createElement('div');
  container.id='examSummary';
  container.innerHTML='';
  const table=document.createElement('table');
  table.className='exam-summary-table';
  const header=document.createElement('tr');
  ['','Linguagens','Humanas','Natureza','Matemática'].forEach(t=>{
    const th=document.createElement('th');
    th.textContent=t;
    header.appendChild(th);
  });
  table.appendChild(header);
  const tbody=document.createElement('tbody');
  const totals={Lin:{c:0,a:0},Hum:{c:0,a:0},Nat:{c:0,a:0},Mat:{c:0,a:0}};
  const order=[...new Set([
    ...examOrderNat,
    ...examOrderLin,
    ...examOrderHum,
    ...examOrderMat
  ])];
  order.forEach(exam=>{
    const data=exams[exam];
    if(!data) return;
    const tr=document.createElement('tr');
    const tdLabel=document.createElement('td');
    const btn=document.createElement('button');
    btn.textContent=exam;
    btn.className='exam-summary-exam';
    const m=exam.match(/ENEM|SAS|BERNOULLI|POLIEDRO|SOMOS|EVOLUCIONAL/i);
    if(m) btn.classList.add(`exam-${m[0].toLowerCase()}`);
    // Botões do resumo não abrem mais o simulado
    // para que os cliques não façam nada
    // btn.onclick = () => showExam(exam);
    tdLabel.appendChild(btn);
    tr.appendChild(tdLabel);
    const cats=[
      ['Lin','Linguagens','lin'],
      ['Hum','Humanas','hum'],
      ['Nat','Natureza','nat'],
      ['Mat','Matemática','mat']
    ];
    cats.forEach(([key,_,mode])=>{
      const td=document.createElement('td');
      const d=data[key];
      td.textContent=d && d.t ? `${d.c}/${d.a} de ${d.t}` : '-';
      if(d && d.t){
        td.classList.add('exam-summary-cell');
        td.onclick=()=>{ currentExamMode=mode; showExam(exam); };
      }
      if(d){ totals[key].c+=d.c; totals[key].a+=d.a; }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  const tfoot=document.createElement('tfoot');
  const trTotal=document.createElement('tr');
  trTotal.appendChild(document.createElement('td'));
  ['Lin','Hum','Nat','Mat'].forEach(key=>{
    const td=document.createElement('td');
    const t=totals[key];
    const pct=t.a ? (t.c/t.a*100) : 0;
    const perfColor = t.a===0 ? 'var(--c-neutral)'
      : pct>=90 ? 'var(--c-blue)'
      : pct>=80 ? 'var(--c-green)'
      : pct>=60 ? 'var(--c-orange)'
      : 'var(--c-red)';
    td.innerHTML=`${t.c}/${t.a} (<span style="color:${perfColor}">${pct.toFixed(1)}%</span>)`;
    trTotal.appendChild(td);
  });
  tfoot.appendChild(trTotal);
  table.appendChild(tfoot);
  container.appendChild(table);
  app.appendChild(container);
}

function collectNatReviewItems(filter=null){
  const modes = normalizeReviewModes(filter?.modes || (filter?.mode ? [filter.mode] : natReviewState.modes));
  const selectedDisciplines = new Set(normalizeReviewDiscs(filter?.discs || natReviewState.discs, modes));
  const kind = filter?.kind || natReviewState.kind || 'wrong';
  const normalizedFilter = (() => {
    if (!filter) return null;
    const { disc, sub } = filter.disc === REVIEW_ALL_DISC ? { disc: null, sub: null } : filter;
    return { disc: disc ?? null, sub: sub ?? null };
  })();
  const combined = [];
  modes.forEach(currentMode => {
    const areaData = examsDataByMode[currentMode] || {};
    const examOrder = examOrderByMode[currentMode] || [];
    const visited = new Set();
    const allowed = new Set(DISCIPLINES_BY_MODE[currentMode] || []);
    const matchesFilter = (disc, sub) => {
      if(!allowed.has(disc)) return false;
      if(!selectedDisciplines.has(disc)) return false;
      if(normalizedFilter?.disc && disc !== normalizedFilter.disc) return false;
      if(normalizedFilter?.sub && normalizedFilter.sub !== ALL_SUB && sub !== normalizedFilter.sub) return false;
      return true;
    };
    const pushQuestionsFromExam = exam => {
      const questions = areaData[exam] || [];
      questions.forEach(({disc,sub,q})=>{
        if(!matchesFilter(disc,sub)) return;
        const key = qKey(disc,sub,q.label);
        const favoriteKey = `${NAT_REVIEW_FAVORITE_PREFIX}${key}`;
        const isFavorite = localStorage.getItem(favoriteKey) === '1';
        const effectiveState = getEffectiveQuestionState(disc, sub, q.label);
        if(kind === 'favorite'){
          if(isFavorite) combined.push({exam,mode:currentMode,disc,sub,q,type:'favorite',favorite:isFavorite});
        }else if(effectiveState === 2){
          combined.push({exam,mode:currentMode,disc,sub,q,type:'wrong',favorite:isFavorite});
        }
      });
      visited.add(exam);
    };
    examOrder.forEach(exam => pushQuestionsFromExam(exam));
    Object.keys(areaData).forEach(exam => {
      if(!visited.has(exam)) pushQuestionsFromExam(exam);
    });
  });
  return combined;
}

function computeNatReviewSnapshot(items){
  if (typeof localStorage === 'undefined') {
    return { totalCount: 0, reviewedCount: 0 };
  }
  let reviewedCount = 0;
  items.forEach(item=>{
    const key = qKey(item.disc,item.sub,item.q.label);
    const reviewKey = `natReview_${key}`;
    const reviewState = +localStorage.getItem(reviewKey) || 0;
    if(reviewState > 0){
      reviewedCount += 1;
    }
  });
  return { totalCount: items.length, reviewedCount };
}

function countNatReviewItems(filter=null){
  const effectiveFilter = (() => {
    if (!filter) return null;
    const next = { ...filter };
    if (next.disc === REVIEW_ALL_DISC) {
      delete next.disc;
    }
    return next;
  })();
  const combined = collectNatReviewItems(effectiveFilter);
  const snapshot = computeNatReviewSnapshot(combined);
  return Math.max(snapshot.totalCount - snapshot.reviewedCount, 0);
}
/* ---------------- LISTA DE ASSUNTOS ---------------- */
/* ---------------- PROVAS E SIMULADOS ---------------- */
function showExamMenu(){
  currentDisc=currentSub=null;
  currentExam=null;
  currentExamMode=null;
  examListOpen=true;
  currentView = 'examMenu';
  currentMicroSimEntry = null;
  leaveHome();
  toggleSettingsVisibility(false);
  updateHeader(true,'Provas e Simulados');
  const stats=document.getElementById('headerStats');
  stats.style.visibility='hidden';
  clear();
  window.scrollTo(0,0);
  renderExamSummary();
}

function showExamList(mode='nat'){
  currentDisc=currentSub=null;
  currentExam=null;
  examListOpen=true;
  currentExamMode=mode;
  currentView = 'examList';
  currentMicroSimEntry = null;
  leaveHome();
  toggleSettingsVisibility(false);
  const areaTitles={lin:'Linguagens',hum:'Humanas',nat:'Natureza',mat:'Matemática'};
  updateHeader(true,`Provas e Simulados - ${areaTitles[mode] || ''}`);
  const stats=document.getElementById('headerStats');
  stats.style.visibility='hidden';
  clear();
  window.scrollTo(0,0);
  const order = examOrderByMode[mode] || [];
  order.forEach(ex=>{
    const btn=document.createElement('button');
    btn.textContent=ex;
    btn.className='btn exam-btn';
    const m=ex.match(/ENEM|SAS|BERNOULLI|POLIEDRO|SOMOS|EVOLUCIONAL/i);
    if(m) btn.classList.add(`exam-${m[0].toLowerCase()}`);
    btn.onclick=()=>showExam(ex);
    app.appendChild(btn);
  });
}

function showExam(exam){
  examListOpen=false;
  currentExam=exam;
  currentView = 'exam';
  currentMicroSimEntry = null;
  leaveHome();
  toggleSettingsVisibility(false);
  const areaTitles={lin:'Linguagens',hum:'Humanas',nat:'Natureza',mat:'Matemática'};
  const area=areaTitles[currentExamMode]||'';
  updateHeader(true, area ? `${exam} - ${area}` : exam);
  document.getElementById('headerStats').style.visibility='visible';
  clear();
  window.scrollTo(0,0);
  const data = examsDataByMode[currentExamMode] || {};
  const questions=data[exam]||[];
  const statDiv=document.getElementById('headerStats');
  function refresh(){
    let c=0,a=0;
    let bioErr=0,quiErr=0,fisErr=0;
    questions.forEach(({disc,sub,q})=>{
      const st = getEffectiveQuestionState(disc, sub, q.label);
      if(st===1) c++;
      if(st===1||st===2) a++;
      if(st===2){
        if(disc==='Biologia') bioErr++;
        else if(disc==='Química') quiErr++;
        else if(disc==='Física') fisErr++;
      }
    });
    const pct=a?(c/a*100):0;
    const perfColor = a===0 ? 'var(--c-neutral)'
      : pct>=90 ? 'var(--c-blue)'
      : pct>=80 ? 'var(--c-green)'
      : pct>=60 ? 'var(--c-orange)'
      : 'var(--c-red)';
    let html = `<span style="color:var(--c-text-primary)">Desempenho:</span> ` +
               `<span style="color:${perfColor}">${c}/${a} (${pct.toFixed(1)}%)</span>`;
    if(currentExamMode==='nat'){
      html += `<span style="color:var(--c-text-primary)"> | Total: ${questions.length} | 🧬 Biologia: <span style="color:var(--c-red)">${bioErr}</span> | 🧪 Química: <span style="color:var(--c-red)">${quiErr}</span> | ⚛️ Física: <span style="color:var(--c-red)">${fisErr}</span></span>`;
    } else {
      html += `<span style="color:var(--c-text-primary)"> | Total: ${questions.length}</span>`;
    }
    statDiv.innerHTML = html;
    statDiv.className='stat';
  }
  refresh();
  questions.forEach(({disc,sub,q})=>{
    const row=app.appendChild(Object.assign(document.createElement('div'),{className:'question-row'}));
    const qBtn=document.createElement('button');
    qBtn.innerHTML=`<span class="ms-topic">${getFriendlyName(disc,sub)}</span><br><span class="ms-label">${q.label}</span>`;
    qBtn.classList.add('btn','question-btn','two-line-btn');
    const topicSpan=qBtn.querySelector('.ms-topic');
    topicSpan.style.color=discColors[disc] || 'var(--c-text-muted)';
    const m=q.label.match(/ENEM|SAS|BERNOULLI|POLIEDRO|SOMOS|EVOLUCIONAL/i);
    if(m) qBtn.classList.add(`exam-${m[0].toLowerCase()}`);
    qBtn.addEventListener('click',e=>{
      if(e.target.closest('.ms-topic')){
        if(sub !== UNCLASSIFIED_SUBJECT_CODE){
          currentDisc=disc;
          currentSub=sub;
          openSummary();
        }
        e.stopPropagation();
      }else{
        openPdf(q.QPDFName,q.page);
      }
    });
    row.appendChild(qBtn);
    attachFavoriteQuestionMenu(row, qBtn, disc, sub, q.label);
    row.appendChild(Object.assign(document.createElement('button'),{
      textContent:'Gabarito',
      className:'small-btn',
      onclick:()=>openGabarito(q)}));
    const key=qKey(disc,sub,q.label);
    let st=getStoredQuestionState(disc, sub, q.label);
    const box=row.appendChild(Object.assign(document.createElement('span'),{className:'state-box'}));
    const paint=()=>{
      const effective = getEffectiveStateFromKey(key, st);
      box.textContent=effective===1?'\u2713':effective===2?'\u2717':'';
      box.style.color=effective===1?'#32cd32':effective===2?'#ff0000':'#f0f0f0';
    };
    paint();
    box.onclick=()=>{
      st=(st+1)%3;
      localStorage.setItem(key,st);
      const today=getTodayStr();
      const logKey=`log_${today}_${key}`;
      if(!D1_DISCIPLINES.includes(disc)){
        if(st===1||st===2){
          localStorage.setItem(logKey,'1');
        }else{
          localStorage.removeItem(logKey);
        }
      }
      paint();
      refresh();
    };
    const cKey=`comment_${key}`;
    const editDiv=document.createElement('div');
    editDiv.className='comment-edit';
    editDiv.contentEditable='true';
    editDiv.dataset.ph='';
    editDiv.addEventListener('click',function(e){if(e.button!==0)return;const anchor=e.target.closest('a');if(anchor){e.preventDefault();if(isImageUrl(anchor.href))openImage(anchor.href);else window.open(anchor.href,'_blank','noopener');return;}if(!editDiv.classList.contains('expanded')){editDiv.focus();}});
    editDiv.innerHTML=localStorage.getItem(cKey)||'';
    replaceArrows(editDiv,true);
    editDiv.addEventListener('paste',e=>{e.preventDefault();const plain=e.clipboardData.getData('text/plain');const sel=window.getSelection();if(!sel.rangeCount)return;const range=sel.getRangeAt(0);range.deleteContents();range.insertNode(document.createTextNode(plain));range.collapse(false);sel.removeAllRanges();sel.addRange(range);replaceArrows(editDiv,true);});
    editDiv.addEventListener('input',()=>{if(editDiv.classList.contains('expanded')){fitHeight(editDiv);}});
    editDiv.addEventListener('focus',()=>{editDiv.classList.add('expanded');editDiv.style.whiteSpace='pre-wrap';editDiv.style.overflowY='auto';fitHeight(editDiv);});
    editDiv.addEventListener('blur',()=>{if(editDiv.textContent.trim()===''){editDiv.innerHTML='';localStorage.removeItem(cKey);}editDiv.classList.remove('expanded');editDiv.style.maxHeight='38px';editDiv.style.whiteSpace='nowrap';editDiv.style.textOverflow='ellipsis';editDiv.style.overflow='hidden';editDiv.scrollTop=0;atualizaIndicadorOverflow(editDiv);});
    editDiv.addEventListener('contextmenu',e=>{e.preventDefault();openLinkMenu(e,editDiv);});
    editDiv.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;if(editDiv.matches(':focus')){openLinkMenu(e,editDiv);}else{e.preventDefault();if(isImageUrl(a.href)){openImage(a.href);}else{window.open(a.href,'_blank','noopener');}}});
    editDiv.addEventListener('input',()=>{replaceArrows(editDiv);localStorage.setItem(cKey,editDiv.innerHTML);});
    row.appendChild(editDiv);
  });
}


function showNatReview(filter=null){
  if (currentView !== 'review' && postReviewModeRestore === null) {
    postReviewModeRestore = postReviewMode;
  }
  if (postReviewMode) {
    postReviewMode = false;
    localStorage.removeItem(REVIEW_MODE_STORAGE_KEY);
    updateReviewModeButton();
  }
  if(filter){
    setNatReviewState(filter);
  }
  const { disc, sub, kind: reviewKind = 'wrong' } = natReviewState;
  const reviewModes = normalizeReviewModes(natReviewState.modes);
  const reviewDiscs = normalizeReviewDiscs(natReviewState.discs, reviewModes);
  const isAll = disc === REVIEW_ALL_DISC;
  const effectiveFilter = isAll
    ? { modes: reviewModes, discs: reviewDiscs, kind: reviewKind }
    : { modes: reviewModes, discs: reviewDiscs, disc, sub, kind: reviewKind };
  currentDisc = null;
  currentSub = null;
  currentExam = null;
  examListOpen = false;
  currentExamMode = reviewModes[0] || 'nat';
  currentView = 'review';
  currentMicroSimEntry = null;
  const keepReviewFiltersOpen = !!(reviewSettingsMenu && reviewSettingsMenu.style.display === 'flex');
  leaveHome();
  toggleSettingsVisibility(false);
  toggleReviewSettingsVisibility(true);
  renderReviewSettingsMenu();
  if (keepReviewFiltersOpen && reviewSettingsMenu && reviewSettingsBtn) {
    reviewSettingsMenu.style.display = 'flex';
    reviewSettingsBtn.setAttribute('aria-expanded', 'true');
  }
  const areaLabel = reviewModes.length
    ? reviewModes.map(mode => REVIEW_MODE_LABELS[mode] || mode).join(' + ')
    : 'Nenhuma área';
  const reviewTitle = reviewKind === 'favorite' ? 'Revisão (Favoritas)' : 'Revisão (Erradas)';
  let headerLabel = `${reviewTitle}: ${areaLabel}`;
  if(!isAll){
    headerLabel = `${reviewTitle}: ${disc}`;
    if(sub && sub !== ALL_SUB){
      headerLabel += `: ${getFriendlyName(disc, sub)}`;
    }
  }else{
    headerLabel = `${reviewTitle}: ${areaLabel}`;
  }
  updateHeader(true, headerLabel);
  summaryBtn.style.display = 'none';
  summaryBtn.onclick = null;
  orderHint.style.display = 'none';
  headerTitle.style.cursor = 'default';
  headerTitle.onclick = null;
  headerTitle.onmouseenter = null;
  headerTitle.onmouseleave = null;
  const stats = document.getElementById('headerStats');
  stats.style.visibility = 'visible';
  clear();
  window.scrollTo(0,0);

  const itemsForView = collectNatReviewItems(effectiveFilter);
  const baseEmptyText = (!isAll || (sub && sub !== ALL_SUB))
    ? 'Nenhuma questão para revisar no filtro escolhido.'
    : (reviewKind === 'favorite' ? 'Nenhuma questão favorita encontrada.' : 'Nenhuma questão errada encontrada nos simulados.');

  const emptyMsg = document.createElement('p');
  emptyMsg.className = 'review-empty';

  const ensureEmptyState = () => {
    const hasRow = !!app.querySelector('.question-row');
    if (hasRow) {
      if (emptyMsg.isConnected) emptyMsg.remove();
    } else {
      emptyMsg.textContent = baseEmptyText;
      if (!emptyMsg.isConnected) app.appendChild(emptyMsg);
    }
  };

  const refreshStats = () => {
    const snapshot = computeNatReviewSnapshot(itemsForView);
    const { reviewedCount, totalCount } = snapshot;
    const text = `Revisadas: ${reviewedCount}/${totalCount}`;
    stats.textContent = text;
    stats.className = 'stat';
  };

  const fragment = document.createDocumentFragment();

  itemsForView.forEach(item => {
    const key = qKey(item.disc, item.sub, item.q.label);
    const favoriteKey = `${NAT_REVIEW_FAVORITE_PREFIX}${key}`;
    let st = getStoredQuestionState(item.disc, item.sub, item.q.label);
    const qualifies = () => {
      if (reviewKind === 'favorite') {
        return localStorage.getItem(favoriteKey) === '1';
      }
      const effective = getEffectiveStateFromKey(key, st);
      return effective === 2;
    };
    if (!qualifies()) return;

    let isFavorite = !!item.favorite;

    const reviewKey = `natReview_${key}`;
    let reviewState = +localStorage.getItem(reviewKey) || 0;

    const syncWithReviewState = () => {
      item.favorite = isFavorite;
    };

    syncWithReviewState();

    item.favorite = isFavorite;

    const row = document.createElement('div');
    row.className = 'question-row';
    if (isFavorite) row.classList.add('review-favorite');

    const qBtn = document.createElement('button');
    qBtn.classList.add('btn', 'question-btn', 'two-line-btn', 'question-btn--with-menu');
    const examPrefix = `${item.exam}-`;
    const labelText = item.q.label.toUpperCase().startsWith(examPrefix.toUpperCase())
      ? item.q.label
      : `${item.exam} • ${item.q.label}`;
    qBtn.innerHTML = `<span class="ms-topic">${getFriendlyName(item.disc, item.sub)}</span><br>` +
      `<span class="ms-label">${labelText}</span>`;
    const topicSpan = qBtn.querySelector('.ms-topic');
    topicSpan.style.color = discColors[item.disc] || 'var(--c-text-muted)';
    const m = item.q.label.match(/ENEM|SAS|BERNOULLI|POLIEDRO|SOMOS|EVOLUCIONAL/i);
    if (m) qBtn.classList.add(`exam-${m[0].toLowerCase()}`);
    qBtn.addEventListener('click', e => {
      if (e.target.closest('.ms-topic')) {
        if (item.sub !== UNCLASSIFIED_SUBJECT_CODE) {
          currentDisc = item.disc;
          currentSub = item.sub;
          openSummary();
        }
        e.stopPropagation();
      } else {
        openPdf(item.q.QPDFName, item.q.page);
      }
    });
    row.appendChild(qBtn);

    row.appendChild(Object.assign(document.createElement('button'), {
      textContent: 'Gabarito',
      className: 'small-btn',
      onclick: () => openGabarito(item.q)
    }));

    const menuToggle = document.createElement('span');
    menuToggle.className = 'question-menu-toggle';
    menuToggle.textContent = '▾';
    menuToggle.title = 'Ações da questão';
    menuToggle.setAttribute('aria-haspopup', 'menu');
    menuToggle.setAttribute('aria-expanded', 'false');
    qBtn.appendChild(menuToggle);

    const actionMenu = document.createElement('div');
    actionMenu.className = 'question-action-menu';
    actionMenu.style.display = 'none';
    const favoriteOption = document.createElement('button');
    favoriteOption.type = 'button';
    favoriteOption.className = 'question-action-option';
    actionMenu.appendChild(favoriteOption);
    row.appendChild(actionMenu);

    const controls = document.createElement('div');
    controls.className = 'review-state-grid';

    const stateBox = document.createElement('span');
    stateBox.className = 'state-box result-box';
    stateBox.title = 'Marcar questão como certa ou errada';
    const paintState = () => {
      const effective = getEffectiveStateFromKey(key, st);
      stateBox.textContent = effective === 1 ? '✓' : effective === 2 ? '✗' : '';
      stateBox.classList.toggle('state-correct', effective === 1);
      stateBox.classList.toggle('state-wrong', effective === 2);
    };
    stateBox.onclick = () => {
      st = (st + 1) % 3;
      localStorage.setItem(key, st);
      const today = getTodayStr();
      const logKey = `log_${today}_${key}`;
      if (!D1_DISCIPLINES.includes(item.disc)) {
        if (st === 1 || st === 2) {
          localStorage.setItem(logKey, '1');
        } else {
          localStorage.removeItem(logKey);
        }
      }
      if (st === 2 && item.type !== 'wrong') {
        item.type = 'wrong';
      }
      paintState();
      ensureEmptyState();
      refreshStats();
    };
    paintState();
    controls.appendChild(stateBox);

    const reviewBox = document.createElement('span');
    reviewBox.className = 'state-box review-box';
    const paintReview = () => {
      reviewBox.textContent = reviewState === 1 ? '✓' : reviewState === 2 ? '✗' : '';
      reviewBox.classList.toggle('review-correct', reviewState === 1);
      reviewBox.classList.toggle('review-wrong', reviewState === 2);
      reviewBox.title = reviewState === 0
        ? 'Marcar revisão'
        : reviewState === 1
          ? 'Revisado – certo'
          : 'Revisado – errado';
    };
    reviewBox.onclick = () => {
      reviewState = (reviewState + 1) % 3;
      const reviewLogKey = `reviewLog_${getTodayStr()}_${key}`;
      if (reviewState === 0) {
        localStorage.removeItem(reviewKey);
        localStorage.removeItem(reviewLogKey);
      } else {
        localStorage.setItem(reviewKey, reviewState);
        localStorage.setItem(reviewLogKey, '1');
      }
      paintReview();
      syncWithReviewState();
      ensureEmptyState();
      refreshStats();
    };
    paintReview();
    controls.appendChild(reviewBox);

    const updateMenuToggle = () => {
      const hasState = isFavorite;
      menuToggle.classList.toggle('menu-active', hasState);
    };

    const paintFavorite = () => {
      favoriteOption.textContent = isFavorite ? 'Desfavoritar' : 'Favoritar';
      favoriteOption.classList.toggle('active', isFavorite);
      row.classList.toggle('review-favorite', isFavorite);
      updateMenuToggle();
    };

    let menuOpen = false;
    const onOutsideClick = event => {
      if (!row.contains(event.target)) {
        closeMenu();
      }
    };
    const closeMenu = () => {
      if (!menuOpen) return;
      menuOpen = false;
      actionMenu.style.display = 'none';
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.removeEventListener('click', onOutsideClick);
      row.style.zIndex = '';
    };
    const openMenu = () => {
      if (menuOpen) return;
      menuOpen = true;
      row.style.zIndex = '30';
      actionMenu.style.display = 'block';
      actionMenu.style.visibility = 'hidden';
      const toggleRect = menuToggle.getBoundingClientRect();
      const rowRect = row.getBoundingClientRect();
      const menuRect = actionMenu.getBoundingClientRect();
      const maxLeft = Math.max(rowRect.width - menuRect.width, 0);
      const desiredLeft = Math.max(toggleRect.right - rowRect.left - menuRect.width, 0);
      actionMenu.style.left = `${Math.min(desiredLeft, maxLeft)}px`;
      actionMenu.style.top = `${toggleRect.bottom - rowRect.top + 4}px`;
      actionMenu.style.visibility = 'visible';
      menuToggle.classList.add('open');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.addEventListener('click', onOutsideClick);
    };

    menuToggle.addEventListener('click', e => {
      e.stopPropagation();
      e.preventDefault();
      if (menuOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    favoriteOption.addEventListener('click', e => {
      e.preventDefault();
      isFavorite = !isFavorite;
      item.favorite = isFavorite;
      if (isFavorite) {
        localStorage.setItem(favoriteKey, '1');
      } else {
        localStorage.removeItem(favoriteKey);
      }
      paintFavorite();
      syncWithReviewState();
      if (reviewKind === 'favorite' && !isFavorite) {
        row.remove();
      }
      ensureEmptyState();
      refreshStats();
      closeMenu();
    });


    qBtn.addEventListener('click', () => {
      if (menuOpen) closeMenu();
    });

    paintFavorite();

    row.appendChild(controls);

    const cKey = `comment_${key}`;
    const editDiv=document.createElement('div');
    editDiv.className='comment-edit';
    editDiv.contentEditable='true';
    editDiv.dataset.ph='';
    editDiv.addEventListener('click',function(e){if(e.button!==0)return;const anchor=e.target.closest('a');if(anchor){e.preventDefault();if(isImageUrl(anchor.href))openImage(anchor.href);else window.open(anchor.href,'_blank','noopener');return;}if(!editDiv.classList.contains('expanded')){editDiv.focus();}});
    editDiv.innerHTML=localStorage.getItem(cKey)||'';
    replaceArrows(editDiv,true);
    editDiv.addEventListener('paste',e=>{e.preventDefault();const plain=e.clipboardData.getData('text/plain');const sel=window.getSelection();if(!sel.rangeCount)return;const range=sel.getRangeAt(0);range.deleteContents();range.insertNode(document.createTextNode(plain));range.collapse(false);sel.removeAllRanges();sel.addRange(range);replaceArrows(editDiv,true);});
    editDiv.addEventListener('input',()=>{if(editDiv.classList.contains('expanded')){fitHeight(editDiv);}});
    editDiv.addEventListener('focus',()=>{editDiv.classList.add('expanded');editDiv.style.whiteSpace='pre-wrap';editDiv.style.overflowY='auto';fitHeight(editDiv);});
    editDiv.addEventListener('blur',()=>{if(editDiv.textContent.trim()===''){editDiv.innerHTML='';localStorage.removeItem(cKey);}editDiv.classList.remove('expanded');editDiv.style.maxHeight='38px';editDiv.style.whiteSpace='nowrap';editDiv.style.textOverflow='ellipsis';editDiv.style.overflow='hidden';editDiv.scrollTop=0;atualizaIndicadorOverflow(editDiv);ensureEmptyState();});
    editDiv.addEventListener('contextmenu',e=>{e.preventDefault();openLinkMenu(e,editDiv);});
    editDiv.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;if(editDiv.matches(':focus')){openLinkMenu(e,editDiv);}else{e.preventDefault();if(isImageUrl(a.href)){openImage(a.href);}else{window.open(a.href,'_blank','noopener');}}});
    editDiv.addEventListener('input',()=>{replaceArrows(editDiv);localStorage.setItem(cKey,editDiv.innerHTML);});
    row.appendChild(editDiv);

    fragment.appendChild(row);
  });

  app.appendChild(fragment);
  ensureEmptyState();
  refreshStats();
}
function showSubjects(disc) {
  currentDisc = disc;
  currentSub  = null;
  trailReturnSub = false;
  currentView = 'subjects';
  currentMicroSimEntry = null;
  leaveHome();            // volta ao visual normal fora da Home
  toggleSettingsVisibility(false);  // esconde engrenagem

  if(disc === 'Redação') {
    currentSub = '01';
    openDisciplineSummary(disc);
    return;
  }

  // 1) Atualiza o cabeçalho normalmente
  updateHeader(true, disc);
  document.getElementById('headerStats').style.visibility='visible';
  orderHint.style.display = 'none';

  // 2) Botão Resumo e ordenação
  if (['Física','Matemática','Linguagens','Geografia e Sociologia','História e Filosofia'].includes(disc)) {
    summaryBtn.style.display = 'inline-block';
    summaryBtn.textContent = 'Resumo';
    summaryBtn.onclick = () => openDisciplineSummary(disc);
  } else {
    summaryBtn.style.display = 'none';
  }
  headerTitle.style.cursor = 'pointer';
  headerTitle.onclick = () => {
    const mode = subjectsOrder[disc] || 'normal';
    subjectsOrder[disc] = mode === 'normal' ? 'ranking' : 'normal';
    showSubjects(disc);
  };
  headerTitle.onmouseenter = () => {
    const mode = subjectsOrder[disc] || 'normal';
    orderHint.textContent = mode === 'normal'
      ? 'Ordenar Por Incidência'
      : 'Ordenar Padrão';
    orderHint.style.display = 'block';
  };
  headerTitle.onmouseleave = () => { orderHint.style.display = 'none'; };

  // 3) Limpa e reseta scroll
  clear();
  window.scrollTo(0, 0);

  // 4) Estatísticas no topo
  const statDiv = document.getElementById("headerStats");
  function refreshDiscStats() {
    let total = 0, correct = 0, answered = 0;
    for (const sub of Object.keys(questoesData[disc])) {
      const qs = questoesData[disc][sub];
      total += qs.length;
      qs.forEach(q => {
        const st = getEffectiveQuestionState(disc, sub, q.label);
        if (st === 1) correct++;
        if (st === 1 || st === 2) answered++;
      });
    }
    const pct = answered ? (correct/answered*100) : 0;
    statDiv.textContent = `Desempenho: ${correct}/${answered} (${pct.toFixed(1)}%) | Total: ${total}`;
    statDiv.className = answered === 0
      ? "stat neutral"
      : pct >= 90 ? "stat blue"
      : pct >= 80 ? "stat green"
      : pct >= 60 ? "stat orange"
      : "stat red";
  }
  statDiv.style.visibility = 'visible';
  refreshDiscStats();

  // 5) Monta a lista de assuntos na ordem certa
  let subs = Object.keys(questoesData[disc]);
  const orderMode = subjectsOrder[disc] || 'normal';
  if (orderMode === 'ranking') {
    subs.sort((a, b) =>
      parseInt(INCIDENCE_RANKINGS[disc][a], 10)
    - parseInt(INCIDENCE_RANKINGS[disc][b], 10)
    );
  } else {
    subs.sort(); // '01', '02', ...
  }

  // 6) Renderiza cada botão de assunto
  for (const sub of subs) {
    const btn = app.appendChild(Object.assign(
      document.createElement("button"), {
        className: "subject-btn",
        textContent: getFriendlyName(disc, sub),
        onclick: () => showQuestions(disc, sub, false, false)
      }
    ));

    if (disc !== 'Redação') {
      // badge de ranking de incidência
      btn.insertAdjacentHTML("beforeend",
        `<span class="subject-badge-rect">
           ${INCIDENCE_RANKINGS[disc]?.[sub]||""}
         </span>`);
    }

    // faixa de cor de desempenho
    const qs = questoesData[disc][sub];
    const [c, a] = qs.reduce(([c, a], q) => {
      const st = getEffectiveQuestionState(disc, sub, q.label);
      return [
        c + (st === 1 ? 1 : 0),
        a + ((st === 1 || st === 2) ? 1 : 0)
      ];
    }, [0, 0]);
    const pct = a ? (c/a*100) : null;
    const color = pct == null
      ? "#1e1e1e"
      : pct >= 90 ? "#2BA7F5"
      : pct >= 80 ? "#43C743"
      : pct >= 60 ? "#F47C20"
      : "#D92020";
    btn.insertAdjacentHTML("beforeend",
      `<span class="subject-stripe" style="background:${color}"></span>`);
  }
}

/* ---------------- LISTA DE QUESTÕES ---------------- */
function showQuestions(disc, sub, fromStar = false, fromTrailSub = false) {
  starReturn = fromStar;   // registra se veio direto da Home pela estrela
  trailReturnSub = fromTrailSub; // registra se veio direto da Trilha para um sub
  currentDisc = disc;
  currentSub  = sub;
  currentView = 'questions';
  currentMicroSimEntry = null;
  leaveHome();            // volta ao visual normal fora da Home
  toggleSettingsVisibility(false);  // esconde engrenagem
  updateHeader(true, `${disc}: ${getFriendlyName(disc, sub)}`);
  document.getElementById('headerStats').style.visibility='visible';
  orderHint.style.display = 'none';
  summaryBtn.style.display = 'inline-block';
  summaryBtn.textContent = 'Resumo';
  summaryBtn.onclick = openSummary;
  headerTitle.onclick = null;
  headerTitle.onmouseenter = null;
  headerTitle.onmouseleave = null;
  headerTitle.style.cursor = 'default';
  clear();
  window.scrollTo(0, 0);

  const statDiv = document.getElementById("headerStats");

  function refreshStats() {
    const qs = questoesData[disc][sub];
    let c = 0, a = 0;
    qs.forEach(q => {
      const st = getEffectiveQuestionState(disc, sub, q.label);
      if (st === 1) c++;
      if (st === 1 || st === 2) a++;
    });
    const pct = a ? (c / a * 100) : 0;
    statDiv.textContent = `Desempenho: ${c}/${a} (${pct.toFixed(1)}%) | Total: ${qs.length}`;
    statDiv.className   = a === 0
                         ? "stat neutral"
                         : pct >= 90
                           ? "stat blue"
                           : pct >= 80
                             ? "stat green"
                             : pct >= 60
                               ? "stat orange"
                               : "stat red";
  }

  refreshStats();

  /* Renderiza cada questão */
  const qs = questoesData[disc][sub];
  if (['Linguagens', 'História e Filosofia', 'Geografia e Sociologia'].includes(disc)) {
    qs.sort((a, b) => {
      const parse = q => {
        const m = q.label.match(/^ENEM-(\d{4})-(REG|PPL|DIG)/);
        if (!m) return [Infinity, Infinity];
        return [parseInt(m[1], 10), {REG:0, PPL:1, DIG:2}[m[2]]];
      };
      const [yearA, modeA] = parse(a);
      const [yearB, modeB] = parse(b);
      if (yearA !== yearB) return yearA - yearB;
      if (modeA !== modeB) return modeA - modeB;
      return a.label.localeCompare(b.label);
    });
  }
  qs.forEach((q, idx) => {
    const row = app.appendChild(Object.assign(
      document.createElement("div"), { className:"question-row" }));
    row.dataset.questionKey = qKey(disc, sub, q.label);

    /* Botão da questão (abre PDF) */
    // ─── Botão “stripe” com cor por exame ───
    const qBtn = document.createElement("button");
    qBtn.textContent = q.label;
    qBtn.classList.add("btn");

    // detecta ENEM, SAS, BERNOULLI, POLIEDRO, SOMOS ou EVOLUCIONAL no label
    const m = q.label.match(/ENEM|SAS|BERNOULLI|POLIEDRO|SOMOS|EVOLUCIONAL/i);
    if (m) {
      const exam = m[0].toLowerCase();          // "enem", "sas", "bernoulli", "poliedro", "somos" ou "evolucional"
      qBtn.classList.add(`exam-${exam}`);       // .exam-enem / .exam-sas / .exam-bernoulli / .exam-poliedro / .exam-somos / .exam-evolucional
    }

    qBtn.onclick = () => openPdf(q.QPDFName, q.page);
    row.appendChild(qBtn);
    attachFavoriteQuestionMenu(row, qBtn, disc, sub, q.label);

    /* Botão gabarito */
    row.appendChild(Object.assign(
      document.createElement("button"), {
        textContent:"Gabarito",
        className:"small-btn",
        onclick: () => openGabarito(q)
      }));

    /* Caixa ✓ / ✗ */
    const key    = qKey(disc, sub, q.label);          // estado ✓/✗
    let st    = getStoredQuestionState(disc, sub, q.label);
    const box = row.appendChild(Object.assign(
      document.createElement("span"), { className:"state-box" }));

    const paint = () => {
      const effective = getEffectiveStateFromKey(key, st);
      box.textContent = effective===1 ? "✓" : effective===2 ? "✗" : "";
      box.style.color= effective===1 ? "#32cd32" : effective===2 ? "#ff0000" : "#f0f0f0";
    };
    paint();
    box.onclick = () => {
      st = (st + 1) % 3;
      localStorage.setItem(key, st);

      const today  = getTodayStr();
      const logKey = `log_${today}_${key}`;             // registro diário

      if (!D1_DISCIPLINES.includes(disc)) {
        if (st === 1 || st === 2) {
          // marcou ✓ ou ✗ → garante o log
          localStorage.setItem(logKey, "1");
        } else {
          // voltou pra “não marcado” → remove o log
          localStorage.removeItem(logKey);
        }
      }

      paint();
      refreshStats();
    };

    // ------ Editor rico de comentário (COM ELLIPSIS + COLAR SÓ TEXTO PLANO) ------
    const cKey = `comment_${qKey(disc, sub, q.label)}`;

    const editDiv = document.createElement('div');
    editDiv.className       = 'comment-edit';
    editDiv.contentEditable = 'true';
    editDiv.dataset.ph      = '';

// ────────────────────────────────────────────────────────────────────────
// Listener único para “clique esquerdo” que abre links ou expande o campo
// ────────────────────────────────────────────────────────────────────────
editDiv.addEventListener('click', function(e) {
  // 1) Só prossegue se for clique com botão esquerdo
  if (e.button !== 0) return;

  // 2) Se o alvo for um <a>, abre em nova aba
  const anchor = e.target.closest('a');
  if (anchor) {
    e.preventDefault();
    if (isImageUrl(anchor.href)) {
      openImage(anchor.href);
    } else {
      window.open(anchor.href, '_blank', 'noopener');
    }
    return;
  }

  // 3) Caso contrário (não clicou num link), expande/foca o editDiv
  if (!editDiv.classList.contains('expanded')) {
    editDiv.focus();
  }
});

    // carrega qualquer comentário salvo (texto puro ou links simples)
    editDiv.innerHTML = localStorage.getItem(cKey) || '';

    // 1) “paste”: colar somente texto puro
    editDiv.addEventListener('paste', e => {
      e.preventDefault();
      const plain = e.clipboardData.getData('text/plain');
      const sel = window.getSelection();
      if (!sel.rangeCount) return;
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(plain));
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);
      // dispara um evento de input para garantir o salvamento
      editDiv.dispatchEvent(new Event('input'));
    });

    // 2) “input”: ao digitar, reajusta altura se estiver expandido
    editDiv.addEventListener('input', () => {
      if (editDiv.classList.contains('expanded')) {
        fitHeight(editDiv);
      }
    });

    // 3) “focus”: expande para multiline e ajusta altura inicial
    editDiv.addEventListener('focus', () => {
      editDiv.classList.add('expanded');
      editDiv.style.whiteSpace = 'pre-wrap';
      editDiv.style.overflowY  = 'auto';
      fitHeight(editDiv);
    });

    // 4) “blur”: volta ao estado normal (ellipsis), limpa se vazio e checa overflow
    editDiv.addEventListener('blur', () => {
      // limpa storage se só tiver espaços/brancos
      if (editDiv.textContent.trim() === '') {
        editDiv.innerHTML = '';
        localStorage.removeItem(cKey);
      } else {
        // garante que o comentário seja salvo mesmo sem evento de input
        localStorage.setItem(cKey, editDiv.innerHTML);
      }
      // recolhe para uma linha com reticências
      editDiv.classList.remove('expanded');
      editDiv.style.maxHeight    = '38px';
      editDiv.style.whiteSpace   = 'nowrap';
      editDiv.style.textOverflow = 'ellipsis';
      editDiv.style.overflow     = 'hidden';
      editDiv.scrollTop          = 0;
      // checa se agora há overflow horizontal
      atualizaIndicadorOverflow(editDiv);
    });

    // 5) “contextmenu”: abre menu customizado de links
    editDiv.addEventListener('contextmenu', e => {
      e.preventDefault();
      openLinkMenu(e, editDiv);
    });

    // 6) “click” em <a>: se estiver editando, exibe menu; se não, abre em nova aba
    editDiv.addEventListener('click', e => {
      const a = e.target.closest('a');
      if (!a) return;
      if (editDiv.matches(':focus')) {
        openLinkMenu(e, editDiv);
      } else {
        e.preventDefault();
        if (isImageUrl(a.href)) {
          openImage(a.href);
        } else {
          window.open(a.href, '_blank', 'noopener');
        }
      }
    });

    // 7) “input”: salva no localStorage a cada mudança
    const save = () => {
      replaceArrows(editDiv);
      localStorage.setItem(cKey, editDiv.innerHTML);
    };
    editDiv.addEventListener('input', save);

    // Insere o elemento na tela
    row.appendChild(editDiv);

    // Executa logo de cara para detectar overflow inicial (se houver texto longo salvo)
    atualizaIndicadorOverflow(editDiv);

    /* … essas duas linhas abaixo já existiam antes – não duplique! … */
  });           // ← fecha o forEach((q, idx) => { … })

  // ------ No final de showQuestions (depois de gerar todas as questões) ------
  document.querySelectorAll('.comment-edit').forEach(div => {
    div.blur();
  });
  if (document.activeElement && document.activeElement.classList.contains('comment-edit')) {
    document.activeElement.blur();
  }
}             // ← fecha a função showQuestions

/* ================================================================
   6. VISUALIZAÇÃO DE PDF (PDF.js)
   ============================================================== */
function clearPdfViewerContent() {
  cancelPdfAutosave();
  pdfDirtyLayers.clear();
  pdfActivePointerIds.clear();
  pdfAutosaveSuspended = false;
  lastPdfRenderedPages = [];
  if (pdfPagesWrapper) {
    pdfPagesWrapper.innerHTML = '';
  } else if (pdfContainer) {
    pdfContainer.querySelectorAll('canvas, .answer-letter, .pdf-page-wrapper').forEach(el => el.remove());
  }
}

function setBodyScrollLocked(locked) {
  if (!document || !document.body) return;
  document.body.classList.toggle('lock-scroll', !!locked);
}

function setPdfPageMenuOpen(open) {
  pdfPageMenuOpen = !!open;
  if (pdfPageNav) {
    pdfPageNav.classList.toggle('open', pdfPageMenuOpen);
    pdfPageNav.setAttribute('aria-hidden', String(!pdfPageMenuOpen));
  }
  if (pdfPageMenuToggleBtn) {
    pdfPageMenuToggleBtn.setAttribute('aria-expanded', String(pdfPageMenuOpen));
    pdfPageMenuToggleBtn.setAttribute('aria-label', 'Navegação de páginas');
    pdfPageMenuToggleBtn.title = 'Páginas';
    pdfPageMenuToggleBtn.classList.toggle('pdf-tool-btn--hidden', pdfPageMenuOpen);
    if (pdfPageMenuOpen) {
      pdfPageMenuToggleBtn.setAttribute('tabindex', '-1');
      pdfPageMenuToggleBtn.setAttribute('aria-hidden', 'true');
    } else {
      pdfPageMenuToggleBtn.removeAttribute('tabindex');
      pdfPageMenuToggleBtn.setAttribute('aria-hidden', 'false');
    }
    const icon = pdfPageMenuToggleBtn.querySelector('i');
    if (icon) {
      icon.classList.add('fa-plus');
      icon.classList.remove('fa-minus');
    }
  }
}

function togglePdfPageMenu() {
  if (!pdfPageMenuOpen) {
    setPdfPageMenuOpen(true);
  }
}

function updatePdfNavigationState() {
  const hasPdf = !!lastPdfName && Number.isFinite(lastPdfTotalPages) && lastPdfTotalPages > 0;
  const pageNumber = hasPdf && Number.isFinite(currentPdfPage) ? currentPdfPage : null;
  if (pdfPageIndicator) {
    pdfPageIndicator.textContent = pageNumber ? `${pageNumber}/${lastPdfTotalPages}` : '--/--';
  }
  if (pdfPrevPageBtn) {
    const disablePrev = !pageNumber || pageNumber <= 1;
    pdfPrevPageBtn.disabled = disablePrev;
    pdfPrevPageBtn.setAttribute('aria-disabled', String(disablePrev));
  }
  if (pdfNextPageBtn) {
    const disableNext = !pageNumber || pageNumber >= lastPdfTotalPages;
    pdfNextPageBtn.disabled = disableNext;
    pdfNextPageBtn.setAttribute('aria-disabled', String(disableNext));
  }
}

function navigatePdfPage(delta) {
  if (!Number.isFinite(delta) || delta === 0) return;
  if (!lastPdfName || !Number.isFinite(currentPdfPage)) return;
  if (isFullPdfLoading) return;
  const target = currentPdfPage + delta;
  if (target < 1) return;
  if (Number.isFinite(lastPdfTotalPages) && lastPdfTotalPages > 0 && target > lastPdfTotalPages) {
    return;
  }
  currentPdfPage = target;
  updatePdfNavigationState();
  return openPdf(lastPdfName, target);
}

function getPdfDrawingStorageKey(pdfName, pageNumber) {
  if (typeof localStorage === 'undefined') return null;
  if (!pdfName && pdfName !== '') return null;
  const page = Number(pageNumber);
  if (!Number.isFinite(page)) return null;
  const safeName = encodeURIComponent(pdfName);
  return `${PDF_DRAW_PREFIX}${safeName}::${page}`;
}

function buildPdfDrawingMetadata({ strokeCount = null, timestamp = Date.now() } = {}) {
  const ts = Number.isFinite(timestamp) ? timestamp : Date.now();
  const data = { v: PDF_DRAW_METADATA_VERSION, ts };
  if (Number.isFinite(strokeCount)) {
    data.sc = strokeCount;
  }
  return JSON.stringify(data);
}

function parsePdfDrawingMetadata(raw) {
  if (!raw || typeof raw !== 'string') return null;
  if (raw.startsWith('data:image/')) {
    return { type: 'image', timestamp: 0 };
  }
  try {
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') return null;
    const timestamp = Number.isFinite(data.ts)
      ? data.ts
      : Number.isFinite(data.timestamp)
        ? data.timestamp
        : 0;
    const strokeCount = Number.isFinite(data.sc)
      ? data.sc
      : Number.isFinite(data.strokes)
        ? data.strokes
        : null;
    return {
      type: 'meta',
      timestamp,
      strokeCount: Number.isFinite(strokeCount) ? strokeCount : null
    };
  } catch (err) {
    if (raw.startsWith('v3|')) {
      const parts = raw.split('|');
      const timestamp = Number(parts[1]) || 0;
      const strokeCount = Number(parts[2]);
      return {
        type: 'meta',
        timestamp,
        strokeCount: Number.isFinite(strokeCount) ? strokeCount : null
      };
    }
    return null;
  }
}

function isQuotaExceededError(error) {
  if (!error) return false;
  if (typeof DOMException !== 'undefined' && error instanceof DOMException) {
    if (error.code === 22 || error.code === 1014) return true;
  }
  const name = String(error.name || '').toLowerCase();
  if (name === 'quotaexceedederror' || name === 'ns_error_dom_quota_reached') {
    return true;
  }
  const message = String(error.message || '').toLowerCase();
  if (message.includes('quota') || message.includes('storage') || message.includes('cheio')) {
    return true;
  }
  return false;
}

function purgeOldPdfDrawingEntries({ preserveKeys = new Set(), maxRemovals = 1 } = {}) {
  if (typeof localStorage === 'undefined') return 0;
  const preserve = preserveKeys instanceof Set
    ? preserveKeys
    : new Set(Array.isArray(preserveKeys) ? preserveKeys : []);
  const entries = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || preserve.has(key)) continue;
    if (!key.startsWith(PDF_DRAW_PREFIX) || key === PDF_DRAW_LAST_CLEAN_KEY) continue;
    if (key.endsWith(PDF_DRAW_STROKES_SUFFIX)) continue;
    const metadata = parsePdfDrawingMetadata(localStorage.getItem(key));
    const timestamp = metadata?.timestamp || 0;
    entries.push({ key, timestamp });
  }
  if (!entries.length) return 0;
  entries.sort((a, b) => a.timestamp - b.timestamp);
  const limit = Math.max(1, Number(maxRemovals) || 0);
  let removed = 0;
  for (const entry of entries) {
    if (removed >= limit) break;
    localStorage.removeItem(entry.key);
    localStorage.removeItem(`${entry.key}${PDF_DRAW_STROKES_SUFFIX}`);
    removed += 1;
  }
  return removed;
}

function optimizePdfDrawingStorage() {
  if (typeof localStorage === 'undefined') return;
  try {
    const updates = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || key === PDF_DRAW_LAST_CLEAN_KEY) continue;
      if (!key.startsWith(PDF_DRAW_PREFIX)) continue;
      if (key.endsWith(PDF_DRAW_STROKES_SUFFIX)) continue;
      const raw = localStorage.getItem(key);
      if (!raw || typeof raw !== 'string') continue;
      if (!raw.startsWith('data:image/')) continue;
      const strokeKey = `${key}${PDF_DRAW_STROKES_SUFFIX}`;
      const serialized = localStorage.getItem(strokeKey);
      if (!serialized) continue;
      let strokeCount = null;
      try {
        const { strokes } = deserializePdfStrokes(serialized);
        strokeCount = Array.isArray(strokes) ? strokes.length : null;
      } catch (err) {
        console.error('Falha ao analisar manuscrito ao otimizar armazenamento do PDF', err);
      }
      updates.push({ key, metadata: buildPdfDrawingMetadata({ strokeCount }) });
    }
    updates.forEach(({ key, metadata }) => {
      try {
        localStorage.setItem(key, metadata);
      } catch (err) {
        console.error('Falha ao otimizar armazenamento das anotações do PDF', err);
      }
    });
  } catch (err) {
    console.error('Falha ao otimizar armazenamento das anotações do PDF', err);
  }
}

function isPdfCanvasBlank(canvas) {
  const ctx = canvas?.getContext('2d');
  if (!ctx) return true;
  const { width, height } = canvas;
  if (!width || !height) return true;
  try {
    const pixels = new Uint32Array(ctx.getImageData(0, 0, width, height).data.buffer);
    for (const pixel of pixels) {
      if (pixel !== 0) return false;
    }
    return true;
  } catch (err) {
    console.error('Falha ao inspecionar camada de desenho do PDF', err);
    return false;
  }
}

function savePdfDrawingLayer(pdfName, pageNumber, canvas) {
  if (typeof localStorage === 'undefined') return false;
  const key = getPdfDrawingStorageKey(pdfName, pageNumber);
  if (!key) return false;
  const strokeKey = `${key}${PDF_DRAW_STROKES_SUFFIX}`;
  const state = getPdfCanvasState(canvas);
  const strokes = Array.isArray(state?.strokes) ? state.strokes : [];
  const strokeCount = strokes.length;

  const hasBackgroundImage = state?.backgroundImage instanceof HTMLImageElement;
  let isBlank = false;
  if (strokeCount === 0 && !hasBackgroundImage) {
    try {
      isBlank = isPdfCanvasBlank(canvas);
    } catch (err) {
      console.error('Falha ao inspecionar camada de desenho do PDF', err);
    }
  }

  if (isBlank || (strokeCount === 0 && !hasBackgroundImage)) {
    localStorage.removeItem(key);
    localStorage.removeItem(strokeKey);
    return true;
  }

  if (state) {
    state.canvasWidth = Number.isFinite(canvas?.width) ? canvas.width : state.canvasWidth;
    state.canvasHeight = Number.isFinite(canvas?.height) ? canvas.height : state.canvasHeight;
  }

  let serialized = null;
  if (strokeCount > 0) {
    serialized = serializePdfStrokes(strokes, {
      width: state?.canvasWidth,
      height: state?.canvasHeight
    });
  }

  const metadata = serialized
    ? buildPdfDrawingMetadata({ strokeCount })
    : null;

  let dataUrl = null;
  if (!metadata) {
    try {
      dataUrl = canvas.toDataURL('image/png');
    } catch (err) {
      console.error('Falha ao gerar imagem da anotação do PDF', err);
    }
  }

  if (!metadata && !dataUrl) {
    console.error('Falha ao salvar anotação do PDF: dados indisponíveis.');
    return false;
  }

  const attemptStore = () => {
    if (metadata) {
      localStorage.setItem(key, metadata);
    } else if (dataUrl) {
      localStorage.setItem(key, dataUrl);
    }
    if (serialized) {
      localStorage.setItem(strokeKey, serialized);
    } else {
      localStorage.removeItem(strokeKey);
    }
  };

  try {
    attemptStore();
    return true;
  } catch (err) {
    if (!isQuotaExceededError(err)) {
      console.error('Falha ao salvar anotação do PDF', err);
      return false;
    }

    const preserve = new Set([key]);
    if (serialized) {
      preserve.add(strokeKey);
    }

    let success = false;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const removed = purgeOldPdfDrawingEntries({ preserveKeys: preserve, maxRemovals: 1 });
      if (!removed) break;
      try {
        attemptStore();
        success = true;
        break;
      } catch (retryErr) {
        if (!isQuotaExceededError(retryErr)) {
          console.error('Falha ao salvar anotação do PDF', retryErr);
          return false;
        }
      }
    }

    if (!success) {
      if (!pdfStorageQuotaAlertShown) {
        alert('Espaço insuficiente para salvar novas anotações. Exporte ou remova manuscritos antigos para liberar memória.');
        pdfStorageQuotaAlertShown = true;
      }
      console.error('Falha ao salvar anotação do PDF: espaço insuficiente.', err);
      return false;
    }

    return true;
  }
}

function restorePdfDrawingLayer(pdfName, pageNumber, canvas) {
  if (typeof localStorage === 'undefined') return;
  const key = getPdfDrawingStorageKey(pdfName, pageNumber);
  if (!key) return;
  const state = getPdfCanvasState(canvas);
  if (state) {
    state.selectedStrokeIds.clear();
  }
  const stored = localStorage.getItem(key);
  const metadata = parsePdfDrawingMetadata(stored);
  const strokeKey = `${key}${PDF_DRAW_STROKES_SUFFIX}`;
  const serialized = localStorage.getItem(strokeKey);
  if (state) {
    state.lastSavedAt = metadata?.timestamp || null;
  }
  if (serialized && state) {
    const { strokes, width: storedWidth, height: storedHeight } = deserializePdfStrokes(serialized);
    state.strokes = strokes;
    state.backgroundImage = null;
    const maxId = strokes.reduce((max, stroke) => Math.max(max, Number(stroke.id) || 0), 0);
    state.nextId = Math.max(maxId + 1, state.nextId || 1);
    if (Number.isFinite(storedWidth) && Number.isFinite(storedHeight) && storedWidth > 0 && storedHeight > 0) {
      state.canvasWidth = storedWidth;
      state.canvasHeight = storedHeight;
      const scaleX = canvas.width / storedWidth;
      const scaleY = canvas.height / storedHeight;
      scalePdfDrawingState(state, scaleX, scaleY, {
        width: canvas.width,
        height: canvas.height
      });
    } else {
      state.canvasWidth = Number.isFinite(canvas?.width) ? canvas.width : state.canvasWidth;
      state.canvasHeight = Number.isFinite(canvas?.height) ? canvas.height : state.canvasHeight;
      if (stored) {
        const fallbackImage = new Image();
        fallbackImage.onload = () => {
          const baseWidth = fallbackImage.naturalWidth || fallbackImage.width;
          const baseHeight = fallbackImage.naturalHeight || fallbackImage.height;
          if (!baseWidth || !baseHeight) return;
          const sx = canvas.width / baseWidth;
          const sy = canvas.height / baseHeight;
          if (Math.abs(sx - 1) < 0.001 && Math.abs(sy - 1) < 0.001) return;
          scalePdfDrawingState(state, sx, sy, {
            width: canvas.width,
            height: canvas.height
          });
          renderPdfCanvas(canvas);
        };
        fallbackImage.src = stored;
      }
    }
    renderPdfCanvas(canvas);
    return;
  }
  if (!stored) return;
  if (metadata && metadata.type === 'meta') return;
  const image = new Image();
  image.onload = () => {
    if (state) {
      state.backgroundImage = image;
      renderPdfCanvas(canvas);
      return;
    }
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  };
  image.onerror = () => {
    console.warn('Não foi possível restaurar a anotação salva do PDF.');
  };
  image.src = stored;
}

function migrateLegacyPdfDrawings() {
  if (typeof localStorage === 'undefined') return;
  try {
    const migrations = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || key === PDF_DRAW_LAST_CLEAN_KEY) continue;
      if (!key.startsWith(PDF_DRAW_PREFIX)) continue;
      const parts = key.split('::');
      if (parts.length < 4) continue;
      const [, maybeDate, encodedName, pageStr] = parts;
      if (!PDF_DRAW_LEGACY_DATE_PATTERN.test(maybeDate)) continue;
      const baseKey = `${PDF_DRAW_PREFIX}${encodedName}::${pageStr}`;
      const value = localStorage.getItem(key);
      if (value != null) {
        migrations.push({ oldKey: key, newKey: baseKey, value });
      }
      const legacyStrokeKey = `${key}${PDF_DRAW_STROKES_SUFFIX}`;
      const strokeValue = localStorage.getItem(legacyStrokeKey);
      if (strokeValue != null) {
        migrations.push({ oldKey: legacyStrokeKey, newKey: `${baseKey}${PDF_DRAW_STROKES_SUFFIX}`, value: strokeValue });
      }
    }
    migrations.forEach(({ oldKey, newKey, value }) => {
      if (value != null && localStorage.getItem(newKey) == null) {
        try {
          localStorage.setItem(newKey, value);
        } catch (err) {
          console.error('Falha ao migrar anotação do PDF para chave permanente.', err);
        }
      }
      localStorage.removeItem(oldKey);
    });
    if (migrations.length) {
      console.info('Anotações antigas do PDF migradas para armazenamento permanente.');
    }
    localStorage.removeItem(PDF_DRAW_LAST_CLEAN_KEY);
  } catch (err) {
    console.error('Falha ao migrar anotações antigas do PDF', err);
  }
}

function cleanupStalePdfDrawings() {
  if (typeof localStorage === 'undefined') return;
  try {
    migrateLegacyPdfDrawings();
    optimizePdfDrawingStorage();
    const orphanStrokeKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(PDF_DRAW_PREFIX)) continue;
      if (key === PDF_DRAW_LAST_CLEAN_KEY) continue;
      if (key.endsWith(PDF_DRAW_STROKES_SUFFIX)) {
        const baseKey = key.slice(0, -PDF_DRAW_STROKES_SUFFIX.length);
        if (!localStorage.getItem(baseKey)) {
          orphanStrokeKeys.push(key);
        }
      }
    }
    orphanStrokeKeys.forEach(key => localStorage.removeItem(key));
  } catch (err) {
    console.error('Falha ao limpar anotações antigas do PDF', err);
  }
}

function clearPdfDrawings() {
  if (typeof localStorage === 'undefined') return null;
  try {
    const keysToRemove = [];
    let pages = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(PDF_DRAW_PREFIX)) continue;
      keysToRemove.push(key);
      if (!key.endsWith(PDF_DRAW_STROKES_SUFFIX) && key !== PDF_DRAW_LAST_CLEAN_KEY) {
        pages++;
      }
    }
    if (!keysToRemove.length) return 0;
    keysToRemove.forEach(key => localStorage.removeItem(key));
    return pages;
  } catch (err) {
    console.error('Falha ao remover manuscritos dos PDFs', err);
    return null;
  }
}

cleanupStalePdfDrawings();

function getPdfPointerKey(pointerId) {
  if (pointerId == null) return null;
  try {
    return String(pointerId);
  } catch (err) {
    console.warn('Falha ao normalizar pointerId para o autosave do PDF.', err);
    return null;
  }
}

function suspendPdfAutosave(pointerId = null) {
  const key = getPdfPointerKey(pointerId);
  if (key !== null) {
    pdfActivePointerIds.add(key);
  }
  if (pdfAutosaveSuspended) return;
  pdfAutosaveSuspended = true;
  cancelPdfAutosave();
}

function resumePdfAutosave(pointerId = null) {
  const key = getPdfPointerKey(pointerId);
  if (key !== null) {
    pdfActivePointerIds.delete(key);
  }
  if (pdfActivePointerIds.size > 0) {
    return;
  }
  const wasSuspended = pdfAutosaveSuspended;
  pdfAutosaveSuspended = false;
  if (wasSuspended || pdfDirtyLayers.size > 0) {
    schedulePdfAutosave();
  }
}

function markPdfLayerDirty(canvas) {
  if (!canvas) return;
  canvas.dataset.dirty = 'true';
  pdfDirtyLayers.add(canvas);
  schedulePdfAutosave();
}

function cancelPdfAutosave() {
  if (pdfAutosaveTimeout != null) {
    clearTimeout(pdfAutosaveTimeout);
    pdfAutosaveTimeout = null;
  }
}

function schedulePdfAutosave() {
  if (pdfAutosaveSuspended) return;
  if (pdfAutosaveTimeout != null) return;
  if (!pdfDirtyLayers.size) return;
  pdfAutosaveTimeout = setTimeout(() => {
    pdfAutosaveTimeout = null;
    if (pdfAutosaveSuspended || !pdfDirtyLayers.size) {
      return;
    }
    persistCurrentPdfDrawings();
  }, PDF_AUTOSAVE_DELAY);
}

function ensurePdfPersistenceHandlers() {
  if (pdfPersistListenersAttached) return;
  const persist = () => persistCurrentPdfDrawings({ force: true });
  window.addEventListener('beforeunload', persist);
  window.addEventListener('pagehide', persist);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      persist();
    }
  });
  pdfPersistListenersAttached = true;
}

function persistCurrentPdfDrawings({ force = false } = {}) {
  cancelPdfAutosave();
  if (typeof localStorage === 'undefined') {
    pdfDirtyLayers.clear();
    return;
  }
  const layers = force ? getPdfDrawingLayers() : Array.from(pdfDirtyLayers);
  layers.forEach((layer) => {
    if (!(layer instanceof HTMLCanvasElement)) return;
    const pdfName = layer.dataset.pdfName;
    const pageNumber = Number(layer.dataset.pageNumber);
    if (!force && layer.dataset.dirty !== 'true') return;
    const saved = savePdfDrawingLayer(pdfName, pageNumber, layer);
    if (saved) {
      layer.dataset.dirty = 'false';
      pdfDirtyLayers.delete(layer);
    } else {
      layer.dataset.dirty = 'true';
      pdfDirtyLayers.add(layer);
    }
  });
  if (pdfDirtyLayers.size > 0) {
    schedulePdfAutosave();
  }
}

function getPdfDrawingLayers() {
  const scope = pdfPagesWrapper || pdfContainer;
  if (!scope) return [];
  return Array.from(scope.querySelectorAll('.pdf-draw-layer'));
}

function stylusTapDistance(a, b) {
  const dx = (a?.x || 0) - (b?.x || 0);
  const dy = (a?.y || 0) - (b?.y || 0);
  return Math.hypot(dx, dy);
}

function registerStylusTripleTap(event) {
  const time = typeof event.timeStamp === 'number' ? event.timeStamp : Date.now();
  const tap = { time, x: event.clientX || 0, y: event.clientY || 0 };
  stylusTapHistory = stylusTapHistory.filter(item => time - item.time <= STYLUS_TAP_TIMEOUT);
  stylusTapHistory.push(tap);
  if (stylusTapHistory.length < 3) return false;
  const recent = stylusTapHistory.slice(-3);
  if (time - recent[0].time > STYLUS_TAP_TIMEOUT) {
    return false;
  }
  let clustered = true;
  for (let i = 0; i < recent.length && clustered; i += 1) {
    for (let j = i + 1; j < recent.length; j += 1) {
      if (stylusTapDistance(recent[i], recent[j]) > STYLUS_TAP_DISTANCE) {
        clustered = false;
        break;
      }
    }
  }
  if (!clustered) return false;
  stylusTapHistory = [];
  return true;
}

function applyPdfToolToLayer(layer) {
  if (!layer) return;
  if (pdfDrawingTool === 'hand') {
    layer.style.pointerEvents = 'none';
    layer.style.touchAction = 'auto';
  } else {
    layer.style.pointerEvents = 'auto';
    layer.style.touchAction = pdfIpadMode ? 'pan-x pan-y' : 'none';
  }
}

let pdfTouchBlockerAttached = false;
let pdfGestureBlockersAttached = false;

function detachPdfTouchBlocker() {
  if (!pdfTouchBlockerAttached) return;
  if (pdfContainer) {
    pdfContainer.removeEventListener('touchmove', handlePdfTouchBlocker);
  }
  pdfTouchBlockerAttached = false;
}

function isPdfToolbarTarget(target) {
  if (!(target instanceof Element)) return false;
  return !!target.closest('#pdfToolbar');
}

function handlePdfTouchBlocker(event) {
  if (!pdfIpadMode) return;
  if (isPdfToolbarTarget(event.target)) return;
  if (!pdfStylusDrawingActive) return;
  if (event.touches && event.touches.length <= 1) {
    event.preventDefault();
  }
}

function ensurePdfTouchBlocker() {
  if (!pdfIpadMode || !pdfContainer || pdfTouchBlockerAttached) return;
  pdfContainer.addEventListener('touchmove', handlePdfTouchBlocker, { passive: false });
  pdfTouchBlockerAttached = true;
}

function preventPdfGestureZoom(event) {
  if (!pdfIpadMode) return;
  if (!pdfContainer || pdfContainer.style.display !== 'flex') return;
  event.preventDefault();
  if (typeof event.stopImmediatePropagation === 'function') {
    event.stopImmediatePropagation();
  } else if (typeof event.stopPropagation === 'function') {
    event.stopPropagation();
  }
}

function handlePdfGestureWheel(event) {
  if (!pdfIpadMode) return;
  if (!event.ctrlKey) return;
  event.preventDefault();
}

function attachPdfGestureBlockers() {
  if (!pdfContainer || pdfGestureBlockersAttached) return;
  const options = { passive: false };
  ['gesturestart', 'gesturechange', 'gestureend'].forEach((type) => {
    pdfContainer.addEventListener(type, preventPdfGestureZoom, options);
  });
  pdfContainer.addEventListener('wheel', handlePdfGestureWheel, { passive: false });
  pdfGestureBlockersAttached = true;
}

function detachPdfGestureBlockers() {
  if (!pdfContainer || !pdfGestureBlockersAttached) return;
  ['gesturestart', 'gesturechange', 'gestureend'].forEach((type) => {
    pdfContainer.removeEventListener(type, preventPdfGestureZoom);
  });
  pdfContainer.removeEventListener('wheel', handlePdfGestureWheel);
  pdfGestureBlockersAttached = false;
}

function setPdfDrawingTool(tool) {
  pdfDrawingTool = tool;
  stylusTapHistory = [];
  if (pdfHandBtn) {
    pdfHandBtn.classList.toggle('active', tool === 'hand');
    pdfHandBtn.setAttribute('aria-pressed', String(tool === 'hand'));
  }
  if (pdfPenBtn) {
    pdfPenBtn.classList.toggle('active', tool === 'pen');
    pdfPenBtn.setAttribute('aria-pressed', String(tool === 'pen'));
  }
  if (pdfEraserBtn) {
    pdfEraserBtn.classList.toggle('active', tool === 'eraser');
    pdfEraserBtn.setAttribute('aria-pressed', String(tool === 'eraser'));
  }
  getPdfDrawingLayers().forEach(applyPdfToolToLayer);
  if (pdfContainer) {
    pdfContainer.classList.toggle('hand-mode', tool === 'hand');
  }
  if (tool === 'hand') {
    pdfStylusDrawingActive = false;
  }
}

function setPdfIpadMode(enabled, { forcePen = false } = {}) {
  pdfIpadMode = !!enabled;
  if (pdfContainer) {
    pdfContainer.classList.toggle('ipad-mode', pdfIpadMode);
  }
  if (pdfIpadMode) {
    ensurePdfTouchBlocker();
    attachPdfGestureBlockers();
  } else {
    detachPdfTouchBlocker();
    detachPdfGestureBlockers();
    pdfStylusDrawingActive = false;
    resetPdfPinchPreview();
    pdfPinchState = null;
  }
  if (forcePen) {
    setPdfDrawingTool('pen');
  } else {
    getPdfDrawingLayers().forEach(applyPdfToolToLayer);
  }
}

function attachDrawingEvents(canvas, pdfName, pageNumber) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const state = getPdfCanvasState(canvas);
  if (!state) return;
  state.pdfName = pdfName;
  state.pageNumber = pageNumber;
  state.selectedStrokeIds ||= new Set();

  let drawing = false;
  let strokeDirty = false;
  let strokeHadMovement = false;
  let activeStroke = null;
  let activeTool = null;

  const getPoint = (event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  };

  const finishInteraction = (event) => {
    if (canvas.hasPointerCapture && canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
    if (!drawing) {
      pdfStylusDrawingActive = false;
      resumePdfAutosave(event.pointerId);
      return;
    }

    if (activeTool === 'pen' && activeStroke) {
      if (!strokeHadMovement) {
        strokeDirty = true;
        renderPdfCanvas(canvas);
      }
    } else if (activeTool === 'eraser') {
      const selected = state.selectedStrokeIds || new Set();
      if (selected.size) {
        const ids = new Set(selected);
        state.strokes = state.strokes.filter(stroke => !ids.has(stroke.id));
        strokeDirty = true;
      }
      selected.clear();
      renderPdfCanvas(canvas);
    }

    drawing = false;
    activeStroke = null;
    activeTool = null;
    strokeHadMovement = false;
    pdfStylusDrawingActive = false;

    if (strokeDirty) {
      markPdfLayerDirty(canvas);
      strokeDirty = false;
    }
    resumePdfAutosave(event.pointerId);
  };

  canvas.addEventListener('pointerdown', (event) => {
    if (pdfDrawingTool !== 'pen' && pdfDrawingTool !== 'eraser') return;
    const pointerType = event.pointerType || 'mouse';
    if (pdfIpadMode && pointerType !== 'pen' && pointerType !== 'mouse') {
      return;
    }
    if (canvas.setPointerCapture) {
      canvas.setPointerCapture(event.pointerId);
    }
    suspendPdfAutosave(event.pointerId);
    const point = getPoint(event);
    drawing = true;
    strokeDirty = false;
    strokeHadMovement = false;
    activeTool = pdfDrawingTool;

    if (activeTool === 'pen') {
      state.selectedStrokeIds.clear();
      const width = getPdfEffectivePenWidth(currentPdfZoom);
      activeStroke = {
        id: state.nextId++,
        type: 'pen',
        color: PDF_PEN_COLOR,
        width,
        baseWidth: width,
        points: [point]
      };
      state.strokes.push(activeStroke);
      renderPdfCanvas(canvas);
    } else {
      state.selectedStrokeIds.clear();
      const hits = findPdfStrokeHits(state.strokes, point, PDF_ERASER_HIT_RADIUS);
      hits.forEach(id => state.selectedStrokeIds.add(id));
      if (hits.length) {
        renderPdfCanvas(canvas);
      }
    }

    pdfStylusDrawingActive = pointerType === 'pen' && (activeTool === 'pen' || activeTool === 'eraser');
    event.preventDefault();
  });

  canvas.addEventListener('pointermove', (event) => {
    if (!drawing) return;
    const point = getPoint(event);
    if (activeTool === 'pen' && activeStroke) {
      const lastPoint = activeStroke.points[activeStroke.points.length - 1];
      if (!lastPoint || lastPoint.x !== point.x || lastPoint.y !== point.y) {
        activeStroke.points.push(point);
        strokeDirty = true;
        strokeHadMovement = true;
        renderPdfCanvas(canvas);
      }
    } else if (activeTool === 'eraser') {
      let changed = false;
      const hits = findPdfStrokeHits(state.strokes, point, PDF_ERASER_HIT_RADIUS);
      hits.forEach(id => {
        if (!state.selectedStrokeIds.has(id)) {
          state.selectedStrokeIds.add(id);
          changed = true;
        }
      });
      if (changed) {
        renderPdfCanvas(canvas);
      }
    }
    event.preventDefault();
  });

  ['pointerup', 'pointerleave', 'pointercancel'].forEach(type => {
    canvas.addEventListener(type, (event) => {
      if (event.pointerType === 'pen') {
        pdfStylusDrawingActive = false;
      }
      finishInteraction(event);
    });
  });
}

function createDrawingLayer(baseCanvas, pdfName, pageNumber) {
  const drawingCanvas = document.createElement('canvas');
  drawingCanvas.width = baseCanvas.width;
  drawingCanvas.height = baseCanvas.height;
  drawingCanvas.className = 'pdf-draw-layer';
  drawingCanvas.style.width = '100%';
  drawingCanvas.style.height = '100%';
  drawingCanvas.dataset.pageNumber = baseCanvas.dataset.pageNumber || String(pageNumber);
  drawingCanvas.dataset.pdfName = pdfName;
  const state = getPdfCanvasState(drawingCanvas);
  if (state) {
    state.strokes = [];
    state.selectedStrokeIds = new Set();
    state.nextId = 1;
    state.backgroundImage = null;
    state.canvasWidth = drawingCanvas.width;
    state.canvasHeight = drawingCanvas.height;
  }
  attachDrawingEvents(drawingCanvas, pdfName, pageNumber);
  applyPdfToolToLayer(drawingCanvas);
  renderPdfCanvas(drawingCanvas);
  return drawingCanvas;
}

function waitNextFrame() {
  return new Promise(resolve => requestAnimationFrame(() => resolve()));
}

async function loadFullPdf() {
  if (!pdfContainer || pdfContainer.style.display !== 'flex') return;
  if (!lastPdfName || !lastPdfTotalPages) return;
  if (isFullPdfLoaded || isFullPdfLoading) return;

  const allPages = Array.from({ length: lastPdfTotalPages }, (_, i) => i + 1);
  const viewportState = capturePdfViewportState();
  isFullPdfLoading = true;
  updatePdfNavigationState();
  let success = false;
  try {
    success = await openPdf(lastPdfName, allPages);
    if (success && viewportState) {
      await waitNextFrame();
      await waitNextFrame();
      restorePdfViewportState(viewportState);
      if (Number.isFinite(viewportState.pageNumber)) {
        const targetPage = Math.max(1, Math.min(viewportState.pageNumber, lastPdfTotalPages || viewportState.pageNumber));
        currentPdfPage = targetPage;
        updatePdfNavigationState();
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    isFullPdfLoading = false;
    if (!success) {
      isFullPdfLoaded = false;
    }
    updatePdfNavigationState();
  }
}

/** Listener do atalho que carrega todas as páginas do PDF. */
async function handlePdfKeydown(event) {
  if (!pdfContainer || pdfContainer.style.display !== 'flex') return;
  const key = event.key;
  if (key === 'ArrowRight') {
    event.preventDefault();
    navigatePdfPage(1);
    return;
  }
  if (key === 'ArrowLeft') {
    event.preventDefault();
    navigatePdfPage(-1);
    return;
  }
  const isPlus = key === '+' || key === 'Add' || key === 'NumpadAdd' || (key === '=' && event.shiftKey);
  if (!isPlus) return;

  event.preventDefault();
  await loadFullPdf();
}

function capturePdfViewportState() {
  const scope = pdfPagesWrapper || pdfContainer;
  if (!scope) return null;
  const wrappers = Array.from(scope.querySelectorAll('.pdf-page-wrapper[data-page-number]'));
  if (!wrappers.length) return null;
  const scrollTop = pdfContainer.scrollTop;
  const firstVisible = wrappers.find(wrapper => scrollTop < wrapper.offsetTop + wrapper.offsetHeight);
  if (!firstVisible) return null;
  const pageNumber = Number(firstVisible.dataset.pageNumber);
  if (!Number.isFinite(pageNumber)) return null;
  const offsetWithinPage = Math.max(0, scrollTop - firstVisible.offsetTop);
  const pageHeight = firstVisible.offsetHeight || 0;
  const offsetRatio = pageHeight > 0 ? Math.min(1, Math.max(0, offsetWithinPage / pageHeight)) : null;
  return { pageNumber, offsetWithinPage, offsetRatio };
}

function restorePdfViewportState(state) {
  const scope = pdfPagesWrapper || pdfContainer;
  if (!state || !scope) return;
  const wrapper = scope.querySelector(`.pdf-page-wrapper[data-page-number="${state.pageNumber}"]`);
  if (!wrapper) return;
  let offset = Number.isFinite(state.offsetWithinPage) ? state.offsetWithinPage : 0;
  if (state.offsetRatio != null && wrapper.offsetHeight > 0) {
    offset = wrapper.offsetHeight * state.offsetRatio;
  }
  const targetScroll = wrapper.offsetTop + Math.max(0, offset || 0);
  pdfContainer.scrollTop = Math.max(0, targetScroll);
}

function getPdfViewportFocusFromPoint(clientX, clientY) {
  const scope = pdfPagesWrapper || pdfContainer;
  if (!scope) return null;
  const wrappers = Array.from(scope.querySelectorAll('.pdf-page-wrapper[data-page-number]'));
  for (const wrapper of wrappers) {
    const rect = wrapper.getBoundingClientRect();
    if (
      clientX >= rect.left && clientX <= rect.right &&
      clientY >= rect.top && clientY <= rect.bottom
    ) {
      const pageNumber = Number(wrapper.dataset.pageNumber);
      if (!Number.isFinite(pageNumber)) continue;
      const offsetWithinPage = Math.max(0, clientY - rect.top);
      const offsetRatio = rect.height > 0 ? Math.min(1, Math.max(0, offsetWithinPage / rect.height)) : null;
      return { pageNumber, offsetWithinPage, offsetRatio };
    }
  }
  return null;
}

function clampPdfZoom(value) {
  const target = Number(value);
  if (!Number.isFinite(target)) {
    return Number.isFinite(currentPdfZoom) ? currentPdfZoom : PDF_DEFAULT_ZOOM;
  }
  return Math.min(PDF_MAX_ZOOM, Math.max(PDF_MIN_ZOOM, target));
}

async function setPdfZoom(targetZoom, { viewportState } = {}) {
  if (!pdfContainer || pdfContainer.style.display !== 'flex') return;
  if (!lastPdfName) return;
  const clampedZoom = clampPdfZoom(targetZoom);
  if (!Number.isFinite(currentPdfZoom)) {
    currentPdfZoom = PDF_DEFAULT_ZOOM;
  }
  const state = viewportState || capturePdfViewportState();
  if (Math.abs(clampedZoom - currentPdfZoom) < 0.01) {
    if (state) {
      restorePdfViewportState(state);
    }
    return;
  }
  const pdf = await loadPdfDocument(lastPdfName);
  if (!pdf) {
    console.error('Documento PDF indisponível para ajuste de zoom.');
    return;
  }

  const scope = pdfPagesWrapper || pdfContainer;
  const wrappers = scope
    ? Array.from(scope.querySelectorAll('.pdf-page-wrapper[data-page-number]'))
    : [];

  if (!wrappers.length) {
    const pages = lastPdfRenderedPages.length
      ? lastPdfRenderedPages.slice()
      : (Number.isFinite(currentPdfPage) ? [currentPdfPage] : [1]);
    try {
      await openPdf(lastPdfName, pages, PDF_RENDER_QUALITY, clampedZoom);
    } catch (err) {
      console.error('Falha ao ajustar zoom do PDF', err);
      return;
    }
    if (state) {
      restorePdfViewportState(state);
    }
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  const quality = PDF_RENDER_QUALITY;
  const renderScale = quality * dpr * clampedZoom;
  const updatedPages = [];

  for (const wrapper of wrappers) {
    const pageNumber = Number(wrapper.dataset.pageNumber);
    if (!Number.isFinite(pageNumber)) continue;
    updatedPages.push(pageNumber);
    const canvas = wrapper.querySelector('canvas');
    if (!(canvas instanceof HTMLCanvasElement)) continue;
    const drawingLayer = wrapper.querySelector('.pdf-draw-layer');
    const previousWidth = canvas.width || 1;
    const previousHeight = canvas.height || 1;

    try {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: renderScale });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = `${viewport.width / (quality * dpr)}px`;
      canvas.style.height = `${viewport.height / (quality * dpr)}px`;
      canvas.style.maxWidth = '100%';
      wrapper.style.width = canvas.style.width;
      wrapper.style.maxWidth = '100%';

      await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;

      if (drawingLayer instanceof HTMLCanvasElement) {
        const scaleX = previousWidth ? canvas.width / previousWidth : 1;
        const scaleY = previousHeight ? canvas.height / previousHeight : 1;
        drawingLayer.width = canvas.width;
        drawingLayer.height = canvas.height;
        drawingLayer.style.width = '100%';
        drawingLayer.style.height = '100%';
        const stateRef = getPdfCanvasState(drawingLayer);
        scalePdfDrawingState(stateRef, scaleX, scaleY, {
          width: canvas.width,
          height: canvas.height
        });
        renderPdfCanvas(drawingLayer);
        applyPdfToolToLayer(drawingLayer);
      }
    } catch (err) {
      console.error('Falha ao redesenhar página do PDF durante ajuste de zoom', err);
    }
  }

  if (updatedPages.length) {
    lastPdfRenderedPages = updatedPages;
  }
  currentPdfZoom = clampedZoom;
  if (state) {
    await waitNextFrame();
    restorePdfViewportState(state);
  }
}

function getPdfTouchDistance(touches) {
  if (!touches || touches.length < 2) return 0;
  const a = touches.item ? touches.item(0) : touches[0];
  const b = touches.item ? touches.item(1) : touches[1];
  if (!a || !b) return 0;
  const dx = a.clientX - b.clientX;
  const dy = a.clientY - b.clientY;
  return Math.hypot(dx, dy);
}

function getPdfTouchCenter(touches) {
  if (!touches || touches.length < 2) return { x: 0, y: 0 };
  const a = touches.item ? touches.item(0) : touches[0];
  const b = touches.item ? touches.item(1) : touches[1];
  if (!a || !b) {
    return { x: 0, y: 0 };
  }
  return {
    x: (a.clientX + b.clientX) / 2,
    y: (a.clientY + b.clientY) / 2
  };
}

function resetPdfPinchPreview() {
  const wrapper = pdfPagesWrapper || pdfContainer;
  if (!wrapper) return;
  wrapper.style.transform = '';
  wrapper.style.transformOrigin = '';
}

function releaseCurrentPdfDocument() {
  if (currentPdfDocument && typeof currentPdfDocument.destroy === 'function') {
    currentPdfDocument.destroy().catch(err => {
      console.warn('Falha ao liberar documento PDF em memória.', err);
    });
  }
  currentPdfDocument = null;
  currentPdfDocumentName = null;
}

async function loadPdfDocument(pdfName) {
  if (!pdfName) return null;
  if (!window.pdfjsLib) return null;
  if (currentPdfDocument && currentPdfDocumentName === pdfName) {
    return currentPdfDocument;
  }

  releaseCurrentPdfDocument();

  const sources = [`PDFs/${pdfName}`, `PDFsD1/${pdfName}`, `PDFs_Não_Classificados/${pdfName}`];
  let lastError = null;
  for (const src of sources) {
    try {
      const pdf = await pdfjsLib.getDocument(src).promise;
      currentPdfDocument = pdf;
      currentPdfDocumentName = pdfName;
      return pdf;
    } catch (err) {
      lastError = err;
    }
  }
  if (lastError) {
    console.error('Falha ao carregar documento PDF', lastError);
  }
  return null;
}

function handlePdfPinchStart(event) {
  if (!pdfContainer || pdfContainer.style.display !== 'flex') return;
  if (!pdfIpadMode) return;
  if (event.touches.length < 2) return;
  if (isPdfToolbarTarget(event.target)) return;
  const distance = getPdfTouchDistance(event.touches);
  if (!distance) return;
  const center = getPdfTouchCenter(event.touches);
  const focus = getPdfViewportFocusFromPoint(center.x, center.y) || capturePdfViewportState();
  const wrapper = pdfPagesWrapper || pdfContainer;
  if (wrapper) {
    const rect = wrapper.getBoundingClientRect();
    wrapper.style.transformOrigin = `${center.x - rect.left}px ${center.y - rect.top}px`;
  }
  pdfPinchState = {
    startDistance: distance,
    startZoom: Number.isFinite(currentPdfZoom) ? currentPdfZoom : PDF_DEFAULT_ZOOM,
    lastZoom: Number.isFinite(currentPdfZoom) ? currentPdfZoom : PDF_DEFAULT_ZOOM,
    focus
  };
  event.preventDefault();
}

function handlePdfPinchMove(event) {
  if (!pdfPinchState) return;
  if (event.touches.length < 2) return;
  const distance = getPdfTouchDistance(event.touches);
  if (!distance || !pdfPinchState.startDistance) return;
  const scale = distance / pdfPinchState.startDistance;
  const targetZoom = clampPdfZoom(pdfPinchState.startZoom * scale);
  pdfPinchState.lastZoom = targetZoom;
  const wrapper = pdfPagesWrapper || pdfContainer;
  if (wrapper) {
    const baseZoom = Number.isFinite(currentPdfZoom) ? currentPdfZoom : PDF_DEFAULT_ZOOM;
    const previewScale = baseZoom ? targetZoom / baseZoom : 1;
    wrapper.style.transform = `scale(${previewScale})`;
  }
  event.preventDefault();
}

function handlePdfPinchEnd(event) {
  if (!pdfPinchState) return;
  if (event.touches && event.touches.length >= 2) return;
  resetPdfPinchPreview();
  const { lastZoom, focus } = pdfPinchState;
  pdfPinchState = null;
  if (Number.isFinite(lastZoom)) {
    const current = Number.isFinite(currentPdfZoom) ? currentPdfZoom : PDF_DEFAULT_ZOOM;
    if (Math.abs(lastZoom - current) > 0.01) {
      setPdfZoom(lastZoom, { viewportState: focus });
    } else if (focus) {
      restorePdfViewportState(focus);
    }
  }
  if (event) {
    event.preventDefault();
  }
}

/** Abre/Renderiza um PDF no modal. */
async function openPdf(pdfName, pages, quality = PDF_RENDER_QUALITY, zoom = null) {
  const isNewDocument = lastPdfName !== pdfName;
  const pageList = Array.isArray(pages) ? pages : [pages];
  const pagesToRender = pageList
    .map(num => Number(num))
    .filter(num => Number.isFinite(num) && num >= 1);
  const sortedPages = pagesToRender.slice().sort((a, b) => a - b);
  const desiredPage = sortedPages.length ? sortedPages[0] : null;
  const wasHidden = pdfContainer.style.display !== "flex";
  cleanupStalePdfDrawings();
  ensurePdfPersistenceHandlers();
  pdfContainer.style.display = "flex";
  setBodyScrollLocked(true);
  if (wasHidden) {
    setPdfIpadMode(true, { forcePen: true });
    pdfContainer.scrollTop = 0;
    setPdfPageMenuOpen(false);
  } else {
    setPdfPageMenuOpen(pdfPageMenuOpen);
  }
  if (wasHidden || isNewDocument) {
    currentPdfZoom = PDF_DEFAULT_ZOOM;
  }
  persistCurrentPdfDrawings();
  clearPdfViewerContent();
  pdfPinchState = null;

  if (!pdfKeyListenerAttached) {
    document.addEventListener('keydown', handlePdfKeydown);
    pdfKeyListenerAttached = true;
  }

  if (!window.pdfjsLib) {
    alert('Visualização de PDF indisponível.');
    return false;
  }

  const pdf = await loadPdfDocument(pdfName);
  if (!pdf) {
    alert('PDF não encontrado.');
    return false;
  }

  let effectiveZoom;
  if (Number.isFinite(zoom)) {
    effectiveZoom = Math.min(PDF_MAX_ZOOM, Math.max(PDF_MIN_ZOOM, zoom));
  } else if (Number.isFinite(currentPdfZoom)) {
    effectiveZoom = currentPdfZoom;
  } else {
    effectiveZoom = PDF_DEFAULT_ZOOM;
  }
  currentPdfZoom = effectiveZoom;
  lastPdfName = pdfName;
  lastPdfTotalPages = pdf?.numPages || 0;
  if (desiredPage !== null) {
    const total = lastPdfTotalPages || desiredPage;
    currentPdfPage = Math.max(1, Math.min(desiredPage, total));
  } else if (lastPdfTotalPages > 0) {
    currentPdfPage = 1;
  } else {
    currentPdfPage = null;
  }
  const uniquePages = new Set(pagesToRender.length ? pagesToRender : pageList);
  isFullPdfLoaded = lastPdfTotalPages > 0 && uniquePages.size === lastPdfTotalPages;
  updatePdfNavigationState();

  const dpr   = window.devicePixelRatio || 1;
  const scale = quality * dpr * effectiveZoom;

  const targetContainer = pdfPagesWrapper || pdfContainer;

  lastPdfRenderedPages = pagesToRender.slice();

  for (const num of pagesToRender) {
    const page     = await pdf.getPage(num);
    const viewport = page.getViewport({ scale });
    const canvas   = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.dataset.pageNumber = String(num);
    canvas.style.width = `${viewport.width/(quality*dpr)}px`;
    canvas.style.height = `${viewport.height/(quality*dpr)}px`;
    canvas.style.maxWidth = '100%';
    const wrapper = document.createElement('div');
    wrapper.className = 'pdf-page-wrapper';
    wrapper.dataset.pageNumber = String(num);
    wrapper.style.width = canvas.style.width;
    wrapper.style.maxWidth = '100%';
    wrapper.appendChild(canvas);
    const drawingLayer = createDrawingLayer(canvas, pdfName, num);
    wrapper.appendChild(drawingLayer);
    targetContainer.appendChild(wrapper);
    await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
    restorePdfDrawingLayer(pdfName, num, drawingLayer);
  }
  setPdfDrawingTool(pdfDrawingTool);
  return true;
}

function openAnswer(answer){
  pdfContainer.style.display = 'flex';
  setBodyScrollLocked(true);
  persistCurrentPdfDrawings();
  clearPdfViewerContent();
  releaseCurrentPdfDocument();
  currentPdfZoom = PDF_DEFAULT_ZOOM;
  lastPdfName = null;
  lastPdfTotalPages = 0;
  isFullPdfLoaded = false;
  isFullPdfLoading = false;
  currentPdfPage = null;
  const div = Object.assign(document.createElement('div'),{
    className:'answer-letter',
    textContent: `Gabarito: ${answer}`
  });
  div.style.cssText = 'font-size:48px;color:#fff;margin:40px;text-align:center;';
  if (pdfPagesWrapper) {
    pdfPagesWrapper.appendChild(div);
  } else {
    pdfContainer.appendChild(div);
  }
  updatePdfNavigationState();
}

function openGabarito(q){
  if(q?.gabaritoAnswer){
    openAnswer(q.gabaritoAnswer);
  }else if(q?.GPDFName && q?.gabaritoPage){
    openPdf(q.GPDFName, q.gabaritoPage);
  }else{
    alert('Gabarito indisponível.');
  }
}

function closePdfViewer() {
  persistCurrentPdfDrawings();
  setPdfIpadMode(false);
  pdfContainer.style.display = "none";
  setBodyScrollLocked(false);
  clearPdfViewerContent();
  releaseCurrentPdfDocument();
  pdfContainer.scrollTop = 0;
  setPdfPageMenuOpen(false);
  if (pdfKeyListenerAttached) {
    document.removeEventListener('keydown', handlePdfKeydown);
    pdfKeyListenerAttached = false;
  }
  currentPdfZoom = PDF_DEFAULT_ZOOM;
  lastPdfName = null;
  lastPdfTotalPages = 0;
  isFullPdfLoaded = false;
  isFullPdfLoading = false;
  setPdfDrawingTool('hand');
  pdfStylusDrawingActive = false;
  currentPdfPage = null;
  updatePdfNavigationState();
}

if (closeBtn) {
  closeBtn.onclick = closePdfViewer;
}

if (pdfHandBtn) {
  pdfHandBtn.addEventListener('click', () => setPdfDrawingTool('hand'));
}
if (pdfPenBtn) {
  pdfPenBtn.addEventListener('click', () => setPdfDrawingTool('pen'));
}
if (pdfEraserBtn) {
  pdfEraserBtn.addEventListener('click', () => setPdfDrawingTool('eraser'));
}
if (pdfPageMenuToggleBtn) {
  pdfPageMenuToggleBtn.addEventListener('click', togglePdfPageMenu);
}
if (pdfPrevPageBtn) {
  pdfPrevPageBtn.addEventListener('click', () => {
    navigatePdfPage(-1);
  });
}
if (pdfNextPageBtn) {
  pdfNextPageBtn.addEventListener('click', () => {
    navigatePdfPage(1);
  });
}
if (pdfPageIndicator) {
  pdfPageIndicator.setAttribute('role', 'button');
  pdfPageIndicator.setAttribute('tabindex', '0');
  pdfPageIndicator.setAttribute('aria-label', 'Recolher navegação de páginas');
  const closeMenu = () => setPdfPageMenuOpen(false);
  pdfPageIndicator.addEventListener('click', closeMenu);
  pdfPageIndicator.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      closeMenu();
    }
  });
}
if (pdfContainer) {
  pdfContainer.addEventListener('touchstart', handlePdfPinchStart, { passive: false });
  pdfContainer.addEventListener('touchmove', handlePdfPinchMove, { passive: false });
  pdfContainer.addEventListener('touchend', handlePdfPinchEnd);
  pdfContainer.addEventListener('touchcancel', handlePdfPinchEnd);
}
setPdfPageMenuOpen(false);
setPdfDrawingTool(pdfDrawingTool);
updatePdfNavigationState();

function openImage(url) {
  if (!previewImg) {
    window.open(url, '_blank', 'noopener');
    return;
  }
  previewImg.src = url;
  imgContainer.style.display = 'flex';
}
function closeImage(){
  imgContainer.style.display = 'none';
  if (previewImg) previewImg.src = '';
}
if (closeImgBtn) closeImgBtn.onclick = closeImage;
if (imgContainer) {
  imgContainer.addEventListener('click', e => {
    if (e.target === imgContainer) closeImage();
  });
}

// --- Simulado de Matemática (10 questões de assuntos aleatórios) ---
function showMicroSim(entry) {
  currentDisc = 'Matemática';
  currentSub  = null;
  currentView = 'microSim';
  currentMicroSimEntry = null;
  // mantém trailReturn para voltar à trilha corretamente
  leaveHome();
  toggleSettingsVisibility(false);
  updateHeader(true, 'Simulado de Matemática');
  summaryBtn.style.display = 'inline-block';
  summaryBtn.textContent = 'Resumo';
  summaryBtn.onclick = () => openDisciplineSummary('Matemática');
  document.getElementById('headerStats').style.visibility='visible';
  clear();
  window.scrollTo(0,0);

  let sourceEntry = null;
  let micro = [];
  if(entry && Array.isArray(entry.qs)) {
    sourceEntry = { ...entry };
    micro = entry.qs.slice();
  } else {
    const max = countRemainingQuestions('Matemática');
    if(max===0){
      app.textContent = 'Todas as questões de Matemática foram concluídas.';
      return;
    }
    const inp = prompt(`Quantas questões deseja? (1-${max})`, '10');
    if(inp === null){
      backBtn.onclick();
      return;
    }
    const n = Math.max(1, Math.min(parseInt(inp,10)||0, max));
    micro = generateMicroQuestions(n);
    sourceEntry = { disc: 'Matemática', sub: 'micro', qs: micro.slice() };
  }
  if(micro.length===0){
    app.textContent = 'Todas as questões de Matemática foram concluídas.';
    return;
  }
  const questions = micro.map(({sub,label}) => {
    const q = questoesData['Matemática'][sub].find(x => x.label===label);
    return q? {disc:'Matemática', sub, q}: null;
  }).filter(Boolean);
  if (questions.length === 0) {
    app.textContent = 'Todas as questões de Matemática foram concluídas.';
    return;
  }
  const normalizedQs = questions.map(({sub, q}) => ({ sub, label: q.label }));
  currentMicroSimEntry = { ...(sourceEntry || { disc: 'Matemática', sub: 'micro' }), qs: normalizedQs };

  const statDiv = document.getElementById('headerStats');
  function refreshStats(){
    let c=0,a=0;
    questions.forEach(({disc,sub,q})=>{
      const st = getEffectiveQuestionState(disc, sub, q.label);
      if(st===1) c++;
      if(st===1||st===2) a++;
    });
    const pct = a? (c/a*100):0;
    statDiv.textContent=`Desempenho: ${c}/${a} (${pct.toFixed(1)}%) | Total: ${questions.length}`;
    statDiv.className = a===0 ? 'stat neutral'
      : pct>=90? 'stat blue'
      : pct>=80? 'stat green'
      : pct>=60? 'stat orange'
      : 'stat red';
  }
  refreshStats();

  questions.forEach(({disc,sub,q})=>{
    const row = app.appendChild(Object.assign(
      document.createElement('div'),{className:'question-row'}));
    const qBtn = document.createElement('button');
    qBtn.innerHTML = `
      <span class="ms-topic">${getFriendlyName(disc,sub)}</span><br>
      <span class="ms-label">${q.label}</span>`;
    qBtn.classList.add('btn','question-btn','two-line-btn');
    qBtn.querySelector('.ms-topic').style.color = discColors[disc] || 'var(--c-text-muted)';
    const m = q.label.match(/ENEM|SAS|BERNOULLI|POLIEDRO|SOMOS|EVOLUCIONAL/i);
    if(m){
      const exam = m[0].toLowerCase();
      qBtn.classList.add(`exam-${exam}`);
    }
    qBtn.onclick = () => openPdf(q.QPDFName, q.page);
    row.appendChild(qBtn);
    attachFavoriteQuestionMenu(row, qBtn, disc, sub, q.label);

    row.appendChild(Object.assign(
      document.createElement('button'),{
        textContent:'Gabarito',
        className:'small-btn',
        onclick:()=>openGabarito(q)}));

    const key = qKey(disc,sub,q.label);
    let st = getStoredQuestionState(disc, sub, q.label);
    const box = row.appendChild(Object.assign(
      document.createElement('span'),{className:'state-box'}));
    const paint=()=>{
      const effective = getEffectiveStateFromKey(key, st);
      box.textContent=effective===1?'✓':effective===2?'✗':'';
      box.style.color=effective===1?'#32cd32':effective===2?'#ff0000':'#f0f0f0';
    };
    paint();
    box.onclick=()=>{
      st=(st+1)%3;
      localStorage.setItem(key,st);
      const today=getTodayStr();
      const logKey=`log_${today}_${key}`;
      const msKey=`logmicro_${today}_${key}`;
      if(!D1_DISCIPLINES.includes(disc)){
        if(st===1||st===2){
          localStorage.setItem(logKey,'1');
          localStorage.setItem(msKey,'1');
        } else {
          localStorage.removeItem(logKey);
          localStorage.removeItem(msKey);
        }
      }
      paint();
      refreshStats();
    };

    const cKey = `comment_${key}`;
    const editDiv=document.createElement('div');
    editDiv.className='comment-edit';
    editDiv.contentEditable='true';
    editDiv.dataset.ph='';
    editDiv.addEventListener('click',function(e){
      if(e.button!==0) return;
      const anchor=e.target.closest('a');
      if(anchor){
        e.preventDefault();
        if(isImageUrl(anchor.href)) openImage(anchor.href);
        else window.open(anchor.href,'_blank','noopener');
        return;
      }
      if(!editDiv.classList.contains('expanded')){
        editDiv.focus();
      }
    });
    editDiv.innerHTML=localStorage.getItem(cKey)||'';
    replaceArrows(editDiv,true);
    editDiv.addEventListener('paste',e=>{
      e.preventDefault();
      const plain=e.clipboardData.getData('text/plain');
      const sel=window.getSelection();
      if(!sel.rangeCount) return;
      const range=sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(plain));
      range.collapse(false); sel.removeAllRanges(); sel.addRange(range);
      replaceArrows(editDiv,true);
    });
    editDiv.addEventListener('input',()=>{ if(editDiv.classList.contains('expanded')) fitHeight(editDiv); });
    editDiv.addEventListener('focus',()=>{ editDiv.classList.add('expanded'); editDiv.style.whiteSpace='pre-wrap'; editDiv.style.overflowY='auto'; fitHeight(editDiv); });
    editDiv.addEventListener('blur',()=>{ if(editDiv.textContent.trim()===''){ editDiv.innerHTML=''; localStorage.removeItem(cKey); } editDiv.classList.remove('expanded'); editDiv.style.maxHeight='38px'; editDiv.style.whiteSpace='nowrap'; editDiv.style.textOverflow='ellipsis'; editDiv.style.overflow='hidden'; editDiv.scrollTop=0; atualizaIndicadorOverflow(editDiv); });
    editDiv.addEventListener('contextmenu',e=>{ e.preventDefault(); openLinkMenu(e,editDiv); });
    editDiv.addEventListener('click',e=>{ const a=e.target.closest('a'); if(!a) return; if(editDiv.matches(':focus')){ openLinkMenu(e,editDiv); }else{ e.preventDefault(); if(isImageUrl(a.href)) openImage(a.href); else window.open(a.href,'_blank','noopener'); } });
    const save=()=>{ replaceArrows(editDiv); localStorage.setItem(cKey,editDiv.innerHTML); };
    editDiv.addEventListener('input',save);
    row.appendChild(editDiv);
    atualizaIndicadorOverflow(editDiv);
  });

  document.querySelectorAll('.comment-edit').forEach(div=>div.blur());
  if(document.activeElement && document.activeElement.classList.contains('comment-edit')){
    document.activeElement.blur();
  }
  if(pendingSearchFocus && pendingSearchFocus.disc === disc && pendingSearchFocus.sub === sub){
    const match = pendingSearchFocus;
    pendingSearchFocus = null;
    requestAnimationFrame(() => focusQuestionFromSearch(match));
  }
}

function openSummary(){                      // usa a disciplina/assunto atuais
  if(!currentDisc || !currentSub) return;
  openSummaryFor(currentDisc, currentSub);
}
function openDisciplineSummary(disc){        // resumo geral da disciplina
  if(!disc) return;
  openSummaryFor(disc, '00');
}
function openSummaryFor(disc, sub){
  if(!disc || !summaryFrame || !summaryContainer) return;
  const d = encodeURIComponent(disc);
  const effectiveSub = sub ?? '00';
  const s = encodeURIComponent(effectiveSub);
  summaryFrame.src = `Editor_de_Texto.html?disc=${d}&sub=${s}`;
  summaryContainer.style.display = "flex";
  setBodyScrollLocked(true);
}
function closeSummary(){
  summaryContainer.style.display = "none";
  const pdfOpen = pdfContainer && pdfContainer.style.display === 'flex';
  if(!pdfOpen && !isSearchOverlayOpen()){
    setBodyScrollLocked(false);
  }
}
window.closeSummary = closeSummary;           // para o iframe conseguir fechar

/* ===================================================================
   MENU DE LINK (Add / Edit / Remove)
   ===================================================================*/
(function(){
  // cria o menu flutuante apenas uma vez
  const menu = document.createElement('div');
  menu.style.cssText = `
    position:fixed; background:#2a2a2a; border:1px solid #555;
    border-radius:4px; padding:4px; z-index:3000; display:none`;
  document.body.appendChild(menu);

  function hide(){ menu.style.display = 'none'; }
  document.addEventListener('click', hide);
  document.addEventListener('scroll', hide, true);

  // helpers ---------------------------------------------------------
  function buildItem(label, fn){
    const b = document.createElement('button');
    b.textContent = label;
    b.style.cssText =
      'all:unset; display:block; padding:6px 12px; color:#fff; cursor:pointer';
    b.onmouseenter = () => b.style.background = '#3a3a3a';
    b.onmouseleave = () => b.style.background = 'none';
    b.onclick = () => { fn(); hide(); };
    return b;
  }

    // API pública ------------------------------------------------------
  window.openLinkMenu = function (evt, editDiv) {
    evt.preventDefault();              // remove o menu nativo do navegador
    const sel    = window.getSelection();
    const anchor = evt.target.closest('a');      // se clicou num <a>, pega-o
    const range  = sel.rangeCount ? sel.getRangeAt(0) : null;
    const hasSel = range && !range.collapsed;    // true se houver texto selecionado

    // limpa opções anteriores
    menu.innerHTML = '';

    /* ―― 1. “Abrir link” (só se clicou num <a>) ―― */ 
    /*
    if (anchor) {
      menu.appendChild(buildItem('Abrir link', () => {
        window.open(anchor.href, '_blank', 'noopener');
      }));
    }
    */

    /* ―― 2. “Inserir link” ou “Editar link” ―― */
    if (anchor || hasSel) {
      const label = anchor ? 'Editar link' : 'Inserir link';
      menu.appendChild(buildItem(label, () => {
        const url = prompt('URL do link:', anchor ? anchor.href : '') || '';
        if (!url) return;   // se cancelar, sai

        if (anchor) {
          // editar href existente
          anchor.href = url;
        } else {
          // inserir <a>
          document.execCommand('createLink', false, url);
          // garantir target="_blank" e rel="noopener":
          const a = sel.anchorNode.parentElement.closest('a');
          if (a) {
            a.target = '_blank';
            a.rel    = 'noopener';
          }
        }
        // força salvar alterações no comentário:
        editDiv.dispatchEvent(new Event('input'));
        editDiv.focus();
      }));
    }

    /* ―― 3. “Remover link” (só se clicou num <a>) ―― */
    if (anchor) {
      menu.appendChild(buildItem('Remover link', () => {
        const parent = anchor.parentNode;
        while (anchor.firstChild) {
          parent.insertBefore(anchor.firstChild, anchor);
        }
        parent.removeChild(anchor);
        // força salvar alterações no comentário:
        editDiv.dispatchEvent(new Event('input'));
        editDiv.focus();
      }));
    }

    // Se não há nenhuma opção a exibir, não mostra o menu
    if (!menu.children.length) return;

    menu.style.left    = `${evt.clientX}px`;
    menu.style.top     = `${evt.clientY}px`;
    menu.style.display = 'block';
  };
})();

/* ================================================================
   7. EVENTOS GLOBAIS
   ============================================================== */
/* 1 ───── Handler do botão “Importar” ───── */
importFile.addEventListener("change", ({ target }) => {
  const file = target.files[0];
  const mode = target.dataset.mode === 'handwriting' ? 'handwriting' : 'general';
  if (!file) {
    target.dataset.mode = '';
    target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    // guarda o JSON bruto em sessionStorage
    if (typeof sessionStorage !== 'undefined') {
      const wrapper = {
        __type: IMPORT_WRAPPER_TYPE,
        mode,
        data: e.target.result
      };
      try {
        sessionStorage.setItem("__pendingImport__", JSON.stringify(wrapper));
      } catch (err) {
        console.error('Falha ao preparar importação', err);
        alert('Não foi possível preparar a importação. Verifique o console para mais detalhes.');
        target.dataset.mode = '';
        target.value = '';
        return;
      }
    }

    // libera espaço no localStorage para a próxima carga
    if (mode === 'handwriting') {
      removeHandwritingEntriesFromLocalStorage();
    } else {
      localStorage.clear();
    }

    // recarrega a página; o passo 2 roda no boot
    target.dataset.mode = '';
    target.value = '';
    location.reload();
  };
  reader.readAsText(file);
});

/* 2 ───── Restauração automática logo no início do JS principal ───── */
(() => {
  const hasSession = typeof sessionStorage !== 'undefined';
  const raw = hasSession ? sessionStorage.getItem("__pendingImport__") : null;
  if (!raw) return;                           // nada pendente

  let mode = 'general';
  let parsedData = null;

  try {
    const maybeWrapper = JSON.parse(raw);
    if (maybeWrapper && typeof maybeWrapper === 'object' && !Array.isArray(maybeWrapper) && maybeWrapper.__type === IMPORT_WRAPPER_TYPE) {
      mode = maybeWrapper.mode === 'handwriting' ? 'handwriting' : 'general';
      if (typeof maybeWrapper.data !== 'string') {
        throw new Error('Wrapper de importação inválido');
      }
      parsedData = JSON.parse(maybeWrapper.data);
    } else {
      parsedData = maybeWrapper;
    }
  } catch (err) {
    console.error("Falha ao processar backup:", err);
    alert("Importação cancelada (arquivo corrompido).");
    if (hasSession) {
      sessionStorage.removeItem("__pendingImport__");
    }
    return;
  }

  if (!parsedData || typeof parsedData !== 'object' || Array.isArray(parsedData)) {
    console.error('Falha ao processar backup: formato inesperado.');
    alert("Importação cancelada (arquivo corrompido).");
    if (hasSession) {
      sessionStorage.removeItem("__pendingImport__");
    }
    return;
  }

  try {
    if (mode === 'handwriting') {
      removeHandwritingEntriesFromLocalStorage();
    } else {
      localStorage.clear();
    }
    Object.entries(parsedData).forEach(([k, v]) => {
      if (!shouldIncludeKeyForImport(k, mode)) return;
      localStorage.setItem(k, v);
    });
  } catch (err) {
    console.error("Falha ao processar backup:", err);
    alert("Importação cancelada (arquivo corrompido).");
  } finally {
    if (hasSession) {
      sessionStorage.removeItem("__pendingImport__"); // limpa a flag
    }
  }
})();


/* Botão Voltar → decide se volta à lista de assuntos, trilha ou menu */
backBtn.onclick = () => {
  if(currentExam){
    if(trailReturn){
      const d=trailReturn;
      currentExam=null;
      trailReturn=null;
      trailReturnSub=false;
      showTrail(d);
    }else{
      currentExam=null;
      showExamMenu();
    }
    return;
  }
  if(examListOpen){
    if(currentExamMode){
      showExamMenu();
    } else {
      examListOpen=false;
      showMenu();
    }
    return;
  }
  if(trailReturn){
    if(currentSub){
      if(trailReturnSub){
        const d = trailReturn;
        trailReturn = null;
        trailReturnSub = false;
        showTrail(d);
      } else {
        showSubjects(currentDisc);
      }
    } else {
      const d = trailReturn;
      trailReturn = null;
      trailReturnSub = false;
      showTrail(d);
    }
  }else if(starReturn){
    starReturn = false;
    trailReturnSub = false;
    showMenu();
  }else if(currentSub){
    showSubjects(currentDisc);
  }else{
    showMenu();
  }
};

// ─────────────────────────────────────────────────────────────────
// POMODORO RESILIENTE A RELOAD (COM CORREÇÃO DE LABEL PAUSE/RESUME)
// ─────────────────────────────────────────────────────────────────

// Estado global
let pomodoroInterval  = null;
let pomodoroRemaining = 0;
let pomodoroPaused    = false;

// 1) Persistência de estado
function savePomodoroState({ endTimestamp = null, paused = false, remaining = 0 }) {
  if (endTimestamp !== null) localStorage.setItem('pomodoro_end', endTimestamp);
  else                      localStorage.removeItem('pomodoro_end');
  localStorage.setItem('pomodoro_paused', paused ? '1' : '0');
  localStorage.setItem('pomodoro_remain', remaining);
}
function loadPomodoroState() {
  return {
    end:       parseInt(localStorage.getItem('pomodoro_end')    || '0', 10),
    paused:    localStorage.getItem('pomodoro_paused') === '1',
    remaining: parseInt(localStorage.getItem('pomodoro_remain') || '0', 10),
  };
}
function clearPomodoroState() {
  localStorage.removeItem('pomodoro_end');
  localStorage.removeItem('pomodoro_paused');
  localStorage.removeItem('pomodoro_remain');
}

// 2) Formatação MM:SS
function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

// 3) Helper para (re)iniciar o setInterval
function runInterval() {
  const btn = document.getElementById('pomodoroBtn');
  if (pomodoroInterval) clearInterval(pomodoroInterval);
  pomodoroInterval = setInterval(() => {
    if (!pomodoroPaused) {
      pomodoroRemaining--;
      btn.textContent = formatTime(pomodoroRemaining);
      if (pomodoroRemaining <= 0) {
        clearInterval(pomodoroInterval);
        alert('⏰ Pomodoro concluído!');
        stopPomodoro();
      }
    }
  }, 1000);
}

// 4) Injeção do botão no header
function ensurePomodoroUI() {
  const headerEl = document.getElementById('header');
  if (!headerEl || document.getElementById('pomodoroBtn')) return;
  const btn = document.createElement('button');
  btn.id          = 'pomodoroBtn';
  btn.textContent = '🍅';
  btn.onclick     = onPomodoroClick;
  headerEl.appendChild(btn);
}

// 5) Setup do modal (HTML pré-existente)
function setupPomodoroModal() {
  const modal = document.getElementById('pomodoroModal');
  if (!modal) return;
  // fechar clicando fora
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
  });
  // opções fixas
  modal.querySelectorAll('#pomodoroOptions button[data-min]')
       .forEach(b => b.onclick = () => {
         startPomodoro(parseInt(b.dataset.min, 10));
         modal.style.display = 'none';
       });
  // personalizado
  modal.querySelector('#customBtn').onclick = () => {
    modal.querySelector('#pomodoroOptions').style.display = 'none';
    modal.querySelector('#customInput').style.display    = 'block';
  };
  modal.querySelector('#startCustomBtn').onclick = () => {
    const val = parseInt(modal.querySelector('#customMinutes').value, 10);
    if (val > 0) startPomodoro(val);
    modal.style.display = 'none';
  };
  // controles
  modal.querySelector('#pauseResumeBtn').onclick = () => {
    pauseResumePomodoro();
    modal.style.display = 'none';
  };
  modal.querySelector('#stopBtn').onclick = () => {
    stopPomodoro();
    modal.style.display = 'none';
  };
}

// 6) Abre o modal — atualizando o label corretamente
function onPomodoroClick() {
  const modal  = document.getElementById('pomodoroModal');
  const opts   = modal.querySelector('#pomodoroOptions');
  const custom = modal.querySelector('#customInput');
  const ctrls  = modal.querySelector('#pomodoroControls');
  const pauseBtn = modal.querySelector('#pauseResumeBtn');

  // atualiza o texto do botão de acordo com o estado
  pauseBtn.textContent = pomodoroPaused ? 'Retomar' : 'Pausar';

  if (pomodoroInterval || pomodoroPaused) {
    opts.style.display   = 'none';
    custom.style.display = 'none';
    ctrls.style.display  = 'block';
  } else {
    opts.style.display   = 'flex';
    custom.style.display = 'none';
    ctrls.style.display  = 'none';
  }
  modal.style.display = 'flex';
}

// 7) Inicia Pomodoro e salva endTimestamp
function startPomodoro(minutes) {
  stopPomodoro();
  const now          = Date.now();
  const endTimestamp = now + minutes * 60 * 1000;
  savePomodoroState({ endTimestamp, paused: false, remaining: minutes * 60 });

  pomodoroRemaining = minutes * 60;
  pomodoroPaused    = false;

  const btn = document.getElementById('pomodoroBtn');
  btn.classList.add('active');
  btn.textContent = formatTime(pomodoroRemaining);

  runInterval();
}

// 8) Pausa / Retoma e persiste estado
function pauseResumePomodoro() {
  pomodoroPaused = !pomodoroPaused;
  const pauseBtn = document.getElementById('pauseResumeBtn');
  pauseBtn.textContent = pomodoroPaused ? 'Retomar' : 'Pausar';

  if (pomodoroPaused) {
    savePomodoroState({ endTimestamp: null, paused: true, remaining: pomodoroRemaining });
  } else {
    const endTimestamp = Date.now() + pomodoroRemaining * 1000;
    savePomodoroState({ endTimestamp, paused: false, remaining: pomodoroRemaining });
    runInterval();
  }
}

// 9) Para e limpa estado
function stopPomodoro() {
  clearInterval(pomodoroInterval);
  pomodoroInterval  = null;
  pomodoroRemaining = 0;
  pomodoroPaused    = false;
  clearPomodoroState();

  const btn = document.getElementById('pomodoroBtn');
  btn.classList.remove('active');
  btn.textContent = '🍅';
}

// 10) No boot, retoma se havia Pomodoro salvo
function resumePomodoroIfNeeded() {
  const { end, paused, remaining } = loadPomodoroState();
  const btn   = document.getElementById('pomodoroBtn');
  const modal = document.getElementById('pomodoroModal');

  if (paused && remaining > 0) {
    // estava pausado
    pomodoroRemaining = remaining;
    pomodoroPaused    = true;
    btn.classList.add('active');
    btn.textContent = formatTime(remaining);
    // já atualiza o label do botão do modal
    modal.querySelector('#pauseResumeBtn').textContent = 'Retomar';

  } else if (end && end > Date.now()) {
    // ativo — calcula remaining e reinicia intervalo
    pomodoroRemaining = Math.ceil((end - Date.now()) / 1000);
    pomodoroPaused    = false;
    btn.classList.add('active');
    btn.textContent = formatTime(pomodoroRemaining);
    runInterval();

  } else if (end && end <= Date.now()) {
    // ciclo finalizado enquanto a aba estava oculta
    alert('⏰ Pomodoro concluído!');
    stopPomodoro();

  } else {
    // nada válido
    clearPomodoroState();
  }
}

// 11) Integração final
ensurePomodoroUI();
setupPomodoroModal();
resumePomodoroIfNeeded();
// …e então chame showMenu()
// Garante que, sempre que a aba ficar visível de novo,
// o estado do Pomodoro seja recalculado e o timer atualizado.
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    resumePomodoroIfNeeded();
  }
});

// Cobre casos em que a janela volta a ter foco
window.addEventListener('focus', resumePomodoroIfNeeded);

/* ================================================================
   XP MODAL – Cálculo de estatísticas e gráfico semanal
   ============================================================== */
(() => {

  /* ---------- Configurações ---------- */
  const EXAM_DATE = new Date('2026-11-08T00:00:00-03:00');  // 08/11/2026

  /* ---------- Seletores ---------- */
  const xpModal      = document.getElementById('xpModal');
  const xpPrevWeek   = document.getElementById('xpPrevWeek');
  const xpNextWeek = document.getElementById('xpNextWeek');   // NOVO
  const xpPeriod     = document.getElementById('xpPeriod');
  const xpEnem       = document.getElementById('xpEnem');
  const xpSummary    = document.getElementById('xpSummary');
  const xpChartElm   = document.getElementById('xpChart');
  // >>> acrescente aqui <<<
  const arcanoImg = document.querySelector('.intro-img');
  const introLeft = document.querySelector('.intro-left');

  /* ---------- Utilidades de data ---------- */
  const DAY_MS = 24*60*60*1000;

  function mondayOf(date){
    const d = new Date(date);
    d.setHours(0,0,0,0);
    const diff = (d.getDay()+6) % 7; // 0=Seg,6=Dom
    return new Date(d.getTime() - diff*DAY_MS);
  }
  function fmt(d){ return d.toLocaleDateString('pt-BR'); }

  /* ---------- Contador de XP por data ---------- */
  function countXpOn(dateStr){
    let n = 0;
    for(let i=0;i<localStorage.length;i++){
      const k = localStorage.key(i);
      if(k.startsWith(`log_${dateStr}_`)) n++;
    }
    return n;
  }

  /* ---------- Dados para a semana desejada ---------- */
  function getWeekData(monday){
    const labels = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];
    const counts = [];
    for(let i=0;i<7;i++){
      const d = new Date(monday.getTime() + i*DAY_MS);
      const dStr = d.toLocaleDateString('en-CA',{timeZone:'America/Fortaleza'});
      counts.push( countXpOn(dStr) );
    }
    return { labels, counts };
  }

  /* ---------- Média móvel dos últimos 7 dias ---------- */
  function last7DaysAvg(){
    let sum=0;
    const today = getTodayDateBR();
    for(let i=0;i<7;i++){
      const d = new Date(today.getTime() - i*DAY_MS);
      const dStr = d.toLocaleDateString('en-CA',{timeZone:'America/Fortaleza'});
      sum += countXpOn(dStr);
    }
    return sum/7;
  }

  /* ---------- Gráfico ---------- */
  let chart = null;
  function drawChart(labels, counts){
    if (chart) chart.destroy();

    if (typeof Chart === 'undefined') {
      console.warn('Chart.js não carregado – gráfico indisponível');
      return;
    }

    chart = new Chart(xpChartElm, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data: counts,
          backgroundColor: '#7D828C',
          borderWidth: 1,
          borderRadius: 3
        }]
      },
      options: {
        maintainAspectRatio: false,
        animation: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 5 },
            grid: {
              color: '#30363d'          // cor das linhas horizontais
            },
            /* ─── aqui está o que remove a linha vertical ─── */
            border: {
              display: false            // oculta a borda do eixo y
              // (se quisesse só “apagar” a cor, poderia usar borderColor:'transparent')
            }
          },
          x: {
            ticks: {
              // ───── aqui está o “bold” que funciona ─────
              font: {
                size: 11,        // qualquer tamanho >0
                weight: 'bold',  // ou 700
                // family: 'Arial', style:'normal'  // (opcionais)
              },
              color: '#8b949e',   // se quiser trocar a cor
            },
            grid: { display: false },
            border: { display: false },  // (opcional) tira a borda do eixo x também
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#232323',   // cor do balão
            borderWidth: 1,
            cornerRadius: 6,
            caretSize: 1,
            displayColors: false,         // já está no seu código
            padding: 2,
            bodyAlign: 'center',
            callbacks: {
              /* ⬇️ Aqui trocamos “XP” por qualquer coisa: */
              title: () => '',
              label: ctx => [`+${ctx.parsed.y} XP`],   // mude ⭐ por ✨, 🎯, 🔥, etc.
            }
          }
        }
      }
    });
  }

  /* ---------- Renderização completa do modal ---------- */
  let currentMonday = mondayOf(new Date());   // começa na semana atual

  function refreshModal(){
    const {labels, counts} = getWeekData(currentMonday);
    drawChart(labels, counts);

    const weekStart = fmt(currentMonday);
    const weekEnd   = fmt(new Date(currentMonday.getTime()+6*DAY_MS));
    xpPeriod.textContent = `${weekStart}-${weekEnd} |`;

    const today = getTodayDateBR();
    const diasProva = Math.ceil( (EXAM_DATE - today) / DAY_MS );
    xpEnem.textContent = `ENEM: ${diasProva} dias`;

    const totalSemana = counts.reduce((a,b)=>a+b,0);
    const restantes   = getTotalQuestionsCount() - getTotalXPCount();
    const media7      = last7DaysAvg();
    const previsao    = media7>0 ? Math.ceil(restantes / media7) : '∞';
    xpSummary.textContent = `Total Semanal: ${totalSemana}XP | Previsão: ${previsao} dias`;
  }

  /* ---------- Navegação de semana ---------- */
  xpPrevWeek.onclick = () => {
    currentMonday = new Date(currentMonday.getTime() - 7*DAY_MS);
    refreshModal();
  };
  xpNextWeek.onclick = () => {
    /* só avança se NÃO for a semana atual */
    const todayMonday = mondayOf(new Date());
    if (currentMonday.getTime() + 7*DAY_MS > todayMonday.getTime()) return;

    currentMonday = new Date(currentMonday.getTime() + 7*DAY_MS);
    refreshModal();
  };

/* ---------- Atalho no “🔮 Hoje” ---------- */
  function bindXpTrigger () {
    const btn = document.getElementById('xp-hoje');
    if (!btn) return;               // não está na tela? sai.

    btn.style.cursor = 'pointer';
    btn.title        = 'Clique para ver / ocultar gráfico semanal';

    /* zera qualquer handler antigo */
    btn.onclick = null;

    btn.onclick = () => {
      /* <<< captura o elemento atualizado do menu >>> */
      const introLeft = document.querySelector('.intro-left');
      if (!introLeft) return;       // (não deveria acontecer)

      const aberto = xpModal.style.display === 'flex';

      if (aberto) {
        xpModal.style.display = 'none';
      } else {
        /* ancora o modal no menu recém-renderizado */
        introLeft.appendChild(xpModal);
        currentMonday = mondayOf(new Date());
        refreshModal();
        xpModal.style.display = 'flex';
      }
    };
  }

  /* deixa a função acessível fora do IIFE */
  window.bindXpTrigger = bindXpTrigger;

  bindXpTrigger();
  setTimeout(bindXpTrigger);   // reforço pós-showMenu()

  /* ====== habilita / desabilita o visual exclusivo da Home ====== */
  window.enterHome = function () { document.body.classList.add('home'); };
  window.leaveHome = function () { document.body.classList.remove('home'); };

})(); /* Fecha o IIFE do XP Modal */

/* ================================================================
   8. BOOT (primeira renderização)
   ============================================================== */
updateD1Btn();
migratePastTrailToAgenda();
showMenu(); // Render inicial da aplicação
