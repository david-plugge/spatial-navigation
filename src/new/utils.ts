export function isVisible(element: HTMLElement) {
	return !!(
		element.hidden ||
		element.offsetWidth ||
		element.offsetHeight ||
		element.getClientRects().length
	);
}
