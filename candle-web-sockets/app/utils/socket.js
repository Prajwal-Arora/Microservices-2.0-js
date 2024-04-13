module.exports = {
  attachServer(server) {
    this.io = require('socket.io')(server, {
      cors: {
        origin: '*',
        methods: '*',
      },
      pingTimeout: 10000,
      pintInterval: 10000,
      transports: ['websocket'],
    });
  },

  emit(event, data) {
    this.io.emit(event, data);
  },

  getInstance() {
    return this.io;
  },
};
