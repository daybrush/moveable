<script lang="ts">
  import VanillaMoveable, { PROPERTIES, EVENTS } from "moveable";
  import { onMount, onDestroy, createEventDispatcher } from "svelte";



  let options;
  let container;
  let moveable: VanillaMoveable;

  $: {
    const props = $$props;

    options = {};
    PROPERTIES.forEach(name => {
      if (name in props) {
        options[name] = props[name];
      }
    });
    container = options.container;
    if (moveable) {
      // moveable.setState(options);
    }
  }

  onMount(() => {
    moveable = new VanillaMoveable(container || document.body, options);
    const dispatch = createEventDispatcher();

    EVENTS.forEach(name => {
      moveable.on(name, e => {
        dispatch(name, e);
      });
    });
  });
  onDestroy(() => {
    destroy();
  });

  export function updateRect() {
    return moveable.updateRect();
  }
  export function updateTarget() {
    return moveable.updateTarget();
  }
  export function isInside(clientX, clientY) {
    return moveable.isInside(clientX, clientY);
  }
  export function isMoveableElement(target) {
    return moveable.isMoveableElement(target);
  }
  export function getRect() {
    return moveable.getRect();
  }
  export function destroy() {
    moveable.destroy();
  }
  export function dragStart(e) {
    moveable.dragStart(e);
  }
</script>
