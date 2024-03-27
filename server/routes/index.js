const express = require("express");
const authRoute = require("./authRoutes");
// const userRoutes = require("./userRoutes");

const router = express.Router();

router.use(`/auth`, authRoute);
// router.use(`/users`, userRoutes);

module.exports = router;