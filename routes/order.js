var express = require('express');
var router = express.Router();
const db = require('../db')
const { checkAuthenticated } = require('../services/auth')

router.get('/', checkAuthenticated, async (req, res, next) => {
  try {
    const { id } = req.user
    const result = await db.query(`select o.id, o.total, o.status, o.cart_id from orders o
                                   join carts c
                                   on o.cart_id = c.id
                                   join users u
                                   on c.username = u.username
                                   where u.username = $1`, [id])
    res.status(200).send(result.rows)
  }
  catch(err) {
    next(err)
  }
});
  
router.get('/:id', checkAuthenticated, async (req, res, next) => {
  try {
    const result = await db.query('select * from orders where id = $1', [req.params.id])
    res.status(200).send(result.rows[0])
  } catch(err) {
      next(err)
  }
})

module.exports = router