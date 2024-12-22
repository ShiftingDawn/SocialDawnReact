import Axios from "axios";
import { configure } from "axios-hooks";

export const axios = Axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true
});

configure({ axios });