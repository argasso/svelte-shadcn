import type { Pages$result, Products, Products$result } from '$houdini';
import { isNonNil } from '$lib';
import { flatten, type MenuItem } from '$lib/menu';

export type Filter = NonNullable<
	NonNullable<Products$result>['collection']
>['products']['filters'][number];

type ProductFilter = NonNullable<Products['input']['filters']>[number];
type SortKey = NonNullable<Products['input']['sortKey']>;
type SortOption = { label: string; value: string, sortKey: SortKey; reverse: boolean }

export const defaultSortKey: SortOption = {
	label: 'Nyast först',
	value: '', 
	sortKey: 'CREATED',
	reverse: true
}

export const sortOptions: SortOption[] = [
	defaultSortKey,
	{
		label: 'Äldst först',
		value: 'aldst',
		sortKey: 'CREATED',
		reverse: false
	},
	{
		label: 'Titel A-Ö',
		value: 'titel-stigande',
		sortKey: 'TITLE',
		reverse: false
	},
	{
		label: 'Titel Ö-A',
		value: 'titel-fallande',
		sortKey: 'TITLE',
		reverse: true
	},
	{
		label: 'Billigast först',
		value: 'pris-stigande',
		sortKey: 'PRICE',
		reverse: false
	},
	{
		label: 'Dyrast först',
		value: 'pris-fallande',
		sortKey: 'PRICE',
		reverse: true
	},
	{
		label: 'Flest sålda',
		value: 'salda-stigande', 
		sortKey: 'BEST_SELLING',
		reverse: false
	},
];

export const DEFAULT_PAGE_SIZE = 12;
export const sizeOptions = [
	`${DEFAULT_PAGE_SIZE}`,
	`${DEFAULT_PAGE_SIZE * 2}`,
	`${DEFAULT_PAGE_SIZE * 4}`
];

// export type ArgassoFilterItem = {
// 	id?: string;
// 	key: string;
// 	label: string;
// 	value: string;
// 	count?: number;
// 	applied?: boolean;
// 	children?: ArgassoFilterItem[];
// };

// export type ArgassoFilter = {
// 	id: string;
// 	type: Filter['type'];
// 	label: string;
// 	values: ArgassoFilterItem[];
// };

type Hierarchy = NonNullable<Pages$result['categories']>['nodes'];

// export function getShopifyFilter(searchParams: URLSearchParams, filters?: Filter[]): ProductFilter[] {
// 	const uniqueKeys = new Set(searchParams.keys());
// 	return Array.from(uniqueKeys).flatMap((key) => {
// 		const values = searchParams.getAll(key);
// 		return mapToFilters(key, values);
// 	});
// }

// export function isShopifyFilterKey(key: string) {
// 	return (
// 		['price', 'available', 'tag'].includes(key) ||
// 		['pm.', 'po.', 'vm.', 'vo.'].some((prefix) => key.startsWith(prefix))
// 	);
// }

// function mapToFilters(key: string, values: string[]): ProductFilter[] {
// 	if (key === 'price') {
// 		const numbers = values.map((v) => parseValue(v)).filter(isNonNil);
// 		if (numbers.length === 2) {
// 			const min = Math.min(...numbers);
// 			const max = Math.max(...numbers);
// 			const filter = { price: { min, max } };
// 			return [filter];
// 		} else {
// 			console.log('expected 2 values for price', values);
// 		}
// 	}
// 	if (key === 'available') {
// 		return values.map((v) => ({ available: v.toLowerCase() === 'true' }));
// 	}
// 	if (key === 'tag') {
// 		return values.map((v) => ({ tag: v }));
// 	}
// 	if (['pm.', 'po.', 'vm.', 'vo.'].some((prefix) => key.startsWith(prefix))) {
// 		return values
// 			.sort((a, b) => a.localeCompare(b))
// 			.map((v, i, arr) => {
// 				if (!arr[i + 1] || !arr[i + 1].startsWith(v)) {
// 					const parts = key.split('.', 3);
// 					const shortGid = v.split('.').at(-1);
// 					if (parts.length === 3 && shortGid) {
// 						const [prefix, namespace, key] = parts;
// 						const value = prefix.endsWith('o') ? longGID(shortGid) : v;
// 						const field = { namespace, key, value };
// 						const filter = prefix.startsWith('p')
// 							? { productMetafield: field }
// 							: { variantMetafield: field };
// 						return filter;
// 					} else {
// 						console.log('expected 3 (dot separated) parts for key', key, v);
// 					}
// 				}
// 			})
// 			.filter(isNonNil);
// 	}
// 	return [];
// }

export function parseValue(value: string | null): number | undefined {
	if (value) {
		const val = parseFloat(value);
		if (!isNaN(val)) {
			return val;
		}
	}
}

// export type ParsedFilter = Omit<Filter, 'values'> & {
//  values: ArgassoFilterItem[]
//  applied: boolean
// }

// export function parseShopifyFilters(filters: Filter[], hierarchy: Hierarchy, searchParams: URLSearchParams, categoryId?: string): ParsedFilter[] {
// 	const parentGidByChildGid = new Map(hierarchy.map((h) => [h.id, h.parent?.value]));

// 	return filters.map(({ id, ...filter }) => {
// 		let values: ArgassoFilterItem[];
// 		if (id === 'filter.v.m.book.category') {
// 			const itemsByGid = new Map<string, ArgassoFilterItem>();
// 			let fallbackKey = 'missing';
// 			filter.values.forEach(({ label, input, count, ...rest }) => {
// 				const parsed = JSON.parse(input) as ProductFilter;
// 				const query = getKeyValue(parsed);
// 				if (query) {
// 					const { key, value } = query;
// 					fallbackKey = key;
// 					itemsByGid.set(longGID(value), { id: rest.id, key, label, count, value, children: [], applied: searchParams.getAll(key).some(v => v === value) });
// 				} else {
// 					console.log('missing gid in filter input value', input);
// 				}
// 			});
// 			values = hierarchy
// 				.sort(sortParentsFirst)
// 				.map(({ id, title }) => {
// 					const value = shortGID(id);
// 					const label = title?.value;
// 					const child = itemsByGid.get(id) ?? filterItem({ key: fallbackKey, label, value, applied: searchParams.getAll(fallbackKey).some(v => v === value) });
// 					if (!itemsByGid.has(id)) {
// 						itemsByGid.set(id, child);
// 					}
// 					const parentId = parentGidByChildGid.get(id) ?? '';
// 					const parent = itemsByGid.get(parentId);
// 					if (parent && child) {
// 						child.value = [parent.value, child.value].join('.');
// 						child.applied = searchParams.getAll(child.key).some(v => v === child.value)
// 						parent.children?.push(child);
// 					} else {
// 						return child;
// 					}
// 				})
// 				.filter(isNonNil);
// 			if (categoryId){
// 				values = findSubtreeById(values, categoryId) ?? []
// 			}
// 		} else {
// 			values = filter.values.flatMap(({ label, input, count, ...rest }) => {
// 				const parsed = JSON.parse(input) as ProductFilter;
// 				if (filter.type === 'PRICE_RANGE') {
// 					if (isPrice(parsed)) {
// 						const { price } = parsed;
// 						return [
// 							{ key: 'price', label: 'Som lägst', value: `${price.min ?? 0}` },
// 							{ key: 'price', label: 'Som högst', value: `${price.max ?? 300}` }
// 						];
// 					} else {
// 						console.warn('missing price in filter input value', input);
// 						return [];
// 					}
// 				} else {
// 					const query = getKeyValue(parsed);
// 					if (query) {
// 						const { key, value } = query;
// 						const applied = searchParams.getAll(key).some(v => v === value)
// 						return [{ id: rest.id, key, label, count, value, applied }];
// 					} else {
// 						console.warn('missing key/value in filter input value', input);
// 						return [];
// 					}
// 				}
// 			});
// 		}
// 		return {
// 			...filter,
// 			id,
// 			values,
// 			applied: searchParams.has(values[0].key),
// 		};
// 	});
// }

// function findSubtreeById(values: ArgassoFilterItem[], categoryId: string) {
// 	for (const v of values) {
// 		if (v?.value.endsWith(shortGID(categoryId))) {
// 			return v.children
// 		}
// 		return findSubtreeById(v.children ?? [], categoryId)
// 	}
// }

type Category = Pages$result['categories']['nodes'][number]
export function makeCategoryPath(categories: Category[], category?: Category): string[] {
	if (category) {
		const parent = categories?.find(c => c.id === category.parent?.value)
		return [...makeCategoryPath(categories, parent), category.id]
	}
	return []
}

export function getDecendants(item: EnhancedFilterItem): EnhancedFilterItem[] {
	const items = item.children?.flatMap(getDecendants) ?? []
	return [item, ...items]
}

type NoUndefinedField<T> = { [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>> };

type Price = NoUndefinedField<Pick<ProductFilter, 'price'>>;
export function isPrice(value: ProductFilter): value is Price {
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

// function getKeyValue(productFilter: ProductFilter) {
// 	if (isProductMetafield(productFilter)) {
// 		const { namespace, key, value } = productFilter.productMetafield;
// 		const prefix = value.startsWith(METAOBJECT_PREFIX) ? 'po' : 'pm';
// 		return { key: [prefix, namespace, key].join('.'), value: shortGID(value) };
// 	} else if (isVariantMetafield(productFilter)) {
// 		const { namespace, key, value } = productFilter.variantMetafield;
// 		const prefix = value.startsWith(METAOBJECT_PREFIX) ? 'vo' : 'vm';
// 		return { key: [prefix, namespace, key].join('.'), value: shortGID(value) };
// 	} else if (isAvailableFilter(productFilter) || isTagFilter(productFilter)) {
// 		const [key, value] = Object.entries(productFilter)[0];
// 		return { key, value: String(value) };
// 	}
// }

// function filterItem(obj: {
// 	key: string;
// 	label?: string | null;
// 	count?: number | null;
// 	value: string;
// 	applied?: boolean
// }): ArgassoFilterItem {
// 	const { key, value, applied } = obj;
// 	const label = obj.label ?? 'missing';
// 	const count = obj.count ?? 0;
// 	return { key, label, count, value, children: [], applied };
// }

const METAOBJECT_PREFIX = 'gid://shopify/Metaobject/';

export function shortGID<T extends string | null | undefined>(longGid: T): T {
	return longGid?.replace(METAOBJECT_PREFIX, '') as T
}

// export function longGID(shortGid?: string) {
// 	return `${METAOBJECT_PREFIX}${shortGid}`;
// }

// export type StructuredFilterItem = Filter['values'][number] & {
// 	children?: StructuredFilterItem[]
// }

// export type StructuredFilter = Omit<Filter, 'values'> & {
// 	key: string
// 	values: StructuredFilterItem[], 
// }

// export function  makeCategoryTree(filters: EnhancedFilter[], hierarchy: Hierarchy, categoryId?: string): StructuredFilter[] {
// 	return filters.map((filter) => {
// 		let values: StructuredFilterItem[] = filter.values

// 		if (filter.id === 'filter.v.m.book.category') {
// 			const parentByChildId = new Map(hierarchy.map((h) => [
// 				shortGID(h.id),
// 				h.parent?.value && shortGID(h.parent.value)
// 			]));
				
// 			const itemsById = new Map<string, StructuredFilterItem>(filter.values.map(v => [getShortValue(v), {...v, children: []}]))
	
// 			values = []
	
// 			itemsById.forEach(child => {
// 				const parentId = parentByChildId.get(getShortValue(child)) ?? '';
// 				const parent = itemsById.get(parentId);
// 				if (parent) {
// 					// child.value = [parent.value, child.value].join('.');
// 					parent.children?.push(child);
// 				} else {
// 					values.push(child);
// 				}
// 			})
	
// 			if (categoryId){
// 				values = itemsById.get(shortGID(categoryId) ?? '')?.children ?? []
// 			}
// 		}

// 		return {
// 			...filter,
// 			values,
// 		}
// 	})
// }

export type EnhancedFilterItem = Filter['values'][number] & {
	key: string
	value: string
	active: boolean
	filterType: Filter['type']
	filterLabel: string
	children?: EnhancedFilterItem[]
}

export type EnhancedFilter = Omit<Filter, 'values'> & {
	key: string
	active: boolean
	values: EnhancedFilterItem[], 
}

export function getEnhancedFilter(filter: Filter, searchParams: URLSearchParams, initialFilters?: Filter[]): EnhancedFilter {
	const filterType = filter.type
	const filterLabel = filter.label
	const key = getShortKey(filter.id)
	const active = searchParams.has(key)
	const values = filter.values.map(v => {
		const searchValues = searchParams.getAll(key)
		if (filterType === 'PRICE_RANGE') {
			const input = initialFilters?.find(f => f.id === 'filter.v.price')?.values.at(0)?.input ?? v.input
			const value = getPriceRange(input, searchValues).join('.')
			return {...v, filterType, filterLabel, key, value, active, input}
		} else {
			const value = getShortValue(v)
			return {...v, filterType, filterLabel, key, value, active: searchValues.some(v => v.endsWith(value))}
		}
	})
	return {
		...filter,
		key,
		values,
		active
	}
}

function getPriceRange(input: string, queryValues: string[]): string[] {
		const parsed = JSON.parse(input) as ProductFilter;
		if (isPrice(parsed)) {
			const [min, max] = queryValues.sort()
			const minValue = `${min ?? parsed.price.min ?? 0}`
			const maxValue = `${max ?? parsed.price.max ?? 300}`
			return [minValue, maxValue]
		} else {
			console.warn('missing price in filter input value', input);
			return [];
		}
}

export function getCategoryFilterAsTree(filter: EnhancedFilter, hierarchy: MenuItem[]): EnhancedFilter {
	if (filter.id !== 'filter.v.m.book.category') {
		return filter
	}
const menuItems = hierarchy.flatMap(h => flatten(h))

	const parentByChildId = new Map(menuItems.map(h => [
		shortGID(h.id),
		shortGID(h.parent?.id)
	]))
	const includedValues = filter.values.filter(v => menuItems.some(i => shortGID(i.id) === v.value))
	
	const itemsById = new Map(includedValues.map(v => [
		v.value,
		{...v, children: [] as EnhancedFilterItem[]}
	]))

	let values: EnhancedFilterItem[] = []
	itemsById.forEach(child => {
		const parent = itemsById.get(parentByChildId.get(child.value) ?? '')
		if (parent) {
			parent.children.push(child);
		} else {
			values.push(child);
		}
	})

	// if (categoryId){
	// 	values = itemsById.get(shortGID(categoryId))?.children ?? []
	// }

	return {
		...filter,
		values,
	}
}

export function getActiveShopifyFilters(filters: Filter[], menuStructure: MenuItem | undefined, searchParams: URLSearchParams): ProductFilter[] {
	
	const parentIdByChildId = new Map(flatten(menuStructure).map(({id, parent}) => [shortGID(id), shortGID(parent?.id)]))

	return filters.map(f => getEnhancedFilter(f, searchParams)).flatMap(f => f.values
		.filter(v => v.active)
		.filter((v, _i, arr) => f.key !== 'category' || !arr.some(a => parentIdByChildId.get(a.value) === v.value))
		.flatMap(({input}) => {
			const parsed = JSON.parse(input) as ProductFilter;
			if (f.type === 'PRICE_RANGE') {
				const query = searchParams.getAll(f.key)
				const numbers = query.map((v) => parseValue(v)).filter(isNonNil);
				if (numbers.length === 2) {
					const min = Math.min(...numbers);
					const max = Math.max(...numbers);
					const filter = { price: { min, max } }
					return [filter]
				} else {
					console.log('expected 2 values for price', query);
					return []
				}
			} else {
				return [parsed]
			}
		})
	)
}

// type KeyValueFilterItem = Filter['values'][number] & {
// 	key: string,
// 	applied: boolean
// 	value: string,
// 	children: KeyValueFilterItem[]
// }

// type KeyValueFilter = Omit<Filter, 'values'> & {
// 	key: string, 
// 	applied: boolean,
// 	values: KeyValueFilterItem[], 
// }

// export function parse(filters?: Filter[], searchParams?: URLSearchParams): KeyValueFilter[] {
// 	return filters?.map((filter) => {
// 		const key = getShortKey(filter.id)
// 		const applied = searchParams?.has(key) ?? false
// 		const values = filter.values.flatMap((filterValue) => {
// 			if (filter.type === 'PRICE_RANGE') {
// 				const parsed = JSON.parse(filterValue.input) as ProductFilter;
// 				if (isPrice(parsed)) {
// 					const { price } = parsed;
// 					const minValue = `${price.min ?? 0}`
// 					const maxValue = `${price.max ?? 300}`
// 					const minApplied = searchParams?.getAll(key).includes(minValue) ?? false
// 					const maxApplied = searchParams?.getAll(key).includes(minValue) ?? false
// 					return [
// 						{ ...filterValue, key, value: minValue, applied: minApplied, children: [] },
// 						{ ...filterValue, key, value: maxValue, applied: maxApplied, children: [] },
// 					];
// 				} else {
// 					console.warn('missing price in filter input value', filterValue.input);
// 					return [];
// 				}
// 			} else {
// 				const value = filterValue.id.split('.').pop()?.replace('gid-shopify-metaobject-', '')
// 				if (value) {
// 					const applied = searchParams?.getAll(key).includes(value) ?? false
// 					return [{ ...filterValue, key, value, applied, children: [] }];
// 				} else {
// 					console.warn('missing value when parsed from id', filterValue);
// 					return [];
// 				}
// 			}
// 		});
// 		return {...filter,key,values,applied,}
// 	}) ?? []
// }

export function getShortKey(longKey: string) {
	return Object.keys(shortKeys).find(k => shortKeys[k] === longKey) ?? longKey
}

export function getLongKey(shortKey: string) {
	return shortKeys[shortKey] ?? shortKey
}

export function getShortValue(filterValue: Filter['values'][number]) {
	return filterValue.id.split('.').pop()?.replace('gid-shopify-metaobject-', '') ?? filterValue.id
}

export function isShopifyFilterKey(key: string) {
return shortKeys[key] !== undefined
}

const shortKeys: Record<string, string> = {
	'category': 'filter.v.m.book.category',
	'price': 'filter.v.price',
	'availability': 'filter.v.availability',
	'age': 'filter.v.m.book.age',
	'authors': 'filter.p.m.custom.authors',
	'reading_level': 'filter.v.m.book.reading_level',
	'discontinued': 'filter.v.m.book.discontinued',
	'binding': 'filter.v.m.book.binding',
}