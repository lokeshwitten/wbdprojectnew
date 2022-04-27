const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();
router.post('/signup', authController.signup);
router.post('/login', authController.login)
router.get('/email-verify/:randToken', authController.email_verify)
router.post('/verify-otp', authController.otp_verify)
module.exports = router;