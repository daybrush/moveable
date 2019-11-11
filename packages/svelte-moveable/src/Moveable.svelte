<script lang="ts">
  import VanillaMoveable, {
    PROPERTIES,
    EVENTS,
    MoveableOptions
  } from "moveable";
  import { camelize, isUndefined } from "@daybrush/utils";

  import {
    onMount,
    onDestroy,
    createEventDispatcher,
    beforeUpdate,
    afterUpdate,
    tick,
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
    container = options.container || $$props.container;

    if (moveable) {
      tick().then(() => {
        moveable.setState(options);
      });
    }
  });
  onMount(() => {
    moveable = new VanillaMoveable(container || document.body, options);

    EVENTS.forEach(name => {
      const onName = camelize(`on ${name}`);
      moveable.on(name, e => {
        const result = $$props[onName] && $$props[onName](e);
        const result2 = dispatch(name, e);

        return !isUndefined(result) ? result : (!isUndefined(result2) ? result2 : undefined);
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
