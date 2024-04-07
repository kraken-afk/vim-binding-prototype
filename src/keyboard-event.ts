import type { Dispatch, SetStateAction } from "react";

export const keyboardHandler: Partial<
	Record<
		KeyboardEventKey,
		(
			state: [string, Dispatch<SetStateAction<string>>],
			element: HTMLTextAreaElement,
		) => void
	>
> = {
	Backspace: ([buffer, setBuffer]) => {
		const { length } = buffer;
		setBuffer((prev) => prev.slice(0, length - 1));
	},
	Enter: ([_, setBuffer]) => {
		setBuffer((prev) => prev.concat("\n"));
	},
	Tab: ([_, setBuffer]) => {
		setBuffer((prev) => prev.concat("\t"));
	},
};
