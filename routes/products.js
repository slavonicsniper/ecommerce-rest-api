var express = require('express');
var router = express.Router();
// require db adapter file
const db = require('../db')

router.get('/', (req, res, next) => {
    db.query('select * from products', [], (err, result) => {
        if(err) {
            return next(err)
        }
        res.status(200).send(result.rows)
    })
})

router.get('/:id', (req, res, next) => {
    const id = req.params.id
    db.query('select * from products where id = $1', [id], (err, result) => {
        if(err) {
            return next(err)
        }
        res.status(200).send(result.rows[0])
    })
})

module.exports = router;