const TxRoute = require('./tx.routes');
const UserRoute = require('./user.routes');

module.exports = [new TxRoute(), new UserRoute()];
