<script>
  export let source;

  import { onMount } from 'svelte';

  let wrapper;
  onMount(() => {
    let debounce;
    const editor = monaco.editor.create(wrapper, {
      value: $source,
      language: 'c',
      theme: 'vs-dark',
      minimap: { enabled: false },
    });
    editor.onDidChangeModelContent(() => {
      if (debounce) clearTimeout(debounce);
      debounce = setTimeout(() => (
        source.set(editor.getValue())
      ), 300);
    });
    return () => {
      clearTimeout(debounce);
      editor.dispose();
    };
  });
</script>

<div bind:this={wrapper} />
