class HttpException extends Error {
  constructor(status, message) {
    super(status, message);

    this.status = status;
    this.message = message;
  }
}

module.exports = {
  HttpException,
};
