const db = require('../db')

const checkPaymentInfo = async (req, res, next) => {
    try {
        const { id } = req.user
        const { card, cvc, expiration} = req.body
        const cardResult = await db.query('select username from payments where card = $1 and cvc = $2 and expiration = $3 and username = $4', [card, cvc, expiration, id])
        if(cardResult.rows.length) {
          return next()
        }
        res.status(401).send()
      } catch(err) {
        next(err)
      }
}

module.exports = {
    checkPaymentInfo,
}