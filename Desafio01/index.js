/*Crie uma aplicação para armazenar projetos e suas tarefas do zero utilizando [Express]

### Rotas

- `POST /projects`: A rota deve receber `id` e `title` dentro do corpo e cadastrar um novo projeto dentro de um array no seguinte formato:
   `{ id: "1", title: 'Novo projeto', tasks: [] }`
   Certifique-se de enviar tanto o ID quanto o título do projeto no formato string com aspas duplas.

- `GET /projects`: Rota que lista todos projetos e suas tarefas;

- `PUT /projects/:id`: A rota deve alterar apenas o título do projeto com o `id` presente nos parâmetros da rota;

- `DELETE /projects/:id`: A rota deve deletar o projeto com o `id` presente nos parâmetros da rota;

- `POST /projects/:id/tasks`: A rota deve receber um campo `title` e armazenar uma nova tarefa no array de tarefas de um projeto específico 
  escolhido através do `id` presente nos parâmetros da rota;

### Exemplo

Se eu chamar a rota `POST /projects` repassando `{ id: 1, title: 'Novo projeto' }` e a rota `POST /projects/1/tasks` com `{ title: 'Nova tarefa' }`, 
meu array de projetos deve ficar assim:

[
  {
    id: "1",
    title: "Novo projeto",
    tasks: ["Nova tarefa"]
  }
]

### Middlewares

- Crie um middleware que será utilizado em todas rotas que recebem o ID do projeto nos parâmetros da URL que verifica se o projeto com aquele ID existe.
  Se não existir retorne um erro, caso contrário permita a requisição continuar normalmente

- Crie um middleware global chamado em todas requisições que imprime (`console.log`) uma contagem de quantas requisições foram feitas na aplicação até então
*/


const express = require('express');
const server  = express();
server.listen(3000);

server.use(express.json());

const projects = [];
var numReq = 0;

server.use((req, res, next) =>{
  numReq++;
  console.log(`Requisicoes na aplicacao ate o momento: ${numReq}`);
  next();
});

server.post('/projects', checkIdBody, (req, res) =>{
  const id = req.body.id;
  const title = req.body.title;
  const project = {"id": id, "title": title, "tasks": []};
  projects.push(project);
  return res.json(project);
});

server.post('/projects/:id/tasks', checkIdParams, (req, res) =>{
  const id = req.params.id;
  const title = req.body.title;
  const index = projects.findIndex(element => element.id === id);
  projects[index].tasks.push(title);
  return res.json(projects[index]);
});

server.get('/projects', (req, res) =>{
  return res.json(projects);
});

server.put('/projects/:id', checkIdParams, (req, res) =>{
  const id = req.params.id;
  const title = req.body.title;
  const index = projects.findIndex(element => element.id === id);
  projects[index].title = title;
  return res.json(projects[index]);
});

server.delete('/projects/:id', checkIdParams, (req, res) =>{
  const id = req.params.id;
  const index = projects.findIndex(element => element.id === id);
  projects.splice(index, 1);
  return res.send();
});

function checkIdParams(req, res, next){
  const id = req.params.id;
  const check = projects.find(element => element.id === id);
  if(!check){
    return res.status(400).json({"Error":"ID não existe."});
  }
  return next();
}

function checkIdBody(req, res, next){
  const id = req.body.id;
  const check = projects.find(element => element.id === id);
  if(check){
    return res.status(400).json({"Error":"ID já existe."});
  }
  return next();
}