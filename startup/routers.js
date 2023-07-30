const homeRouter = require('../routes/web/home');
const AuthRoutes = require('../routes/api/authRoutes');
const usersRouter = require('../routes/api/userRoutes');
const chatsRouter = require('../routes/api/chatsRoutes');
const messagesRouter = require('../routes/api/messagesRoutes');

const errorHandler = require('../middlewares/errorHandler');
const error404Handler = require('../middlewares/error404Handler');

module.exports = function(app) {
    app.use('/', homeRouter);

    const authRoutes = new AuthRoutes();
    app.use('/api/v1/auth', authRoutes.getRouter());
    app.use('/api/v1/users', usersRouter);
    app.use('/api/v1/chats', chatsRouter);
    app.use('/api/v1/messages', messagesRouter);

    app.use(error404Handler);
    app.use(errorHandler);
}