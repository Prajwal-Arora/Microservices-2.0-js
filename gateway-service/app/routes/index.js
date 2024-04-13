const AgRoute_User = require('./ag-user.routes');
const AgRoute_Market = require('./ag-market.routes');
const AgRoute_Tx = require('./ag-tx.routes');

module.exports = [new AgRoute_User(), new AgRoute_Market(), new AgRoute_Tx()];
