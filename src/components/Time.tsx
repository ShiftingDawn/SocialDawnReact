import { useMemo } from "react";

export function Time({ value }: { value: Date | number }) {
	const v = useMemo(() => {
		if (typeof value === "number") {
			return new Date(value);
		} else return value;
	}, [value]);
	return <time dateTime={v.toISOString()}>{v.toLocaleString()}</time>;
}
