export type Direction = 'up' | 'down' | 'left' | 'right';

export interface SelectableAttributes {
	'data-selectable-group'?: string;
	'data-selectable'?: string;
	'data-selected'?: string;
	'data-selectable-disabled'?: string;
	'data-selectable-initial'?: string;
	'data-selectable-next'?: string;
	'data-selectable-isolated'?: string;
	'data-selectable-savelast'?: string;
	'data-selectable-mark'?: string;
}
