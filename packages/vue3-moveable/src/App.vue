<script setup lang="ts">
import Moveable, { OnRender } from "./components/index.ts";

const onRender = (e: OnRender) => {
    e.target.style.cssText += e.cssText;
};
</script>

<template>
    <div>
        <div class="target"></div>
        <Moveable target=".target" :draggable="true" @render="onRender"></Moveable>
    </div>
</template>

<style scoped>
.target {
    position: relative;
    width: 100px;
    height: 100px;
    background: #f55;
}

.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}

.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}</style>
