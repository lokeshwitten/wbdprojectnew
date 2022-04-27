const Schedule = require('../models/schedule')
const User = require('../models/user')
exports.createWorkout = async(req, res, next) => {
    const userId = req.get('userId')
    const name = req.body.name
    const duration = Number.parseInt(req.body.duration)
    const calories = Number.parseInt(req.body.calories)
    const distance = Number.parseInt(req.body.distance)
    const category = req.body.category
    const day = req.body.day
    try {
        const user = await User.findByPk(userId)
        const result = await user.createSchedule({
            name: name,
            duration: duration,
            calories: calories,
            distance: distance,
            category: category,
            day: day
        })
        console.log(result)
        res.status(200).json({ message: "The schedule created Successfully." })
    } catch (err) {
        res.status(500).json({ message: "The schedule can't be created or the user doesn't exist." })
    }
}