import { Alert, AlertColor } from "@mui/material";
import { ReactNode } from "react";
import { toast } from "sonner";

interface NotificationProps {
	toastId: number | string;
	type: AlertColor;
	message: ReactNode;
}

export function FlashMessage({ toastId, type, message }: NotificationProps) {
	return (
		<Alert severity={type} onClick={() => toast.dismiss(toastId)}
			   sx={{ width: "var(--width)", boxShadow: 1 }}>
			{message}
		</Alert>
	);
}