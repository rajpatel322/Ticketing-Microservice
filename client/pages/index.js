import Link from "next/link";

const LandingPage = ({ currentUser, tickets }) => {
	const ticketList = tickets.map((t) => {
		return (
            <tr key={t.id} >
                <td className="bg-danger">{t.title}</td>
                <td className="bg-success">{t.price}</td>
                <td>
                    <Link href="/tickets/[ticketId]" as={`/tickets/${t.id}`}>
                        View
                    </Link>
                </td>
            </tr>
		);
	});

    return (<div className="container text-center">
            <h2>Tickets</h2>
                <table className="table table-dark table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Price</th>
                            <th>Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ticketList}
                    </tbody>
                </table>
            </div>
        );
};


//Server side rendering procress
LandingPage.getInitialProps = async (context, client, currentUser) => {
    const {data} = await client.get('/api/tickets');

    return {tickets: data};
};  


export default LandingPage;