<script>
  import { vec3 } from 'gl-matrix';
  import { Renderer, Volume } from 'gpuvoxels';
  import { onMount } from 'svelte';
  import Input from './input.js';
  import { atlas, rendering, scene } from '../state.js';

  const hex2Rgb = (hex) => [
    parseInt(hex.slice(1, 3), 16) / 255,
    parseInt(hex.slice(3, 5), 16) / 255,
    parseInt(hex.slice(5, 7), 16) / 255
  ];

  let wrapper;
  onMount(() => {
    const input = new Input(wrapper);
    const renderer = new Renderer(rendering.gpu);
    wrapper.appendChild(renderer.canvas);
    renderer.setClearColor(0.1, 0.1, 0.1);
    // Still dunno why.. but it throws an error if I don't do this.
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(input.bounds.width, input.bounds.height);
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
    let hasError = false;
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

      if (hasError) {
        return;
      }

      const command = renderer.device.createCommandEncoder();
      volume.compute(command, time);
      renderer.render(command, volume);
      renderer.device.queue.submit([command.finish()]);
    };
    requestAnimationFrame(animate);

    const processShaderErrors = ({ code, shader }, state) => {
      hasError = false;
      shader.compilationInfo().then(({ messages }) => (
        state.set(messages.map(({ length, lineNum, linePos, message, type }) => {
          hasError = true;
          const line = code.split('\n')[lineNum - 1];
          const pointer = Array.from({ length: linePos - 1 + length }, (v, i) => (
            i >= (linePos - 1) ? '^' : ' '
          )).join('');
          return [`:${lineNum}:${linePos} ${type}: ${message}`, `${line}`, `${pointer}`];
        }))
      ));
    };

    const subscriptions = [
      atlas.source.subscribe((source) => {
        renderer.atlas.compute(source);
        processShaderErrors(renderer.atlas, atlas.errors);
      }),
      rendering.clearColor.subscribe((clearColor) => (
        renderer.setClearColor(...hex2Rgb(clearColor))
      )),
      rendering.effects.edges.color.subscribe((color) => {
        renderer.postprocessing.effects.edges.color = hex2Rgb(color);
      }),
      rendering.effects.edges.intensity.subscribe((intensity) => {
        renderer.postprocessing.effects.edges.intensity = intensity;
      }),
      scene.source.subscribe((source) => {
        volume.setScene({ source });
        processShaderErrors(volume.voxelizer, scene.errors);
      }),
    ];
    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
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
