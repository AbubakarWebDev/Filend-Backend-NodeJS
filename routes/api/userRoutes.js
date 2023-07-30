const express = require("express");
const authenticateToken = require("../../middlewares/authenticateToken");
const UserController = require("../../controllers/userController");

class UserRoutes {
  constructor() {
    this.router = express.Router();
    this.userController = new UserController();
    this.initializeRoutes();
  }
  initializeRoutes() {
    // Protected Routes
    this.router.get("/", authenticateToken, (req, res) =>
      this.userController.getAllUsers(req, res)
    );
    this.router.put("/", authenticateToken, (req, res) =>
      this.userController.updateUserProfile(req, res)
    );
    this.router.put("/avatar", authenticateToken, (req, res) =>
      this.userController.updateUserAvatar(req, res)
    );
    this.router.get("/loggedin", authenticateToken, (req, res) =>
      this.userController.getLoggedInUser(req, res)
    );
    this.router.post("/change-password", authenticateToken, (req, res) =>
      this.userController.changePassword(req, res)
    );

    // Public Routes
    this.router.get("/:id", (req, res) =>
      this.userController.checkUserExists(req, res)
    );
  }

  getRouter() {
    return this.router;
  }
}

module.exports = UserRoutes;
