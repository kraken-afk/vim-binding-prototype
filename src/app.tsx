import "normalize.css";
import "./global.css";
import { Preview } from "./components/preview";
import { TextArea } from "./components/text-area";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { keyboardHandler } from "./keyboard-event";

export function App() {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [buffer, setBuffer] = useState<string>("");
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const handler = useMemo<
    Partial<
      Record<
        keyof HTMLElementEventMap,
        (
          event: KeyboardEvent<HTMLTextAreaElement> & {
            target: HTMLInputElement;
          },
        ) => void
      >
    >
  >(
    () => ({
      keydown: (event) => {
        event.preventDefault();

        const key = event.key as KeyboardEventKey;

        if (key in keyboardHandler) {
          keyboardHandler[key]?.call(
            null,
            [buffer, setBuffer],
            textAreaRef.current as HTMLTextAreaElement,
          );
          console.log(event.target.value);
        } else if (
          key !== "ArrowRight" &&
          key !== "ArrowLeft" &&
          key !== "ArrowDown" &&
          key !== "CapsLock" &&
          key !== "ArrowUp" &&
          key !== "Control" &&
          key !== "Escape" &&
          key !== "Shift" &&
          key !== "Home" &&
          key !== "Meta" &&
          key !== "Alt" &&
          key !== "End" &&
          key !== "F1" &&
          key !== "F2" &&
          key !== "F3" &&
          key !== "F4" &&
          key !== "F5" &&
          key !== "F6" &&
          key !== "F7" &&
          key !== "F8" &&
          key !== "F9"
        ) {
          // default implementation / insert ch;aracter into buffer
          setBuffer((prev) => prev.concat(key));
        }
      },
    }),
    [],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const element = textAreaRef.current;
    element?.addEventListener;

    for (const h in handler) {
      // @ts-ignore
      element?.addEventListener(h, handler[h]);
    }
  }, [handler, buffer]);

  return (
    <div className="container">
      <Preview className="preview">{buffer}</Preview>
      <TextArea spellCheck={false} ref={textAreaRef} value={buffer} onChange={() => { }} />
    </div>
  );
}
