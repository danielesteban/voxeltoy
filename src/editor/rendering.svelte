<script>
  import { rendering } from '../state.js';
  const { clearColor, effects: { edges: { color, intensity } } } = rendering;
</script>

<div class="wrapper">
  <div class="input">
    <label for="clearColor">Clear color:</label>
    <input id="clearColor" type="color" bind:value={$clearColor} />
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
    width: 10rem;
  }
</style>
