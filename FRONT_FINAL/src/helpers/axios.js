import axios from "axios"
import { BASE_URL } from "../configs"

const _axios = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials':'true',
    },
    withCredentials: true,
    crossDomain: true,
})

_axios.interceptors.request.use(async (config) => {
    const token = sessionStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default _axios