import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, from } from "@apollo/client";
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
Axios.interceptors.request.use(
	(request) => {
		const csrfCookie = document.cookie.split(";").find((item) => item.startsWith("XSRF-TOKEN="));
		if (csrfCookie) {
			request.headers["X-XSRF-TOKEN"] = csrfCookie.substring("XSRF-TOKEN=".length);
		}
		return request;
	},
	(error) => Promise.reject(error),
);

configure({ axios: Axios, cache: false });

const csrfLink = new ApolloLink((operation, forward) => {
	const csrfCookie = document.cookie.split(";").find((item) => item.startsWith("XSRF-TOKEN="));
	if (csrfCookie) {
		operation.setContext(({ headers }: any) => ({
			headers: {
				["X-XSRF-TOKEN"]: csrfCookie.substring("XSRF-TOKEN=".length),
				...headers,
			},
		}));
	}
	return forward(operation);
});

export const apollo = new ApolloClient({
	cache: new InMemoryCache(),
	link: from([
		csrfLink,
		new HttpLink({
			uri: `${getApiBaseUrl()}graphql`,
			credentials: "include",
		}),
	]),
});
