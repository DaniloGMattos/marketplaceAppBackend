const express = require('express')
const validate = require('express-validation')
const handle = require('express-async-handler')
const routes = express.Router()
// CONTROLLERS
const UserController = require('./app/controllers/UserContoller')
const SessionController = require('./app/controllers/SessionController')
const AdController = require('./app/controllers/AdController')
const PurchaseController = require('./app/controllers/PurchaseController')
const AproveController = require('./app/controllers/AproveController')
// MIDDLEWARES
const authMiddleware = require('./app/middlewares/auth')
// VALIDATORS
const validator = require('./app/validators')

routes.post('/users', validate(validator.User), handle(UserController.store))
routes.post(
  '/sessions',
  validate(validator.Session),
  handle(SessionController.store)
)

routes.use(authMiddleware)
// Ads

routes.get('/ads', handle(AdController.index))
routes.get('/ads/:id', handle(AdController.show))
routes.post('/ads', validate(validator.Ad), handle(AdController.store))
routes.put('/ads/:id', validate(validator.Ad), handle(AdController.update))
routes.delete('/ads/:id', handle(AdController.destroy))

// PURCHASE

routes.post(
  '/purchases',
  validate(validator.Purchase),
  handle(PurchaseController.store)
)
routes.put('/purchases/:id', handle(AproveController.update))
module.exports = routes
