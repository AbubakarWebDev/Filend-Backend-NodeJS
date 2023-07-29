module.exports = function (server) {
    const io = require("socket.io")(server, {
        pingTimeout: 60000,
        cors: {
            origin: process.env.CORS_ORIGIN.split(',')
        },
    });

    const chatNamespace = io.of("/chat");
    const webRTCNamespace = io.of("/webRTC");


    const onlineUsers = {};

    chatNamespace.on('connection', (socket) => {
        const socketId = socket.id;
        console.log(`A user with the id: ${socketId} is connected`);

        socket.on('setup', (userId) => {
            socket.join(userId);

            onlineUsers[userId] = socketId;

            chatNamespace.emit('onlineUsers', onlineUsers);
        });

        socket.on('joinChat', (chatId) => {
            socket.join(chatId);
        });

        socket.on('joinNewGroupChat', ({ chat, userId }) => {
            socket.join(chat._id);

            [...chat.users, ...chat.groupAdmins].forEach((user) => {
                if (user._id !== userId) {
                    chatNamespace.to(user._id).emit('joinGroupChat', chat);
                }
            });
        });

        socket.on('updateGroupChat', ({ chat, userId, addedUser, removedUser }) => {
            [...chat.users, ...chat.groupAdmins].forEach((user) => {
                if (user._id !== userId) {
                    chatNamespace.to(user._id).emit('updatedGroupChat', chat);
                }
            });

            removedUser.forEach((user) => {
                chatNamespace.to(user._id).emit('deleteGroupChat', chat._id);
            });

            addedUser.forEach((user) => {
                chatNamespace.to(user._id).emit('joinGroupChat', chat);
            });
        });

        socket.on('typing', ({ chatId, user }) => {
            chatNamespace.to(chatId).except(user._id).emit('startTyping', { chatId, user });
        });

        socket.on('typingOff', ({ chatId, user }) => {
            chatNamespace.to(chatId).except(user._id).emit('stopTyping', { chatId, user });
        });

        socket.on('sendMessage', (message) => {
            [...message.chat.users, ...message.chat.groupAdmins].forEach((user) => {
                if (user !== message.sender._id) {
                    chatNamespace.to(user).emit('receiveMessage', message);
                }
            });
        });

        socket.on('disconnect', () => {
            for (const key in onlineUsers) {
                if (onlineUsers[key] === socketId) {
                    console.log(`A user with the id: ${socketId} is disconnected`);

                    socket.leave(key);
                    delete onlineUsers[key];
                }
            }

            chatNamespace.emit('onlineUsers', onlineUsers);
        });
    });

    
    const users = {};
    const socketToRoom = {};

    webRTCNamespace.on('connection', (socket) => {
        console.log(`A user with the socketId: ${socket.id} is connected`);

        socket.on("join_room", ({ roomID, init }) => {
            users[roomID] ? users[roomID].push(socket.id) : users[roomID] = [socket.id];

            socketToRoom[socket.id] = roomID;

            init ? initiator = socket.id : webRTCNamespace.to(initiator).emit("peer_connected", socket.id);
        });

        socket.on("sending_sdp_offer", (payload) => {
            webRTCNamespace.to(payload.userToSignal).emit("receive_sdp_offer", {
                signal: payload.signal,
                callerID: payload.callerID,
            });
        });

        socket.on("sending_sdp_answer", (payload) => {
            webRTCNamespace.to(payload.userToSignal).emit("receive_sdp_answer", {
                signal: payload.signal,
                callerID: payload.callerID,
            });
        });

        socket.on("sending_file_MetaData", (payload) => {
            webRTCNamespace.to(payload.userToSignal).emit("receive_file_MetaData", {
                metaData: payload.metaData,
                callerID: payload.callerID,
            });
        });

        socket.on("successfully_store_file_MetaData", (payload) => {
            webRTCNamespace.to(payload.userToSignal).emit("peer_successfully_store_file_MetaData", {
                callerID: payload.callerID,
            });
        });

        socket.on('disconnect', () => {
            console.log(`A user with the socketId: ${socket.id} is disconnected`);

            const roomID = socketToRoom[socket.id];
            const socketsInRoom = users[roomID];

            if (socketsInRoom) {
                const updatedSocketsInRoom = socketsInRoom.filter((id) => id !== socket.id);

                users[roomID] = updatedSocketsInRoom;

                delete socketToRoom[socket.id];

                socket.broadcast.emit("user_left", socket.id);
            }
        });
    });
}

