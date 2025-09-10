
const express = require("express");
const { signup, login, me } = require("../controllers/authController");
const { signupValidator, loginValidator} = require("../middleware/authValidator");
const validateRequest = require("../middleware/validateRequest");
const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router();

router.post("/signup", signupValidator, validateRequest, signup);
router.post("/login", loginValidator, validateRequest, login);
router.get("/me", authMiddleware, me);

module.exports = router;
