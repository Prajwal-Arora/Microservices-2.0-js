const amqp = require('amqplib');
const {
  exchangeName,
  routingKey,
  queueName,
  routingKey2,
  queueNameSms,
} = require('./constants');
const { AMQP_URL } = require('../../config/env');
const logger = require('log4js').getLogger('rabbitmq_setup');

/*
- Publishers attach a routing key to each message they publish.
- The message is sent to an exchange.
- The exchange uses the routing key and the exchange type to determine which queues should receive the message.
- Consumers bind to specific queues and specify binding keys to receive messages that match the routing criteria
*/

async function setupConsumerEMAIL() {
  try {
    const connection = await amqp.connect(AMQP_URL, { heartbeat: 60 });
    const channel = await connection.createChannel();
    channel.prefetch(1);
    // Create exchange if it doesn't exist
    await channel.assertExchange(exchangeName, 'direct', { durable: true });
    await channel.assertQueue(queueName, { durable: true });
    await channel.bindQueue(queueName, exchangeName, routingKey);

    return channel;
  } catch (error) {
    logger.error('RabbitMQ connection error:', error.message);
    setTimeout(setupConsumerEMAIL, 5000);
  }
}

async function setupConsumerSMS() {
  try {
    const connection = await amqp.connect(AMQP_URL, { heartbeat: 60 });
    const channel = await connection.createChannel();
    channel.prefetch(1);
    // Create exchange if it doesn't exist
    await channel.assertExchange(exchangeName, 'direct', { durable: true });
    await channel.assertQueue(queueNameSms, { durable: true });
    await channel.bindQueue(queueNameSms, exchangeName, routingKey2);

    return channel;
  } catch (error) {
    logger.error('RabbitMQ connection error:', error.message);
    setTimeout(setupConsumerSMS, 5000);
  }
}

module.exports = {
  setupConsumerEMAIL,
  setupConsumerSMS,
};
