<script>
  import { createEventDispatcher, onDestroy } from 'svelte';

  export let enabled = true;
  let visible = false;

  const delay = setTimeout(() => {
    visible = true;
  }, 100);
	const dispatch = createEventDispatcher();
  const observer = new IntersectionObserver(([{ isIntersecting }]) => {
    if (isIntersecting) {
      dispatch('intersect');
    }
  });
  
  onDestroy(() => {
    clearTimeout(delay);
    observer.disconnect();
  });

  let wrapper;
  $: {
    if (enabled) {
      observer.observe(wrapper);
    } else {
      observer.disconnect();
    }
  }
</script>

<div class="wrapper" bind:this={wrapper}>
  {#if visible}
    <slot />
  {/if}
</div>

<style>
  .wrapper {
    width: 100%;
    text-align: center;
  }
</style>
