module.exports = (err, req, res, next) => {
   console.error('Unhandled Error:', err);
   res.status(500).json({
      message: 'Internal Server Error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
   });
};