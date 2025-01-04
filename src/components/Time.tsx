import { useMemo } from "react";

export function Time({ value }: { value: Date | string | number }) {
	const v = useMemo(() => {
		if (typeof value === "number" || typeof value === "string") {
			return new Date(value);
		} else return value;
	}, [value]);
	return <time dateTime={v.toISOString()}>{v.toLocaleString()}</time>;
}
