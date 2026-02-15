import { Request, Response } from "express";
import { BookingService } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  const { tutorId, date, duration } = req.body;
  const studentId = (req as any).session.user.id;
  const booking = await BookingService.createBooking(studentId, tutorId, date, duration);
  res.status(201).json(booking);
};

const getBookings = async (req: Request, res: Response) => {
  const userId = (req as any).session.user.id;
  const role = (req as any).session.user.role;
  const bookings = await BookingService.getBookings(userId, role);
  res.json(bookings);
};

const cancelBooking = async (req: Request, res: Response) => {
  const { id } = req.params;
  const booking = await BookingService.cancelBooking(id as string);
  res.json(booking);
};

const completeBooking = async (req: Request, res: Response) => {
  const { id } = req.params;
  const booking = await BookingService.completeBooking(id as string);
  res.json(booking);
};

const listAllBookings = async (req: Request, res: Response) => {
  const bookings = await BookingService.listAllBookings();
  res.json(bookings);
};

export const BookingController = {
  createBooking,
  getBookings,
  cancelBooking,
  completeBooking,
  listAllBookings,
};