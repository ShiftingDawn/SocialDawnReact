import { Card, CardContent } from "@mui/material";
import { SectionTitle } from "$/Text.tsx";

export function SimpleCard({ children, title }: PC<{ title?: string }>) {
	return (
		<Card>
			{title && <SectionTitle>{title}</SectionTitle>}
			<CardContent>{children}</CardContent>
		</Card>
	);
}
