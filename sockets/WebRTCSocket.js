class WebRTCSocket {
    constructor(namespace) {
        this.users = {};
        this.initiator = null;
        this.socketToRoom = {};
        this.namespace = namespace;

        this.onJoinRoom = this.onJoinRoom.bind(this);
        this.handleConnection = this.handleConnection.bind(this);
        this.handleDisconnect = this.handleDisconnect.bind(this);
        this.onSendingSDPOffer = this.onSendingSDPOffer.bind(this);
        this.onSendingSDPAnswer = this.onSendingSDPAnswer.bind(this);
        this.onSendingFileMetaData = this.onSendingFileMetaData.bind(this);
        this.onSuccessfullyStoreFileMetaData = this.onSuccessfullyStoreFileMetaData.bind(this);
    }

    handleConnection(socket) {
        console.log(`A user with the id: ${socket.id} is connected - WebRTCSocket`);

        function socketProvider(eventHandler) {
            return function(data, ackCallback) {
                eventHandler(data, ackCallback, socket);
            }
        }

        socket.on("join_room", socketProvider(this.onJoinRoom));

        socket.on("sending_sdp_offer", socketProvider(this.onSendingSDPOffer));

        socket.on("sending_sdp_answer", socketProvider(this.onSendingSDPAnswer));

        socket.on("sending_file_MetaData", socketProvider(this.onSendingFileMetaData));

        socket.on("successfully_store_file_MetaData", socketProvider(this.onSuccessfullyStoreFileMetaData));

        socket.on('disconnect', socketProvider(this.handleDisconnect));
    }

    onJoinRoom({ roomID, init }, ackCallback, socket) {
        this.users[roomID] ? this.users[roomID].push(socket.id) : this.users[roomID] = [socket.id];

        this.socketToRoom[socket.id] = roomID;

        if (init) {
            this.initiator = socket.id 
        }
        else if (this.users[roomID].includes(this.initiator)) {
            this.namespace.to(this.initiator).emit("peer_connected", socket.id);
        }

        ackCallback("ok");
    }

    onSendingSDPOffer(payload, ackCallback, socket) {
        this.namespace.to(payload.userToSignal).emit("receive_sdp_offer", {
            signal: payload.signal,
            callerID: payload.callerID,
        });

        ackCallback("ok");
    }

    onSendingSDPAnswer(payload, ackCallback, socket) {
        this.namespace.to(payload.userToSignal).emit("receive_sdp_answer", {
            signal: payload.signal,
            callerID: payload.callerID,
        });

        ackCallback("ok");
    }

    onSendingFileMetaData(payload, ackCallback, socket) {
        this.namespace.to(payload.userToSignal).emit("receive_file_MetaData", {
            metaData: payload.metaData,
            callerID: payload.callerID,
        });

        ackCallback("ok");
    }

    onSuccessfullyStoreFileMetaData(payload, ackCallback, socket) {
        this.namespace.to(payload.userToSignal).emit("peer_successfully_store_file_MetaData", {
            callerID: payload.callerID,
        });

        ackCallback("ok");
    }

    handleDisconnect(data, ackCallback, socket) {
        console.log(`A user with the id: ${socket.id} is disconnected - WebRTCSocket`);

        const roomID = this.socketToRoom[socket.id];
        const socketsInRoom = this.users[roomID];

        if (socketsInRoom) {
            const updatedSocketsInRoom = socketsInRoom.filter((id) => id !== socket.id);

            this.users[roomID] = updatedSocketsInRoom;

            delete this.socketToRoom[socket.id];

            socket.broadcast.emit("user_left", socket.id);
        }
    }
}

module.exports = WebRTCSocket;