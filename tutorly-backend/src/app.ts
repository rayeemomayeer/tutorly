import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { errorResponse } from './utils/response';
import { toNodeHandler } from "better-auth/node";
import categoryRoutes from "./modules/categories/category.routes";
import config from './config/env';
import { auth } from './lib/auth';
import tutorRouters from './modules/tutors/tutor.routes';
import bookingRoutes from './modules/bookings/booking.routes';
import reviewRouters from './modules/reviews/review.routes';
import adminRouters from './modules/admin/admin.routes';

const app = express()

app.use(cors({
    origin: config.APP_URL || "http://localhost:4000", // client side url
    credentials: true
}))

app.all("/api/auth/*splat", toNodeHandler(auth)); 

app.use(express.json());
app.use(morgan('dev'));



app.get('/', (req: Request, res: Response) => {
  res.send('Tutorly Backend is running')
})


app.use("/api/category", categoryRoutes);
app.use("/api/tutor", tutorRouters);
app.use("/api/booking", bookingRoutes);
app.use("/api/review", reviewRouters);
app.use("/api/admin", adminRouters)





// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  errorResponse(res, err, err.statusCode || 500);
});

export default app;