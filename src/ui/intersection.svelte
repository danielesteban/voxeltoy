<script>
  import { createEventDispatcher, onDestroy } from 'svelte';

  export let enabled = true;

	const dispatch = createEventDispatcher();
  const observer = new IntersectionObserver(([{ isIntersecting }]) => {
    if (isIntersecting) {
      dispatch('intersect');
    }
  });

  onDestroy(() => {
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
  <slot />
</div>
