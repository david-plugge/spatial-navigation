import { Direction } from './types';

export function getDirectionalDistance(
	from: DOMRect,
	to: DOMRect,
	dir: Direction,
) {
	const cx = (from.left + from.right) / 2;
	const cy = (from.top + from.bottom) / 2;

	let x: number;
	let y: number;

	switch (dir) {
		case 'up':
			if (from.top < to.bottom) return Infinity;
			x = to.left > cx ? to.left : to.right < cx ? to.right : cx;
			y = to.bottom;
			break;
		case 'down':
			if (from.bottom > to.top) return Infinity;
			x = to.left > cx ? to.left : to.right < cx ? to.right : cx;
			y = to.top;
			break;
		case 'left':
			if (from.left < to.right) return Infinity;
			x = to.right;
			y = to.top > cy ? to.top : to.bottom < cy ? to.bottom : cy;
			break;
		case 'right':
			if (from.right > to.left) return Infinity;
			x = to.left;
			y = to.top > cy ? to.top : to.bottom < cy ? to.bottom : cy;
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

export function getAbsoluteDistance(from: DOMRect, to: DOMRect) {
	const x = from.left + from.right - (to.left + to.right);
	const y = from.top + from.bottom - (to.top + to.bottom);

	return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}
