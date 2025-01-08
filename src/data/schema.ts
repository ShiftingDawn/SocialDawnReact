export interface UserDTO {
	username: string;
	thumbnail: string;
}

export interface SelfUserDTO extends UserDTO {
	email: string;
}

export interface FriendDTO {
	id: string;
	since: Date;
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
	sentAt: Date;
}

export interface DmDTO {
	id: string;
	messages: DmMessageDTO[];
	lastUpdate: Date;
}

export interface DmMessageDTO {
	id: string;
	sender: UserDTO;
	sentAt: Date;
	content: string;
}
