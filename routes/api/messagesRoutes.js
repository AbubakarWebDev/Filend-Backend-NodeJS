const express = require("express");
const authenticateToken = require("../../middlewares/authenticateToken");
const MessageController = require("../../controllers/messageController");

class MessagesRoutes {
  constructor() {
    this.router = express.Router();
    this.messageController = new MessageController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/", authenticateToken, (req, res) =>
      this.messageController.getAllMessages(req, res)
    );
    this.router.post("/", authenticateToken, (req, res) =>
      this.messageController.sendMessage(req, res)
    );
    this.router.put("/readBy", authenticateToken, (req, res) =>
      this.messageController.updateReadBy(req, res)
    );
  }

  getRouter() {
    return this.router;
  }
}

module.exports = MessagesRoutes;
