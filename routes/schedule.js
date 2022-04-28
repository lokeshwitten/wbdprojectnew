const express = require('express');
const isAuth = require('../middleware/is-auth')

const workoutController = require('../controllers/workout')

const router = express.Router();

router.post('/add-workout', workoutController.createWorkout)
router.delete('/delete-workout/:workoutid', workoutController.deleteWorkout)
router.put('/edit-workout/:workoutid', workoutController.editWorkout)
router.get('/getdoneexercises', workoutController.getDoneWorkouts)
module.exports = router