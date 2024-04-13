const { setupConsumerEMAIL, setupConsumerSMS } = require('./setup');
const logger = require('log4js').getLogger('rabbitmq_consumer');
const { queueName, queueNameSms } = require('./constants');
const {
  sendMailWithTemplate,
  sendMailWithArray,
} = require('../utils/nodemailer');
const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
} = require('../../config/env');
const twilioClient = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
  lazyLoading: true,
});

async function consumeMessagesEmail() {
  const channel = await setupConsumerEMAIL();
  channel.consume(queueName, async (message) => {
    const messageContent = JSON.parse(message.content.toString());
    if (messageContent.purpose === 'cancelOrder_array') {
      await sendMailWithArray(messageContent);
    } else {
      await sendMailWithTemplate(messageContent);
    }
    channel.ack(message);
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

async function consumeMessagesSMS() {
  const channel = await setupConsumerSMS();
  channel.consume(queueNameSms, async (message) => {
    const messageContent = JSON.parse(message.content.toString());
    try {
      await twilioClient.messages.create({
        body: `Your verification code is ${messageContent.otp}`,
        from: TWILIO_PHONE_NUMBER,
        to: `+${messageContent.country_code}${messageContent.phone_number}`,
      });
    } catch (err) {
      logger.error({
        success: false,
        receiver: `+${messageContent.country_code}${messageContent.phone_number}`,
        ERROR: err,
      });
    }
    channel.ack(message);
  });

  logger.info(`Consumer started for queue: ${queueNameSms} ✅`);

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
  consumeMessagesEmail,
  consumeMessagesSMS,
};
