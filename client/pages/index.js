import axios from 'axios';


const LandingPage = ({ currentUser }) => {
    console.log(currentUser);
    axios.get('/api/users/currentuser').catch((err) => {
      console.log(err.message);
    });
   
    return <h1>Landing Page</h1>;
  };


// LandingPage.getInitialProps = async () => {

//     const response = await axios.get('/api/users/currentuser');
//     console.log("I am on server");

//     return response.data;
// };


export default LandingPage;