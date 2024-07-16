import { Direction, Selector } from './types';

function resolveSelector(selector: Selector) {
	let element: unknown = selector;
	if (typeof selector === 'string') {
		element = document.querySelector(selector);
	}

	if (element instanceof HTMLElement) {
		return element;
	}

	throw new Error(`${selector} is not an HTMLElement`);
}

export function selectElement(selector: Selector) {
	const element = resolveSelector(selector);
}

export function navigate(direction: Direction) {}

function _getSelectedElement() {}

function _navigate(currentSelection: HTMLElement, direction: Direction) {}
