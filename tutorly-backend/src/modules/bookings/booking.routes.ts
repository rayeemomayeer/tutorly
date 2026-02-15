import { Router } from "express";
import { BookingController } from "./booking.controller";
import authMiddleware from "src/middleware/authMiddleware";
import { validate } from "src/middleware/validate";
import { createBookingSchema } from "./booking.validation";
const bookingRouter = Router();


bookingRouter.post(
  "/",
  authMiddleware("booking", "create"),
  validate(createBookingSchema),
  BookingController.createBooking
);


bookingRouter.get("/", authMiddleware("booking", "read"), BookingController.getBookings);


bookingRouter.patch("/:id/cancel", authMiddleware("booking", "cancel"), BookingController.cancelBooking);


bookingRouter.patch("/:id/complete", authMiddleware("booking", "complete"), BookingController.completeBooking);


bookingRouter.get("/admin/all", authMiddleware("booking", "list"), BookingController.listAllBookings);

export default bookingRouter;