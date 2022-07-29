<script>
  import { meta, rendering, serialize } from '../state/app.js';
  import { goTo } from '../state/router.js';
  import { baseURL, session, scene } from '../state/server.js';
  import Session from './session.svelte';

  const { id, author, title } = meta;

  let isSending = false;
  let isUpdate = $id && $author === $session.name;
  let screenshot = isUpdate ? `${baseURL}scene/${$id}/screenshot` : rendering.screenshot();
  const getScreenshot = () => (
    screenshot.slice(0, 5) === 'data:' ? (
      screenshot.slice(22)
    ) : (
      undefined
    )
  );
  const refreshScreenshot = () => {
    screenshot = rendering.screenshot();
  };
  const publish = (e) => {
    e.preventDefault();
    if (isSending) {
      return;
    }
    isSending = true;
    scene
      .create({
        ...serialize(),
        screenshot: getScreenshot(),
      })
      .then((id) => (
        goTo(`/${id}`)
      ))
      .catch(() => {});
  };
  const update = (e) => {
    e.preventDefault();
    if (isSending) {
      return;
    }
    isSending = true;
    scene
      .update($id, {
        ...serialize(),
        screenshot: getScreenshot(),
      })
      .then((id) => (
        goTo(`/${id}`, true)
      ))
      .catch(() => {});
  };
</script>

<div class="wrapper">
  {#if $session}
    <form on:submit={isUpdate ? update : publish}>
      <div class="input">
        <label for="author">Author:</label>
        <input value={$session.name} autocomplete="off" id="author" type="text" disabled />
      </div>
      <div class="input">
        <label for="title">Title:</label>
        <input bind:value={$title} autocomplete="off" id="title" type="text" required />
      </div>
      <div class="input screenshot">
        <label for="name">
          Screenshot:
          <!-- svelte-ignore a11y-missing-attribute missing-declaration -->
          <a on:click={refreshScreenshot}>refresh</a>
        </label>
        <img
          alt="screenshot"
          crossorigin="anonymous"
          src={screenshot}
        />
      </div>
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
    display: flex;
    font-weight: 700;
    margin-bottom: 0.25rem;
  }

  .input > label > a {
    margin-left: auto;
    cursor: pointer;
    text-decoration: underline;
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

  .input > img {
    background-color: #666;
    width: 300px;
    height: 300px;
    border: 1px solid #000;
    border-radius: 0.25rem;
    background-size: cover;
  }

  .submit {
    text-align: center;
    margin-top: 0.5rem;
  }
</style>
