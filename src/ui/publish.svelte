<script>
  import { meta, rendering, serialize } from '../state/app.js';
  import { session, scene } from '../state/server.js';
  import Session from './session.svelte';

  const { id, author, title } = meta;

  let isSending = false;
  let isUpdate = $id && $author === $session.name;
  const screenshot = isUpdate ? false : rendering.screenshot();
  const publish = (e) => {
    e.preventDefault();
    isSending = true;
    (isUpdate ? (
      scene.update($id, serialize())
    ) : (
      scene.create({
        ...serialize(),
        screenshot: screenshot ? screenshot.slice(22) : undefined,
      })
    ))
      .then(() => {
        location.hash = '/gallery';
      })
      .catch(() => {})
  };
</script>

<div class="wrapper">
  {#if $session}
    <form on:submit={publish}>
      <div class="input">
        <label for="author">Author:</label>
        <input value={$session.name} autocomplete="off" id="author" type="text" disabled />
      </div>
      <div class="input">
        <label for="title">Title:</label>
        <input bind:value={$title} autocomplete="off" id="title" type="text" required />
      </div>
      {#if screenshot}
        <div class="input screenshot">
          <label for="name">Screenshot:</label>
          <div class="image" style={screenshot ? `background-image: url(${screenshot})` : ''} />
        </div>
      {/if}
      <div class="submit">
        <button type="submit" disabled={isSending}>
          {isUpdate ? 'Save' : 'Publish'}
        </button>
      </div>
    </form>
  {:else}
    <Session />
  {/if}
</div>

<style>
  .wrapper {
    background-color: #1e1e1e;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 1rem 0;
  }

  form {
    background-color: #111;
    border-radius: 0.25rem;
    padding: 1rem;
    margin: 1rem;
  }

  .input {
    padding: 0.5rem 1rem;
  }

  .input.screenshot {
    align-items: flex-start;
  }

  .input.screenshot > label {
    margin-top: 0.25rem;
  }

  .input > label {
    display: block;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }

  .input > input {
    box-sizing: border-box;
    width: 300px;
    padding: 0.5rem;
    border: 1px solid #000;
    outline: 0;
    border-radius: 0.25rem;
    font-family: inherit;
  }

  .input > input:disabled {
    color: inherit;
    opacity: 0.3;
  }

  .image {
    background-color: #666;
    width: 300px;
    height: 300px;
    border: 1px solid #000;
    border-radius: 0.25rem;
    background-size: cover;
  }

  .submit {
    text-align: center;
    margin-top: 1rem;
  }

  .submit > button {
    cursor: pointer;
    background-color: #1e1e1e;
    color: #fff;
    padding: 0.5rem 1rem;
    border: 1px solid #000;
    outline: 0;
    border-radius: 0.25rem;
    font-family: inherit;
  }

  .submit > button:disabled {
    opacity: 0.3;
  }
</style>
