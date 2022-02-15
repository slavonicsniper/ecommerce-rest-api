const db = require('../db')

const findCartByUser = async username => {
    try {
        const result = await db.query('select id from carts where username = $1 order by id desc', [username])
        if(result.rows.length) {
            return result.rows[0]
        }
        return null
    } catch(err) {
        throw err
    }
}

const findProductIdByName = async productName => {
    try {
        const result = await db.query('select id from products where name = $1', [productName])
        if(result.rows.length) {
            return result.rows[0]
        }
        return null
    } catch(err) {
        throw err
    }
}

const convertReqBody = async (reqBody, cartId) => {
    try {
        for (const element of reqBody) {
            element.cart_id = cartId.id
            const productId = await findProductIdByName(element.name)
            element.product_id = productId.id
        }
        return reqBody
    } catch(err) {
        throw err
    }
}

module.exports = {
    findCartByUser,
    findProductIdByName,
    convertReqBody
}