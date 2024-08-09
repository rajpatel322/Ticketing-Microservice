import express from 'express';
import 'express-async-errors'
import {json} from 'body-parser';
import { createChargeRouter } from './routes/new';

import { errorHandler, NotFoundError, currentUser} from '@rpateltickets/common';
import cookieSession from 'cookie-session';

export const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: false
}))

app.use(currentUser);
app.use(createChargeRouter);


app.all('*', async (req, res, next)=> {
    throw new NotFoundError();
});


app.use(errorHandler);

