import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
    return currentUser ? (<h1>You are signed in</h1>) : (<h1>You are NOT signed in</h1>);
  };


//Server side rendering procress
LandingPage.getInitialProps = async ({req}) => {

    const {data} = await buildClient({req}).get('/api/users/currentuser');
    return data;
};  


export default LandingPage;