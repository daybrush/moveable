<script>
  import Moveable from "./Moveable.svelte";
  import { Frame } from "scenejs";
  export let name;

  const frameMap = new Map();
  let target = [];

  function handleDrag() {
    console.log(1);
  }
  function newFrame(el) {
    const frame = new Frame({
      transform: {
        translateX: "0px",
        translateY: "0px",
      },
    });

    frameMap.set(el, frame);

    return frame;
  }
  function getFrame(target) {
    return frameMap.get(target) || newFrame(target);
  }
  function render({ target }) {
    console.log("?");
    target.style.cssText += getFrame(target).toCSS();
  }
  function dragStart({ target, set }) {
    const frame = getFrame(target);

    set([
      parseFloat(frame.get("transform", "translateX")),
      parseFloat(frame.get("transform", "translateY")),
    ]);
  }
  function resize({ target, width, height }) {
    const frame = getFrame(target);

console.log(target, width, height);
    frame.set("width", `${width}px`);
    frame.set("height", `${height}px`);
  }
  function drag({ target, beforeTranslate }) {
    const frame = getFrame(target);

    frame.set("transform", "translateX", `${beforeTranslate[0]}px`);
    frame.set("transform", "translateY", `${beforeTranslate[1]}px`);
  }
</script>

<style>
  .target {
    position: absolute;
    width: 120px;
    height: 70px;
    border: 1px solid #333;
    font-size: 30px;
    line-height: 30px;
    text-align: center;
    box-sizing: border-box;
  }
  .target:nth-child(1) {
    top: 100px;
    left: 100px;
  }
  .target:nth-child(2) {
    top: 50px;
    left: 300px;
    height: 100px;
  }
  .target:nth-child(3) {
    top: 250px;
    left: 200px;
    width: 80px;
  }
</style>

<Moveable
  {target}
  draggable={true}
  resizable={true}
  on:dragStart={({ detail }) => {
    dragStart(detail);
  }}
  on:drag={({ detail }) => {
    drag(detail);
  }}
  on:resize={({ detail }) => {
    resize(detail);
  }}
  on:render={({ detail }) => {
    render(detail);
  }}
  />
<div class="target" bind:this={target[0]}>T1</div>
<!-- <div class="target" bind:this={target[1]}>T2</div>
<div class="target" bind:this={target[2]}>T3</div> -->
