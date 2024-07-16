export function getAttributeBoolean(
	element: HTMLElement,
	attribute: string,
	defaultValue: boolean,
) {
	const value = element.getAttribute(attribute);
	return value === null
		? defaultValue
		: value === '' || value === 'true' || value === 'on';
}

export function setAttributeBoolean(
	element: HTMLElement,
	attribute: string,
	value: boolean,
) {
	if (value) {
		element.setAttribute(attribute, '');
	} else {
		element.removeAttribute(attribute);
	}
}
