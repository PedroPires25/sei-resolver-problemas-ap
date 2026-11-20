// Gestor de Instâncias: cria e confirma instâncias (em memória nesta fase).
const instancias = new Map();

function criarInstancia(activityID) {
  if (!instancias.has(activityID)) instancias.set(activityID, { activityID, criadaEm: new Date().toISOString() });
  return instancias.get(activityID);
}

function validarInstancia(activityID) { return instancias.has(activityID); }

module.exports = { criarInstancia, validarInstancia };
