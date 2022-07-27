<script>
  import { tick } from 'svelte';
  import { tool } from './state.js';
  import Atlas from './ui/atlas.svelte';
  import Rendering from './ui/rendering.svelte';
  import Scene from './ui/scene.svelte';
  import Toolbar from './ui/toolbar.svelte';
  import Voxels from './viewport/voxels.svelte';

  let uiWidth = 800;
  const drag = {
    enabled: false,
    initial: 0,
    offset: 0,
  };
  const mousedown = ({ clientX }) => {
    drag.enabled = true;
    drag.initial = uiWidth;
    drag.offset = clientX;
  };
  const mousemove = ({ clientX }) => {
    if (drag.enabled) {
      uiWidth = Math.max(Math.floor(drag.initial + clientX - drag.offset), 500);
      tick().then(() => window.dispatchEvent(new Event('resize')));
    }
  };
  const mouseup = () => {
    if (drag.enabled) {
      drag.enabled = false;
    }
  };
</script>

<svelte:window on:mousemove={mousemove} on:mouseup={mouseup} />

<div class="app">
  <div class="ui" style="width: {uiWidth}px">
    <Toolbar />
    {#if $tool === 'scene'}
      <Scene />
    {:else if $tool === 'atlas'}
      <Atlas />
    {:else if $tool === 'rendering'}
      <Rendering />
    {/if}
  </div>
  <div class="divider" on:mousedown={mousedown} />
  <Voxels />
</div>

<style>
  .app {
    display: grid;
    grid-template-columns: auto auto 1fr;
    grid-template-rows: 1fr;
    width: 100vw;
    height: 100vh;
  }

  .ui {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    min-height: 0;
  }

  .divider {
    width: 0.5rem;
    border-color: #1e1e1e;
    border-style: solid;
    border-left-width: 1px;
    border-right-width: 1px;
    background-color: #111;
    cursor: ew-resize;
  }
</style>
