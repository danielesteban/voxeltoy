<script context="module">
  const Storage = new Map();
</script>

<script>
  import { tick, onMount } from 'svelte';

  export let state;
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
    let isFromEditor = true;
    editor = monaco.editor.create(wrapper, {
      minimap: { enabled: false },
      theme: 'vs-dark',
    });
    if (Storage.has(source)) {
      const { model, view } = Storage.get(source);
      editor.setModel(model);
      editor.restoreViewState(view);
    } else {
      editor.setModel(monaco.editor.createModel($source, 'c'));
    }
    const subscriptions = [
      errors.subscribe((errors) => {
        if (!errors.length) {
          return;
        }
        showErrors = true;
        tick().then(resizeEditor);
      }),
      source.subscribe((value) => {
        if (!isFromEditor) {
          editor.setValue(value);
        }
      }),
    ];
    isFromEditor = false;
    editor.onDidChangeModelContent(() => {
      if (debounce) clearTimeout(debounce);
      debounce = setTimeout(() => {
        isFromEditor = true;
        source.set(editor.getValue());
        isFromEditor = false;
      }, 300);
    });
    window.addEventListener('resize', resizeEditor, false);
    return () => {
      Storage.set(source, {
        model: editor.getModel(),
        view: editor.saveViewState(),
      });
      editor.dispose();
      clearTimeout(debounce);
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
