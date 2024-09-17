const OrderIndex = ({orders}) => {
    const OrderList = orders.map((o) => {
		if (o.status === "complete") {
            return (
                <tr key={o.id}>
                    <td className="bg-success">{o.ticket.title}</td>
                    <td className="bg-success">{o.status}</td>
                </tr>
            );
        } else {
            return (
                <tr key={o.id}>
                    <td className="bg-danger">{o.ticket.title}</td>
                    <td className="bg-danger">{o.status}</td>
                </tr>
            );
        }
	});

    return (<div className="container text-center">
                

            <h1>Tickets</h1>
                <table className="table table-dark table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {OrderList}
                    </tbody>
                </table>
        </div>);
}


OrderIndex.getInitialProps = async (context, client) => {
    const {data} = await client.get('/api/orders');
    return {orders: data};
};

export default OrderIndex;