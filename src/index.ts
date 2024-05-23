import { ATTRIBUTES } from './constants';
import { isDisabled } from './entities';
import {
	getNext,
	getSelectables,
	isInitial,
	isIsolated,
	isItem,
	isMarked,
	isSaveLast,
	isSelectable,
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
	const markChain: HTMLElement[] = [];
	const unmarkChain: HTMLElement[] = [];

	run(selected, selected);

	function run(selected: HTMLElement, current: HTMLElement) {
		const group = getParentGroup(current);
		const next = getNext(current, dir);

		if (next === null) return;
		if (typeof next === 'string') {
			const element = document.getElementById(next);
			if (element) {
				if (isSaveLast(group)) {
					markChain.push(current);
				}
				select(element);
			}
			return;
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

			console.log(node);

			const d = getDistance(box, node.getBoundingClientRect(), dir);

			if (d < distance) {
				distance = d;
				closest = node;
			}
		});

		// const walker = document.createTreeWalker(group, NodeFilter.SHOW_ELEMENT, {
		// 	acceptNode: (node: HTMLElement) => {
		// 		if (!isSelectable(node)) {
		// 			return NodeFilter.FILTER_SKIP;
		// 		}

		// 		if (
		// 			node.isSameNode(selected) ||
		// 			isDisabled(node) ||
		// 			!checkVisibility(node)
		// 		) {
		// 			return NodeFilter.FILTER_REJECT;
		// 		}

		// 		const d = getDistance(box, node.getBoundingClientRect(), dir);

		// 		if (d < distance) {
		// 			distance = d;
		// 			closest = node;
		// 		}

		// 		return NodeFilter.FILTER_REJECT;
		// 	},
		// });

		// while (walker.nextNode());

		if (closest) {
			select(closest);
			return;
		}
		if (group === document.body) {
			return;
		}
		if (isIsolated(group)) {
			return;
		}

		if (isSaveLast(group)) {
			markChain.push(current);
		}
		run(selected, group);
	}

	function select(element: HTMLElement) {
		if (isItem(element)) {
			selectItem(element);

			markChain.forEach((el) => setMarked(el, true));
			unmarkChain.forEach((el) => setMarked(el, false));

			return;
		}

		let distance = Infinity;
		let closest: HTMLElement | null = null;

		const walker = document.createTreeWalker(element, NodeFilter.SHOW_ELEMENT, {
			acceptNode: (node: HTMLElement) => {
				if (!isSelectable(node)) {
					return NodeFilter.FILTER_SKIP;
				}
				if (node.isSameNode(selected) || isDisabled(node)) {
					return NodeFilter.FILTER_REJECT;
				}
				if (isMarked(node) && distance > -1) {
					distance = -1;
					closest = node;
					return NodeFilter.FILTER_REJECT;
				}
				if (isInitial(node) && distance > 0) {
					distance = 0;
					closest = node;
					return NodeFilter.FILTER_REJECT;
				}

				const d = getDistance(box, node.getBoundingClientRect(), dir);

				if (d < distance) {
					distance = d;
					closest = node;
				}

				return NodeFilter.FILTER_REJECT;
			},
		});

		while (walker.nextNode());

		if (closest) {
			unmarkChain.push(closest);
			select(closest);
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

	const candidates = getSelectables(element);

	let currentRank = 0;
	let current: HTMLElement | null = null;

	for (const candidate of candidates) {
		if (isMarked(candidate)) {
			return findFirst(candidate);
		}
		if (isInitial(candidate)) {
			if (currentRank < 1) {
				currentRank = 1;
				current = candidate;
			}
		}
		current ??= candidate;
	}

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
