import Axios, { AxiosRequestConfig } from "axios";
import useAxios, { configure, Options } from "axios-hooks";
import { ErrorResponse } from "#/ErrorResponse";

export function getApiBaseUrl(): string {
	const result = import.meta.env.VITE_API_URL;
	return result.endsWith("/") ? result : result + "/";
}

export const axios = Axios.create({
	baseURL: getApiBaseUrl(),
	withCredentials: true,
});

configure({ axios, cache: false });

export function useApi<TResponse = any, TBody = any, TError = ErrorResponse>(
	config: AxiosRequestConfig<TBody> | string,
	option?: Options,
) {
	return useAxios<TResponse, TBody, TError>(config, option);
}
