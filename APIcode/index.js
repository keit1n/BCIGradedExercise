const { v4: uuidv4 } = require('uuid');
const express = require('express')
const multer  = require('multer')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
const upload = multer({ dest: 'uploads/' })
//const port = 3000
const app = express()

app.use(bodyParser.json());



var users = [
    { id: uuidv4(), Username: 'User1', Password: '123'},
    { id: uuidv4(), Username: 'User2', Password: '456'},
    { id: uuidv4(), Username: 'User3', Password: '789'},
    { id: uuidv4(), Username: 'User4', Password: '987'}
];

var items = [
  { id: uuidv4(), Title: 'Shoes', Description: 'Used nikes', Category: 'Clothing', PostDate: '1.1.2011', Location: 'Oulu'},
  { id: uuidv4(), Title: 'BMW', Description: 'Greates car ever made', Category: 'Cars', PostDate: '14.2.2008', Location: 'Kajaani'},
  { id: uuidv4(), Title: 'Microwawe', Description: 'Warms your meals', Category: 'Appliances', PostDate: '5.4.2020', Location: 'Kempele'},
  { id: uuidv4(), Title: 'Silver dollar', Description: 'Title says it all a silver dollar from 1886', Category: 'Collectibles', PostDate: '4.10.2021', Location: 'Kerava'}
];

app.set('port', (process.env.PORT || 80));

// start listening for incoming HTTP connections
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

app.get('/users', (req, res) => {
    console.log(users);
    res.json(users);
})
  
app.post('/users', (req, res) => {
    users.push({ id: uuidv4(), Username: req.body.Username, Password: req.body.Password })
    res.sendStatus(201);
  });

app.post('/users/login', (req, res) => {
    var user = users.find(user => user.Username = req.body.Username)
    if (user == null) {
      return res.status(404).send('Cannot find user')   
    }
    try {
      if(user.Password == req.body.Password) {
        bcrypt.hash(user.Password, saltRounds, function(err, hash) {
          console.log(hash)
          user.token = hash;
          res.send({token: hash})
          console.log(users)
        })
        
      } else {
        res.send('Not Allowed')
      }
    } catch {
      res.status(500).send()
    }
})

app.get('/items', (req, res) => {
  console.log(items);
  res.json(items);
})

app.get('/items/postdate', (req, res) => {
 var item = items.find(d => d.PostDate === req.body.PostDate)
  console.log(item);
  res.json(item);
})

app.get('/items/location', (req, res) => {
  var item = items.find(d => d.Location === req.body.Location)
  console.log(item);
  res.json(item);
})

app.get('/items/category', (req, res) => {
  var item = items.find(d => d.Category === req.body.Category)
  console.log(item);
  res.json(item);
})

app.post('/items', (req, res) => { 
  var user = users.find(user => user.Username = req.body.Username)
  if (user == null) {
    return res.status(400).send('Cannot find user')
  }
  if (user.token == req.body.token) {                                                                                     
    items.push({ id: uuidv4(), Title: req.body.Title, Description: req.body.Description, Category: req.body.Category, 
              Location: req.body.Location, AskPrice: req.body.AskPrice, PostDate: req.body.PostDate, Delivery: req.body.Delivery,
              Username: req.body.Username, SellerEmail: req.body.SellerEmail, SellerPhone: req.body.SellerPhone})
    res.sendStatus(201);
  }
  else {
    return res.sendStatus(401)
  }
  
});

app.get('/items/:id', (req, res) => {
  var item = items.find(d => d.id === req.params.id);
  if (item === undefined) {
    res.sendStatus(404);
  }
  else {
    res.json(item)
  }
})

app.delete('/items/:id', (req, res) => {
  console.log(req.headers.token)
  console.log(req.params.id)
  
  var item = items.find(d => d.id === req.params.id);
  if (item === undefined) {
    res.sendStatus(404);
  }
  var usertoken = users.find(u => u.token === req.headers.token)
  if(usertoken.token == req.headers.token) {
    items = items.filter(({id}) => id !== req.params.id)
    res.sendStatus(200)
    console.log(items)
  }
}) 

app.put('/items/:id', (req, res) => {
  var item = items.find(d => d.id === req.params.id);
  if (item === undefined) {
    res.sendStatus(404);
  }
  var usertoken = users.find(u => u.token === req.headers.token)
  if(usertoken.token == req.headers.token) {
    item = req.body
    res.sendStatus(200)
    
  }
})

  app.post('/photos/upload', upload.array('photos', 4), function (req, res, next) {                     // tässä nettikauppaan 4 kuvan lataus
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
    console.log(req.files);
    res.sendStatus(200);
  })