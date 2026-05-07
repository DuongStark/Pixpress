class HttpError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

function notFoundHandler(req, res, next) {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err && err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      success: false,
      error: {
        code: "FILE_TOO_LARGE",
        message: "Uploaded file is too large.",
      },
    });
  }

  const statusCode = Number.isInteger(err && err.statusCode) ? err.statusCode : 500;
  const isServerError = statusCode >= 500;
  const message = isServerError ? "Internal server error." : err.message;

  const payload = {
    success: false,
    error: {
      code: err && err.code ? String(err.code) : "ERROR",
      message,
    },
  };

  if (err && err.details !== undefined) {
    payload.error.details = err.details;
  }

  if (process.env.NODE_ENV !== "production" && err && err.stack) {
    payload.error.stack = err.stack;
  }

  return res.status(statusCode).json(payload);
}

module.exports = {
  HttpError,
  notFoundHandler,
  errorHandler,
};
