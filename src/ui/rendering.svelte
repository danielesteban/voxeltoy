<script>
  import { rendering } from '../state.js';

  const { background, effects: { edges: { color, intensity } }, resolution } = rendering;
  const resolutions = [100, 200, 300, 400];
  const setResolution = (value) => () => {
    $resolution = value;
  };
</script>

<div class="wrapper">
  <div class="input">
    <label for="background">Background:</label>
    <input id="background" type="color" bind:value={$background} />
  </div>
  <div class="input">
    <label for="resolution">Resolution:</label>
    <div class="resolution">
      {#each resolutions as size}
        <div class:enabled={size === $resolution} on:click={setResolution(size)}>
          {size}<span>3</span>
        </div>
      {/each}
    </div>
  </div>
  <h4>Effects</h4>
  <h5>Edges</h5>
  <div class="input">
    <label for="edgesColor">Color:</label>
    <input id="edgesColor" type="color" bind:value={$color} />
  </div>
  <div class="input">
    <label for="edgesIntensity">Intensity:</label>
    <input
      id="edgesIntensity"
      type="number"
      min={0}
      max={1}
      step={0.01}
      bind:value={$intensity}
    />
  </div>
</div>

<style>
  h4 {
    background-color: #000;
    padding: 0.5rem 1rem;
    margin: 1rem 0 0;
  }

  h5 {
    background-color: #111;
    padding: 0.5rem 1rem;
    margin: 0 0 1rem;
  }

  .wrapper {
    background-color: #1e1e1e;
    padding: 1rem 0;
  }

  .input {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
  }

  .input > label {
    font-weight: 700;
    width: 10rem;
  }

  .input > input {
    box-sizing: border-box;
    width: 10rem;
    border: 1px solid #000;
    outline: 0;
  }

  .input > input[type="number"] {
    padding: 0.5rem;
  }

  .resolution {
    display: flex;
  }

  .resolution > div {
    background-color: #111;
    padding: 0.5rem 1rem;
    cursor: pointer;
  }

  .resolution > div > span {
    vertical-align: super;
  }

  .resolution > div.enabled {
    color: #393;
    cursor: default;
  }

  .resolution > div:first-child {
    border-radius: 4px 0 0 4px;
  }

  .resolution > div:last-child {
    border-radius: 0 4px 4px 0;
  }
</style>
