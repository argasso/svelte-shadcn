<script lang="ts">
  import { getSingleValueQueryStore } from '$lib/stores/URLSearchParamsStore'
  import * as Select from '$lib/components/ui/select'
  import { isNonNil } from '$lib'

  type Option = { value: string; label: string }

  let className = ''
  export { className as class }
  export let key: string
  export let options: (Option | string)[]
  export let suffix: string | undefined = undefined
  export let placeholder: string | undefined = undefined
  export let label: string | undefined = undefined

  let opts: Option[]
  $: opts = options
    .map((o) => (typeof o === 'string' ? { value: o, label: optionalJoin(o, suffix) } : o))
    .map((o, i, arr) => (i === 0 && !arr.find((a) => a.value == '') ? { ...o, value: '' } : o))

  const value = getSingleValueQueryStore(key)
  $: selected = opts.find((o) => o.value === $value)

  function optionalJoin(...values: (string | undefined)[]) {
    return values.filter(isNonNil).join(' ')
  }
</script>

<Select.Root portal={null} {selected} onSelectedChange={(s) => value.set(s?.value ?? '')}>
  <Select.Trigger class={className}>
    <Select.Value {placeholder} />
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      {#if label}
        <Select.Label>{label}</Select.Label>
      {/if}
      {#each opts as item}
        <Select.Item value={item.value} label={item.label}></Select.Item>
      {/each}
    </Select.Group>
  </Select.Content>
  <Select.Input name={key} />
</Select.Root>
