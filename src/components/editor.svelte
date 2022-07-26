<script>
  export let state;
  import { tick, onMount } from 'svelte';
  const { errors, source } = state;

  let wrapper;
  let editor;
  let showErrors = false;
  const resizeEditor = () => editor.layout();
  const toggleErrors = () => {
    showErrors = !showErrors;
    tick().then(resizeEditor);
  };
  onMount(() => {
    let debounce;
    let isMounting = true;
    let isFromEditor = false;
    editor = monaco.editor.create(wrapper, {
      value: $source,
      language: 'c',
      minimap: { enabled: false },
      theme: 'vs-dark',
    });
    editor.onDidChangeModelContent(() => {
      if (debounce) clearTimeout(debounce);
      debounce = setTimeout(() => {
        isFromEditor = true;
        source.set(editor.getValue());
        isFromEditor = false;
      }, 300);
    });
    window.addEventListener('resize', resizeEditor, false);
    const subscriptions = [
      errors.subscribe((errors) => {
        if (isMounting || !errors.length) {
          return;
        }
        showErrors = true;
        tick().then(resizeEditor);
      }),
      source.subscribe((value) => {
        if (!isMounting && !isFromEditor) {
          editor.setValue(value);
        }
      }),
    ];
    isMounting = false;
    return () => {
      clearTimeout(debounce);
      editor.dispose();
      window.removeEventListener('resize', resizeEditor);
      subscriptions.forEach((unsubscribe) => unsubscribe());
    };
  });
</script>

<div class="editor">
  <div class="wrapper" bind:this={wrapper} />
  <div class="errors" class:open={showErrors}>
    <div class="toggle" on:click={toggleErrors}>
      <div class="status" class:error={$errors.length} />
      {$errors.length} errors
    </div>
    <div class="messages">
      {#each $errors as messages}
        <div>
          {#each messages as message}
            <div>{message}</div>
          {/each}
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .editor {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
    min-height: 0;
  }

  .wrapper {
    overflow: hidden;
  }

  .errors {
    height: 34px;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }

  .errors.open {
    height: 200px;
  }

  .toggle {
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    cursor: pointer;
    gap: 0.5rem;
  }

  .status {
    width: 1rem;
    height: 1rem;
    border-radius: 0.5rem;
    background-color: #393;
  }

  .status.error {
    background-color: #933;
  }

  .messages {
    background-color: #111;
    overflow-y: auto;
  }

  .messages > div {
    padding: 0.5rem 1rem;
    white-space: pre;
  }
</style>
