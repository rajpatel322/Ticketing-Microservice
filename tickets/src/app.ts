import express from 'express';
import 'express-async-errors'
import {json} from 'body-parser';
import createTicketRouter from './routes/new';
import { showTicketRouter } from './routes/show';

import { errorHandler, NotFoundError, currentUser} from '@rpateltickets/common';
import cookieSession from 'cookie-session';

export const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}))

app.use(currentUser);

app.use(createTicketRouter);
app.use(showTicketRouter);

app.all('*', async (req, res, next)=> {
    throw new NotFoundError();
});


app.use(errorHandler);

