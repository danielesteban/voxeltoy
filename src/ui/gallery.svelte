<script>
  import { onMount } from 'svelte';
  import { baseURL, scene } from '../state/server.js';
  import Intersection from './intersection.svelte';

  let items = [];
  let fetching = false;
  let next = 0;
  const fetchListing = (page) => () => {
    if (fetching) {
      fetching.abort();
    }
    fetching = new AbortController();
    next = false;
    scene.list(page, fetching.signal)
      .then(({ pages, scenes }) => {
        items = page > 0 ? [...items, ...scenes] : scenes;
        next = page < (pages - 1) ? (page + 1) : false;
      })
      .catch(() => {})
      .finally(() => {
        fetching = false;
      })
  };
  const loadScene = (id) => () => {
    location.hash = `/${id}`;
  };
  onMount(() => {
    fetchListing(0)();
    return () => {
      if (fetching) {
        fetching.abort();
      }
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
  {#if fetching || next}
    <Intersection on:intersect={fetchListing(next)} enabled={!!next}>
      Loading...
    </Intersection>
  {/if}
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
    overflow-y: overlay;
  }

  .item {
    background-color: #000;
    border-radius: 0.25rem;
    cursor: pointer;
  }

  .item > img {
    border-radius: 0.25rem 0.25rem 0 0;
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
