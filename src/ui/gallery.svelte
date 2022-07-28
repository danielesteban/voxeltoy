<script>
  import { onMount } from 'svelte';
  import { baseURL, scene } from '../state/server.js';

  let items = [];
  let page = 0;
  const loadScene = (id) => () => {
    location.hash = `/${id}`;
  };
  onMount(() => {
    const controller = new AbortController();
    scene.list(page, controller.signal)
      .then(({ pages, scenes }) => {
        items = scenes;
      })
      .catch(() => {});
    return () => {
      controller.abort();
    };
  });
</script>

<div class="wrapper">
  {#each items as { id, author, title } (id)}
    <div class="item" on:click={loadScene(id)}>
      <img
        alt={title}
        crossorigin="anonymous"
        src="{baseURL}scene/{id}/screenshot"
      />
      <div>
        {title} <span>by {author}</span>
      </div>
    </div>
  {/each}
</div>

<style>
  .wrapper {
    background-color: #1e1e1e;
    display: flex;
    align-content: start;
    justify-content: center;
    padding: 1rem;
    gap: 1rem;
    flex-wrap: wrap;
    overflow-y: auto;
  }

  .item {
    background-color: #000;
    border-radius: 0.25rem;
    cursor: pointer;
  }

  .item > img {
    width: 256px;
    height: 256px;
  }

  .item > div {
    border-top: 1px solid #111;
    padding: 0.5rem;
  }

  .item > div > span {
    opacity: 0.5;
  }
</style>
