<script>
  import { effect } from '../state/app.js';
  import Editor from './editor.svelte';
</script>

<Editor state={effect} />
