import express, {Request, Response} from 'express';
import {body} from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';

import { validationRequest } from '../middlewares/validate-request';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signup', [
    body('email').isEmail().withMessage("Invalid Email, please enter valid email"),
    body('password').trim().isLength({min: 4, max: 20}).withMessage('Password must be between 4 and 20 characters')
],
validationRequest,
async (req: Request, res: Response)=> {
    const {email, password} = req.body;

    const exisitingUser = await User.findOne({email});
    
    if (exisitingUser) {
        throw new BadRequestError("Email in use");
    }

    const user = User.build({email, password});

    await user.save();

    // generate json web token
    const userJwt = jwt.sign({
        id: user.id,
        email: user.email
    }, process.env.JWT_KEY!);


    // save the token to caches

    req.session = {
        jwt: userJwt
    };

    res.status(201).send(user);
    
});


export {router as signupRouter};