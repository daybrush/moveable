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
    afterUpdate,
    tick
  } from "svelte";

  const dispatch = createEventDispatcher();
  let options = {};
  let container;
  let moveable;

  beforeUpdate(() => {
    const props = $$props;

    options = {};
    PROPERTIES.forEach(name => {
      if (name in props) {
        options[name] = props[name];
      }
    });
    container = options.container || $$props.container || document.body;

    if (moveable) {
      tick().then(() => {
        moveable.setState({
          ...options,
          container,
          parentElement: container
        });
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

        return !isUndefined(result)
          ? result
          : !isUndefined(result2)
          ? result2
          : undefined;
      });
    });
  });
  onDestroy(() => {
    moveable.destroy();
  });

  export function getInstance() {
    return moveable;
  }
</script>
