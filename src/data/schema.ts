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
	user: UserDTO;
	messages: DmMessageDTO[];
}

export interface DmMessageDTO {
	id: string;
	sender: UserDTO;
	responseTo?: DmMessageDTO;
	sentAt: Date;
	content: string;
}
