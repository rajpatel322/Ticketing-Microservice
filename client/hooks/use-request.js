import axios from 'axios';
import {useState} from 'react';


const useRequest = ({url, method, body, onSuccess}) => {
    const [errors, setErrors] = useState(null);

    const  doRequest = async (props = {}) => {
        try {
            setErrors(null);
            const response = await axios[method](url,
                {...body, ...props} // using ... we can extract the properties from body and props in a flat object. Don't do {body, props}
            )
            if(onSuccess) {
                onSuccess(response.data);
            }
            return response.data;
        } catch (err) {
            setErrors(<div className="alert alert-danger">
                <h4>Ohhh no...</h4>
                <ul className='my-0'>
                    {err.response.data.errors.map(err=> <li key={err.message}>{err.message}</li>)}
                </ul>
            </div>)
        }
    };


    return {doRequest, errors};
}

export default useRequest;