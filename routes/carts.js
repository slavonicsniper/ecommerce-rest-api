var express = require('express');
var router = express.Router();
const db = require('../db')
const pgp = require('pg-promise')({ capSQL: true });
const { checkAuthenticated, } = require('../services/auth')
const { findCartByUser, convertReqBody } = require('../services/cart')
const { checkPaymentInfo } = require('../services/checkout')

router.get('/all', checkAuthenticated, (req, res, next) => {
  const { id } = req.user
  db.query(`select c.id, p.name, p.price, pc.qty 
            from products p 
            join products_carts pc 
            on p.id = pc.product_id 
            join carts c 
            on c.id = pc.cart_id 
            where c.username = $1`, 
    [id], 
    (err, result) => {
      if(err) {
          return next(err)
      }
      res.status(200).send(result.rows)
    })
});

router.get('/', checkAuthenticated, async (req, res, next) => {
  try {
    const cartId = await findCartByUser(req.user.id)
    const result = await db.query(`select p.name, p.price, pc.qty 
                              from products p 
                              join products_carts pc 
                              on p.id = pc.product_id  
                              where pc.cart_id = $1`, 
                              [cartId.id])
    res.status(200).send(result.rows)
  } catch(err) {
    next(err)
  }
});

router.post('/', checkAuthenticated, (req, res, next) => {
  const data = { username: req.user.id }
  const statement = pgp.helpers.insert(data, null, 'carts') + 'RETURNING *'
  db.query(statement, (err, result) => {
    if(err) {
        return next(err)
    }
    res.status(200).send(result.rows[0])
  })
})

router.post('/items', checkAuthenticated, async (req, res, next) => {
  try {
    const cartId = await findCartByUser(req.user.id)
    const data = await convertReqBody(req.body, cartId)
    const statement = pgp.helpers.insert(data, ['cart_id', 'product_id', 'qty'], 'products_carts') + 'RETURNING *'
    const result = await db.query(statement)
    res.status(201).send(result.rows)
  } catch(err) {
    next(err)
  }
})

router.put('/items/:productId', checkAuthenticated, async (req, res, next) => {
  try {
    const productId = req.params.productId
    const cartId = await findCartByUser(req.user.id)
    const data = req.body
    const condition = pgp.as.format('WHERE product_id = ${productId} AND cart_id = ${cartId} RETURNING *', { productId, cartId: cartId.id })
    const statement = pgp.helpers.update(data, null, 'products_carts') + condition;
    console.log(statement)
    const result = await db.query(statement)
    res.status(200).send(result.rows[0])
  } catch(err) {
    next(err)
  }
})

router.delete('/items/:productId', checkAuthenticated, async (req, res, next) => {
  try {
    const productId = req.params.productId
    const cartId = await findCartByUser(req.user.id)
    const result = await db.query('delete from products_carts where product_id = $1 and cart_id = $2 returning *', [productId, cartId.id])
    res.status(204).send(result.rows[0])
  } catch(err) {
    next(err)
  }
})

router.post('/checkout', checkAuthenticated, checkPaymentInfo, async (req, res, next) => {
  try {
    const cartId = await findCartByUser(req.user.id)
    const cartTotal = await db.query(`select sum(p.price*pc.qty) as total
                                  from products p 
                                  join products_carts pc 
                                  on p.id = pc.product_id  
                                  where pc.cart_id = $1;`,
                                  [cartId.id])
    const data = {
      total: cartTotal.rows[0].total,
      cart_id: cartId.id,
      status: 'COMPLETE'
    }
    const statement = pgp.helpers.insert(data, null, 'orders') + 'RETURNING *'
    const result = await db.query(statement)
    res.status(201).send(result.rows[0])
  }
  catch(err) {
    next(err)
  }
})

module.exports = router;
