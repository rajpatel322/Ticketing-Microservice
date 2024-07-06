import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
    var signin: () => string[];
}

let mongo: any;

beforeAll(async () =>{
    process.env.JWT_KEY = 'asdfasdf'
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri,{});
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for(let collection of collections) {
        await collection.deleteMany({}); // delete the data (reset the data for each test)
    }

});

afterAll( async () =>{
    if (mongo) {
        await mongo.stop();
    }
    await mongoose.connection.close();
});

global.signin = () => {
    // Build a JWT payload
    const payload = {
        id: '123123',
        email: 'test@test.com'
    }
    // Create JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build session object {jwt: MY_JWT}
    const session = {jwt: token};

    // Turn that session into JSON
    const sessioJSON = JSON.stringify(session);

    // Take JSON and encode it as base46
    const base64 = Buffer.from(sessioJSON).toString('base64');

    // return a string thats the cookie with the encoded data
    return [`session=${base64}`];
}