<script>
  import {
    examples, scene, view,
    deserialize,
    serialize
  } from '../state/app.js';
  import Dropdown from './dropdown.svelte';

  let loader;
  let downloader;

  const views = [
    { id: 'scene', name: 'Scene' },
    { id: 'atlas', name: 'Atlas' },
    { id: 'rendering', name: 'Rendering' },
    { id: 'gallery', name: 'Gallery' },
  ];
  const setView = (value) => () => {
    $view = value;
  };
  const loadExample = (example) => () => {
    delete scene.editor;
    scene.source.set(example);
    $view = 'scene';
    if (location.hash) {
      location.hash = '/';
    }
  };
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
      deserialize(JSON.parse(reader.result));
      $view = 'scene';
      loader.value = null;
      if (location.hash) {
        location.hash = '/';
      }
    }, false);
    reader.readAsText(file);
  };
  const exportScene = () => {
    const blob = new Blob([JSON.stringify({ ...serialize(), version: 1 })], { type: 'application/json' });
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
  <Dropdown>
    <div class="toggle" slot="toggle">
      <div class="arrow" />
      File
    </div>
    <svelte:fragment slot="options">
      <div class="load">
        Load Example
        <div class="arrow" />
        <div class="examples">
          {#each examples as example, i}
            <div class="action" on:click={loadExample(example)}>Example {i + 1}</div>
          {/each}
        </div>
      </div>
      <div class="action" on:click={importScene}>
        Import
      </div>
      <div class="action" on:click={exportScene}>
        Export
      </div>
      <div class="action" on:click={setView('publish')}>
        Publish
      </div>
    </svelte:fragment>
  </Dropdown>
  {#each views as { id, name }}
    <div class="view" class:enabled={$view === id} on:click={setView(id)}>
      {name}
    </div>
  {/each}
</div>

<style>
  .helpers {
    display: none;
  }

  .toolbar {
    display: flex;
    white-space: nowrap;
  }

  .view {
    position: relative;
    padding: 1rem;
    cursor: pointer;
  }

  .view:last-child {
    margin-left: auto;
  }

  .view:hover {
    color: #393;
  }

  .view.enabled {
    color: #fff;
    cursor: default;
  }

  .view.enabled::before {
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

  .arrow {
    width: 0; 
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #fff;
  }

  .toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
  }

  .action, .load {
    padding: 0.5rem 1rem;
  }

  .action:hover {
    color: #393;
    cursor: pointer;
  }

  .load {
    position: relative;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .load .arrow {
    transform: rotate(-90deg);
  }

  .examples {
    display: none;
    position: absolute;
    top: 0;
    left: 100%;
    background-color: #000;
  }

  .load:hover .examples {
    display: block;
  }
</style>
