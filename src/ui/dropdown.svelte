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
    top: 100%;
  }

  .dropdown:hover .options {
    display: block;
    background-color: #111;
    z-index: 1;
    width: 100%;
  }
</style>
