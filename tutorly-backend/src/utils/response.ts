import { Response } from 'express';

export const successResponse = (
  res: Response,
  data: any,
  message = 'Success',
  statusCode = 200
) => {
  return res.status(statusCode).json({ success: true, message, data });
};

export const errorResponse = (
  res: Response,
  error: any,
  statusCode = 400
) => {
  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Something went wrong',
    error,
  });
};