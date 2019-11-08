<script>
  import Moveable from "./Moveable.svelte";
  export let name;


  let target=[];

  function handleDrag() {
    console.log (1);
  }

</script>

<style>
  .target {
    width: 120px;
    height: 100px;
    border: 1px solid #333;
    font-size: 30px;
    line-height: 30px;
    text-align: center;
  }
</style>

<Moveable
  target={target}
  draggable={true}
  on:dragStart={({ detail: { set } }) => {
  }}
/>
<div class="target" bind:this={target[0]}>T1</div>
<div class="target" bind:this={target[1]}>T2</div>
<div class="target" bind:this={target[2]}>T3</div>
