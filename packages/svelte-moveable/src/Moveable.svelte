<script>
  import VanillaMoveable, {
    PROPERTIES,
    EVENTS,
  } from "moveable";
  import { camelize, isUndefined } from "@daybrush/utils";

  import {
    onMount,
    onDestroy,
    createEventDispatcher,
    beforeUpdate,
    tick
  } from "svelte";

  const dispatch = createEventDispatcher();
  let options = {};

  let moveableElement;
  let moveable;

  beforeUpdate(() => {
    const props = $$props;

    options = {};
    PROPERTIES.forEach(name => {
      if (name in props) {
        options[name] = props[name];
      }
    });

    if (moveable) {
      tick().then(() => {
        moveable.setState({
          ...options,
        });
      });
    }
  });
  onMount(() => {
    moveable = new VanillaMoveable(moveableElement, {
      ...options
      portalContainer: moveableElement,
    });

    EVENTS.forEach(name => {
      const onName = camelize(`on ${name}`);
      moveable.on(name, e => {
        $$props[onName] && $$props[onName](e);
        dispatch(name, e);
      });
    });
  });
  onDestroy(() => {
    moveable && moveable.destroy();
  });

  export function getInstance() {
    return moveable;
  }
</script>
<div bind:this={moveableElement}></div>
