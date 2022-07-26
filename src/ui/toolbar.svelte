<script>
  import { examples, scene, tool } from '../state.js';
  import Dropdown from './dropdown.svelte';

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
</script>

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
        </div>
        <svelte:fragment slot="options">
          {#each examples as example, i}
            <div class="action" on:click={loadExample(example)}>Example {i + 1}</div>
          {/each}
        </svelte:fragment>
      </Dropdown>
    {/if}
  </div>
</div>

<style>
  .toolbar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
  }

  .tools {
    display: flex;
  }

  .tool {
    position: relative;
    padding: 1rem;
    cursor: pointer;
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

  .toggle {
    padding: 1rem;
  }

  .action {
    text-align: right;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }

  .action:hover {
    color: #393;
  }
</style>
