import { ApolloClient, InMemoryCache } from "@apollo/client";
import Axios from "axios";
import { configure } from "axios-hooks";

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
