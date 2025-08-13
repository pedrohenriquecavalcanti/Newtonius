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
  'Linguagens': "d1",
  'Geografia e Sociologia': "d1",
  'História e Filosofia': "d1",
  'Redação': "d1",
};
const discColors = {
  Biologia: "var(--c-bio)",
  Química:  "var(--c-qui)",
  Física:   "var(--c-fis)",
  Matemática: "var(--c-mat)",
  'Linguagens': "var(--c-d1)",
  'Geografia e Sociologia': "var(--c-d1)",
  'História e Filosofia': "var(--c-d1)",
  'Redação': "var(--c-d1)"
};

// Valor especial usado para representar a disciplina inteira
const ALL_SUB = '__all__';

const D1_DISCIPLINES = ['Linguagens','História e Filosofia','Geografia e Sociologia','Redação'];

const DISCIPLINES_BY_MODE = {
  lin: ['Linguagens', 'Redação'],
  hum: ['Geografia e Sociologia', 'História e Filosofia'],
  nat: ['Biologia', 'Química', 'Física'],
  mat: ['Matemática']
};

let d1Enabled = JSON.parse(localStorage.getItem('d1Enabled') || 'false');

// Data prevista do exame no fuso de Brasília (-03)
const EXAM_DATE = new Date('2025-11-09T00:00:00-03:00');

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
const closeBtn     = document.getElementById("closePdfBtn");
const imgContainer = document.getElementById("imgPreviewContainer");
const closeImgBtn  = document.getElementById("closeImgBtn");
const previewImg   = document.getElementById("imgPreview");
const summaryContainer = document.getElementById("summaryContainer");
const summaryFrame     = document.getElementById("summaryFrame");

const settingsBtn   = document.getElementById("settingsBtn");
const settingsMenu  = document.getElementById("settingsMenu");
const exportBtn     = document.getElementById("exportBtn");
const importBtn     = document.getElementById("importBtn");
const trilhaBtn     = document.getElementById("trilhaBtn");
const examsBtn     = document.getElementById("examsBtn");
const pickerModal   = document.getElementById("subjectPickerModal");
const pickerDisc    = document.getElementById("pickerDisc");
const pickerSub     = document.getElementById("pickerSub");
const pickerExamMode= document.getElementById("pickerExamMode");
const pickerExam    = document.getElementById("pickerExam");
const pickerComment = document.getElementById("pickerComment");
const pickerAdd     = document.getElementById("pickerAdd");
const pickerMicro   = document.getElementById("pickerMicro");
const pickerCancel  = document.getElementById("pickerCancel");
const orderHint     = document.getElementById("orderHint");
const toggleD1Btn   = document.getElementById("toggleD1Btn");

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

/* Constrói a estrutura { Disciplina → Assunto → [Questões] }        */
const questoesData = buildBancoQuestoes([
  ...(window.listaQuestoes || []),
  ...(window.listaQuestoesD1 || [])
]);
const { map: examsDataLin, order: examOrderLin } = buildExamMap([
  ...(window.listaQuestoes || []),
  ...(window.listaQuestoesD1 || [])
], 'lin');
const { map: examsDataHum, order: examOrderHum } = buildExamMap([
  ...(window.listaQuestoes || []),
  ...(window.listaQuestoesD1 || [])
], 'hum');
const { map: examsDataNat, order: examOrderNat } = buildExamMap([
  ...(window.listaQuestoes || []),
  ...(window.listaQuestoesD1 || [])
], 'nat');
const { map: examsDataMat, order: examOrderMat } = buildExamMap([
  ...(window.listaQuestoes || []),
  ...(window.listaQuestoesD1 || [])
], 'mat');

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

function buildExamMap(list, mode='nat'){
  const exams = {};
  const order = [];
  const allowed = new Set(DISCIPLINES_BY_MODE[mode] || []);
  list.forEach(item => {
    const m = item.label.match(/^(.*)-Q-(\d+)/);
    if (!m || (allowed.size && !allowed.has(item.Disciplina))) return;
    const exam = m[1];
    if (!exams[exam]) {
      exams[exam] = [];
      order.push(exam);
    }
    exams[exam].push({
      disc: item.Disciplina,
      sub: item.Assunto,
      q: {
        label: item.label,
        QPDFName: item.QPDFName,
        page: item.page,
        GPDFName: item.GPDFName,
        gabaritoPage: item.gabaritoPage,
        gabaritoAnswer: item.gabaritoAnswer
      }
    });
  });
  for (const ex of order) {
    exams[ex].sort((a,b)=>{
      const na = parseInt(a.q.label.match(/Q-(\d+)/)[1],10);
      const nb = parseInt(b.q.label.match(/Q-(\d+)/)[1],10);
      return na-nb;
    });
  }
  if(mode === 'lin' || mode === 'hum'){
    const typePriority = { REG:1, PPL:2, DIG:3 };
    order.sort((a,b)=>{
      const pa=a.split('-');
      const pb=b.split('-');
      const bancaA=pa[0].toLowerCase();
      const bancaB=pb[0].toLowerCase();
      if(bancaA!==bancaB) return bancaA.localeCompare(bancaB);
      const yearA=parseInt(pa[1],10);
      const yearB=parseInt(pb[1],10);
      if(yearA!==yearB) return yearA-yearB;
      if(bancaA==='enem'){
        const ta=pa[2]||'';
        const tb=pb[2]||'';
        const va=typePriority[ta]||99;
        const vb=typePriority[tb]||99;
        if(va!==vb) return va-vb;
      }
      const restA=pa.slice(2).join('-');
      const restB=pb.slice(2).join('-');
      const na=parseInt(restA,10);
      const nb=parseInt(restB,10);
      if(!isNaN(na) && !isNaN(nb)) return na-nb;
      return restA.localeCompare(restB);
    });
  }
  return { map: exams, order };
}

function getExamCategory(disc){
  if (DISCIPLINES_BY_MODE.lin.includes(disc)) return 'Lin';
  if (DISCIPLINES_BY_MODE.hum.includes(disc)) return 'Hum';
  if (DISCIPLINES_BY_MODE.nat.includes(disc)) return 'Nat';
  if (DISCIPLINES_BY_MODE.mat.includes(disc)) return 'Mat';
  return null;
}
async function doExport() {
  /* 1 ▸ lê tudo do localStorage e joga num array  [key,value] */
  const pares = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
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
  const filename = `Newtonius_${stamp}.json`;

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
function exportData() {

  /* 1 ▸ força o iframe a descarregar para salvar o resumo */
  if (summaryContainer.style.display !== "none") {
    summaryFrame.src = "about:blank";      // dispara o unload do editor
  }

  /* 2 ▸ já estamos de volta do reload? */
  if (typeof sessionStorage !== 'undefined' &&
      sessionStorage.getItem("__exportReady__") === "yes") {
    sessionStorage.removeItem("__exportReady__");
    doExport();                            // faz o download
    return;
  }

  /* 3 ▸ primeira chamada: marca a flag, recarrega a página */
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem("__exportReady__","yes");
    location.reload();                     // equivale ao F5
  }
}

  /* ================================================================
   (NOVO) Gera a chave estável de uma questão
   ============================================================== */
function qKey(disc, sub, label) {
  return `${disc}_${sub}_${encodeURIComponent(label)}`;
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

// Calcula automaticamente a estrela de um assunto
function calcStarState(disc, sub) {
  const qs = questoesData[disc][sub] || [];
  let correct = 0, answered = 0;
  qs.forEach(q => {
    const st = +localStorage.getItem(qKey(disc, sub, q.label)) || 0;
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
if (typeof sessionStorage !== 'undefined' &&
    sessionStorage.getItem("__exportReady__") === "yes") {
  exportData();            // cai direto no ramo que baixa o arquivo
}
/* ---------------- MENU PRINCIPAL ---------------- */
function showMenu () {
  examListOpen=false;
  currentExam=null;
  /* 1 ▸ devolve o xpModal para <body> antes que clear() o remova        */
  const xpModalEl = document.getElementById('xpModal');
  if (xpModalEl && xpModalEl.parentElement !== document.body) {
    document.body.appendChild(xpModalEl);   // salva o modal
  }

  /* 2 ▸ layout padrão */
  currentDisc = currentSub = null;
  trailReturnSub = false;
  summaryBtn.style.display = 'none';
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
  if(d1Enabled) discList.push(...D1_DISCIPLINES);
  for (const disc of discList) {
    const line = lines.appendChild(Object.assign(
      document.createElement("div"), { className: "disc-line" }));
    const btn = Object.assign(
      document.createElement("button"), {
        className: `disc-btn ${discClasses[disc]}`,
        textContent: disc,
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

// Abre/fecha ao clicar na engrenagem
settingsBtn.onclick = e => {
  e.stopPropagation();   // evita fechar imediatamente
  settingsMenu.style.display =
    settingsMenu.style.display === "flex" ? "none" : "flex";
};

// Fecha se clicar fora do menu
document.addEventListener("click", e=>{
  if(!settingsMenu.contains(e.target) && e.target!==settingsBtn){
    settingsMenu.style.display = "none";
  }
});

function toggleSettingsVisibility(showHome){
  settingsBtn.style.display  = showHome ? 'block' : 'none';
  /* se saiu da home, fecha o menu para não ficar solto */
  if (!showHome) settingsMenu.style.display = 'none';
}

exportBtn.onclick = () => {
  settingsMenu.style.display = "none";
  exportData();
};
importBtn.onclick = () => {
  settingsMenu.style.display = "none";
  importFile.click();
};

/* ---------------- TRILHA ESTRATÉGICA ---------------- */
trilhaBtn.onclick = () => {
  settingsMenu.style.display = 'none';
  showTrail();
};

examsBtn.onclick = () => {
  settingsMenu.style.display = "none";
  showExamMenu();
};

function updateD1Btn(){
  toggleD1Btn.textContent = d1Enabled ? 'Esconder - D1' : 'Exibir - D1';
}

toggleD1Btn.onclick = () => {
  d1Enabled = !d1Enabled;
  localStorage.setItem('d1Enabled', JSON.stringify(d1Enabled));
  settingsMenu.style.display = 'none';
  updateD1Btn();
  if(currentDisc === null) showMenu();
};


function loadTrail(dayStr){
  const raw = localStorage.getItem(`trail_${dayStr}`);
  return raw ? JSON.parse(raw) : { novo: [] };
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

function openPicker(callback){
  pickerDisc.innerHTML = '';
  pickerSub.innerHTML  = '';
  pickerExamMode.innerHTML='';
  pickerExam.innerHTML='';
  pickerExamMode.style.display='none';
  pickerExam.style.display='none';
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
  const optComment=document.createElement('option');
  optComment.value='__comment__';
  optComment.textContent='Comentário';
  pickerDisc.appendChild(optComment);
  pickerDisc.onchange = () => {
    if(pickerDisc.value==='__comment__'){
      pickerSub.style.display='none';
      pickerComment.style.display='inline-block';
      pickerMicro.style.display='none';
      pickerExamMode.style.display='none';
      pickerExam.style.display='none';
    }else if(pickerDisc.value==='__exams__'){
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
    }else{
      pickerSub.style.display='';
      pickerComment.style.display='none';
      pickerSub.innerHTML = '';
      const optAll=document.createElement('option');
      optAll.value=ALL_SUB;
      optAll.textContent='Disciplina Inteira';
      pickerSub.appendChild(optAll);
      SUBJECT_NAMES[pickerDisc.value].forEach((n,i)=>{
        const o=document.createElement('option');
        o.value=String(i+1).padStart(2,'0');
        o.textContent=n;
        pickerSub.appendChild(o);
      });
      pickerMicro.style.display =
        pickerDisc.value==='Matemática'? 'inline-block' : 'none';
      pickerExamMode.style.display='none';
      pickerExam.style.display='none';
    }
  };
  pickerDisc.onchange();
  pickerAdd.onclick = () => {
    if(pickerDisc.value==='__comment__'){
      const txt=pickerComment.value.trim();
      if(txt) callback({comment:txt});
      pickerComment.value='';
    }else if(pickerDisc.value==='__exams__'){
      callback({exam:pickerExam.value,mode:pickerExamMode.value});
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
    const diffDays = Math.ceil((EXAM_DATE - day)/(86400000));
    const weekDay = day.toLocaleDateString('pt-BR',{weekday:'long'});
    const dateFmt = day.toLocaleDateString('pt-BR');
    btn.innerHTML=`<span class="day-label">${weekDay} - ${dateFmt} - ${diffDays} dias</span>`+
      `<i class="day-arrow fas fa-chevron-down"></i>`;
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
            const val=txt.trim();
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

        if(s.exam){
          const subj=document.createElement('button');
          subj.className='trail-subject';
          subj.textContent=s.exam;
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
  for(let d=new Date(start);d<=EXAM_DATE;d.setDate(d.getDate()+1)){
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
        const st=+localStorage.getItem(qKey(disc,sub,q.label))||0;
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
    ...examOrderLin,
    ...examOrderHum,
    ...examOrderNat,
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
/* ---------------- LISTA DE ASSUNTOS ---------------- */
/* ---------------- PROVAS E SIMULADOS ---------------- */
function showExamMenu(){
  currentDisc=currentSub=null;
  currentExam=null;
  currentExamMode=null;
  examListOpen=true;
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
      const st=+localStorage.getItem(qKey(disc,sub,q.label))||0;
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
    topicSpan.style.color=discColors[disc];
    const m=q.label.match(/ENEM|SAS|BERNOULLI|POLIEDRO|SOMOS|EVOLUCIONAL/i);
    if(m) qBtn.classList.add(`exam-${m[0].toLowerCase()}`);
    qBtn.addEventListener('click',e=>{
      if(e.target.closest('.ms-topic')){
        currentDisc=disc;
        currentSub=sub;
        openSummary();
        e.stopPropagation();
      }else{
        openPdf(q.QPDFName,q.page);
      }
    });
    row.appendChild(qBtn);
    row.appendChild(Object.assign(document.createElement('button'),{
      textContent:'Gabarito',
      className:'small-btn',
      onclick:()=>{
        if(q.gabaritoAnswer){
          openAnswer(q.gabaritoAnswer);
        }else{
          openPdf(q.GPDFName,q.gabaritoPage);
        }
      }}));
    const key=qKey(disc,sub,q.label);
    let st=+localStorage.getItem(key)||0;
    const box=row.appendChild(Object.assign(document.createElement('span'),{className:'state-box'}));
    const paint=()=>{box.textContent=st===1?'\u2713':st===2?'\u2717':'';box.style.color=st===1?'#32cd32':st===2?'#ff0000':'#f0f0f0';};
    paint();
    box.onclick=()=>{st=(st+1)%3;localStorage.setItem(key,st);const today=getTodayStr();const logKey=`log_${today}_${key}`;if(!D1_DISCIPLINES.includes(disc)){if(st===1||st===2){localStorage.setItem(logKey,'1');}else{localStorage.removeItem(logKey);}}paint();refresh();};
    const cKey=`comment_${key}`;
    const editDiv=document.createElement('div');
    editDiv.className='comment-edit';
    editDiv.contentEditable='true';
    editDiv.dataset.ph='';
    editDiv.addEventListener('click',function(e){if(e.button!==0)return;const anchor=e.target.closest('a');if(anchor){e.preventDefault();if(isImageUrl(anchor.href))openImage(anchor.href);else window.open(anchor.href,'_blank','noopener');return;}if(!editDiv.classList.contains('expanded')){editDiv.focus();}});
    editDiv.innerHTML=localStorage.getItem(cKey)||'';
    editDiv.addEventListener('paste',e=>{e.preventDefault();const plain=e.clipboardData.getData('text/plain');const sel=window.getSelection();if(!sel.rangeCount)return;const range=sel.getRangeAt(0);range.deleteContents();range.insertNode(document.createTextNode(plain));range.collapse(false);sel.removeAllRanges();sel.addRange(range);});
    editDiv.addEventListener('input',()=>{if(editDiv.classList.contains('expanded')){fitHeight(editDiv);}});
    editDiv.addEventListener('focus',()=>{editDiv.classList.add('expanded');editDiv.style.whiteSpace='pre-wrap';editDiv.style.overflowY='auto';fitHeight(editDiv);});
    editDiv.addEventListener('blur',()=>{if(editDiv.textContent.trim()===''){editDiv.innerHTML='';localStorage.removeItem(cKey);}editDiv.classList.remove('expanded');editDiv.style.maxHeight='38px';editDiv.style.whiteSpace='nowrap';editDiv.style.textOverflow='ellipsis';editDiv.style.overflow='hidden';editDiv.scrollTop=0;atualizaIndicadorOverflow(editDiv);});
    editDiv.addEventListener('contextmenu',e=>{e.preventDefault();openLinkMenu(e,editDiv);});
    editDiv.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;if(editDiv.matches(':focus')){openLinkMenu(e,editDiv);}else{e.preventDefault();if(isImageUrl(a.href)){openImage(a.href);}else{window.open(a.href,'_blank','noopener');}}});
    editDiv.addEventListener('input',()=>{localStorage.setItem(cKey,editDiv.innerHTML);});
    row.appendChild(editDiv);
  });
}
function showSubjects(disc) {
  currentDisc = disc;
  currentSub  = null;
  trailReturnSub = false;
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
        const st = +localStorage.getItem(qKey(disc, sub, q.label)) || 0;
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
      const st = +localStorage.getItem(qKey(disc, sub, q.label)) || 0;
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
      const st = +localStorage.getItem(qKey(disc, sub, q.label)) || 0;
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
  questoesData[disc][sub].forEach((q, idx) => {
    const row = app.appendChild(Object.assign(
      document.createElement("div"), { className:"question-row" }));

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

    /* Botão gabarito */
    row.appendChild(Object.assign(
      document.createElement("button"), {
        textContent:"Gabarito",
        className:"small-btn",
        onclick: () => {
          if(q.gabaritoAnswer){
            openAnswer(q.gabaritoAnswer);
          } else {
            openPdf(q.GPDFName, q.gabaritoPage);
          }
        }
      }));

    /* Caixa ✓ / ✗ */
    const key    = qKey(disc, sub, q.label);          // estado ✓/✗
    let st    = +localStorage.getItem(key) || 0;
    const box = row.appendChild(Object.assign(
      document.createElement("span"), { className:"state-box" }));

    const paint = () => {
      box.textContent = st===1 ? "✓" : st===2 ? "✗" : "";
      box.style.color= st===1 ? "#32cd32" : st===2 ? "#ff0000" : "#f0f0f0";
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
/** Abre/Renderiza um PDF no modal. */
async function openPdf(pdfName, pages, quality=2, zoom=1.75) {
  const pageList = Array.isArray(pages) ? pages : [pages];
  pdfContainer.style.display = "flex";
  pdfContainer.querySelectorAll("canvas, .answer-letter").forEach(el=>el.remove());

  if (!window.pdfjsLib) {
    alert('Visualização de PDF indisponível.');
    return;
  }
  let pdf;
  try {
    pdf = await pdfjsLib.getDocument(`PDFs/${pdfName}`).promise;
  } catch (err) {
    try {
      pdf = await pdfjsLib.getDocument(`PDFsD1/${pdfName}`).promise;
    } catch (err2) {
      alert('PDF não encontrado.');
      return;
    }
  }
  const dpr   = window.devicePixelRatio || 1;
  const scale = quality * dpr * zoom;

  for (const num of pageList) {
    const page     = await pdf.getPage(num);
    const viewport = page.getViewport({ scale });
    const canvas   = Object.assign(document.createElement("canvas"), {
      width: viewport.width, height: viewport.height,
      style: `width:${viewport.width/(quality*dpr)}px;
              height:${viewport.height/(quality*dpr)}px;
              margin:16px 0;max-width:100%`
    });
    pdfContainer.appendChild(canvas);
    await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
  }
}

function openAnswer(answer){
  pdfContainer.style.display = 'flex';
  pdfContainer.querySelectorAll('canvas, .answer-letter').forEach(el=>el.remove());
  const div = Object.assign(document.createElement('div'),{
    className:'answer-letter',
    textContent: `Gabarito: ${answer}`
  });
  div.style.cssText = 'font-size:48px;color:#fff;margin:40px;text-align:center;';
  pdfContainer.appendChild(div);
}
closeBtn.onclick = () => {
  pdfContainer.style.display = "none";
  pdfContainer.querySelectorAll("canvas, .answer-letter").forEach(el=>el.remove());
};

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

  let micro = [];
  if(entry && Array.isArray(entry.qs)) {
    micro = entry.qs;
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
  }
  if(micro.length===0){
    app.textContent = 'Todas as questões de Matemática foram concluídas.';
    return;
  }
  const questions = micro.map(({sub,label}) => {
    const q = questoesData['Matemática'][sub].find(x => x.label===label);
    return q? {disc:'Matemática', sub, q}: null;
  }).filter(Boolean);

  const statDiv = document.getElementById('headerStats');
  function refreshStats(){
    let c=0,a=0;
    questions.forEach(({disc,sub,q})=>{
      const st = +localStorage.getItem(qKey(disc,sub,q.label)) || 0;
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
    qBtn.querySelector('.ms-topic').style.color = discColors[disc];
    const m = q.label.match(/ENEM|SAS|BERNOULLI|POLIEDRO|SOMOS|EVOLUCIONAL/i);
    if(m){
      const exam = m[0].toLowerCase();
      qBtn.classList.add(`exam-${exam}`);
    }
    qBtn.onclick = () => openPdf(q.QPDFName, q.page);
    row.appendChild(qBtn);

    row.appendChild(Object.assign(
      document.createElement('button'),{
        textContent:'Gabarito',
        className:'small-btn',
        onclick:()=>{
          if(q.gabaritoAnswer){
            openAnswer(q.gabaritoAnswer);
          }else{
            openPdf(q.GPDFName,q.gabaritoPage);
          }
        }}));

    const key = qKey(disc,sub,q.label);
    let st = +localStorage.getItem(key)||0;
    const box = row.appendChild(Object.assign(
      document.createElement('span'),{className:'state-box'}));
    const paint=()=>{
      box.textContent=st===1?'✓':st===2?'✗':'';
      box.style.color=st===1?'#32cd32':st===2?'#ff0000':'#f0f0f0';
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
    editDiv.addEventListener('paste',e=>{
      e.preventDefault();
      const plain=e.clipboardData.getData('text/plain');
      const sel=window.getSelection();
      if(!sel.rangeCount) return;
      const range=sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(plain));
      range.collapse(false); sel.removeAllRanges(); sel.addRange(range);
    });
    editDiv.addEventListener('input',()=>{ if(editDiv.classList.contains('expanded')) fitHeight(editDiv); });
    editDiv.addEventListener('focus',()=>{ editDiv.classList.add('expanded'); editDiv.style.whiteSpace='pre-wrap'; editDiv.style.overflowY='auto'; fitHeight(editDiv); });
    editDiv.addEventListener('blur',()=>{ if(editDiv.textContent.trim()===''){ editDiv.innerHTML=''; localStorage.removeItem(cKey); } editDiv.classList.remove('expanded'); editDiv.style.maxHeight='38px'; editDiv.style.whiteSpace='nowrap'; editDiv.style.textOverflow='ellipsis'; editDiv.style.overflow='hidden'; editDiv.scrollTop=0; atualizaIndicadorOverflow(editDiv); });
    editDiv.addEventListener('contextmenu',e=>{ e.preventDefault(); openLinkMenu(e,editDiv); });
    editDiv.addEventListener('click',e=>{ const a=e.target.closest('a'); if(!a) return; if(editDiv.matches(':focus')){ openLinkMenu(e,editDiv); }else{ e.preventDefault(); if(isImageUrl(a.href)) openImage(a.href); else window.open(a.href,'_blank','noopener'); } });
    const save=()=>{ localStorage.setItem(cKey,editDiv.innerHTML); };
    editDiv.addEventListener('input',save);
    row.appendChild(editDiv);
    atualizaIndicadorOverflow(editDiv);
  });

  document.querySelectorAll('.comment-edit').forEach(div=>div.blur());
  if(document.activeElement && document.activeElement.classList.contains('comment-edit')){
    document.activeElement.blur();
  }
}

function openSummary(){                      // usa a disciplina/assunto atuais
  const d = encodeURIComponent(currentDisc);
  const s = encodeURIComponent(currentSub);
  summaryFrame.src = `Editor_de_Texto.html?disc=${d}&sub=${s}`;   // carrega o resumo certo
  summaryContainer.style.display = "flex";
}
function openDisciplineSummary(disc){        // resumo geral da disciplina
  const d = encodeURIComponent(disc);
  summaryFrame.src = `Editor_de_Texto.html?disc=${d}&sub=00`;
  summaryContainer.style.display = "flex";
}
function closeSummary(){ summaryContainer.style.display = "none"; }
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
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    // guarda o JSON bruto em sessionStorage
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem("__pendingImport__", e.target.result);
    }

    // libera espaço no localStorage para a próxima carga
    localStorage.clear();

    // recarrega a página; o passo 2 roda no boot
    location.reload();
  };
  reader.readAsText(file);
});

/* 2 ───── Restauração automática logo no início do JS principal ───── */
(() => {
  const raw = (typeof sessionStorage !== 'undefined')
    ? sessionStorage.getItem("__pendingImport__")
    : null;
  if (!raw) return;                           // nada pendente

  try {
    const obj = JSON.parse(raw);              // texto → objeto
    localStorage.clear();                     // garante que está limpo
    Object.entries(obj).forEach(([k, v]) => localStorage.setItem(k, v));
  } catch (err) {
    console.error("Falha ao processar backup:", err);
    alert("Importação cancelada (arquivo corrompido).");
  } finally {
    if (typeof sessionStorage !== 'undefined') {
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
  const EXAM_DATE = new Date('2025-11-09T00:00:00-03:00');  // 09/11/2025

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
