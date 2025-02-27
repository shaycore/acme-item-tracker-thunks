const { conn, User, Thing } = require('./db');
const express = require('express');
const app = express();
const path = require('path');

app.use(express.json());
app.use('/dist', express.static('dist'));

app.get('/', (req, res)=> res.sendFile(path.join(__dirname, 'index.html')));

app.post('/api/users', async(req, res, next)=> {
  try {
    res.status(201).send(await User.create(req.body));
  }
  catch(ex){
    next(ex);
  }
});


app.post('/api/things', async(req, res, next)=> {
  try {
    res.status(201).send(await Thing.create(req.body));
  }
  catch(ex){
    next(ex);
  }
});

app.put('/api/things/:id', async(req, res, next)=> {
  try {
    const thing = await Thing.findByPk(req.params.id);
    await thing.update(req.body);
    res.send(thing);
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/api/users/:id', async(req, res, next)=> {
  try {
    const user = await User.findByPk(req.params.id);
    await user.destroy();
    res.sendStatus(204);
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/api/things/:id', async(req, res, next)=> {
  try {
    const thing = await Thing.findByPk(req.params.id);
    await thing.destroy();
    res.sendStatus(204);
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/things', async(req, res, next)=> {
  try {
    res.send(await Thing.findAll({
      order: [['name']]
    }));
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/users', async(req, res, next)=> {
  try {
    res.send(await User.findAll());
  }
  catch(ex){
    next(ex);
  }
});

app.put('/api/users/:id', async(req, res, next)=> {
  try {
    const user = await User.findByPk(req.params.id);
    await user.update(req.body);
    res.send(user);
  }
  catch(ex){
    next(ex);
  }
});

//I didn't use this route (tried using a route for my first solution to limiting to 3) but I used front end code instead
app.get('/api/users/:id/things', async(req, res, next)=> {
  try {
    const things = await Thing.findAll({
      where: {
        userId: req.params.id
      }
    });
    res.send(things);
  }
  catch(ex){
    next(ex);
  }
});

app.use((err, req, res, next)=> {
  console.log(err);
  res.status(500).send(err);
});


const port = process.env.PORT || 3000;

app.listen(port, ()=> console.log(`listening on port ${port}`));

const init = async()=> {
  try {
    await conn.sync({ force: true });
    const [moe, larry, lucy, ethyl] = await Promise.all(
      ['Moe', 'Larry', 'Lucy', 'Ethyl'].map( name => User.create({ name }))
    );
    const [foo, bar, bazz, quq, fizz] = await Promise.all(
      ['Foo', 'Bar', 'Bazz', 'Quq', 'Fizz'].map( name => Thing.create({ name }))
    );

    foo.userId = moe.id;
    bar.userId = lucy.id;
    bazz.userId = lucy.id;
    lucy.ranking = '8';
    fizz.ranking = '3';

    await Promise.all([
      foo.save(),
      bar.save(),
      bazz.save(),
      lucy.save(),
      fizz.save()
    ]);
  }
  catch(ex){
    console.log(ex);
  }
};

init();
