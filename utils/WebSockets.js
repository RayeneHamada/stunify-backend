class WebSockets {

    static #users = [];
    get getUsers() {
    return WebSockets.#users;
    }
  
  connection(client) {
    // event fired when the chat room is disconnected
    client.on("disconnect", () => {
      WebSockets.#users = WebSockets.#users.filter((user) => user.socketId !== client.id);
    });

    // add identity of user mapped to the socket id
    client.on("identity", (userId) => {
      console.log(client.id);
      WebSockets.#users.push({
        socketId: client.id,
        userId: userId.userId,
      });
    });

    // subscribe person to chat & other user as well
    client.on("subscribe", (room, otherUserId = "") => {
      WebSockets.subscribeOtherUser(room, otherUserId);
      client.join(room);
    });

    // mute a chat room
    client.on("unsubscribe", (room) => {
      client.leave(room);
    });
  }

  subscribeOtherUser(room, otherUserId) {
    const userSockets = this.#users.filter(
      (user) => user.userId === otherUserId
    );
    userSockets.map((userInfo) => {
      const socketConn = global.io.sockets.connected(userInfo.socketId);
      if (socketConn) {
        socketConn.join(room);
      }
    });
  }

  getSocketId(clientId) {
    return WebSockets.#users.find(user => user.userId == clientId);
  }
}

module.exports = new WebSockets();
