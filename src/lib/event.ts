import { useEffect } from "react";

export function useEvent(name: string, callback: (event: Event) => void) {
	useEffect(() => {
		window.addEventListener(name, callback);
		return () => window.removeEventListener(name, callback);
	}, [name, callback]);
}

export function post(name: string, data?: any) {
	window.dispatchEvent(new CustomEvent(name, { detail: data }));
}
