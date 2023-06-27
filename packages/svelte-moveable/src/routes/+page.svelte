<script lang="ts">
  import { onMount } from "svelte";
  import Moveable from "$lib/index.js";

  let svg!: SVGSVGElement;

  onMount(() => {
    console.log(svg);
  });
</script>

<div>
  <div class="target">Target</div>
  <Moveable target=".target" />
</div>
