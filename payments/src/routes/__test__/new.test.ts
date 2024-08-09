import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/orders";
import { OrderStatus } from "@rpateltickets/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payments";

// jest.mock('../../stripe');

it('returns a 404 when purchasing an order that does not exist', async() => {
    await request(app).post('/api/payments').set('Cookie', global.signin()).send({token: '123123', orderId: new mongoose.Types.ObjectId().toHexString()}).expect(404);
});

it('returns a 401 when purchasing an order that doesnt belong to the user', async() => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        version: 0,
        userId: new mongoose.Types.ObjectId().toHexString(),
        price: 10
    });

    await order.save();

    await request(app).post('/api/payments').set('Cookie', global.signin()).send({token: 'asdasd', orderId: order.id}).expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Cancelled,
        version: 0,
        userId: userId,
        price: 10
    });

    await order.save();

    await request(app).post('/api/payments').set('Cookie', global.signin(userId)).send({token: '123123', orderId: order.id}).expect(400);
});

it('returns a 201 with valid inputs', async ()=> {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random()*100000);
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        version: 0,
        userId: userId,
        price: price
    });

    await order.save();

    await request(app).post('/api/payments').set('Cookie', global.signin(userId)).send({
        token: 'tok_visa',
        orderId: order.id
    }).expect(201);

    const stripPayments = await stripe.charges.list({
        limit: 50
    });
    // console.log(stripPayments);
    const stripPayment = stripPayments.data.find(p => {
        return p.amount === price * 100;
    });


    expect(stripPayment).toBeDefined();
    // console.log(stripPayment);
    const payment = await Payment.findOne({
        orderId: order.id,
        stripId: stripPayment!.id
    });

    expect(payment).not.toBeNull();
    console.log(payment?.toJSON());
    // const paymentOptions = (stripe.paymentIntents.create as jest.Mock).mock.calls[0][0];

    // expect(paymentOptions.payment_method).toEqual('pm_card_visa');
    // expect(paymentOptions.amount).toEqual(10*100);
    // expect(paymentOptions.currency).toEqual('usd');


});