import { useEffect } from "react";

export function useEvent(name: string, callback: (event: Event) => void) {
	useEffect(() => {
		const c = callback;
		window.addEventListener(name, c);
		return () => window.removeEventListener(name, c);
	}, [name, callback]);
}

export function post(name: string, data?: any) {
	window.dispatchEvent(new CustomEvent(name, { detail: data }));
}
