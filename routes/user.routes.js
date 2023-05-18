const router = require('express').Router();
const AuthController = require("./../controllers/user.controller");
const authController = new AuthController();

router.post("/register", authController.register);
router.post("/addUserCategory", authController.userCategory);
router.post("/getUserCategory/:id", authController.getUserCategory);


module.exports = router;