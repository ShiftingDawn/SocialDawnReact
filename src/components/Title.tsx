import { Typography, TypographyProps } from "@mui/material";

export function PageTitle({ children, ...props }: Omit<TypographyProps<"h1">, "variant" | "component" | "textAlign">) {
	return (
		<Typography variant={"h4"} component="h1" textAlign={"center"} mb={1} {...props}>
			{children}
		</Typography>
	);
}