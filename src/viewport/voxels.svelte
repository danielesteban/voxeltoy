<script>
  export let gpu;
  import { vec3 } from 'gl-matrix';
  import { Renderer, Volume } from 'gpuvoxels';
  import { onMount } from 'svelte';
  import { scene } from '../state.js';
  import Input from './input.js';

  let wrapper;
  onMount(() => {
    const input = new Input(wrapper);
    const renderer = new Renderer(gpu);
    wrapper.appendChild(renderer.canvas);
    renderer.setClearColor(0.1, 0.1, 0.1);
    // Still dunno why.. but it throws an error if I don't do this.
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(input.bounds.width, input.bounds.height);
    renderer.atlas.compute();
    window.addEventListener('resize', () => {
      input.updateBounds();
      renderer.setSize(input.bounds.width, input.bounds.height);
    }, false);

    const volume = new Volume({
      device: renderer.device,
      width: 300,
      height: 300,
      depth: 300,
    });

    vec3.set(
      renderer.camera.target,
      volume.width * 0.5, volume.height * 0.5, volume.depth * 0.5
    );

    let clock = performance.now() / 1000;
    const animate = () => {
      requestAnimationFrame(animate);
      const time = performance.now() / 1000;
      const delta = time - clock;
      clock = time;
      input.update(delta);
      renderer.camera.setOrbit(
        input.look.state[0],
        input.look.state[1],
        volume.width * input.zoom.state
      );

      const command = renderer.device.createCommandEncoder();
      volume.compute(command, time);
      renderer.render(command, volume);
      renderer.device.queue.submit([command.finish()]);
    };
    requestAnimationFrame(animate);

    const unsubscribe = scene.subscribe((scene) => volume.setScene({ source: scene }));
    return () => {
      unsubscribe();
      input.destroy();
      volume.destroy();
    }
  });
</script>

<div class="wrapper" bind:this={wrapper} />

<style>
  .wrapper {
    overflow: hidden;
  }
</style>
