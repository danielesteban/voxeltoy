<div class="dropdown">
  <slot name="toggle" />
  <div class="options">
    <slot name="options" />
  </div>
</div>

<style>
  .dropdown {
    position: relative;
  }

  .options {
    display: none;
    position: absolute;
    left: 0;
    top: 100%;
    z-index: 1;
  }

  .dropdown:hover .options {
    display: block;
    background-color: #111;
  }
</style>
