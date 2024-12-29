import { Popover, PopoverProps, useColorScheme } from "@mui/material";
import RealEmojiPicker from "@emoji-mart/react";
import Data from "@emoji-mart/data";
import { init } from "emoji-mart";

init({ data: Data });

interface EmojiPickerProps {
	anchorEl: PopoverProps["anchorEl"];
	onClose: (picked: Emoji | null) => void;
}

export interface Emoji {
	aliases: string[];
	id: string;
	keywords: string[];
	name: string;
	native: string;
	shortcodes: string;
	skin?: number;
	unified: string;
}

export function EmojiPicker({ anchorEl, onClose }: EmojiPickerProps) {
	const { colorScheme } = useColorScheme();
	return (
		<Popover open={Boolean(anchorEl)} anchorEl={anchorEl} keepMounted
		         onClose={() => onClose(null)}
		         slotProps={{
			         paper: {
				         sx: {
					         background: "transparent",
					         border: "none",
					         borderRadius: "8px",
				         },
			         },
		         }}
		         anchorOrigin={{ vertical: "top", horizontal: "left" }}
		         transformOrigin={{ vertical: "bottom", horizontal: "left" }}>
			{/*<RealEmojiPicker emojiStyle={} onEmojiClick={onClose}*/}
			{/*                 suggestedEmojisMode={SuggestionMode.RECENT}*/}
			{/*                 theme={colorScheme === "dark" ? Theme.DARK : Theme.AUTO} />*/}
			{/*{createElement("emoji-picker", { ref })}*/}
			<RealEmojiPicker set={"apple"} onEmojiSelect={(emoji: Emoji) => onClose(emoji)}
			                 data={Data} theme={colorScheme === "dark" ? "dark" : "auto"} />
		</Popover>
	);
}