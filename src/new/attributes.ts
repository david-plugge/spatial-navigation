import { ATTRIBUTES } from './constants';
import { Direction } from './types';

function getAttributeBoolean(
	element: HTMLElement,
	attribute: string,
	defaultValue: boolean,
) {
	const value = element.getAttribute(attribute);
	return value === null
		? defaultValue
		: value === '' || value === 'true' || value === 'on';
}

function setAttributeBoolean(
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

export function isSelectableItem(element: HTMLElement) {
	return getAttributeBoolean(element, ATTRIBUTES.item, false);
}

export function isSelectableGroup(element: HTMLElement) {
	return getAttributeBoolean(element, ATTRIBUTES.group, false);
}

export function isSelectable(element: HTMLElement) {
	return isSelectableItem(element) || isSelectableGroup(element);
}

export function getNextId(element: HTMLElement, dir: Direction) {
	const next =
		element.getAttribute(ATTRIBUTES.next + '-' + dir) ??
		element.getAttribute(ATTRIBUTES.next) ??
		undefined;
	return next === 'null' ? null : next;
}

export function isIsolated(element: HTMLElement) {
	return getAttributeBoolean(element, ATTRIBUTES.isolated, false);
}

export function isInitial(element: HTMLElement) {
	return getAttributeBoolean(element, ATTRIBUTES.initial, false);
}

export function isHistory(element: HTMLElement) {
	return getAttributeBoolean(element, ATTRIBUTES.history, false);
}

export function isDisabled(element: HTMLElement) {
	return getAttributeBoolean(element, ATTRIBUTES.disabled, false);
}

export function isMarked(element: HTMLElement) {
	return getAttributeBoolean(element, ATTRIBUTES.mark, false);
}

export function setMarked(element: HTMLElement, marked: boolean) {
	return setAttributeBoolean(element, ATTRIBUTES.mark, marked);
}

export function isSelected(element: HTMLElement) {
	return getAttributeBoolean(element, ATTRIBUTES.selected, false);
}

export function setSelected(element: HTMLElement, selected: boolean) {
	return setAttributeBoolean(element, ATTRIBUTES.selected, selected);
}
