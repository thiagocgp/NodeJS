import { Router } from 'express';

import User from './app/models/user';

const routes = new Router();

routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Thiago Pereira',
    email: 'thiagocgp@gmail.com',
    password_hash: '3843y4382332',
  });

  return res.json(user);
});

export default routes;
