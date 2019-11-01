<script>
  import Moveable from "./Moveable.svelte";
  export let name;


  let h1;

  function handleDrag() {
    console.log (1);
  }
</script>

<style>
	h1 {
		color: purple;
	}
</style>

<Moveable target={h1} draggable={true} on:drag={handleDrag}></Moveable>
<h1 bind:this={h1}>Hello {name}!</h1>
