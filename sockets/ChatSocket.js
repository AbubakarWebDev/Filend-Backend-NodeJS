class ChatSocket {
    constructor(namespace) {
        this.onlineUsers = {};
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
        this.socket = socket;
        console.log(`A user with the id: ${socket.id} is connected - ChatSocket`);

        socket.on('setup', this.onChatSetup);

        socket.on('joinChat', this.onJoinChat);

        socket.on('joinNewGroupChat', this.onJoinNewGroupChat);

        socket.on('updateGroupChat', this.onUpdateGroupChat);

        socket.on('typing', this.onTyping);

        socket.on('typingOff', this.onTypingOff);

        socket.on('sendMessage', this.onSendMessage);

        socket.on('disconnect', this.handleDisconnect);
    }

    onChatSetup(userId) {
        this.socket.join(userId);

        this.onlineUsers[userId] = this.socket.id;

        this.namespace.emit('onlineUsers', this.onlineUsers);
    }

    onJoinChat(chatId) {
        this.socket.join(chatId);
    }

    onJoinNewGroupChat({ chat, userId }) {
        this.socket.join(chat._id);

        [...chat.users, ...chat.groupAdmins].forEach((user) => {
            if (user._id !== userId) {
                this.namespace.to(user._id).emit('joinGroupChat', chat);
            }
        });
    }

    onUpdateGroupChat({ chat, userId, addedUser, removedUser }) {
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
    }

    onTyping({ chatId, user }) {
        this.namespace.to(chatId).except(user._id).emit('startTyping', { chatId, user });
    }

    onTypingOff({ chatId, user }) {
        this.namespace.to(chatId).except(user._id).emit('stopTyping', { chatId, user });
    }

    onSendMessage(message) {
        [...message.chat.users, ...message.chat.groupAdmins].forEach((user) => {
            if (user !== message.sender._id) {
                this.namespace.to(user).emit('receiveMessage', message);
            }
        });
    }

    handleDisconnect() {
        for (const key in this.onlineUsers) {
            if (this.onlineUsers[key] === this.socket.id) {
                console.log(`A user with the id: ${this.socket.id} is disconnected - ChatSocket`);

                this.socket.leave(key);
                delete this.onlineUsers[key];
            }
        }

        this.namespace.emit('onlineUsers', this.onlineUsers);
    }
}

module.exports = ChatSocket;