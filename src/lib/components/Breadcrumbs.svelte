<script lang="ts">
  import * as Breadcrumb from '$lib/components/ui/breadcrumb'

  export let loading = false
  export let crumbs: {
    href?: string
    name: string
  }[] = []
</script>

<Breadcrumb.Root class="py-2 text-sm font-light text-muted-foreground">
  <Breadcrumb.List>
    <Breadcrumb.Item>
      <Breadcrumb.Link href="/">Hem</Breadcrumb.Link>
    </Breadcrumb.Item>
    {#each crumbs as { href, name }}
      <Breadcrumb.Separator />
      <Breadcrumb.Item>
        <Breadcrumb.Link {href}>{name}</Breadcrumb.Link>
      </Breadcrumb.Item>
    {/each}
  </Breadcrumb.List>
</Breadcrumb.Root>
