const homeRouter = require("../routes/web/home");
const AuthRoutes = require("../routes/api/authRoutes");
const UsersRoutes = require("../routes/api/userRoutes");
const ChatsRoutes = require("../routes/api/chatsRoutes");
const MessagesRoutes = require("../routes/api/messagesRoutes");

const errorHandler = require("../middlewares/errorHandler");
const error404Handler = require("../middlewares/error404Handler");

module.exports = function (app) {
  app.use("/", homeRouter);

  const authRoutes = new AuthRoutes();
  const chatsRoutes = new ChatsRoutes();
  const messagesRoutes = new MessagesRoutes();
  const usersRoutes = new UsersRoutes();
  app.use("/api/v1/auth", authRoutes.getRouter());
  app.use("/api/v1/users", usersRoutes.getRouter());
  app.use("/api/v1/chats", chatsRoutes.getRouter());
  app.use("/api/v1/messages", messagesRoutes.getRouter());

  app.use(error404Handler);
  app.use(errorHandler);
};
