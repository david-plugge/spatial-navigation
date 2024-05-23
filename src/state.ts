import { ATTRIBUTES } from './constants';
import { Direction } from './types';
import { getAttributeBoolean, setAttributeBoolean } from './utils';

export function isGroup(element: HTMLElement) {
	return getAttributeBoolean(element, ATTRIBUTES.group, false);
}

export function isItem(element: HTMLElement) {
	return getAttributeBoolean(element, ATTRIBUTES.item, false);
}

export function isSelectable(element: HTMLElement) {
	return isGroup(element) || isItem(element);
}

export function isSelected(element: HTMLElement) {
	return getAttributeBoolean(element, ATTRIBUTES.selected, false);
}
export function setSelected(element: HTMLElement, selected: boolean) {
	setAttributeBoolean(element, ATTRIBUTES.selected, selected);
}

export function isDisabled(element: HTMLElement) {
	return getAttributeBoolean(element, ATTRIBUTES.disabled, false);
}

export function isIsolated(element: HTMLElement) {
	return getAttributeBoolean(element, ATTRIBUTES.isolated, false);
}

export function isInitial(element: HTMLElement) {
	return getAttributeBoolean(element, ATTRIBUTES.initial, false);
}

export function isSaveLast(element: HTMLElement) {
	return getAttributeBoolean(element, ATTRIBUTES.saveLast, true);
}

export function isMarked(element: HTMLElement) {
	return getAttributeBoolean(element, ATTRIBUTES.marked, false);
}
export function setMarked(element: HTMLElement, marked: boolean) {
	setAttributeBoolean(element, ATTRIBUTES.marked, marked);
}

export function getNext(element: HTMLElement, dir: Direction) {
	const next =
		element.getAttribute(ATTRIBUTES.next + '-' + dir) ??
		element.getAttribute(ATTRIBUTES.next) ??
		undefined;
	return next === 'null' ? null : next;
}

export function getSelectables(element: HTMLElement) {
	const items: HTMLElement[] = [];

	const walker = document.createNodeIterator(element, NodeFilter.SHOW_ELEMENT, {
		acceptNode: (node: HTMLElement) => {
			if (!isSelectable(node)) {
				return NodeFilter.FILTER_SKIP;
			}

			items.push(node);
			return NodeFilter.FILTER_REJECT;
		},
	});

	while (walker.nextNode());

	return items;
}

export function walkSelectables(
	element: HTMLElement,
	fn: (element: HTMLElement) => void,
) {
	const walker = document.createNodeIterator(element, NodeFilter.SHOW_ELEMENT, {
		acceptNode: (node: HTMLElement) => {
			if (!isSelectable(node)) {
				return NodeFilter.FILTER_SKIP;
			}

			fn(node);
			return NodeFilter.FILTER_REJECT;
		},
	});

	while (walker.nextNode());
}
