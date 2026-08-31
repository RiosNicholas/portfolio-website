/**
 * Renders a JSON-LD `<script>` tag for structured data. Escapes `<` so a
 * future payload containing `</script>` can't break out of the script
 * element — `<` is a valid JSON string escape and parses back to `<`
 * identically, so current structured data is unaffected.
 */
export function JsonLd({ data }: { data: object }) {
	const json = JSON.stringify(data).replace(/</g, "\\u003c");

	return (
		<script
			dangerouslySetInnerHTML={{ __html: json }}
			type="application/ld+json"
		/>
	);
}
