const exchangeName = 'exchange';
const routingKey = 'send.email';
const queueName = 'send-email';
const routingKey2 = 'twilio.sms';
const queueNameSms = 'twilio-sms';

module.exports = {
  exchangeName,
  routingKey,
  queueName,
  routingKey2,
  queueNameSms,
};
