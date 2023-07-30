const { Server } = require("socket.io");
const ChatSocket = require("../sockets/ChatSocket");
const WebRTCSocket = require("../sockets/WebRTCSocket");

class SocketServer {
  constructor(httpServer) {
    this.io = new Server(httpServer, {
      pingTimeout: 60000,
      cors: {
        origin: process.env.CORS_ORIGIN.split(','),
      },
    });

    this.chatSocket = new ChatSocket(this.io.of("/chat"));
    this.webRTCSocket = new WebRTCSocket(this.io.of("/webRTC"));

    this.setupChatNamespace();
    this.setupWebRTCNamespace();
  }

  setupChatNamespace() {
    const chatNamespace = this.io.of("/chat");
    chatNamespace.on("connection", (socket) => {
      this.chatSocket.handleConnection(socket);
    });
  }

  setupWebRTCNamespace() {
    const webRTCNamespace = this.io.of("/webRTC");
    webRTCNamespace.on("connection", (socket) => {
      this.webRTCSocket.handleConnection(socket);
    });
  }
}

module.exports = SocketServer;