require('dotenv').config();
const isProduction = process.env.NODE_ENV === 'production'
const { Pool } = require('pg')
const pool = new Pool(
  isProduction ? {connectionString: process.env.DATABASE_URL, ssl: {rejectUnauthorized: false}} : {}
)
module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
}