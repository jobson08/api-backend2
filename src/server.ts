import express, { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import { UserRoutes } from './routes/UserRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(cors({
    methods:[ "GET", "POST", "PUT", "PATCH", "DELETE"]
}));

app.use(express.json());

const userRoutes = new UserRoutes().getRoutes();

app.use('/user', userRoutes)

app.use((err:Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof Error){
        return response.status(400).json({
            message: err.message,
        });
    }
    return response.status(500).json({
        message: 'Interno Server Error',
    })
},
);

app.listen(port, ()=> console.log(`server is running at http://localhost:${port}`));