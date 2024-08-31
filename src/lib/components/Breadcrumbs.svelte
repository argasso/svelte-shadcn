<script lang="ts">
  import * as Breadcrumb from '$lib/components/ui/breadcrumb'

  export let crumbs: {
    href?: string
    name: string
  }[] = []
</script>

<Breadcrumb.Root class="py-2 text-sm font-light text-muted-foreground">
  <Breadcrumb.List>
    {#each crumbs as { href, name }, index}
      {#if index > 0}
        <Breadcrumb.Separator />
      {/if}
      <Breadcrumb.Item>
        <Breadcrumb.Link {href}>{name}</Breadcrumb.Link>
      </Breadcrumb.Item>
    {/each}
  </Breadcrumb.List>
</Breadcrumb.Root>
