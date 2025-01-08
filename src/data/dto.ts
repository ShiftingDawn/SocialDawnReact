export interface LoginRequestDTO {
	email: string;
	password: string;
}

export interface LoginResponseDTO {
	token: string | null;
}

export interface RegisterRequestDTO {
	username: string;
	email: string;
	password: string;
}

export interface ChangePasswordRequestDTO {
	oldPassword: string;
	newPassword: string;
	confirmPassword: string;
}

export interface AddFriendRequestDTO {
	username: string;
}

export interface AcceptFriendRequestDTO {
	accept: boolean;
}

export interface LoginCodeRequestDTO {
	token: string;
	code: string;
}

export interface TotpStatusResponseDTO {
	totpState: "DISABLED" | "NEEDS_VALIDATION" | "ENABLED";
}

export interface EnableTotpResponseDTO {
	secret: string;
	qrcode: string;
}

export interface WebSocketSessionTokenResponseDTO {
	sessionId: string;
}
