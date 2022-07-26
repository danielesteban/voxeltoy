<script>
  export let state;
  import { onMount } from 'svelte';

  let wrapper;
  onMount(() => {
    let debounce;
    let fromEditor = true;
    const editor = monaco.editor.create(wrapper, {
      value: $state,
      language: 'c',
      minimap: { enabled: false },
      theme: 'vs-dark',
    });
    editor.onDidChangeModelContent(() => {
      if (debounce) clearTimeout(debounce);
      debounce = setTimeout(() => {
        fromEditor = true;
        state.set(editor.getValue());
        fromEditor = false;
      }, 300);
    });
    const resize = () => editor.layout();
    window.addEventListener('resize', resize, false);
    const unsubscribe = state.subscribe((value) => {
      if (!fromEditor) {
        editor.setValue(value);
      }
    });
    fromEditor = false;
    return () => {
      clearTimeout(debounce);
      editor.dispose();
      window.removeEventListener('resize', resize);
      unsubscribe();
    };
  });
</script>

<div class="wrapper" bind:this={wrapper} />

<style>
  .wrapper {
    overflow: hidden;
  }
</style>
