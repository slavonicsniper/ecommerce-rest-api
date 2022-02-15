var express = require('express');
var router = express.Router();
// require db adapter file
const db = require('../db')

const passport = require('passport')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// register user endpoint
router.post('/register', (req, res, next) => {
  const { username, firstName, lastName, email, password } = req.body
  db.query('insert into users (username, first_name, last_name, email, password) values ($1, $2, $3, $4, $5)', [username, firstName, lastName, email, password], (err, result) => {
    if (err) {
      return next(err)
    }
    res.status(201).send(`User ${username} registered.`)
  })
})

router.post('/login', passport.authenticate('local'), (req, res, next) => {
  res.status(200).send('Authenticated.')
})

module.exports = router;
