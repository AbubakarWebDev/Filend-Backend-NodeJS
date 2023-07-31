const express = require("express");
const AuthController = require("../../controllers/authController");

class AuthRoutes {
    constructor() {
        this.router = express.Router();
        this.authController = new AuthController();
        this.initializeRoutes();
    }

    initializeRoutes() {
        // Protected Routes
        this.router.post("/reset-password", (req, res) => this.authController.resetPassword(req, res));
        this.router.post("/forgot-password", (req, res) => this.authController.sendUserPasswordResetEmail(req, res));

        // Public Routes
        this.router.post("/login", (req, res) => this.authController.loginUser(req, res));
        this.router.post("/register", (req, res, next) => this.authController.registerUser(req, res, next));
    }

    getRouter() {
        return this.router;
    }
}

module.exports = AuthRoutes;