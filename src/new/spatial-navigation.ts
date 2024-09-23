import { ATTRIBUTES } from './constants';
import {
	getNextId,
	isDisabled,
	isIsolated,
	isSelectable,
	setMarked,
	setSelected,
} from './attributes';
import { Direction } from './types';
import { isGroup } from '../state';
import { getDirectionalDistance } from './ranking';
import { isVisible } from './utils';

export function getSelectedElement(container: ParentNode) {
	return container.querySelector<HTMLElement>(
		`[${ATTRIBUTES.selected}]:not([${ATTRIBUTES.selected}="false"])`,
	);
}

export function* walkTreeUp(node: HTMLElement, limit: HTMLElement) {
	let current: HTMLElement | null = node;

	while (current) {
		console.log(current);

		if (isSelectable(current)) {
			yield current;
		}
		current = current.parentElement;

		if (current === limit) {
			break;
		}
	}
}

export function getParentGroup(element: HTMLElement) {
	let current: HTMLElement | null = element.parentElement;
	while (current) {
		if (isGroup(current)) {
			return current;
		}
	}
	return current ?? document.body;
}

export function getNextSelectables(element: HTMLElement) {
	const items: HTMLElement[] = [];

	const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, {
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

function select(currentSelected: HTMLElement, element: HTMLElement) {
	const limit = document.body;

	console.log('SELECT', currentSelected, element);

	for (const node of walkTreeUp(currentSelected, limit)) {
		if (node.contains(element)) {
			break;
		}
		setMarked(node, false);
	}
	for (const node of walkTreeUp(element, limit)) {
		if (node.contains(currentSelected)) {
			break;
		}
		setMarked(node, true);
	}

	setSelected(currentSelected, false);
	setSelected(element, true);
}

function getNext(selected: HTMLElement, direction: Direction) {
	let current = selected;
	const box = selected.getBoundingClientRect();

	while (true) {
		const next = getNextId(current, direction);
		if (next) {
			const target = document.getElementById(next);
			if (target) {
				console.log('select next:', target);
				select(selected, target);
			} else {
				console.error(`select next target ${target} not found`);
			}
			return;
		}

		const group = getParentGroup(current);
		const selectables = getNextSelectables(group);
		console.log(selectables);

		let distance = Infinity;
		let candidate: HTMLElement | null = null;

		for (const item of selectables) {
			if (selected.isSameNode(item) || isDisabled(item) || !isVisible(item)) {
				continue;
			}

			const dist = getDirectionalDistance(
				box,
				item.getBoundingClientRect(),
				direction,
			);

			if (dist < distance) {
				distance = dist;
				candidate = item;
			}
		}

		if (candidate) {
			select(selected, candidate);
			return;
		}

		if (group === document.body) {
			return;
		}

		if (isIsolated(group)) {
			return;
		}

		if (!group) {
			return;
		}

		current = group;
	}
}

document.addEventListener('keydown', (e) => {
	const selected = getSelectedElement(document.body);
	if (!selected) {
		return;
	}

	switch (e.key) {
		case 'ArrowUp': {
			getNext(selected, 'up');
			break;
		}
		case 'ArrowRight': {
			getNext(selected, 'right');
			break;
		}
		case 'ArrowDown': {
			getNext(selected, 'down');
			break;
		}
		case 'ArrowLeft': {
			getNext(selected, 'left');
			break;
		}
	}
});
