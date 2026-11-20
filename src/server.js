// Serviços Inven!RA: único ponto de contacto com a Inven!RA.
// Recebe os pedidos, pede aos outros componentes o que precisa e responde no formato da especificação.
const http = require('http');
const { URL } = require('url');
const catalogo = require('./catalogo');
const instancias = require('./instancias');
const calculador = require('./calculador');
const { paginaConfiguracao } = require('./config_page');

const PORT = process.env.PORT || 3000;

function baseUrl(req) {
  if (process.env.RENDER_EXTERNAL_URL) return process.env.RENDER_EXTERNAL_URL;
  const proto = req.headers['x-forwarded-proto'] || 'http';
  return `${proto}://${req.headers.host}`;
}

function enviar(res, status, corpo, tipo = 'application/json; charset=utf-8') {
  res.writeHead(status, {
    'Content-Type': tipo,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(typeof corpo === 'string' ? corpo : JSON.stringify(corpo, null, 2));
}

function lerCorpo(req) {
  return new Promise(resolve => {
    let dados = '';
    req.on('data', c => { dados += c; if (dados.length > 1e5) req.destroy(); });
    req.on('end', () => {
      if (!dados) return resolve({});
      try { return resolve(JSON.parse(dados)); } catch { /* pode vir como formulário */ }
      resolve(Object.fromEntries(new URLSearchParams(dados)));
    });
  });
}

// Converte os valores do Calculador para o formato de analytics da Inven!RA.
function formatoInvenira(activityID, resultados, base) {
  return resultados.map(r => ({
    inveniraStdID: r.stdID,
    quantAnalytics: [
      { name: 'Acedeu à atividade', type: 'boolean', value: r.acedeu },
      ...r.fichas.map(f => ({ name: f.analitica, type: 'boolean', value: f.concluida })),
      { name: 'Respostas erradas', type: 'integer', value: r.respostasErradas },
      { name: 'Pediu ajuda à TIC', type: 'boolean', value: r.pediuAjuda },
      { name: 'Tentativas antes de pedir ajuda', type: 'integer', value: r.tentativasAntesAjuda },
    ],
    qualAnalytics: [
      { name: 'Percurso nas fichas', type: 'URL', value: `${base}/percurso/${encodeURIComponent(activityID)}/${encodeURIComponent(r.stdID)}` },
    ],
  }));
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const caminho = url.pathname.replace(/\/+$/, '') || '/';
  const base = baseUrl(req);

  if (req.method === 'OPTIONS') return enviar(res, 204, '');

  try {
    // Ficheiro de registo da atividade na Inven!RA
    if (req.method === 'GET' && (caminho === '/' || caminho === '/registo')) {
      return enviar(res, 200, {
        name: 'Sei como resolver problemas técnicos',
        config_url: `${base}/configuracao.html`,
        json_params_url: `${base}/json-params`,
        user_url: `${base}/deploy`,
        analytics_url: `${base}/analytics`,
        analytics_list_url: `${base}/lista-analytics`,
      });
    }

    // 1. Página de configuração (config_url)
    if (req.method === 'GET' && caminho === '/configuracao.html') {
      return enviar(res, 200, paginaConfiguracao(), 'text/html; charset=utf-8');
    }

    // 2. Parâmetros de configuração (json_params_url)
    if (req.method === 'GET' && caminho === '/json-params') {
      return enviar(res, 200, [
        { name: 'fichas', type: 'text/plain' },
        { name: 'publico', type: 'text/plain' },
        { name: 'contacto_tic', type: 'text/plain' },
      ]);
    }

    // 3. Deploy da atividade (user_url): recebe só o activityID
    const mDeploy = caminho.match(/^\/deploy(?:\/([^/]+))?$/);
    if (req.method === 'GET' && mDeploy) {
      const activityID = mDeploy[1] ? decodeURIComponent(mDeploy[1]) : url.searchParams.get('activityID');
      if (!activityID) return enviar(res, 400, { erro: 'Falta o activityID' });
      instancias.criarInstancia(activityID);
      return enviar(res, 200, `${base}/atividade/${encodeURIComponent(activityID)}`, 'text/plain; charset=utf-8');
    }

    // 4. Lista de analíticas (analytics_list_url)
    if (req.method === 'GET' && caminho === '/lista-analytics') {
      return enviar(res, 200, catalogo.listarAnaliticas());
    }

    // 5. Pedido de analíticas (analytics_url): POST com o activityID
    if (req.method === 'POST' && caminho === '/analytics') {
      const corpo = await lerCorpo(req);
      const activityID = corpo.activityID;
      if (!activityID) return enviar(res, 400, { erro: 'Falta o activityID' });
      return enviar(res, 200, formatoInvenira(activityID, calculador.calcular(activityID), base));
    }

    // Ainda não implementados nesta fase (Provide activity e Página de Percurso)
    if (caminho.startsWith('/atividade/') || caminho.startsWith('/percurso/')) {
      return enviar(res, 501, 'Ainda não disponível nesta fase do projeto.', 'text/plain; charset=utf-8');
    }

    return enviar(res, 404, { erro: 'Pedido não reconhecido' });
  } catch (e) {
    console.error(e);
    return enviar(res, 500, { erro: 'Erro interno' });
  }
});

server.listen(PORT, () => console.log(`Activity Provider a correr na porta ${PORT}`));
