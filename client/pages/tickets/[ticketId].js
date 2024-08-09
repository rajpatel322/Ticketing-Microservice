import Router from "next/router";
import useRequest from "../../hooks/use-request";


const TicketShow = ({ticket}) => {

    const {doRequest, errors} = useRequest({
        url: '/api/orders',
        method: 'post',
        body: {
            ticketId: ticket.id
        },
        onSuccess: (order) => Router.push('/orders/[orderId]', `/orders/${order.id}`)
    });

    return (
        <div className="row align-items-center">
            <h1>{ticket.title}</h1>
            <h4>Price: {ticket.price}</h4>
            {errors}
            <button className="btn btn-primary" onClick={()=> doRequest()}>Purchase</button>
        </div>
    );
};

TicketShow.getInitialProps = async (context, client) => {
    // console.log(context);
    const ticketId = context.query.ticketId;
    const {data} = await client.get(`/api/tickets/${ticketId}`);

    return {ticket: data};
};

export default TicketShow;