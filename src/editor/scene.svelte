<script>
  import { onMount } from 'svelte';
  import { scene } from '../state.js';

  let wrapper;
  onMount(() => {
    let debounce;
    const editor = monaco.editor.create(wrapper, {
      value: $scene,
      language: 'c',
      minimap: { enabled: false },
      theme: 'vs-dark',
    });
    editor.onDidChangeModelContent(() => {
      if (debounce) clearTimeout(debounce);
      debounce = setTimeout(() => (
        scene.set(editor.getValue())
      ), 300);
    });
    return () => {
      clearTimeout(debounce);
      editor.dispose();
    };
  });
</script>

<div bind:this={wrapper} />
