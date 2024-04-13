const { setupConsumer } = require('./setup');
const logger = require('log4js').getLogger('rabbitmq_consumer');
const { queueName } = require('./constants');
const User = require('../models/user.model');
const {
  createSubAccount,
  createSubAccountApiKey,
  generatePassphrase,
} = require('../utils/okx_helper');
const { publishUserDetails } = require('./publisher');

async function consumeMessages() {
  const channel = await setupConsumer();
  channel.consume(queueName, async (message) => {
    const messageContent = JSON.parse(message.content.toString());

    const { data, msg } = await createSubAccount(
      messageContent.ums_id.slice(0, 15)
    );
    if (msg !== '' || !data) {
      channel.reject(message, true);
      return;
    }

    const passPhrase = generatePassphrase();
    const { data1, msg1 } = await createSubAccountApiKey(
      data[0].subAcct,
      data[0].label,
      passPhrase
    );
    if (msg1 !== '' || !data1) {
      channel.reject(message, true);
      return;
    }

    const user = new User({
      ums_id: messageContent.ums_id,
      email: messageContent.email,
      acc_freeze: messageContent.acc_freeze,
      okx_account_name: data[0].subAcct,
      okx_api_key: data1[0].apiKey,
      okx_secret_key: data1[0].secretKey,
      okx_passphrase: data1[0].passphrase,
      okx_creation_time: data[0].ts,
      okx_uid: data[0].uid,
      okx_account_label: data[0].label,
      okx_perm: data1[0].perm,
    });

    user.save().then(() => {
      logger.info(`Account data for user ${messageContent.email} saved`);
      publishUserDetails({
        ums_id: messageContent.ums_id,
        email: messageContent.email,
        acc_freeze: messageContent.acc_freeze,
        okx_account_name: data[0].subAcct,
        okx_api_key: data1[0].apiKey,
        okx_secret_key: data1[0].secretKey,
        okx_passphrase: data1[0].passphrase,
        okx_creation_time: data[0].ts,
        okx_uid: data[0].uid,
        okx_account_label: data[0].label,
        okx_perm: data1[0].perm,
      });
      channel.ack(message);
    });
  });

  logger.info(`Consumer started for queue: ${queueName} ✅`);

  // Close channel and connection on error
  channel.on('error', (error) => {
    logger.error(`Channel error: ${error.message}`);
    channel.close();
    channel.connection.close();
  });

  // Close channel and connection on process termination
  process.on('SIGINT', () => {
    channel.close();
    channel.connection.close();
  });
}

module.exports = {
  consumeMessages,
};
