import { A, D, O, S } from "@mobily/ts-belt";
import { useEffect, useReducer, useRef } from "react";
import { match } from "ts-pattern";
import { Preview } from "./components/preview";
import { TextArea } from "./components/text-area";

import "normalize.css";
import "./global.css";

type Command = "Normal" | "Insert";
type Action = { type: Command; key: KeyboardEventKey; element: HTMLTextAreaElement };
type BufferStoreMutation = (state: BufferStore, element: HTMLTextAreaElement) => BufferStore;
type BufferStore = {
	buffer: string[];
	pos: { col: number; line: number };
	mode: Command;
};

const normalModeAction: Partial<Record<KeyboardEventKey, BufferStoreMutation>> = {
	i: (state) => ({ ...state, mode: "Insert" }),
};

const insertModeAction: Partial<Record<KeyboardEventKey, BufferStoreMutation>> = {
	Escape: (state) => ({ ...state, mode: "Normal" }),
	Backspace: (state) => {
		const buffLine = state.buffer[state.pos.line];

		if (S.isEmpty(buffLine)) {
			if (state.pos.line <= 1) return { ...state };

			const line = state.pos.line;
			const col = state.pos.col - 1;
			const buffer =
				state.pos.col === state.buffer[line].length
					? (A.updateAt(state.buffer, line, (str) => str.slice(0, str.length - 1)) as string[])
					: (A.updateAt(state.buffer, line, (str) => str.slice(0, col).concat(str.slice(col + 1))) as string[]);

			return { ...state, buffer, pos: { col, line } };
		}
		const col = state.pos.col - 1;
		const line = state.pos.line;
		const buffer = A.updateAt(state.buffer, line, (str) => str.slice(0, str.length - 1)) as string[];

		return { ...state, buffer, pos: { col, line } };
	},
	ArrowLeft: (state, element) => {
		if (state.pos.col === 0 && state.buffer.length === 1) return { ...state };
		const line = state.pos.line;
		const isOnlyOneLine = state.buffer.length === 1;
		const rangeBufferPosition = isOnlyOneLine ? state.buffer : state.buffer.slice(0, line);
		const totalCharacter = A.reduce(rangeBufferPosition, 0, (acc, v) =>
			isOnlyOneLine ? acc + v.length : acc + v.length + 1,
		);
		const caretPosition = totalCharacter - (state.buffer[line].length - state.pos.col) - 1;

		// console.log("rangeBufferPosition: ", rangeBufferPosition);
		// console.log("totalCharacter " + totalCharacter);
		// console.log("caretPosition " + caretPosition);

		element.setSelectionRange(caretPosition, caretPosition);
		if (state.pos.col === 0) return { ...state, pos: { col: state.buffer[line - 1].length - 1, line: line - 1 } };
		return { ...state, pos: { col: state.pos.col - 1, line: state.pos.line } };
	},
	ArrowRight: (state, element) => {
		if (state.pos.col === state.buffer[state.pos.line].length && state.buffer[state.pos.line + 1] === undefined)
			return { ...state };
		const line = state.pos.line;
		const isOnlyOneLine = state.buffer.length === 1;
		const rangeBufferPosition = isOnlyOneLine ? state.buffer : state.buffer.slice(0, line);
		const totalCharacter = A.reduce(rangeBufferPosition, 0, (acc, v) =>
			isOnlyOneLine ? acc + v.length : acc + v.length + 1,
		);
		const caretPosition = totalCharacter - (state.buffer[line].length - state.pos.col) + 1;

		// console.log("rangeBufferPosition: ", rangeBufferPosition);
		// console.log("totalCharacter " + totalCharacter);
		// console.log("caretPosition " + caretPosition);

		element.setSelectionRange(caretPosition, caretPosition);
		if (state.pos.col === state.buffer[line].length) return { ...state, pos: { col: 0, line: line + 1 } };
		return { ...state, pos: { col: state.pos.col + 1, line: state.pos.line } };
	},
};

function reducer(state: BufferStore, action: Action): BufferStore {
	return match(action)
		.with({ type: "Normal" }, () => {
			const key = action.key;
			const keyAction = D.get(normalModeAction, key);

			return O.isNone(keyAction) ? { ...state } : keyAction(state, action.element);
		})
		.with({ type: "Insert" }, () => {
			const key = action.key;
			const keyAction = D.get(insertModeAction, key);
			const { col, line } = state.pos;

			if (O.isNone(keyAction)) {
				const buffer =
					col === state.buffer[line].length
						? A.updateAt(state.buffer, line, (str) => str.concat(key))
						: A.updateAt(state.buffer, line, (str) => str.slice(0, col).concat(key, str.slice(col)));

				return { ...state, buffer, pos: { col: col + 1, line } };
			}

			return keyAction(state, action.element);
		})
		.otherwise(() => state) as BufferStore;
}

export function App() {
	const textAreaRef = useRef<HTMLTextAreaElement>(null);
	const [state, dispatch] = useReducer(reducer, {
		buffer: [""],
		pos: { col: 0, line: 0 },
		mode: "Normal",
	});
	const buffer = A.join(state.buffer, "");

	useEffect(() => {
		const element = textAreaRef.current;
		const caretPosition = state.pos.col;

		element?.setSelectionRange(caretPosition, caretPosition);
	}, [state]);
	return (
		<>
			<div className="container">
				<Preview className="preview">{buffer}</Preview>
				<TextArea
					onKeyDown={(event) => {
						event.preventDefault();
						const key = event.key as KeyboardEventKey;
						const element = event.target as HTMLTextAreaElement;
						const type = state.mode;

						console.log("\nkey press: ", key);
						console.log(state);
						console.log(element.selectionStart, element.selectionEnd);

						dispatch({ key, type, element });
					}}
					value={buffer}
					spellCheck={false}
					ref={textAreaRef}
					onChange={() => {}}
				/>
			</div>
			<div className="statusline">
				<span className="mode" data-mode={state.mode}>
					{state.mode}
				</span>
			</div>
		</>
	);
}
