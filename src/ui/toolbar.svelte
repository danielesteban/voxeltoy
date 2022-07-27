<script>
  import { deserialize, examples, serialize, scene, tool } from '../state.js';
  import Dropdown from './dropdown.svelte';

  let loader;
  let downloader;

  const tools = [
    { id: 'scene', name: 'Scene' },
    { id: 'atlas', name: 'Atlas' },
    { id: 'rendering', name: 'Rendering' },
  ];
  const setTool = (value) => () => {
    $tool = value;
  };
  const loadExample = (example) => () => (
    scene.source.set(example)
  );
  const importScene = () => (
    loader.click()
  );
  const loadScene = () => {
    const file = loader.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      deserialize(reader.result);
      loader.value = null;
    }, false);
    reader.readAsText(file);
  };
  const exportScene = () => {
    const blob = new Blob([serialize()], { type: 'application/json' });
    downloader.download = 'scene.json';
    downloader.href = URL.createObjectURL(blob);
    downloader.click();
  };
</script>

<div class="helpers">
  <input type="file" accept="application/json" on:change={loadScene} bind:this={loader} />
  <!-- svelte-ignore a11y-missing-attribute a11y-missing-content -->
  <a bind:this={downloader} />
</div>

<div class="toolbar">
  <div class="tools">
    {#each tools as { id, name }}
      <div class="tool" class:enabled={$tool === id} on:click={setTool(id)}>
        {name}
      </div>
    {/each}
  </div>
  <div class="actions">
    {#if $tool === 'scene'}
      <Dropdown>
        <div class="toggle" slot="toggle">
          Load Example
          <div class="arrow" />
        </div>
        <svelte:fragment slot="options">
          {#each examples as example, i}
            <div class="action" on:click={loadExample(example)}>Example {i + 1}</div>
          {/each}
        </svelte:fragment>
      </Dropdown>
    {/if}
    <div on:click={importScene}>
      Import
    </div>
    <div on:click={exportScene}>
      Export
    </div>
  </div>
</div>

<style>
  .helpers {
    display: none;
  }

  .toolbar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
    white-space: nowrap;
  }

  .tools {
    display: flex;
  }

  .tool {
    position: relative;
    padding: 1rem;
    cursor: pointer;
  }

  .tool:hover {
    color: #393;
  }

  .tool.enabled {
    color: #fff;
  }

  .tool.enabled::before {
    position: absolute;
    left: 0.5rem;
    right: 0.5rem;
    bottom: 0.5rem;
    height: 0.25rem;
    content: "";
    background: #393;
    cursor: default;
    border-radius: 0.25rem;
  }

  .actions {
    display: flex;
    justify-content: right;
  }

  .toggle, .actions > div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
  }

  .actions > div {
    cursor: pointer;
  }

  .action {
    text-align: right;
    padding: 0.5rem 1.25rem;
    cursor: pointer;
  }

  .action:hover, .actions > div:hover {
    color: #393;
  }

  .arrow {
    width: 0; 
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #fff;
  }
</style>
