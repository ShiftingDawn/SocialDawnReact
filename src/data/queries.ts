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
	query GetFriendAndDM($friendId: ID!) {
		friend(friendId: $friendId) {
			id
			user {
				username
			}
		}
		dm(friendId: $friendId) {
			id
		}
	}
`;

export const QUERY_GET_DM_MESSAGES = gql`
	query GetDmMessages($friendId: ID!, $lastMessage: ID, $take: Int!) {
		dm(friendId: $friendId) {
			messages(last: $lastMessage, take: $take) {
				id
				sentAt
				content
				sender {
					username
				}
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

export const QUERY_GET_FRIEND_REQUESTS = gql`
	query GetFriendRequests {
		friendRequests {
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
