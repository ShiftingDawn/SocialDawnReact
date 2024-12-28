import { createElement } from "react";
import { AlertColor } from "@mui/material";
import { toast } from "sonner";
import { FlashMessage } from "@sys/FlashMessage.tsx";

export function flash(message: string, type: AlertColor) {
	toast.custom(t => createElement(FlashMessage, {
		toastId: t,
		type,
		message,
	}), { id: message });
}

export function fInfo(message: string) {
	flash(message, "info");
}

export function fSuccess(message: string) {
	flash(message, "success");
}

export function fWarn(message: string) {
	flash(message, "warning");
}

export function fErr(message: string) {
	flash(message, "error");
}