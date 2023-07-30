const express = require("express");
const ChatController = require("../../controllers/chatController");
const authenticateToken = require("../../middlewares/authenticateToken");

class ChatsRoutes {
  constructor() {
    this.router = express.Router();
    this.chatController = new ChatController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/", authenticateToken, (req, res) =>
      this.chatController.getAllChats(req, res)
    );
    this.router.post("/", authenticateToken, (req, res) =>
      this.chatController.getOrCreateChat(req, res)
    );
    this.router.post("/group", authenticateToken, (req, res) =>
      this.chatController.createGroupChat(req, res)
    );
    this.router.put("/group/add-member", authenticateToken, (req, res) =>
      this.chatController.addtoGroup(req, res)
    );
    this.router.put("/group/rename", authenticateToken, (req, res) =>
      this.chatController.renameGroupChat(req, res)
    );
    this.router.put("/group/users", authenticateToken, (req, res) =>
      this.chatController.updateGroupUsers(req, res)
    );
    this.router.put("/group/admins", authenticateToken, (req, res) =>
      this.chatController.updateAdminUsers(req, res)
    );
    this.router.put("/group/remove-member", authenticateToken, (req, res) =>
      this.chatController.removeFromGroup(req, res)
    );
  }
  getRouter() {
    return this.router;
  }
}

module.exports = ChatsRoutes;
