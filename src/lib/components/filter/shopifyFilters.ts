import type { Filters$result, Products, Products$result } from '$houdini';
import { isNonNil, sortParentsFirst } from '$lib';

type Filter = NonNullable<
	NonNullable<Products$result>['collection']
>['products']['filters'][number];

type ProductFilter = NonNullable<Products['input']['filters']>[number];
type SortKey = NonNullable<Products['input']['sortKey']>;

export const sortKeys: { label: string; value: SortKey; reverse: boolean }[] = [
	{
		label: 'Nyast först',
		value: 'CREATED',
		reverse: false
	},
	{
		label: 'Äldst först',
		value: 'CREATED',
		reverse: true
	},
	{
		label: 'Billigast först',
		value: 'PRICE',
		reverse: false
	},
	{
		label: 'Dyrast först',
		value: 'PRICE',
		reverse: true
	}
];

export const DEFAULT_PAGE_SIZE = 12;
export const sizeOptions = [
	`${DEFAULT_PAGE_SIZE}`,
	`${DEFAULT_PAGE_SIZE * 2}`,
	`${DEFAULT_PAGE_SIZE * 4}`
];
// readonly BEST_SELLING: "BEST_SELLING";
//   readonly COLLECTION_DEFAULT: "COLLECTION_DEFAULT";
//   readonly CREATED: "CREATED";
//   readonly ID: "ID";
//   readonly MANUAL: "MANUAL";
//   readonly PRICE: "PRICE";
//   readonly RELEVANCE: "RELEVANCE";
//   readonly TITLE: "TITLE";

export type ArgassoFilterItem = {
	key: string;
	label: string;
	value: string;
	count?: number;
	applied?: boolean;
	children?: ArgassoFilterItem[];
};

export type ArgassoFilter = {
	id: string;
	type: Filter['type'];
	label: string;
	values: ArgassoFilterItem[];
};

type Hierarchy = NonNullable<Filters$result['categories']>['nodes'];

export function getShopifyFilter(searchParams: URLSearchParams): ProductFilter[] {
	const uniqueKeys = new Set(searchParams.keys());
	return Array.from(uniqueKeys).flatMap((key) => {
		const values = searchParams.getAll(key);
		return mapToFilters(key, values);
	});
}

export function isShopifyFilterKey(key: string) {
	return (
		['price', 'available', 'tag'].includes(key) ||
		['pm.', 'po.', 'vm.', 'vo.'].some((prefix) => key.startsWith(prefix))
	);
}

function mapToFilters(key: string, values: string[]): ProductFilter[] {
	if (key === 'price') {
		const numbers = values.map((v) => parseValue(v)).filter(isNonNil);
		if (numbers.length === 2) {
			const min = Math.min(...numbers);
			const max = Math.max(...numbers);
			const filter = { price: { min, max } };
			return [filter];
		} else {
			console.log('expected 2 values for price', values);
		}
	}
	if (key === 'available') {
		console.log('mapping available', key, values);
		return values.map((v) => ({ available: v.toLowerCase() === 'true' }));
	}
	if (key === 'tag') {
		return values.map((v) => ({ tag: v }));
	}
	if (['pm.', 'po.', 'vm.', 'vo.'].some((prefix) => key.startsWith(prefix))) {
		return values
			.sort((a, b) => a.localeCompare(b))
			.map((v, i, arr) => {
				if (!arr[i + 1] || !arr[i + 1].startsWith(v)) {
					const parts = key.split('.', 3);
					const shortGid = v.split('.').at(-1);
					if (parts.length === 3 && shortGid) {
						const [prefix, namespace, key] = parts;
						const value = prefix.endsWith('o') ? longGID(shortGid) : v;
						const field = { namespace, key, value };
						const filter = prefix.startsWith('p')
							? { productMetafield: field }
							: { variantMetafield: field };
						return filter;
					} else {
						console.log('expected 3 (dot separated) parts for key', key, v);
					}
				}
			})
			.filter(isNonNil);
	}
	return [];
}

function parseValue(value: string | null): number | undefined {
	if (value) {
		const val = parseFloat(value);
		if (!isNaN(val)) {
			return val;
		}
	}
}

export function parseShopifyFilters(filters: Filter[], hierarchy: Hierarchy) {
	const parentGidByChildGid = new Map(hierarchy.map((h) => [h.id, h.parent?.value]));

	return filters.map(({ id, ...filter }) => {
		let values: ArgassoFilterItem[];
		if (id === 'filter.v.m.book.category') {
			const itemsByGid = new Map<string, ArgassoFilterItem>();
			let fallbackKey = 'missing';
			filter.values.forEach(({ label, input, count }) => {
				const parsed = JSON.parse(input) as ProductFilter;
				const query = getKeyValue(parsed);
				if (query) {
					const { key, value } = query;
					fallbackKey = key;
					itemsByGid.set(longGID(value), { key, label, count, value, children: [] });
				} else {
					console.log('missing gid in filter input value', input);
				}
			});
			values = hierarchy
				.sort(sortParentsFirst)
				.map(({ id, title }) => {
					const value = shortGID(id);
					const label = title?.value;
					const child = itemsByGid.get(id) ?? filterItem({ key: fallbackKey, label, value });
					if (!itemsByGid.has(id)) {
						itemsByGid.set(id, child);
					}
					const parentId = parentGidByChildGid.get(id) ?? '';
					const parent = itemsByGid.get(parentId);
					if (parent) {
						child.value = [parent.value, child.value].join('.');
						parent.children?.push(child);
					} else {
						return child;
					}
				})
				.filter(isNonNil);
		} else {
			values = filter.values.flatMap(({ label, input, count }) => {
				const parsed = JSON.parse(input) as ProductFilter;
				if (filter.type === 'PRICE_RANGE') {
					if (isPrice(parsed)) {
						const { price } = parsed;
						return [
							{ key: 'price', label: 'Som lägst', value: `${price.min ?? 0}` },
							{ key: 'price', label: 'Som högst', value: `${price.max ?? 300}` }
						];
					} else {
						console.warn('missing price in filter input value', input);
						return [];
					}
				} else {
					const query = getKeyValue(parsed);
					if (query) {
						const { key, value } = query;
						return [{ key, label, count, value }];
					} else {
						console.warn('missing key/value in filter input value', input);
						return [];
					}
				}
			});
		}
		return {
			...filter,
			id,
			values
		};
	});
}

type NoUndefinedField<T> = { [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>> };

type Price = NoUndefinedField<Pick<ProductFilter, 'price'>>;
function isPrice(value: ProductFilter): value is Price {
	return (value as Price).price !== undefined;
}

type VariantMetafield = NoUndefinedField<Pick<ProductFilter, 'variantMetafield'>>;
function isVariantMetafield(value: ProductFilter): value is VariantMetafield {
	return (value as VariantMetafield).variantMetafield !== undefined;
}

type ProductMetafield = NoUndefinedField<Pick<ProductFilter, 'productMetafield'>>;
function isProductMetafield(value: ProductFilter): value is ProductMetafield {
	return (value as ProductMetafield).productMetafield !== undefined;
}

type AvailableFilter = NoUndefinedField<Pick<ProductFilter, 'available'>>;
function isAvailableFilter(value: ProductFilter): value is AvailableFilter {
	return (value as AvailableFilter).available !== undefined;
}

type TagFilter = NoUndefinedField<Pick<ProductFilter, 'tag'>>;
function isTagFilter(value: ProductFilter): value is TagFilter {
	return (value as TagFilter).tag !== undefined;
}

function getKeyValue(productFilter: ProductFilter) {
	if (isProductMetafield(productFilter)) {
		const { namespace, key, value } = productFilter.productMetafield;
		const prefix = value.startsWith(METAOBJECT_PREFIX) ? 'po' : 'pm';
		return { key: [prefix, namespace, key].join('.'), value: shortGID(value) };
	} else if (isVariantMetafield(productFilter)) {
		const { namespace, key, value } = productFilter.variantMetafield;
		const prefix = value.startsWith(METAOBJECT_PREFIX) ? 'vo' : 'vm';
		return { key: [prefix, namespace, key].join('.'), value: shortGID(value) };
	} else if (isAvailableFilter(productFilter) || isTagFilter(productFilter)) {
		const [key, value] = Object.entries(productFilter)[0];
		return { key, value: String(value) };
	}
}

function filterItem(obj: {
	key: string;
	label?: string | null;
	count?: number | null;
	value: string;
}): ArgassoFilterItem {
	const { key, value } = obj;
	const label = obj.label ?? 'missing';
	const count = obj.count ?? 0;
	return { key, label, count, value, children: [] };
}

const METAOBJECT_PREFIX = 'gid://shopify/Metaobject/';

export function shortGID(longGid: string) {
	return longGid.replace(METAOBJECT_PREFIX, '');
}

export function longGID(shortGid: string) {
	return `${METAOBJECT_PREFIX}${shortGid}`;
}
