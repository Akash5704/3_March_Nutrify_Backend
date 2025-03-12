const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const DailyLog = require('../models/DailyLogs');
require('dotenv').config();
const authenticateUser = require('../middleware/authMiddleware');
const router = express.Router();
const weightController = require('../controllers/weightController');
const nutritionController = require('../controllers/nutritionController');
const userController = require('../controllers/userController')
const dailyLogController = require('../controllers/dailylogsController')

router.get("/ping", (req, res) => {
  res.status(200).json({ message: "Server is alive!" });
});

router.post("/signup", userController.userSignUp);

router.post('/login', userController.userLogin);

router.get('/me', authenticateUser, async (req, res) => {
  try {
    console.log(req.user.user_id);
    const user = await User.findById(req.user.id)
      .select('-password')
      .exec();

    if (!user) return res.status(404).json({ message: "User not found" });

    const userObj = user.toObject({ virtuals: true, getters: true });
    console.log("Debugging")
    res.json({
      ...userObj,
      bmi: userObj.bmi,
      bmr: userObj.bmr,
      dailyCalorieGoal: userObj.dailyCalorieGoal,
      proteinGoal: userObj.proteinGoal,
      carbsGoal: userObj.carbsGoal,
      fatGoal: userObj.fatGoal
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post('/daily-log', authenticateUser, dailyLogController.FoodLog);

router.get('/daily-logs', authenticateUser, dailyLogController.getDailyLogs);

router.post('/log',authenticateUser, weightController.logWeight);

router.get('/progress', authenticateUser, weightController.getWeightProgress);

router.post('/updateTargetWeight', authenticateUser, weightController.updateTargetWeight);

router.get('/latest', authenticateUser, weightController.getLatestWeight);

router.get('/stats',authenticateUser, nutritionController.getNutritionStats);


module.exports = router;