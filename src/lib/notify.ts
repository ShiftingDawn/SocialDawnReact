import { createElement } from "react";
import { AlertColor } from "@mui/material";
import { toast } from "sonner";
import { Notification } from "@sys/Notification.tsx";

export function notify(message: string, type: AlertColor) {
	toast.custom(t => createElement(Notification, {
		toastId: t,
		type,
		message,
	}));
}

export function info(message: string) {
	notify(message, "info");
}

export function success(message: string) {
	notify(message, "success");
}

export function warning(message: string) {
	notify(message, "warning");
}

export function error(message: string) {
	notify(message, "error");
}