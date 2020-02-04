const express = require('express');

const server = express();

//Escutando a porta 3000
server.listen(3000);

//Usando json nas requisicoes e respostas
server.use(express.json());

//array de usuarios
const users = ['Thiago', 'Karoline', 'Luana'];

//Qualquer requisicao antes de ser tratada no seu metodo correspondente (get, post, put,...)
//vai passar pelo metodo 'server.use' (middleware) e executar tudo antes do 'next'.
//No 'next' vai ser executado o metodo da requisicao (get, post, ...) e apos isso volta para
//o metodo 'server.use' para executar o que esta apos o next.
server.use((req, res, next) => {
  console.time('Request');
  console.log(req.method + ' ' + req.url);
  next();
  console.timeEnd('Request');
});

//Middleware para verificar se no json recebido contem a tag 'name'
//caso nao tenha, retorna um erro.
//Esse middleware e executado antes de exucutar os metodos de requisicao
//os quais o chamam nos parametros.
//post e put
function checkUserExist(req, res, next){
  if(!req.body.name){
    console.log('Error: Name is required');
    return res.status(400).json({'Error': 'Name is required'});
  }
  return next();
}

//Middleware para verificar se o index passado pelo parametro de rota existe
//caso nao exista esse index no array users, retorna um erro.
//Esse middleware e executado antes de exucutar os metodos de requisicao
//os quais o chamam nos parametros.
//get, put e delete
function checkUserInArray(req, res, next){
  if(!users[req.params.index]){
    console.log('Error: User does not exist');
    return res.status(400).json({'Error': 'User does not exist'});
  }
  return next();
}

//Requisicao GET
//retorna o user pelo index passado no parametro de rota
server.get('/users/:index', checkUserInArray, (req, res) => {
  const index = req.params.index;
  const user = users[index];
  return res.json({'Users': user});
});

//retorna todos os users
server.get('/users', (req, res) => {
  return res.json({'Users': users})
});

//Requisicao POST
//adiciona um user no array passado pelo json
server.post('/users', checkUserExist, (req, res) => {
  const name = req.body.name;
  users.push(name);
  return res.send();
});


//Requisicao PUT
//edita o nome do user com o index passado pelo parametro de rota
//o novo nome e obtido no json enviado
server.put('/users/:index', checkUserInArray, checkUserExist, (req, res) => {
  const index = req.params.index;
  const name = req.body.name;
  users[index] = name;
  return res.send();
});

//Requisicao DELETE
//deleta do array um user com o index passado por parametro de rota
server.delete('/users/:index', checkUserInArray, (req, res) => {
  const index = req.params.index;
  users.splice(index, 1);
  return res.send();
});