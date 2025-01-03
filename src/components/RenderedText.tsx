import { HTMLAttributes, ReactNode, createElement, useEffect, useState } from "react";
import { SearchIndex } from "emoji-mart";

interface RenderedTextProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
	children: string;
}

export function RenderedText({ children }: RenderedTextProps) {
	const [textToRender, setTextToRender] = useState<ReactNode[]>([children]);

	useEffect(() => {
		async function handle(): Promise<ReactNode[]> {
			const nodes: ReactNode[] = [];
			let newString = children;
			while (true) {
				const matches = newString.matchAll(/:[^:\s]*(?:::[^:\s]*)*:/gm);
				const nextMatch = matches.next();
				if (nextMatch.done) {
					nodes.push(newString);
					break;
				}
				const match = nextMatch.value;
				const id = match[0].substring(1, match[0].length - 1);
				const emojis: any[] = await SearchIndex.search(id);
				const emojiMatch = emojis.find((emoji) => emoji.id === id);
				const shortCode = `:${id}:`;
				if (emojiMatch) {
					nodes.push(
						newString.substring(0, match.index),
						createElement("em-emoji", { shortcodes: shortCode }),
					);
				} else {
					nodes.push(newString.substring(0, match.index + shortCode.length));
				}
				newString = newString.substring(match.index + shortCode.length);
			}

			return nodes;
		}

		handle().then(setTextToRender);
	}, [children]);

	return (
		<span>
			{textToRender.map((item, index) => (
				<span key={index}>{item}</span>
			))}
		</span>
	);
}
