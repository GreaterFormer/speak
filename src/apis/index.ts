import axios, { AxiosHeaders } from "axios";
import { AUTH_TOKEN } from "constant";

const API = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
});

API.interceptors.request.use((config: any) => {
    try {
        const token = localStorage.getItem(AUTH_TOKEN);
        if (token) {
            const mHeaders = AxiosHeaders.from({
                Authorization: `Bearer ${token.substring(1, token.length - 1)}`,
            });

            if (mHeaders) {
                config.headers = mHeaders;
            }
        }
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
const GetEventLogs = (ipfsUrl: string) => API.get(`/contract/getEventLogsFor/${ipfsUrl}/OrderFilled`);

const GetOrders = (bettingOptionUrl: string) => API.get(`/orders?bettingOptionUrl=${bettingOptionUrl}`);
const ConfirmCancelAll = (data: any) => API.delete('/orders', data);
const CancelOrder = (id: any) => API.delete(`/orders/${id}`);
const OrderMatch = (data: any) => API.post('/orders/match', data);

const GetBalance = (address: string) => API.get(`/contract/balance/${address}`);
const GetConditionalBalance = (data: any) => API.post('/contract/getConditionalTokenBalanceOf', data);
const GetTokenIds = (ipfsUrl: string) => API.get(`/contract/getTokenIds/${ipfsUrl}`);
const GetUser = (address: string) => API.get(`/users?publicAddress=${address}`);

const Authenticate = (data: any) => API.post('/auth', data);
const SignUp = (data: any) => API.post('/users', data);
const SendEmail = (data: any) => API.post('/auth/email/send', data);

export const apis = {
    Authenticate,
    SignUp,
    SendEmail,

    GetEvents,
    GetEventLogs,

    GetOrders,
    ConfirmCancelAll,
    CancelOrder,
    OrderMatch,

    GetBalance,
    GetConditionalBalance,
    GetTokenIds,
    GetUser
};