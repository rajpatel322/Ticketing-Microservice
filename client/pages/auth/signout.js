import { useEffect } from "react";
import request from "../../hooks/use-request";
import Router from "next/router";

const SignOut = () => {
    const { doRequest} = request ({
        url : '/api/users/signout',
        method: 'post',
        body: {},
        onSuccess: () => Router.push('/')
    });

    useEffect(()=>{
        doRequest();

    }, []);

    return <div> Signing you out ....</div>;
};


export default SignOut;