class ChatSocket {
    constructor(namespace) {
        this.onlineUsers = {};
        this.socketToUser = {};
        this.namespace = namespace;

        this.onTyping = this.onTyping.bind(this);
        this.onJoinChat = this.onJoinChat.bind(this);
        this.onTypingOff = this.onTypingOff.bind(this);
        this.onChatSetup = this.onChatSetup.bind(this); 
        this.onSendMessage = this.onSendMessage.bind(this);
        this.handleConnection = this.handleConnection.bind(this);
        this.handleDisconnect = this.handleDisconnect.bind(this);
        this.onUpdateGroupChat = this.onUpdateGroupChat.bind(this);
        this.onJoinNewGroupChat = this.onJoinNewGroupChat.bind(this);
    }

    handleConnection(socket) {
        console.log(`A user with the id: ${socket.id} is connected - ChatSocket`);

        function socketProvider(eventHandler) {
            return function(data, ackCallback) {
                eventHandler(data, ackCallback, socket);
            }
        }

        socket.on('setup', socketProvider(this.onChatSetup));

        socket.on('joinChat', socketProvider(this.onJoinChat));

        socket.on('joinNewGroupChat', socketProvider(this.onJoinNewGroupChat));

        socket.on('updateGroupChat', socketProvider(this.onUpdateGroupChat));

        socket.on('typing', socketProvider(this.onTyping));

        socket.on('typingOff', socketProvider(this.onTypingOff));

        socket.on('sendMessage', socketProvider(this.onSendMessage));

        socket.on('disconnect', socketProvider(this.handleDisconnect));
    }

    onChatSetup(userId, ack, socket) {
        socket.join(userId);
        
        this.onlineUsers[userId] = socket.id;
        this.socketToUser[socket.id] = userId;
        
        this.namespace.emit('onlineUsers', this.onlineUsers);

        console.log("onChatSetup", userId, this.onlineUsers);

        ack("ok");
    }

    onJoinChat(chatId, ack, socket) {
        socket.join(chatId);

        console.log("onJoinChat", chatId, socket.id);

        ack("ok");
    }

    onJoinNewGroupChat({ chat, userId }, ack, socket) {
        socket.join(chat._id);

        [...chat.users, ...chat.groupAdmins].forEach((user) => {
            if (user._id !== userId) {
                this.namespace.to(user._id).emit('joinGroupChat', chat);
            }
        });

        ack("ok");
    }

    onUpdateGroupChat({ chat, userId, addedUser, removedUser }, ack, socket) {
        [...chat.users, ...chat.groupAdmins].forEach((user) => {
            if (user._id !== userId) {
                this.namespace.to(user._id).emit('updatedGroupChat', chat);
            }
        });

        removedUser.forEach((user) => {
            this.namespace.to(user._id).emit('deleteGroupChat', chat._id);
        });

        addedUser.forEach((user) => {
            this.namespace.to(user._id).emit('joinGroupChat', chat);
        });

        ack("ok");
    }

    onTyping({ chatId, user }, ack, socket) {
        this.namespace.to(chatId).except(user._id).emit('startTyping', { chatId, user });
        ack("ok");
    }

    onTypingOff({ chatId, user }, ack, socket) {
        this.namespace.to(chatId).except(user._id).emit('stopTyping', { chatId, user });
        ack("ok");
    }

    onSendMessage(message, ack, socket) {
        [...message.chat.users, ...message.chat.groupAdmins].forEach((user) => {
            if (user !== message.sender._id) {
                this.namespace.to(user).emit('receiveMessage', message);
            }
        });

        ack("ok");
    }

    handleDisconnect(data, ack, socket) {
        console.log(`A user with the id: ${socket.id} is disconnected - ChatSocket`);

        const userId = this.socketToUser[socket.id];

        if (userId) {
            socket.leave(userId);
            delete this.onlineUsers[userId];
            delete this.socketToUser[socket.id];
        }
        
        console.log(this.onlineUsers);
        console.log(this.socketToUser);

        this.namespace.emit('onlineUsers', this.onlineUsers);
    }
}

module.exports = ChatSocket;