module.exports = {
  PORT: process.env.PORT,
  MONGODB_CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  AMQP_URL: process.env.AMQP_URL,
  OKX_MASTER_API_KEY: process.env.OKX_MASTER_API_KEY,
  OKX_MASTER_SECRET_KEY: process.env.OKX_MASTER_SECRET_KEY,
  OKX_MASTER_PASSPHRASE: process.env.OKX_MASTER_PASSPHRASE,
  OKX_ALLOWED_IPS: process.env.OKX_ALLOWED_IPS,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  INITIAL_VECTOR_HEX: process.env.INITIAL_VECTOR_HEX,
  SECURITY_KEY_HEX: process.env.SECURITY_KEY_HEX,
  ELASTIC_APM_SERVICE_NAME: process.env.ELASTIC_APM_SERVICE_NAME,
  ELASTIC_APM_SERVER_URL: process.env.ELASTIC_APM_SERVER_URL,
};
