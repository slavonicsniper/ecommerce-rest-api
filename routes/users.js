var express = require('express');
var router = express.Router();
const db = require('../db')
const pgp = require('pg-promise')({ capSQL: true });
const { checkAuthenticated, checkAuthUser } = require('../services/auth')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:id', checkAuthenticated, checkAuthUser, (req, res, next) => {
  db.query('select * from users where username = $1', [req.params.id], (err, result) => {
    if(err) {
        return next(err)
    }
    res.status(200).send(result.rows[0])
  })
})

router.put('/:id', checkAuthenticated, checkAuthUser, (req, res, next) => {
  const id = req.params.id
  const params = req.body
  // Generate SQL statement - using helper for dynamic parameter injection
  const condition = pgp.as.format('WHERE username = ${id} RETURNING *', { id });
  const statement = pgp.helpers.update(params, null, 'users') + condition;
  db.query(statement, (err, result) => {
    if(err) {
        return next(err)
    }
    res.status(200).send(result.rows[0])
  })
})




module.exports = router;
