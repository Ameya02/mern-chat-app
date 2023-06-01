const express = require('express');
const router = express.Router();
const {protect} = require('../middleware/authmiddleware');
const {registerUser,  authUser, getAllUsers, onlineStatus} = require('../controllers/userControllers');
router.route("/register").post(registerUser)
router.route("/getAllUsers").get(protect,getAllUsers)
router.post("/login",authUser);
router.route("/status").put(protect,onlineStatus);

module.exports = router;
