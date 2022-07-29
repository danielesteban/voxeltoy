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

  let dom;
  $: {
    if (enabled) {
      observer.observe(dom);
    } else {
      observer.disconnect();
    }
  }
</script>

<div bind:this={dom}>
  {#if visible}
    <slot />
  {/if}
</div>
