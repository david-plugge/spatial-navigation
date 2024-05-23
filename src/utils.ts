import { ATTRIBUTES } from './constants';
import { Direction } from './types';

export function getDistance(a: DOMRect, b: DOMRect, dir: Direction) {
	const cx = (a.left + a.right) / 2;
	const cy = (a.top + a.bottom) / 2;

	let x: number;
	let y: number;

	switch (dir) {
		case 'up':
			if (a.top < b.bottom) return Infinity;
			x = b.left > cx ? b.left : b.right < cx ? b.right : cx;
			y = b.bottom;
			break;
		case 'down':
			if (a.bottom > b.top) return Infinity;
			x = b.left > cx ? b.left : b.right < cx ? b.right : cx;
			y = b.top;
			break;
		case 'left':
			if (a.left < b.right) return Infinity;
			x = b.right;
			y = b.top > cy ? b.top : b.bottom < cy ? b.bottom : cy;
			break;
		case 'right':
			if (a.right > b.left) return Infinity;
			x = b.left;
			y = b.top > cy ? b.top : b.bottom < cy ? b.bottom : cy;
			break;
		default:
			throw new Error('unknown direction ' + dir);
	}

	const dx = Math.abs(cx - x);
	const dy = Math.abs(cy - y);

	if (dir === 'left' || dir === 'right') {
		return dx + Math.pow(dy, 2);
	}
	return dy + Math.pow(dx, 2);
}

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

export function getAttributeNumber(
	element: HTMLElement,
	attribute: string,
	defaultValue: number,
) {
	const value = element.getAttribute(attribute);
	return value === null ? defaultValue : +value;
}

export function getParentGroup(element: HTMLElement) {
	return (
		element.parentElement?.closest<HTMLElement>(`[${ATTRIBUTES.group}]`) ||
		document.body
	);
}

export function getCommonGroup(a: HTMLElement, b: HTMLElement) {
	let el: HTMLElement = a;
	while (el && !el.contains(b)) {
		el = getParentGroup(el);
	}

	return el;
}

export function checkVisibility(element: HTMLElement) {
	return !!(
		element.hidden ||
		element.offsetWidth ||
		element.offsetHeight ||
		element.getClientRects().length
	);
}
