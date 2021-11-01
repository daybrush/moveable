<template>
  <div class="root">
    <div class="container" style="position: relative">
      <div class="target">Target</div>
      <button @click="toggleDraggable">Toggle {{draggable}}</button>
      <moveable
        v-bind:target="['.target']"
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
            draggable: true,
        };
    },
    methods: {
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
<style>
html,
body {
  position: relative;
  height: 100%;
  margin: 0;
  padding: 0;
}
.description {
  padding: 10px;
}
.root {
  position: relative;
}
.container {
  position: relative;
  margin-top: 50px;
}
.target {
  position: absolute;
  width: 100px;
  height: 100px;
  top: 150px;
  left: 100px;
  line-height: 100px;
  text-align: center;
  background: #ee8;
  color: #333;
  font-weight: bold;
  border: 1px solid #333;
  box-sizing: border-box;
}

.target1 {
  left: 120px;
  top: 120px;
}

.target2 {
  left: 300px;
  top: 140px;
}

.target3 {
  left: 180px;
  top: 250px;
}
</style>
