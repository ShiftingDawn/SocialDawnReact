import Axios, { AxiosRequestConfig } from "axios";
import useAxios, { configure, Options } from "axios-hooks";
import { ErrorResponse } from "#/ErrorResponse.d.ts";

export const axios = Axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
});

configure({ axios });

export function useApi<TResponse = any, TBody = any, TError = ErrorResponse>(
	config: AxiosRequestConfig<TBody> | string,
	option?: Options,
) {
	return useAxios<TResponse, TBody, TError>(config, option);
}