const errorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500; //check if status code has been set by validation
  res.status(statusCode);
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? null : error.stack, //only show stack trace during development.
  });
};

module.exports = errorHandler;
