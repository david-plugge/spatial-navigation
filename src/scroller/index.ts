function handleScroll(e: WheelEvent) {
	const scroll = -(e as any).wheelDelta as number;
	const scroller = e.currentTarget as HTMLElement;
	const content = scroller.querySelector<HTMLElement>(
		'[data-scroller-content]',
	)!;

	const scrollableHeight = content.clientHeight - scroller.clientHeight;
	const scrollableWidth = content.clientWidth - scroller.clientWidth;

	if (e.shiftKey && scrollableWidth === 0) return;
	if (!e.shiftKey && scrollableHeight === 0) return;

	const currentScroll = getScroll(scroller);

	if (e.shiftKey) {
		currentScroll.x = Math.min(
			scrollableWidth,
			Math.max(0, currentScroll.x + scroll),
		);
	} else {
		currentScroll.y = Math.min(
			scrollableWidth,
			Math.max(0, currentScroll.y + scroll),
		);
	}

	content.style.transition = 'none';
	content.style.transform = `translate3d(${-currentScroll.x}px, ${-currentScroll.y}px, 0)`;
	content.style.removeProperty('transition');

	scroller.dataset.scrollX = currentScroll.x.toString();
	scroller.dataset.scrollY = currentScroll.y.toString();
}

function getScrollPerDir(element: HTMLElement, dir: string) {
	const value = element.getAttribute('data-scroll-' + dir);

	try {
		return value ? parseInt(value) : 0;
	} catch {
		return 0;
	}
}

export function createScroller(element: HTMLElement) {
	element.addEventListener('wheel', handleScroll);

	return {
		destroy() {
			element.removeEventListener('wheel', handleScroll);
		},
	};
}

export function getScroll(element: HTMLElement) {
	return {
		x: getScrollPerDir(element, 'x'),
		y: getScrollPerDir(element, 'y'),
	};
}

export function scrollIntoView(element: HTMLElement) {
	const scroller = element.closest<HTMLElement>('[data-scroller]');
	const content = element.closest<HTMLElement>('[data-scroller-content]');
	if (!scroller || !content) return;

	const centerX = element.offsetLeft + element.clientWidth / 2;
	const centerY = element.offsetTop + element.clientHeight / 2;

	const x = centerX - scroller.clientWidth / 2;
	const y = centerY - scroller.clientHeight / 2;

	const scrollableHeight = content.clientHeight - scroller.clientHeight;
	const scrollableWidth = content.clientWidth - scroller.clientWidth;

	const scrollX = Math.min(scrollableWidth, Math.max(0, x));
	const scrollY = Math.min(scrollableHeight, Math.max(0, y));

	content.style.transform = `translate3d(${-scrollX}px, ${-scrollY}px, 0)`;

	scroller.dataset.scrollX = scrollX.toString();
	scroller.dataset.scrollY = scrollY.toString();
}

document.addEventListener('keydown', (e) => {
	if (e.keyCode >= 48 && e.keyCode <= 57) {
		const index = e.keyCode - 48;
		const el = document.querySelector<HTMLElement>(
			`.item:nth-child(${index + 1})`,
		);
		el && scrollIntoView(el);
	}
});

document.querySelectorAll<HTMLElement>('.item').forEach((el) => {
	el.addEventListener('select', () => {
		scrollIntoView(el);
	});
});

// scroller.addEventListener('unselect', (e) => {
// 	const event = e as CustomEvent<{ selected: HTMLElement }>;

// 	if (!scroller.contains(event.detail.selected)) {
// 		const first = scroller.querySelector<HTMLElement>('.item');
// 		first && scrollIntoView(first);
// 	}
// });
