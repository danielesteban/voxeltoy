import { get, writable } from 'svelte/store';
import DefaultAtlas from './shaders/atlas.wgsl';
import Example1 from './shaders/example1.wgsl';
import Example2 from './shaders/example2.wgsl';
import Example3 from './shaders/example3.wgsl';
import Example4 from './shaders/example4.wgsl';

export const atlas = {
  errors: writable([]),
  source: writable(DefaultAtlas),
};
export const examples = [Example1, Example2, Example3, Example4];
export const rendering = {
  background: writable('#000000'),
  effects: {
    edges: {
      color: writable('#000000'),
      intensity: writable(0.3),
    },
  },
  gpu: null,
  resolution: writable(300),
};
export const scene = {
  errors: writable([]),
  source: writable(examples[0]),
};
export const tool = writable('scene');

export const deserialize = (data) => {
  if (typeof data === 'string') {
    data = JSON.parse(data);
  }
  atlas.source.set(data.atlas);
  rendering.background.set(('000000' + data.background.toString(16)).slice(-6));
  rendering.effects.edges.color.set(('000000' + data.edgesColor.toString(16)).slice(-6));
  rendering.effects.edges.intensity.set(data.edgesIntensity);
  rendering.resolution.set(data.resolution);
  scene.source.set(data.scene);
};

export const serialize = () => JSON.stringify({
  atlas: get(atlas.source),
  background: parseInt(get(rendering.background).slice(1), 16),
  edgesColor: parseInt(get(rendering.effects.edges.color).slice(1), 16),
  edgesIntensity: get(rendering.effects.edges.intensity),
  resolution: get(rendering.resolution),
  scene: get(scene.source),
});
