import { ATTRIBUTES } from './constants';
import {
	getNext,
	isInitial,
	isIsolated,
	isItem,
	isMarked,
	isSaveLast,
	setMarked,
	isDisabled,
	setSelected,
	walkSelectables,
} from './state';
import { Direction } from './types';
import { checkVisibility, getDistance, getParentGroup } from './utils';

const SELECTED_QUERY = `[${ATTRIBUTES.selected}]:not([${ATTRIBUTES.selected}="false"])`;

export function selectItem(element: HTMLElement) {
	// unselect all selected elements
	// only one should be selected but better be safe than sorry
	document.querySelectorAll<HTMLElement>(SELECTED_QUERY).forEach((el) => {
		setSelected(el, false);
		el.dispatchEvent(
			new CustomEvent('unselect', {
				bubbles: true,
				detail: { selected: element },
			}),
		);
	});
	setSelected(element, true);
	element.focus();
	element.dispatchEvent(new CustomEvent('select', { bubbles: true }));
}

export function getSelected() {
	return document.querySelector<HTMLElement>(SELECTED_QUERY);
}

export function handle(dir: Direction) {
	const selected = getSelected();
	if (!selected) return;

	const box = selected.getBoundingClientRect();

	let current = selected;

	while (true) {
		const group = getParentGroup(current);
		const next = getNext(current, dir);

		if (next === null) return;
		if (typeof next === 'string') {
			const element = document.getElementById(next);
			if (element) {
				select(element);
			}
			break;
		}

		let distance = Infinity;
		let closest: HTMLElement | null = null;

		walkSelectables(group, (node) => {
			if (
				node.isSameNode(selected) ||
				isDisabled(node) ||
				!checkVisibility(node)
			) {
				return;
			}

			const d = getDistance(box, node.getBoundingClientRect(), dir);

			if (d < distance) {
				distance = d;
				closest = node;
			}
		});

		if (closest) {
			select(closest);
			break;
		}
		if (group === document.body) {
			break;
		}
		if (isIsolated(group)) {
			break;
		}

		if (isSaveLast(group)) {
			walkSelectables(group, (node) => {
				setMarked(node, false);
			});
			setMarked(current, true);
		}
		current = group;
	}

	function select(element: HTMLElement) {
		while (true) {
			if (isItem(element)) {
				selectItem(element);
				return;
			}

			let distance = Infinity;
			let closest: HTMLElement | null = null;

			walkSelectables(element, (node) => {
				if (node.isSameNode(selected) || isDisabled(node)) {
					return;
				}
				if (isMarked(node)) {
					if (distance > -1) {
						closest = node;
					}
					setMarked(node, false);
					distance = -1;
					return;
				}
				if (isInitial(node) && distance > 0) {
					distance = 0;
					closest = node;
					return;
				}

				const d = getDistance(box, node.getBoundingClientRect(), dir);

				if (d < distance) {
					distance = d;
					closest = node;
				}
			});

			if (!closest) {
				break;
			}
			element = closest;
		}
	}
}

export function findFirstSelectable(element: HTMLElement): HTMLElement | null {
	if (isDisabled(element)) {
		return null;
	}

	if (isItem(element)) {
		return element;
	}

	let currentRank = 0;
	let current: HTMLElement | null = null;

	walkSelectables(element, (node) => {
		if (isMarked(node)) {
			return findFirstSelectable(node);
		}
		if (isInitial(node)) {
			if (currentRank < 1) {
				currentRank = 1;
				current = node;
			}
		}
		current ??= node;
	});

	return current ? findFirstSelectable(current) : null;
}

//  ==================================================

const selectable = findFirstSelectable(document.body);
if (selectable) {
	selectItem(selectable);
}

document.addEventListener('keydown', (e) => {
	if (e.defaultPrevented) return;

	let handled = true;
	if (e.key) {
		switch (e.key) {
			case 'ArrowUp':
				handle('up');
				break;
			case 'ArrowDown':
				handle('down');
				break;
			case 'ArrowLeft':
				handle('left');
				break;
			case 'ArrowRight':
				handle('right');
				break;
			default:
				handled = false;
				break;
		}
	} else if (e.keyCode) {
		switch (e.keyCode) {
			case 38:
				handle('up');
				break;
			case 40:
				handle('down');
				break;
			case 37:
				handle('left');
				break;
			case 39:
				handle('right');
				break;
			default:
				handled = false;
				break;
		}
	}

	if (handled) {
		e.preventDefault();
	}
});
