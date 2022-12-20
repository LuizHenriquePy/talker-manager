const errorHandler = (error, _req, res, _next) => {
  console.log(error.message);
  console.log(error.status);
  return res.status(error.status || 500).json({ message: error.message || 'Something went wrong' });
};

module.exports = errorHandler;