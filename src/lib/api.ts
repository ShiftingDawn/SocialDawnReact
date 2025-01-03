import { ApolloClient, InMemoryCache } from "@apollo/client";
import Axios, { AxiosRequestConfig } from "axios";
import useAxios, { Options, configure } from "axios-hooks";
import { ErrorResponse } from "#/ErrorResponse";

export function getApiBaseUrl(): string {
	const metaApiUrlElement = document.querySelector("meta[name='api_url']");
	const result = (function () {
		if (metaApiUrlElement) {
			return metaApiUrlElement.getAttribute("content")!;
		} else {
			return import.meta.env.VITE_API_URL;
		}
	})();
	return result.endsWith("/") ? result : result + "/";
}

Axios.defaults.withCredentials = true;
Axios.defaults.baseURL = getApiBaseUrl();

configure({ axios: Axios, cache: false });

export const apollo = new ApolloClient({
	uri: `${getApiBaseUrl()}graphql`,
	cache: new InMemoryCache(),
	credentials: "include",
});

//TODO remove
/**
 * @deprecated
 */
export function useApi<TResponse = any, TBody = any, TError = ErrorResponse>(
	config: AxiosRequestConfig<TBody> | string,
	option?: Options,
) {
	return useAxios<TResponse, TBody, TError>(config, option);
}
