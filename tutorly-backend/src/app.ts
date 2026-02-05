import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { errorResponse } from './utils/response';



const app = express();


app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


app.get('/', (req: Request, res: Response) => {
  res.send('Tutorly Backend is running')
})

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  errorResponse(res, err, err.statusCode || 500);
});

export default app;