import axios, { AxiosHeaders } from "axios";

const API = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
});

API.interceptors.request.use((config: any) => {
    try {
        // const token = localStorage.getItem(AUTH_TOKEN);
        // if (token) {
        //   const mHeaders = AxiosHeaders.from({
        //     Authorization: `Bearer ${token}`,
        //   });

        //   if (mHeaders) {
        //     config.headers = mHeaders;
        //   }
        // }
    } catch (error) { }

    return config;
});

API.interceptors.response.use(
    (response: any) => {
        return response.data;
    },
    async (error: any) => {
        try {
            if (error.response.status === 401 && error.response.data.auth === true) {

            } else {
                return Promise.reject(error);
            }
        } catch (e) {
            console.log(error);
        }
    }
);

const GetEvents = () => API.get("/events/publishedUrls");
const GetOrders = (bettingOptionUrl: string) => API.get(`/orders?bettingOptionUrl=${bettingOptionUrl}`);
const GetBalance = (address: string) => API.get(`/contract/balance/${address}`);

export const apis = {
    GetEvents,
    GetOrders,
    GetBalance
};