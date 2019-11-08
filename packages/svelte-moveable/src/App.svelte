<script>
  import Moveable from "./Moveable.svelte";
  import { onMount } from "svelte";
  import { Frame } from "scenejs";
  import keycon from "keycon";
  export let name;

  const KeyController = keycon.setGlobal();
  const frameMap = new Map();
  let targets = [];
  let moveable;

  function handleDrag() {
    console.log(1);
  }
  function newFrame(el) {
    const frame = new Frame({
      transform: {
        translateX: "0px",
        translateY: "0px",
        scaleX: 1,
        scaleY: 1
      }
    });

    frameMap.set(el, frame);

    return frame;
  }
  function getFrame(target) {
    return frameMap.get(target) || newFrame(target);
  }
  function onRender({ target }) {
    target.style.cssText += getFrame(target).toCSS();
  }
  function onDragStart({ target, set }) {
    const frame = getFrame(target);

    set([
      parseFloat(frame.get("transform", "translateX")),
      parseFloat(frame.get("transform", "translateY"))
    ]);
  }
  function onScaleStart({ target, dragStart, set }) {
    const frame = getFrame(target);
    set([frame.get("transform", "scaleX"), frame.get("transform", "scaleY")]);
    dragStart && onDragStart(dragStart);
  }
  function onScale({ target, scale, drag }) {
    const frame = getFrame(target);

    frame.set("transform", "scaleX", scale[0]);
    frame.set("transform", "scaleY", scale[1]);

    onDrag(drag);
  }
  function onDrag({ target, beforeTranslate }) {
    const frame = getFrame(target);

    frame.set("transform", "translateX", `${beforeTranslate[0]}px`);
    frame.set("transform", "translateY", `${beforeTranslate[1]}px`);
  }
  function onMouseDown(e) {
    const target = e.target;
    if (
      target === document.body ||
      moveable.isMoveableElement(target) ||
      targets.indexOf(target) > -1
    ) {
      return;
    }
    targets = [...targets, target];
  }
  function onClickGroup(e) {
    const target = e.inputTarget;

    console.log(target);
    if (
      target === document.body ||
      moveable.isMoveableElement(target) ||
      targets.indexOf(target) < 0
    ) {
      return;
    }
    targets.splice(targets.indexOf(target), 1);
    targets = [...targets];
  }
  onMount(() => {
    targets = [document.querySelector(".target")];
  });
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

<svelte:body on:mousedown={onMouseDown} />
<Moveable
  bind:this={moveable}
  target={targets}
  draggable={true}
  scalable={true}
  on:dragStart={({ detail }) => {
    onDragStart(detail);
  }}
  on:drag={({ detail }) => {
    onDrag(detail);
  }}
  on:scaleStart={({ detail }) => {
    onScaleStart(detail);
  }}
  on:scale={({ detail }) => {
    onScale(detail);
  }}
  on:render={({ detail }) => {
    onRender(detail);
  }}
  on:clickGroup={({ detail }) => {
    onClickGroup(detail);
  }} />

<div class="target">T1</div>
<div class="target">T2</div>
<div class="target">T3</div>
