export interface LoginRequestDTO {
	email: string;
	password: string;
}

export interface LoginResponseDTO {
	loginToken: string | null;
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

export interface OneTimeCodeRequestDTO {
	code: string;
}

export interface LoginCodeRequestDTO {
	token: string;
	code: string;
}

export interface TotpStatusResponseDTO {
	totpState: "disabled" | "needs_validation" | "enabled";
}
