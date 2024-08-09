import {useState} from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const signup = ()=> {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {doRequest, errors} = useRequest({
        url: '/api/users/signin',
        method: 'post',
        body: {
            email, password
        },
        onSuccess: () => Router.push('/') // callback
    });

    const onSubmit = async event => {
        event.preventDefault();
        // console.log(email, password);
        doRequest();
    };

    return (
            <form onSubmit = {onSubmit}>
                <h1>
                    Sign In
                </h1>
                <div className="form-group pt-3">
                    <label>Email Address</label>
                    <input value = {email} onChange = {e=> setEmail(e.target.value)} className="form-control" />
                </div>
                <div className="form-group pt-3 pb-3">
                    <label>Password</label>
                    <input value = {password} onChange = {e=> setPassword(e.target.value)} type="password" className="form-control" />
                </div>
                {errors}
                <button className="btn btn-primary">Sign In</button>
            </form>
        
    )
};

export default signup;
