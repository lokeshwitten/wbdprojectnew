const express = require('express');
const isAuth = require('../middleware/is-auth')

const workoutController = require('../controllers/workout')

const router = express.Router();

router.post('/add-workout', workoutController.createWorkout)
module.exports = router