<template>
  <div class="root">
    <div class="container" style="position: relative">
      <div :class="className" @mousedown="mousedown">Target</div>
      <button @click="toggleDraggable">Toggle {{draggable}}</button>
      <moveable
        ref="moveable"
        :target="target"
        v-bind:draggable="draggable"
        v-bind:throttleDrag="1"
        v-bind:edgeDraggable="false"
        v-bind:startDragRotate="0"
        v-bind:throttleDragRotate="0"
        @drag="onDrag"
      />
    </div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
import Moveable from "../src/Moveable.vue";

export default defineComponent({
    components: {
        Moveable,
    },
    data(){
        return {
            target: [],
            className: "",
            draggable: true,
        };
    },
    methods: {
        mousedown(event) {
            this.target = ['.target'];
            event.target.classList.add("target");

            this.$nextTick(() => {
                this.$refs.moveable.dragStart(event);
            });
        },
        onDrag(e) {
            e.target.style.transform = e.transform;
        },
        toggleDraggable() {
            console.log(this.draggable);
            this.draggable = !this.draggable;
        }
    }
});
</script>
