export interface UserDTO {
	username: string;
	thumbnail: string;
}

export interface SelfUserDTO extends UserDTO {
	email: string;
}

export interface FriendDTO {
	id: string;
	since: string;
	user: UserDTO;
	dm: DmDTO;
}

export interface FriendRequestListDTO {
	sent: FriendRequestDTO[];
	received: FriendRequestDTO[];
}

export interface FriendRequestDTO {
	id: string;
	user: UserDTO;
	sentAt: string;
}

export interface DmDTO {
	id: string;
	messages: DmMessageDTO[];
	lastUpdate: string;
}

export interface DmMessageDTO {
	id: string;
	sender: UserDTO;
	sentAt: string;
	content: string;
}
