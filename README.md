# Activity Provider «Sei como resolver problemas técnicos»

Primeira versão do Activity Provider para a Inven!RA (Tópico 4, semana 1).
Responde com dados de exemplo aos cinco pedidos com URL fixo. O «Provide activity» ainda não está implementado.

Não tem dependências externas, só precisa do Node.js 18 ou superior.

## Pedidos implementados

| Pedido | Método e URL |
|---|---|
| Ficheiro de registo | `GET /` ou `GET /registo` |
| Configuração (config_url) | `GET /configuracao.html` |
| Parâmetros (json_params_url) | `GET /json-params` |
| Deploy (user_url) | `GET /deploy?activityID=...` ou `GET /deploy/<activityID>` |
| Lista de analíticas (analytics_list_url) | `GET /lista-analytics` |
| Analíticas (analytics_url) | `POST /analytics` com `{"activityID": "..."}` |

## Organização do código (segue a arquitetura do Tópico 3)

- `src/server.js` – **Serviços Inven!RA**: recebe os pedidos e monta as respostas no formato da especificação.
- `src/catalogo.js` – **Catálogo de Fichas**: fichas, públicos e lista de analíticas.
- `src/instancias.js` – **Gestor de Instâncias**: cria as instâncias no deploy (em memória nesta fase).
- `src/calculador.js` – **Calculador de Analíticas**: por agora devolve dados de exemplo.
- `src/config_page.js` – página de configuração.

## Correr localmente

```
npm start
```

O servidor fica em http://localhost:3000. Para testar:

```
curl http://localhost:3000/json-params
curl "http://localhost:3000/deploy?activityID=teste1"
curl http://localhost:3000/lista-analytics
curl -X POST -H "Content-Type: application/json" -d '{"activityID":"teste1"}' http://localhost:3000/analytics
```

## Alojar no Render

1. Criar um repositório no GitHub com estes ficheiros.
2. No Render, New → Web Service → ligar o repositório.
3. Runtime: Node. Build command: `npm install`. Start command: `npm start`.
4. Depois do deploy, abrir `https://<nome>.onrender.com/` para ver o ficheiro de registo com os URL finais.

No plano gratuito o serviço adormece sem uso, por isso o primeiro pedido pode demorar cerca de um minuto.
