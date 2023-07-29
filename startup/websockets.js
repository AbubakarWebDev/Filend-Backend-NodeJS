const ChatSocket = require("../sockets/ChatSocket");
const WebRTCSocket = require("../sockets/WebRTCSocket");

module.exports = function (server) {
    const io = require("socket.io")(server, {
        pingTimeout: 60000,
        cors: {
            origin: process.env.CORS_ORIGIN.split(',')
        },
    });

    const chatNamespace = io.of("/chat");
    const webRTCNamespace = io.of("/webRTC");

    const chatSocket = new ChatSocket(chatNamespace);

    chatNamespace.on('connection', (socket) => {
        chatSocket.handleConnection(socket);
    });

    const webRTCSocket = new WebRTCSocket(webRTCNamespace);

    webRTCNamespace.on('connection', (socket) => {
        webRTCSocket.handleConnection(socket);
    });
}

