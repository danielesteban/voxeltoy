<script>
  export let state;
  import { onMount } from 'svelte';

  let wrapper;
  onMount(() => {
    let debounce;
    const editor = monaco.editor.create(wrapper, {
      value: $state,
      language: 'c',
      minimap: { enabled: false },
      theme: 'vs-dark',
    });
    editor.onDidChangeModelContent(() => {
      if (debounce) clearTimeout(debounce);
      debounce = setTimeout(() => (
        state.set(editor.getValue())
      ), 300);
    });
    const resize = () => editor.layout();
    window.addEventListener('resize', resize, false);
    return () => {
      window.removeEventListener('resize', resize);
      clearTimeout(debounce);
      editor.dispose();
    };
  });
</script>

<div class="wrapper" bind:this={wrapper} />

<style>
  .wrapper {
    overflow: hidden;
  }
</style>
