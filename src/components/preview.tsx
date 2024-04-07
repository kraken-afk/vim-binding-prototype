import type { HTMLAttributes, PropsWithChildren } from "react";

export function Preview(
	props: PropsWithChildren<HTMLAttributes<HTMLPreElement>>,
) {
	return (
		<pre {...props}>
			<code>{props.children}</code>
		</pre>
	);
}
