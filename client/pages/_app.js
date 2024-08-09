import 'bootstrap/dist/css/bootstrap.css'
import buildClient from '../api/build-client';
import Header from '../components/header';

const AppComponent = ({Component, pageProps, currentUser}) => {
    return <div style={{ backgroundColor: 'lightblue', minHeight: '100vh' }}>
                <Header currentUser={currentUser}/>
                <div className="container-md d-flex align-items-center justify-content-center">
                    <Component currentUser = {currentUser} {...pageProps} />
                </div>
        </div>
};

AppComponent.getInitialProps = async (appContext) => {
    // console.log(appContext);
    const client = buildClient(appContext.ctx);
    const {data} = await client.get('/api/users/currentuser');
    let pageProps = {};
    if(appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser);
    }
    console.log(pageProps);
    return { // go to the AppComponent's parameter
        pageProps,
        currentUser: data.currentUser
    };

}

export default AppComponent;