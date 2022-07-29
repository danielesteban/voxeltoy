<script>
  import {
    examples, meta,
    deserialize,
    serialize
  } from '../state/app.js';
  import { view, goTo } from '../state/router.js'; 
  import { session } from '../state/server.js'; 
  import Dropdown from './dropdown.svelte';

  const { id, author, title, hasModified } = meta;
  const views = [
    { id: 'scene', name: 'Scene' },
    { id: 'atlas', name: 'Atlas' },
    { id: 'effect', name: 'Effect' },
    { id: 'rendering', name: 'Rendering' },
  ];

  const goToGallery = (filter = '') => () => (
    goTo(`/gallery/${filter}`)
  );

  const load = (scene) => {
    deserialize(scene);
    $view = { id: 'scene' };
    if (location.hash) {
      goTo('/');
    }
  };

  const loadExample = (example) => () => (
    load({ scene: example })
  );

  const setView = (id) => () => {
    $view = { id };
  };

  let loader;
  let downloader;
  const importScene = () => loader.click();
  const readScene = () => {
    const file = loader.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      loader.value = null;
      load(JSON.parse(reader.result));
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
  <input type="file" accept="application/json" on:change={readScene} bind:this={loader} />
  <!-- svelte-ignore a11y-missing-attribute a11y-missing-content -->
  <a bind:this={downloader} />
</div>

<div>
  {#if $view.id === 'gallery'}
    <div class="menu">
      Voxeltoy
    </div>
    <div class="toolbar">
      <div>
        <div class="view" class:enabled={$view.filter === 'latest'} on:click={$view.filter !== 'latest' ? goToGallery() : null}>
          Latest
        </div>
        {#if $view.filter !== 'latest'}
          <div class="view enabled">
            {$view.filter}
          </div>
        {/if}
      </div>
    </div>
  {:else}
    <div class="menu">
      <!-- svelte-ignore a11y-missing-attribute -->
      <span class="parent">
        <a on:click={goToGallery()}>Voxeltoy</a>
        &gt;
      </span>
      {$title} by
      {#if $author || $session}
        <!-- svelte-ignore a11y-missing-attribute -->
        <a on:click={goToGallery($author || $session.name)}>
          {$author || $session.name}
        </a>
      {:else}
        anonymous
      {/if}
    </div>
    <div class="toolbar">
      <div>
        <Dropdown>
          <div class="toggle" slot="toggle">
            <div class="arrow" />
            File
          </div>
          <svelte:fragment slot="options">
            <div class="load">
              Examples
              <div class="arrow" />
              <div class="examples">
                {#each examples as example, i}
                  <div class="action" on:click={loadExample(example)}>Example {i + 1}</div>
                {/each}
              </div>
            </div>
            <div class="action" on:click={loadExample(examples[0])}>
              New
            </div>
            <div class="action" on:click={importScene}>
              Import
            </div>
            <div class="action" on:click={exportScene}>
              Export
            </div>
            <div
              class="action"
              class:disabled={!$hasModified}
              on:click={$hasModified ? setView('publish') : null}
            >
              {#if $id && $session && $author === $session.name}
                Save
              {:else}
                Publish
              {/if}
            </div>
          </svelte:fragment>
        </Dropdown>
        {#each views as { id, name }}
          <div class="view" class:enabled={$view.id === id} on:click={setView(id)}>
            {name}
          </div>
        {/each}
      </div>
      <div>
        {#if $hasModified}
          <div
            class="view"
            class:enabled={$view.id === 'publish'}
            on:click={setView('publish')}
          >
            {#if $id && $session && $author === $session.name}
              Save
            {:else}
              Publish
            {/if}
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
<style>
  .helpers {
    display: none;
  }

  .menu {
    background-color: #111;
    padding: 1rem;
    text-align: center;
    white-space: nowrap;
  }

  .menu > a, .menu .parent > a {
    font-weight: 700;
    text-decoration: underline;
    cursor: pointer;
  }

  .menu > a:hover, .menu .parent > a:hover {
    color: #393;
  }

  .menu .parent {
    color: #666;
  }

  .toolbar {
    background-color: #000;
    display: flex;
    white-space: nowrap;
    justify-content: space-between;
  }

  .toolbar > div {
    display: flex;
  }

  .view {
    position: relative;
    padding: 1rem;
    cursor: pointer;
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

  .action.disabled {
    opacity: 0.5;
    cursor: default;
  }

  .action.disabled:hover {
    color: #fff;
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
