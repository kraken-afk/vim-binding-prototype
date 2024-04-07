import {
	type PropsWithRef,
	type TextareaHTMLAttributes,
	forwardRef,
} from "react";

export const TextArea = forwardRef<
	HTMLTextAreaElement,
	PropsWithRef<TextareaHTMLAttributes<HTMLTextAreaElement>>
>((props, ref) => {
	return <textarea {...props} id="buffer" ref={ref} />;
});
