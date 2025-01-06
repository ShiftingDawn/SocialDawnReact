import { gql } from "@apollo/client";

export const QUERY_GET_DMS = gql`
	query GetDms {
		dms {
			id
			user {
				username
				thumbnail
			}
		}
	}
`;

export const QUERY_GET_DM = gql`
	query GetDm($dmId: String!) {
		dm(dmId: $dmId) {
			id
			user {
				username
				thumbnail
			}
		}
	}
`;

export const QUERY_GET_DM_MESSAGES = gql`
	query GetDmMessages($dmId: String!, $lastMessage: String, $take: Int!) {
		dmMessages(dmId: $dmId, last: $lastMessage, take: $take) {
			id
			sentAt
			content
			responseTo {
				id
			}
			sender {
				username
			}
		}
	}
`;

export const QUERY_GET_FRIENDS = gql`
	query GetFriends {
		friends {
			id
			user {
				username
				thumbnail
			}
			since
		}
	}
`;

export const QUERY_GET_FRIEND = gql`
	query GetFriend($friendId: String!) {
		friend(friendId: $friendId) {
			id
			user {
				username
				thumbnail
			}
			since
			dm {
				id
			}
		}
	}
`;

export const QUERY_GET_FRIEND_REQUESTS = gql`
	query GetFriendRequests {
		friendRequest {
			sent {
				id
				user {
					username
				}
				sentAt
			}
			received {
				id
				user {
					username
				}
				sentAt
			}
		}
	}
`;
