<script setup lang="ts">
import { ref } from "vue";

const el = ref<HTMLElement | null>(null);

function handleExample(e: CustomEvent) {
	console.log(e);
}

function emitEvent() {
	el.value?.dispatchEvent(
		new CustomEvent("example", {
			detail: "HELLOOO",
		}),
	);
}
</script>

<template>
	<button @click="emitEvent">Emit</button>

	<div ref="el" @example="handleExample"></div>
</template>
