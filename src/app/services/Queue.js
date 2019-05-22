const kue = require('kue')
const Sentry = require('@sentry/node')
const redisConfig = require('../../config/regis')
const emailJob = require('../jobs/PurchaseMail')

const Queue = kue.createQueue({ redis: redisConfig })
Queue.process(emailJob.key, emailJob.handle)
Queue.on('error', Sentry.captureException)
module.exports = Queue
