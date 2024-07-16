import { ATTRIBUTES } from './constants';
import { getAttributeBoolean } from './attributes';

function isSelectableItem(element: HTMLElement) {
	return getAttributeBoolean(element, ATTRIBUTES.item, false);
}

function isSelectableGroup(element: HTMLElement) {
	return getAttributeBoolean(element, ATTRIBUTES.group, false);
}

function isSelectable(element: HTMLElement) {
	return isSelectableItem(element) || isSelectableGroup(element);
}

export function getSelectedElement(container: ParentNode) {
	return container.querySelector<HTMLElement>(
		`[${ATTRIBUTES.selected}]:not([${ATTRIBUTES.selected}="false"])`,
	);
}

export function* walkTreeUp(node: HTMLElement, limit: HTMLElement) {
	let current: HTMLElement | null = node;

	while (current && current !== limit) {
		if (isSelectable(current)) {
			yield current;
		}
		current = current.parentElement;
	}
}

export function getNextSelectables(node: HTMLElement) {
	const items: HTMLElement[] = [];

	const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT, {
		acceptNode(node: HTMLElement) {
			if (isSelectable(node)) {
				items.push(node);
				return NodeFilter.FILTER_REJECT;
			}

			return NodeFilter.FILTER_SKIP;
		},
	});

	while (walker.nextNode());

	return items;
}

function select(element: HTMLElement, currentSelected: HTMLElement) {
	const limit = document.body;

	const path: HTMLElement[] = [];

	for (const node of walkTreeUp(currentSelected, limit)) {
		if (node.contains(element)) {
			break;
		}
		path.push(node);
	}
	for (const node of walkTreeUp(element, limit)) {
		if (node.contains(currentSelected)) {
			break;
		}
		path.push(node);
	}

	console.log(path);
}

const selected = document.querySelector<HTMLElement>(
	'#scroller > div > div:nth-child(6) > div:nth-child(3)',
)!;
const currentSelected = document.querySelector<HTMLElement>(
	'#scroller > div > div:nth-child(3) > div:nth-child(2)',
)!;

select(selected, currentSelected);
