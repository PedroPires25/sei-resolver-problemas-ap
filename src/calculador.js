// Calculador de Analíticas: nesta fase devolve dados de exemplo.
// Mais tarde passa a ler os percursos no Registo de Percurso (listarPercursos).
const { listarFichas } = require('./catalogo');

const EXEMPLO = [
  { stdID: '1001', acedeu: true, concluidas: ['palavra_passe'], erradas: 2, pediuAjuda: true, tentativas: 2 },
  { stdID: '1002', acedeu: true, concluidas: ['palavra_passe', 'ecra_azul'], erradas: 0, pediuAjuda: false, tentativas: 0 },
  { stdID: '1003', acedeu: false, concluidas: [], erradas: 0, pediuAjuda: false, tentativas: 0 },
];

// Devolve valores por participante, sem saber nada do formato da Inven!RA.
function calcular(activityID) {
  return EXEMPLO.map(p => ({
    stdID: p.stdID,
    acedeu: p.acedeu,
    fichas: listarFichas().map(f => ({ analitica: f.analitica, concluida: p.concluidas.includes(f.id) })),
    respostasErradas: p.erradas,
    pediuAjuda: p.pediuAjuda,
    tentativasAntesAjuda: p.tentativas,
  }));
}

module.exports = { calcular };
