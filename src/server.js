require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const Sentry = require('@sentry/node')
const validate = require('express-validation')
const Youch = require('youch')
const sentryConfig = require('./config/sentry')
const databaseConfig = require('./config/database')
class App {
  constructor () {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'productio'
    this.sentry()
    this.midlewares()
    this.database()
    this.routes()
    this.exception()
  }
  sentry () {
    Sentry.init(sentryConfig)
  }
  midlewares () {
    this.express.use(express.json())
    this.express.use(Sentry.Handlers.requestHandler())
  }
  database () {
    mongoose.connect(databaseConfig.uri, {
      useCreateIndex: true,
      useNewUrlParser: true
    })
  }
  routes () {
    this.express.use(require('./routes'))
  }
  exception () {
    if (process.env.NODE_ENV === 'production') {
      this.express.use(Sentry.Handlers.errorHandler())
    }
    this.express.use(async (err, req, res, next) => {
      if (err instanceof validate.ValidationError) {
        return res.status(err.status).json(err)
      }
      if (process.env.NODE_ENV !== 'production') {
        const youch = new Youch(err)
        return res.json(await youch.toJSON())
      }
      return res
        .status(err.status || 500)
        .json({ error: 'Internal Server Error' })
    })
  }
}
module.exports = new App().express
