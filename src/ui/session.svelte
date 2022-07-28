<script>
  import { user } from '../state/server.js';

  let email = '';
  let name = '';
  let password = '';
  let hasError = false;
  let isSending = false;
  let isRegister = false;

  const showLogin = () => {
    isRegister = false;
  };

  const submitLogin = (e) => {
    e.preventDefault();
    hasError = false;
    isSending = true;
    user.login({ email, password })
      .catch(() => {
        hasError = true;
      })
      .finally(() => {
        isSending = false;
      });
  };

  const showRegister = () => {
    isRegister = true;
  };

  const submitRegister = (e) => {
    e.preventDefault();
    hasError = false;
    isSending = true;
    user.register({ email, name, password })
      .catch(() => {
        hasError = true;
      })
      .finally(() => {
        isSending = false;
      });
  };
</script>

<form on:submit={isRegister ? submitRegister : submitLogin}>
  {#if isRegister}
    <div class="input">
      <label for="name">Name:</label>
      <input bind:value={name} autocomplete="off" id="name" type="text" required />
    </div>
  {/if}
  <div class="input">
    <label for="email">Email:</label>
    <input bind:value={email} autocomplete="username" id="email" type="email" required />
  </div>
  <div class="input">
    <label for="password">Password:</label>
    <input bind:value={password} autocomplete={isRegister ? 'current-password' : 'new-password'} id="password" type="password" required />
  </div>
  {#if hasError}
    <div class="error">
      There was an error
    </div>
  {/if}
  <div class="submit">
    <button type="submit" disabled={isSending}>
      {#if isRegister}
        Register
      {:else}
        Login
      {/if}
    </button>
  </div>
  <div class="alternative">
    {#if isRegister}
      <!-- svelte-ignore a11y-missing-attribute missing-declaration -->
      <a on:click={showLogin}>Already have an account?</a>
    {:else}
      <!-- svelte-ignore a11y-missing-attribute missing-declaration -->
      <a on:click={showRegister}>Need an account?</a>
    {/if}
  </div>
</form>

<style>
  form {
    background-color: #111;
    border-radius: 0.25rem;
    padding: 1rem;
    margin: 1rem;
  }

  .input {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
  }

  .input > label {
    font-weight: 700;
    width: 6rem;
  }

  .input > input {
    box-sizing: border-box;
    padding: 0.5rem;
    border: 1px solid #000;
    outline: 0;
    border-radius: 0.25rem;
    font-family: inherit;
  }

  .submit {
    text-align: center;
    margin-top: 1rem;
  }

  .alternative {
    text-align: center;
    margin: 1rem 1rem 0;
    padding-top: 1rem;
    border-top: 1px solid #1e1e1e;
  }

  .alternative > a {
    cursor: pointer;
    text-decoration: underline;
  }

  .error {
    margin: 1rem 0 1.5rem;
    text-align: center;
    color: #933;
  }
</style>
