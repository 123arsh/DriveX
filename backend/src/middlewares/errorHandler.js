export default function errorHandler(err, req, res, next) {
  console.error('Error:', {
    message: err.message,
    code: err.code,
    status: err.status || 500,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
  
  const status = err.status || 500;
  const response = {
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString(),
  };
  
  // Include additional context in development
  if (process.env.NODE_ENV !== 'production') {
    response.code = err.code;
    response.stack = err.stack;
  }
  
  res.status(status).json(response);
}
