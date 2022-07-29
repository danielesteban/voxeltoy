<script>
  import { rendering } from './state/app.js';
  import { init } from './state/router.js';
  import App from './app.svelte';
  
  let hasError = false;
  let isLoading = true;

  Promise.all([
    (async () => {
      if (!navigator.gpu || !navigator.gpu.getPreferredCanvasFormat) {
        throw new Error('WebGPU');
      }
      const adapter = await navigator.gpu.requestAdapter();
      const device = await adapter.requestDevice();
      return { adapter, device };
    })(),
    new Promise((resolve) => {
      require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/min/vs' }});
      require(['vs/editor/editor.main'], resolve);
    }),
  ])
    .then(([gpu]) => {
      rendering.gpu = gpu;
      return init();
    })
    .catch((e) => {
      console.error(e);
      hasError = true;
    })
    .finally(() => {
      isLoading = false;
    });
</script>

{#if isLoading}
  <div class="loading">Loading...</div>
{:else if hasError}
  <div class="canary">
    Sorry! This works only in <a href="https://www.google.com/chrome/canary/" rel="noopener noreferrer" target="_blank">Chrome Canary</a>.
  </div>
{:else}
  <App />
{/if}

<div class="info">
  voxeltoy - <a href="https://github.com/danielesteban/voxeltoy" rel="noopener noreferrer" target="_blank">view source</a><br />
  <a href="https://dani.gatunes.com" rel="noopener noreferrer" target="_blank">dani@gatunes</a> © 2022
</div>
<a class="ribbon" href="https://github.com/sponsors/danielesteban" data-ribbon="♥ Become a sponsor" rel="noopener noreferrer" target="_blank">
  ♥ Become a sponsor
</a>

<style>
  :global(:root) {
    font-size: 16px;
  }

  :global(body) {
    margin: 0;
    background: #000;
    color: #fff;
    cursor: default;
    user-select: none;
    overflow: hidden;
    font-family: monospace;
    font-size: 0.75rem;
    line-height: 1.125rem;
  }

  :global(canvas) {
    vertical-align: middle;
  }

  :global(button) {
    cursor: pointer;
    background-color: #393;
    color: #fff;
    padding: 0.5rem 1rem;
    border: 1px solid #000;
    border-radius: 0.25rem;
    font-family: inherit;
    font-weight: inherit;
    outline: none;
  }

  :global(button:active) {
    transform: translate(0, 1px);
  }

  :global(button:disabled) {
    cursor: default;
    opacity: 0.3;
    transform: none;
  }

  :global(::-webkit-scrollbar) {
    width: 8px;
    background-color: rgba(0, 0, 0, 0);
  }

  :global(::-webkit-scrollbar:hover) {
    background-color: rgba(0, 0, 0, 0);
  }

  :global(::-webkit-scrollbar-thumb:vertical) {
    background: #444;
    border-radius: 100px;
  }

  :global(::-webkit-scrollbar-thumb:vertical:active) {
    background: #555;
  }

  .canary, .loading {
    position: absolute;
    bottom: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .canary > a, .info > a {
    color: inherit;
  }

  .info {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    text-align: right;
    opacity: 0.6;
  }

  .ribbon {
    width: 12.1em;
    height: 12.1em;
    position: absolute;
    overflow: hidden;
    top: 0;
    right: 0;
    pointer-events: none;
    text-decoration: none;
    text-indent: -999999px;
  }

  .ribbon:before, .ribbon:after {
    position: absolute;
    display: block;
    width: 15.38em;
    height: 1.54em;
    top: 3.23em;
    right: -3.23em;
    box-sizing: content-box;
    transform: rotate(45deg);
  }

  .ribbon:before {
    content: "";
    padding: .38em 0;
    background-color: #393;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.15));
    box-shadow: 0 .15em .23em 0 rgba(0, 0, 0, 0.5);
    pointer-events: auto;
  }

  .ribbon:after {
    content: attr(data-ribbon);
    color: #fff;
    font: 700 1em monospace;
    line-height: 1.54em;
    text-decoration: none;
    text-shadow: 0 -.08em rgba(0, 0, 0, 0.5);
    text-align: center;
    text-indent: 0;
    padding: .15em 0;
    margin: .15em 0;
    border-width: .08em 0;
    border-style: dotted;
    border-color: #fff;
    border-color: rgba(255, 255, 255, 0.7);
  }
</style>
