const router = require('express').Router();
const CategoryController = require("../controllers/category.controller")
const catController = new CategoryController();

router.post("/createCategory", catController.addCategory)
router.post("/updateCategory/:id", catController.updateCategory)
router.post("/getCategory", catController.getCategory)

module.exports = router;