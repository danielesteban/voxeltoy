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
    if (state.editor) {
      const { model, view } = state.editor;
      editor.setModel(model);
      editor.restoreViewState(view);
    } else {
      editor.setModel(monaco.editor.createModel($source, 'c'));
    }
    const subscriptions = [
      errors.subscribe((errors) => {
        monaco.editor.setModelMarkers(
          editor.getModel(),
          'Errors',
          errors.map(({ lineNum, linePos, length, message }) => ({
            message,
            startLineNumber: lineNum,
            endLineNumber: lineNum,
            startColumn: linePos,
            endColumn: linePos + length,
          }))
        );
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
    editor.focus();
    window.addEventListener('resize', resizeEditor, false);
    return () => {
      state.editor = {
        model: editor.getModel(),
        view: editor.saveViewState(),
      };
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
      <div class="arrow" />
    </div>
    <div class="messages">
      {#each $errors as { lineNum, linePos, type, message, line, pointer }}
        <div>
          <div>:{lineNum}:{linePos} {type}: {message}</div>
          <div>{line}</div>
          <div>{pointer}</div>
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
    justify-content: flex-end;
    padding: 0.5rem 1rem;
    cursor: pointer;
    gap: 0.5rem;
    background-color: #111;
  }

  .arrow {
    width: 0; 
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid #fff;
  }

  .errors.open .arrow {
    transform: rotate(180deg);
  }

  .status {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 0.25rem;
    background-color: #393;
  }

  .status.error {
    background-color: #933;
  }

  .messages {
    background-color: #1e1e1e;
    overflow-y: auto;
  }

  .messages > div {
    padding: 0.5rem 1rem;
  }

  .messages > div > div {
    white-space: pre;
  }
</style>
