import Dexie, {type EntityTable} from "dexie";

export const db = new Dexie("socialdawn") as Dexie & {
	messages: EntityTable<Messages, "id">
};
db.version(1).stores({
	messages: "++id, dm, sender, sendAt, content"
});

interface Messages {
	id: string;
	dm: string;
	sender: string;
	sendAt: number;
	content: string;
}