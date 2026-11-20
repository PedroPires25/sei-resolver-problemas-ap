// Página de configuração (config_url). A Inven!RA lê os campos com os nomes dos json_params.
const { listarFichas, listarPublicos } = require('./catalogo');

function paginaConfiguracao() {
  const fichas = listarFichas().map(f =>
    `<label><input type="checkbox" class="ficha" value="${f.id}" checked> ${f.titulo}</label><br>`).join('\n      ');
  const publicos = listarPublicos().map(p => `<option value="${p.id}">${p.nome}</option>`).join('');
  return `<!DOCTYPE html>
<html lang="pt">
<head><meta charset="utf-8"><title>Configuração - Sei como resolver problemas técnicos</title>
<style>body{font-family:Arial,sans-serif;max-width:560px;margin:24px}fieldset{margin-bottom:16px}label{line-height:1.8}</style></head>
<body>
  <h2>Sei como resolver problemas técnicos</h2>
  <fieldset><legend>Fichas a realizar</legend>
      ${fichas}
  </fieldset>
  <fieldset><legend>Público</legend>
    <select id="publico" name="publico">${publicos}</select>
  </fieldset>
  <fieldset><legend>Contacto da equipa de TIC</legend>
    <input type="text" id="contacto_tic" name="contacto_tic" size="40" placeholder="Sala ou email da equipa de TIC">
  </fieldset>
  <!-- Campo lido pela Inven!RA: identificadores das fichas separados por vírgula -->
  <input type="hidden" id="fichas" name="fichas">
  <script>
    function atualizarFichas() {
      document.getElementById('fichas').value =
        Array.from(document.querySelectorAll('.ficha:checked')).map(c => c.value).join(',');
    }
    document.querySelectorAll('.ficha').forEach(c => c.addEventListener('change', atualizarFichas));
    atualizarFichas();
  </script>
</body>
</html>`;
}

module.exports = { paginaConfiguracao };
