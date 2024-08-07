import express, {Response, Request} from 'express';
import { body } from 'express-validator';

import { User } from '../models/user';
import { Password } from '../hashing/password';
import { validationRequest, BadRequestError } from '@rpateltickets/common';
import jwt from 'jsonwebtoken';


const router = express.Router();

router.post('/api/users/signin', [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must enter a password')
], validationRequest, async (req: Request, res: Response)=> {
    const {email, password} = req.body;

    const exitingUser = await User.findOne({email});

    if(!exitingUser) {
        throw new BadRequestError("Invalid credentials");
    }


    const passwordMatch = await Password.compare(exitingUser.password, password);

    if(!passwordMatch) {
        throw new BadRequestError("Invalid Password");
    }

    // Generate JWT
    const userJwt = jwt.sign(
        {
            id: exitingUser.id,
            emai: exitingUser.email
        },
        process.env.JWT_KEY!
    );

    // store in on session object

    req.session = {
        jwt: userJwt
    };

    res.status(200).send(exitingUser);
});


export {router as signinRouter};