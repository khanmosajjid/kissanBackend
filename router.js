const router = require("express").Router();
const userRoutes = require("./routes/user.routes");
const categoryRoutes = require("./routes/category.routes")

router.use("/user", userRoutes);
router.use("/", categoryRoutes);

router.get("/", (req, res) => { return res.send({ message: "Connected" }) })
module.exports = router;

