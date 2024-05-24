import { ATTRIBUTES } from './constants';
import { isDisabled } from './entities';
import {
	getNext,
	isInitial,
	isIsolated,
	isItem,
	isMarked,
	isSaveLast,
	setMarked,
	setSelected,
	walkSelectables,
} from './state';
import { Direction } from './types';
import { checkVisibility, getDistance, getParentGroup } from './utils';

function selectItem(element: HTMLElement) {
	document
		.querySelectorAll<HTMLElement>(`[${ATTRIBUTES.selected}]`)
		.forEach((el) => {
			setSelected(el, false);
			el.dispatchEvent(new CustomEvent('unselect'));
		});
	setSelected(element, true);
	element.focus();
	element.dispatchEvent(new CustomEvent('select'));
}

function getSelected() {
	return document.querySelector<HTMLElement>(
		`[${ATTRIBUTES.selected}]:not([${ATTRIBUTES.selected}="false"])`,
	);
}

function handle(dir: Direction) {
	const selected = getSelected();
	if (!selected) return;

	const box = selected.getBoundingClientRect();

	let current = selected;

	while (1) {
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
		while (1) {
			if (isItem(element)) {
				selectItem(element);

				// const group = getParentGroup(element);
				// walkSelectables(group, (node) => {
				// 	setMarked(node, false);
				// });

				break;
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

function findFirst(element: HTMLElement): HTMLElement | null {
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
			return findFirst(node);
		}
		if (isInitial(node)) {
			if (currentRank < 1) {
				currentRank = 1;
				current = node;
			}
		}
		current ??= node;
	});

	return current ? findFirst(current) : null;
}

main: {
	const selected = findFirst(document.body);

	if (selected) {
		selectItem(selected);
	}

	document.addEventListener('keydown', (e) => {
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
		}
	});
}
