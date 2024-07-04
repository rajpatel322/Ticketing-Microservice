import 'bootstrap/dist/css/bootstrap.css'
import buildClient from '../api/build-client';
import Header from '../components/header';
const AppComponent = ({Component, pageProps, currentUser}) => {
    return <div>
        <Header currentUser={currentUser}/> 
        <Component {...pageProps} />
        </div>
};

AppComponent.getInitialProps = async (appContext) => {
    // console.log(appContext);
    const client = buildClient(appContext.ctx);
    const {data} = await client.get('/api/users/currentuser');
    let pageProps = {};
    if(appContext.Component.getInitialProps) { // if the page doesn't have getInitialProps then don't call the await function
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }
    console.log(pageProps);
    return {
        pageProps,
        currentUser: data.currentUser
    };

}

export default AppComponent;