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
        this.socket = socket;
        console.log(`A user with the id: ${socket.id} is connected - WebRTCSocket`);

        socket.on("join_room", this.onJoinRoom);

        socket.on("sending_sdp_offer", this.onSendingSDPOffer);

        socket.on("sending_sdp_answer", this.onSendingSDPAnswer);

        socket.on("sending_file_MetaData", this.onSendingFileMetaData);

        socket.on("successfully_store_file_MetaData", this.onSuccessfullyStoreFileMetaData);

        socket.on('disconnect', this.handleDisconnect);
    }

    onJoinRoom({ roomID, init }) {
        this.users[roomID] ? this.users[roomID].push(this.socket.id) : this.users[roomID] = [this.socket.id];

        this.socketToRoom[this.socket.id] = roomID;

        if (init) {
            this.initiator = this.socket.id 
        }
        else if (this.users[roomID].includes(this.initiator)) {
            this.namespace.to(this.initiator).emit("peer_connected", this.socket.id);
        }
    }

    onSendingSDPOffer(payload) {
        this.namespace.to(payload.userToSignal).emit("receive_sdp_offer", {
            signal: payload.signal,
            callerID: payload.callerID,
        });
    }

    onSendingSDPAnswer(payload) {
        this.namespace.to(payload.userToSignal).emit("receive_sdp_answer", {
            signal: payload.signal,
            callerID: payload.callerID,
        });
    }

    onSendingFileMetaData(payload) {
        this.namespace.to(payload.userToSignal).emit("receive_file_MetaData", {
            metaData: payload.metaData,
            callerID: payload.callerID,
        });
    }

    onSuccessfullyStoreFileMetaData(payload) {
        this.namespace.to(payload.userToSignal).emit("peer_successfully_store_file_MetaData", {
            callerID: payload.callerID,
        });
    }

    handleDisconnect() {
        console.log(`A user with the id: ${this.socket.id} is disconnected - WebRTCSocket`);

        const roomID = this.socketToRoom[this.socket.id];
        const socketsInRoom = this.users[roomID];

        if (socketsInRoom) {
            const updatedSocketsInRoom = socketsInRoom.filter((id) => id !== this.socket.id);

            this.users[roomID] = updatedSocketsInRoom;

            delete this.socketToRoom[this.socket.id];

            this.socket.broadcast.emit("user_left", this.socket.id);
        }
    }
}

module.exports = WebRTCSocket;