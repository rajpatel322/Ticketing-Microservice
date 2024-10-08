import axios from 'axios';

const buildClient = ({req}) => {
    if(typeof window === 'undefined') {
        return axios.create({

            // baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            baseURL: 'http://www.ticketpatel.xyz',
            headers: req.headers
        })
    } else {
        return axios.create({
            baseUrl : "/"
        })
    }
}


export default buildClient;