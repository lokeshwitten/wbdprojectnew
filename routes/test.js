//These rputes are for testing purposes to implement various other features
const express = require('express')
const router = express.Router()
const testController = require('../controllers/test')
router.get('/getRepos', testController.getRepos)
module.exports = router