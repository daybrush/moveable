<script lang="ts">
  import VanillaMoveable, {
    PROPERTIES,
    EVENTS,
    MoveableOptions
  } from "moveable";
  import { camelize } from "@daybrush/utils";

  import {
    onMount,
    onDestroy,
    createEventDispatcher,
    beforeUpdate,
  } from "svelte";

  const dispatch = createEventDispatcher();
  declare var $$props: any;
  let options: Partial<MoveableOptions> = {};
  let container: SVGElement | HTMLElement;
  let moveable: VanillaMoveable;

  beforeUpdate(() => {
    const props = $$props;

    options = {};
    PROPERTIES.forEach(name => {
      if (name in props) {
        (options as any)[name] = props[name];
      }
    });
    container = options.container;

    if (moveable) {
      moveable.target = options.target;
      moveable.setState(options);
    }
  });
  onMount(() => {
    moveable = new VanillaMoveable(container || document.body, options);

    EVENTS.forEach(name => {
      const onName = camelize(`on ${name}`);
      moveable.on(name, e => {
        $$props[onName] && $$props[onName](e);
        dispatch(name, e);
      });
    });
  });
  onDestroy(() => {
    moveable.destroy();
  });

  export function updateRect() {
    return moveable.updateRect();
  }
  export function updateTarget() {
    return moveable.updateTarget();
  }
  export function isInside(clientX: number, clientY: number) {
    return moveable.isInside(clientX, clientY);
  }
  export function isMoveableElement(target: SVGElement | HTMLElement) {
    return moveable.isMoveableElement(target);
  }
  export function getRect() {
    return moveable.getRect();
  }
  export function destroy() {
    moveable.destroy();
  }
  export function dragStart(e: MouseEvent | TouchEvent) {
    moveable.dragStart(e);
  }
  export function setState(state: any, callback: () => any) {
    moveable.setState(state, callback);
  }
</script>
