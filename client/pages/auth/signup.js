import {useState} from 'react';
import Router from 'next/router';
import request from '../../hooks/use-request';

const signup = ()=> {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {doRequest, errors} = request({
        url: '/api/users/signup',
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
                Sign Up
            </h1>
            <div className="form-group">
                <label>Email Address</label>
                <input value = {email} onChange = {e=> setEmail(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input value = {password} onChange = {e=> setPassword(e.target.value)} type="password" className="form-control" />
            </div>
            {errors}
            <button className="btn btn-primary">Sign Up</button>
        </form>
    )
};

export default signup;
