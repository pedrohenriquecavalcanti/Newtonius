/* Dados de questões ainda não classificadas por assunto */
(function(){
  const UNCLASSIFIED_SUBJECT_CODE = '__sem_assunto__';
  const rawEntries = [
    {
      labelPrefix: 'Bernoulli-2025-8-D2',
      area: 'nat',
      disciplina: 'Sem Assunto (Natureza)',
      provaPdf: 'Bernoulli_2025_8_D2.pdf',
      gabaritoPdf: 'Bernoulli_2025_8_D2_Gabarito.pdf',
      questoesPorPagina: {
        3: [91, 92, 93, 94],
        4: [95, 96],
        5: [97, 98, 99, 100],
        6: [101, 102],
        7: [103, 104, 105],
        8: [106, 107] // Completar com as demais páginas conforme catalogação
      },
      gabaritoPorPagina: {
        2: [91, 92, 93],
        3: [94, 95],
        4: [96, 97],
        5: [98, 99],
        6: [100, 101],
        7: [102, 103] // Completar com as demais páginas conforme catalogação
      }
    }
  ];

  function buildQuestionPageIndex(pagesMap){
    const index = new Map();
    Object.entries(pagesMap || {}).forEach(([page, numbers]) => {
      const pageNum = Number(page);
      if(!Number.isFinite(pageNum)) return;
      (Array.isArray(numbers) ? numbers : []).forEach(n => {
        const qn = Number(n);
        if(!Number.isFinite(qn)) return;
        if(!index.has(qn)) index.set(qn, []);
        const list = index.get(qn);
        if(!list.includes(pageNum)) list.push(pageNum);
      });
    });
    return index;
  }

  function expandRawEntries(entries){
    const expanded = [];
    entries.forEach(entry => {
      const {
        labelPrefix,
        area,
        disciplina,
        provaPdf,
        gabaritoPdf,
        questoesPorPagina,
        gabaritoPorPagina
      } = entry || {};
      const questionPages = buildQuestionPageIndex(questoesPorPagina);
      const answerPages = buildQuestionPageIndex(gabaritoPorPagina);
      questionPages.forEach((pages, questionNumber) => {
        const label = `${labelPrefix}-Q-${questionNumber}`;
        expanded.push({
          Disciplina: disciplina || null,
          Assunto: UNCLASSIFIED_SUBJECT_CODE,
          label,
          QPDFName: provaPdf,
          page: pages.sort((a,b)=>a-b),
          GPDFName: gabaritoPdf,
          gabaritoPage: (answerPages.get(questionNumber) || []).sort((a,b)=>a-b),
          area,
          unclassified: true
        });
      });
    });
    expanded.sort((a,b)=>{
      const qa = Number((a.label.match(/-Q-(\d+)/) || [])[1] || 0);
      const qb = Number((b.label.match(/-Q-(\d+)/) || [])[1] || 0);
      return qa - qb;
    });
    return expanded;
  }

  window.rawQuestoesNaoClassificadas = rawEntries;
  window.listaQuestoesNaoClassificadas = expandRawEntries(rawEntries);
})();
