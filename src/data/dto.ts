export interface LoginRequestDTO {
	email: string;
	password: string;
}

export interface LoginResponseDTO {
	accessToken: string;
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
