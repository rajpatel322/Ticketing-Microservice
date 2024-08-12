import { useEffect, useState } from "react";
import StripeCheckout from 'react-stripe-checkout';
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const OrderShow = ({order, currentUser}) => {

    

    const [timeLeft, settimeLeft] = useState({minutes: 0, seconds: 0});
    const {doRequest, errors} = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id
        },
        onSuccess: (payment) => {
            Router.push('/orders');
        }
    })

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            const minutes = Math.floor(msLeft / 60000); // 1 minute = 60000 ms
            const seconds = Math.floor((msLeft % 60000) / 1000); // Remaining seconds
            settimeLeft({minutes, seconds});
        };

        findTimeLeft();
        const timerId = setInterval(findTimeLeft, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, []);

    if(timeLeft.minutes < 0 && timeLeft.seconds < 0) {
        return <div><h1 className="text-danger fs-1 fw-bolder">
        Order Expired
                </h1></div>;
    }



    return <div className="container text-wrap">
        <h1>
            Time left to pay: {timeLeft.minutes}m {timeLeft.seconds}s
        </h1>
        <StripeCheckout token={(token) => doRequest({token:token.id})} stripeKey={process.env.NEXT_PUBLIC_STRIPE_PUB_KEY}
        amount = {order.ticket.price * 100} email = {currentUser.email} />
        <p className="text-danger font-weight-bold">
            **NOTE** enter 4242 4242 4242 4242 for the credit card number, 10/30 for the expiration date, and random 3 CVC. I used Stripe Developer mode so no payment will be made or charged 
        </p>
        {errors}
        </div>;
};


OrderShow.getInitialProps = async (context, client) => {
    const orderId = context.query.orderId;
    const {data} = await client.get(`/api/orders/${orderId}`);
    return {order: data};
};


export default OrderShow;