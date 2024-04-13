const { setupPublisher } = require('./setup');
const logger = require('log4js').getLogger('rabbitmq_publisher');
const { exchangeName, routingKey2, routingKey3 } = require('./constants');

async function publishEmailtoQ(message) {
  const channel = await setupPublisher();
  const messageBuffer = Buffer.from(JSON.stringify(message));
  channel.publish(exchangeName, routingKey2, messageBuffer, {
    persistent: true,
  });
  logger.info(' >> from order-s to notifiation-s publish successful (email)');
  // Close channel and connection
  await channel.close();
  await channel.connection.close();
}

async function publishUserDetails(message) {
  const channel = await setupPublisher();
  const messageBuffer = Buffer.from(JSON.stringify(message));
  channel.publish(exchangeName, routingKey3, messageBuffer, {
    persistent: true,
  });
  logger.info(' >> from order-s to bot-s publish successful');
  // Close channel and connection
  await channel.close();
  await channel.connection.close();
}

module.exports = {
  publishEmailtoQ,
  publishUserDetails,
};

// const message = { data: 'Hello, world!' };
// const messageBuffer = Buffer.from(JSON.stringify(message));
// channel.publish(exchangeName, routingKey, messageBuffer, { persistent: true });
// ```````````````````````````````````````````````````````````
// const message = 'Hello, World!';
// channel.publish(exchangeName, routingKey, Buffer.from(message), { persistent: true });
// ```````````````````````````````````````````````````````````
