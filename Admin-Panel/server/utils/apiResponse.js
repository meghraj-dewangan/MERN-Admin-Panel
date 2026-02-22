/**
 * Consistent API response format
 */

function success(res, data = null, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

function error(res, message = 'Something went wrong', statusCode = 500, errors = null) {
  const response = {
    success: false,
    message,
  };
  if (errors) response.errors = errors;
  return res.status(statusCode).json(response);
}

function created(res, data = null, message = 'Created successfully') {
  return success(res, data, message, 201);
}

function unauthorized(res, message = 'Unauthorized') {
  return error(res, message, 401);
}

function forbidden(res, message = 'Forbidden — insufficient permissions') {
  return error(res, message, 403);
}

function notFound(res, message = 'Resource not found') {
  return error(res, message, 404);
}

function badRequest(res, message = 'Bad request', errors = null) {
  return error(res, message, 400, errors);
}

export { success, error, created, unauthorized, forbidden, notFound, badRequest };
