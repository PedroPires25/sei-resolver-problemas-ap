# Sei como resolver problemas técnicos

Activity Provider para a Inven!RA, desenvolvido no âmbito da unidade curricular
Arquitetura e Padrões de Software (Mestrado em Engenharia Informática e Tecnologia Web, Universidade Aberta, 2026/27).

Pedro Pires

## Sobre a atividade

A atividade tem fichas de cenário curtas sobre os problemas técnicos mais frequentes no colégio onde trabalho,
como a palavra-passe esquecida, o ecrã azul ou o projetor sem imagem. Cada ficha tem até cinco passos e termina
com o problema resolvido ou com a indicação de a quem pedir ajuda e que informação levar.

## Estado atual (Tópico 4, semana 1)

Nesta fase o Activity Provider responde, com dados de exemplo, aos cinco pedidos da Inven!RA com URL fixo:

- configuração: `GET /configuracao.html`
- parâmetros: `GET /json-params`
- deploy: `GET /deploy?activityID=...`
- lista de analíticas: `GET /lista-analytics`
- analíticas: `POST /analytics` com `{"activityID": "..."}`

O endereço principal mostra o ficheiro de registo da atividade. O "Provide activity" ainda não está implementado.

Endereço: https://sei-resolver-problemas-ap.onrender.com

Observação: No plano gratuito o serviço adormece sem uso, por isso o primeiro pedido pode demorar cerca de um minuto.

## Organização do código

Organizei os ficheiros de acordo com os componentes da arquitetura que apresentei no Tópico 3:

- `server.js` – Serviços Inven!RA, recebe os pedidos e responde no formato da especificação
- `catalogo.js` – Catálogo de Fichas
- `instancias.js` – Gestor de Instâncias
- `calculador.js` – Calculador de Analíticas (por agora com dados de exemplo)
- `config_page.js` – página de configuração

Usei Node.js sem bibliotecas externas. Para correr localmente basta `npm start` (porta 3000).
