<script>
  import { vec3 } from 'gl-matrix';
  import { Renderer, Volume } from 'gpuvoxels';
  import { onMount } from 'svelte';
  import { atlas, effect, scene, rendering } from '../state/app.js';
  import Input from './input.js';

  const hex2Rgb = (hex) => [
    parseInt(hex.slice(1, 3), 16) / 255,
    parseInt(hex.slice(3, 5), 16) / 255,
    parseInt(hex.slice(5, 7), 16) / 255
  ];
  
  const screenshot = (renderer, resolution = 512) => () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = resolution;
    canvas.height = resolution;
    let x = 0;
    let y = 0;
    let w = renderer.canvas.width;
    let h = renderer.canvas.height;
    if (w > h) {
      x = (h - w) * -0.5;
      w = h;
    } else {
      y = (w - h) * -0.5;
      h = w;
    }
    ctx.drawImage(renderer.canvas, x, y, h, w, 0, 0, resolution, resolution);
    return canvas.toDataURL();
  };

  let viewport;
  onMount(() => {
    const input = new Input(viewport);
    const renderer = new Renderer(rendering.gpu);
    viewport.appendChild(renderer.canvas);
    // Still dunno why.. but it throws an error if I don't do this.
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setSize(input.bounds.width, input.bounds.height);
    window.addEventListener('resize', () => {
      input.updateBounds();
      renderer.setSize(input.bounds.width, input.bounds.height);
    }, false);

    let clock = performance.now() / 1000;
    let hasError = false;
    let volume;
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

      renderer.time.set(time);
      const command = renderer.device.createCommandEncoder();
      volume.compute(command);
      renderer.render(command, volume);
      renderer.device.queue.submit([command.finish()]);
    };
    requestAnimationFrame(animate);

    const processShaderErrors = ({ code, shader }, state) => {
      hasError = false;
      const lines = code.split('\n');
      const lineOffset = lines.indexOf('// __SOURCE__') + 1;
      shader.compilationInfo().then(({ messages }) => (
        state.set(messages.map(({ length, lineNum, linePos, message, type }) => {
          hasError = true;
          return {
            line: lines[lineNum - 1],
            lineNum: lineNum - lineOffset,
            linePos,
            length,
            message,
            pointer: Array.from({ length: linePos - 1 + length }, (v, i) => (
              i >= (linePos - 1) ? '^' : ' '
            )).join(''),
            type,
          };
        }))
      ));
    };

    const subscriptions = [
      rendering.background.subscribe((background) => (
        renderer.setClearColor(...hex2Rgb(background))
      )),
      rendering.resolution.subscribe((resolution) => {
        let source;
        if (volume) {
          source = volume.source;
          volume.destroy();
        }
        volume = new Volume({
          device: renderer.device,
          time: renderer.time,
          width: resolution,
          height: resolution,
          depth: resolution,
        });
        if (source) {
          volume.source = source;
          volume.setScene({ source });
        }
        vec3.set(
          renderer.camera.target,
          volume.width * 0.5, volume.height * 0.5, volume.depth * 0.5
        );
      }),
      atlas.source.subscribe((source) => {
        source = '// __SOURCE__\n' + source;
        renderer.atlas.compute(source);
        processShaderErrors(renderer.atlas, atlas.errors);
      }),
      effect.source.subscribe((source) => {
        source = '// __SOURCE__\n' + source;
        renderer.postprocessing.setEffect(source);
        processShaderErrors(renderer.postprocessing, effect.errors);
      }),
      scene.source.subscribe((source) => {
        volume.source = source;
        source = '// __SOURCE__\n' + source;
        volume.setScene({ source });
        processShaderErrors(volume.voxelizer, scene.errors);
      }),
    ];
    rendering.screenshot = screenshot(renderer);
    return () => {
      subscriptions.forEach((unsubscribe) => unsubscribe());
      input.destroy();
      volume.destroy();
      delete rendering.screenshot;
    }
  });
</script>

<div class="viewport" bind:this={viewport} />

<style>
  .viewport {
    overflow: hidden;
  }
</style>
