const amqp = require('amqplib');
const { exchangeName } = require('./constants');
const { AMQP_URL } = require('../../config/env');

/*
- Publishers attach a routing key to each message they publish.
- The message is sent to an exchange.
- The exchange uses the routing key and the exchange type to determine which queues should receive the message.
- Consumers bind to specific queues and specify binding keys to receive messages that match the routing criteria
*/

async function setupPublisher() {
  const connection = await amqp.connect(AMQP_URL);
  const channel = await connection.createChannel();

  // Create exchange if it doesn't exist
  await channel.assertExchange(exchangeName, 'direct', { durable: true });
  return channel;
}

module.exports = {
  setupPublisher,
};
