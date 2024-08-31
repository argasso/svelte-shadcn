const BOOK_URL = '/bok';
const BOOKS_URL = '/bocker';
const AUTHORS_URL = '/information/forfattare';

export function bookUrl(handle: string) {
	return `${BOOK_URL}/${handle}`;
}

export function booksUrl(handle: string) {
	return `${BOOKS_URL}/${handle}`;
}

export function authorUrl(handle: string) {
	return `${AUTHORS_URL}/${handle}`;
}

type WithFields = {
	fields: {
		key: string;
		value: string | null;
	}[];
};

export function getFieldValue<T extends WithFields>(node: T, key: string) {
	return node.fields.find((f) => f.key === key)?.value || undefined;
}

export function hasFieldValue<T extends WithFields>(node: T, key: string, value: string) {
	return getFieldValue(node, key) === value;
}

type FieldValue = {
	value: string | null;
};

type TreeLikeMetaobject = {
	id: string;
	handle: string;
	parent: FieldValue | null;
	title: FieldValue | null;
	name: FieldValue | null;
};

export function resolveHrefs<T extends TreeLikeMetaobject>(nodes: T[]) {
	const hrefById = new Map();
	return nodes.sort(sortParentsFirst).map(({ id, handle, parent, title, name, ...rest }) => {
		const parentHref = hrefById.get(parent?.value ?? '');
		const href = `${parentHref ?? ''}/${handle}`;
		hrefById.set(id, href);
		return {
			...rest,
			id,
			handle,
			href,
			parent: parent?.value ?? undefined,
			title: title?.value ?? undefined,
			name: name?.value ?? undefined
		};
	});
}

type TreeLike = { id: string; parent: FieldValue | null };

export function sortParentsFirst<T extends TreeLike>(a: T, b: T) {
	if (isParent(a, b)) {
		return -1;
	} else if (isParent(b, a)) {
		return 1;
	}
	return 0;
}

function isParent(node: TreeLike, child: TreeLike) {
	return node.id === child.parent?.value;
}

export function onlyProducts<T extends { __typename: string }>(nodes: T[] | null | undefined) {
	return (nodes ?? []).filter(
		(e): e is Extract<T, { __typename: 'Product' }> => e.__typename === 'Product'
	);
}

export function onlyMetaobjects<T extends { __typename: string }>(nodes: T[] | null | undefined) {
	return (nodes ?? []).filter(
		(e): e is Extract<T, { __typename: 'Metaobject' }> => e.__typename === 'Metaobject'
	);
}

export function onlyMediaImages<T extends { __typename: string }>(nodes: T[] | null | undefined) {
	return (nodes ?? []).filter(
		(e): e is Extract<T, { __typename: 'MediaImage' }> => e.__typename === 'MediaImage'
	);
}

export function onlyProduct<T extends { __typename: string }>(object: T | null | undefined) {
	return object ? onlyProducts([object]).at(0) : undefined
}

export function onlyMetaobject<T extends { __typename: string }>(object: T | null | undefined) {
	return object ? onlyMetaobjects([object]).at(0) : undefined
}

export function onlyMediaImage<T extends { __typename: string }>(object: T | null | undefined) {
	return object ? onlyMediaImages([object]).at(0) : undefined
}

export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
	return value !== null && value !== undefined;
}

const months = [
	'januari',
	'februari',
	'mars',
	'april',
	'maj',
	'juni',
	'juli',
	'augusti',
	'september',
	'oktober',
	'november',
	'december'
];
export function publishMonth(date: string) {
	const d = new Date(date);
	const year = d.getFullYear();
	const month = months[d.getMonth()];
	return `${month} ${year}`;
}

export function parseJSON(input: string | null) {
	if (input) {
		return JSON.parse(input);
	}
}

export function formatPrice(price: { amount: string; currencyCode: string }) {
	const formattedAmount = parseFloat(price.amount).toFixed(2).replace('.00', '');
	switch (price.currencyCode) {
		case 'SEK':
			return `${formattedAmount} kr`;
		case 'USD':
			return `$${formattedAmount}`;
		case 'EUR':
			return `€${formattedAmount}`;
	}
	return `${formattedAmount} ${price.currencyCode}`;
}

export function toTree<T extends { id: string; parent: { value: string | null } | null }>(
	items: T[] = []
) {
	const itemsById = new Map(items.map((item) => [item.id, { ...item, children: [] as T[] }]));

	return items.reduce(
		(prev, node) => {
			const child = itemsById.get(node.id);
			if (child) {
				if (node.parent?.value && itemsById.has(node.parent?.value)) {
					const parent = itemsById.get(node.parent.value);
					parent?.children.push(child);
				} else {
					prev.push(child);
				}
			}
			return prev;
		},
		[] as (T & { children: T[] })[]
	);
}

export const isNonNil = <T>(value: T | null | undefined | void): value is T => value != null;
