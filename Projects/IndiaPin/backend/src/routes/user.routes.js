const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

// Route for getting all users and creating a new user
router.route("/")
    .get(userController.getAllUsers)
    .post(userController.createUser);

// Route for operations on a specific user by ID
router.route("/:id")
    .get(userController.getUserById)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;
