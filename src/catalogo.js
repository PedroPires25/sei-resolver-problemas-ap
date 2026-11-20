// Catálogo de Fichas: que fichas existem e que analíticas produzem.
const FICHAS = [
  { id: 'palavra_passe', titulo: 'Palavra-passe esquecida', analitica: 'Ficha palavra-passe concluída' },
  { id: 'ecra_azul', titulo: 'Ecrã azul', analitica: 'Ficha ecrã azul concluída' },
  { id: 'projetor', titulo: 'Projetor sem imagem', analitica: 'Ficha projetor concluída' },
];

const PUBLICOS = [
  { id: '2ciclo', nome: '2.º ciclo' },
  { id: '3ciclo', nome: '3.º ciclo' },
  { id: 'secundario', nome: 'Secundário' },
  { id: 'professores', nome: 'Professores' },
];

function listarFichas() { return FICHAS; }
function listarPublicos() { return PUBLICOS; }

function listarAnaliticas() {
  return {
    qualAnalytics: [{ name: 'Percurso nas fichas', type: 'URL' }],
    quantAnalytics: [
      { name: 'Acedeu à atividade', type: 'boolean' },
      ...FICHAS.map(f => ({ name: f.analitica, type: 'boolean' })),
      { name: 'Respostas erradas', type: 'integer' },
      { name: 'Pediu ajuda à TIC', type: 'boolean' },
      { name: 'Tentativas antes de pedir ajuda', type: 'integer' },
    ],
  };
}

module.exports = { listarFichas, listarPublicos, listarAnaliticas };
