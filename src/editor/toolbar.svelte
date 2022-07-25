<script>
  import { tool } from '../state.js';
  const setTool = (value) => () => {
    $tool = value;
  };
</script>

<div class="toolbar">
  <div class:enabled={$tool === 'scene'} on:click={setTool('scene')}>Scene</div>
  <div class:enabled={$tool === 'atlas'} on:click={setTool('atlas')}>Atlas</div>
  <div class:enabled={$tool === 'rendering'} on:click={setTool('rendering')}>Rendering</div>
</div>

<style>
  .toolbar {
    display: flex;
  }

  .toolbar > div {
    padding: 1rem;
    cursor: pointer;
  }

  .toolbar > div.enabled {
    background: #393;
    cursor: default;
  }
</style>
