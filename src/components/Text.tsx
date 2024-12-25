import { Typography, TypographyProps } from "@mui/material";

export function PageTitle({ children, ...props }: Omit<TypographyProps<"h1">, "variant" | "component" | "textAlign">) {
	return (
		<Typography variant={"h4"} component="h1" textAlign={"center"} mb={1} {...props}>
			{children}
		</Typography>
	);
}

export function SectionTitle({
								 children, ...props
							 }: Omit<TypographyProps<"h3">, "variant" | "component" | "textAlign">) {
	return (
		<Typography variant={"h5"} component="h2" textAlign={"center"} mb={1} {...props}>
			{children}
		</Typography>
	);
}

export function Caption({ children, ...props }: Omit<TypographyProps<"p">, "variant" | "component">) {
	return (
		<Typography variant={"caption"} component="p" {...props}>
			{children}
		</Typography>
	);
}