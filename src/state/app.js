import { get, writable } from 'svelte/store';
import DefaultAtlas from '../shaders/atlas.wgsl';
import Example1 from '../shaders/example1.wgsl';
import Example2 from '../shaders/example2.wgsl';
import Example3 from '../shaders/example3.wgsl';
import Example4 from '../shaders/example4.wgsl';

export const examples = [Example1, Example2, Example3, Example4];
export const view = writable('scene');

export const atlas = {
  errors: writable([]),
  source: writable(DefaultAtlas),
};
export const rendering = {
  background: writable('#000000'),
  effects: {
    edges: {
      color: writable('#000000'),
      intensity: writable(0.3),
    },
  },
  gpu: null,
  resolution: writable(200),
};
export const scene = {
  errors: writable([]),
  source: writable(examples[0]),
};
export const meta = {
  id: writable(''),
  author: writable(''),
  title: writable('Untitled'),
};

export const deserialize = (data) => {
  delete atlas.editor;
  atlas.source.set(data.atlas || DefaultAtlas);
  rendering.background.set(`#${('000000' + (data.background || 0).toString(16)).slice(-6)}`);
  rendering.effects.edges.color.set(`#${('000000' + (data.edgesColor || 0).toString(16)).slice(-6)}`);
  rendering.effects.edges.intensity.set(data.edgesIntensity !== undefined ? data.edgesIntensity : 0.3);
  rendering.resolution.set(data.resolution || 200);
  delete scene.editor;
  scene.source.set(data.scene);
  meta.id.set(data.id || '');
  meta.author.set(data.author || '');
  meta.title.set(data.title || 'Untitled');
};

export const serialize = () => ({
  atlas: get(atlas.source),
  background: parseInt(get(rendering.background).slice(1), 16),
  edgesColor: parseInt(get(rendering.effects.edges.color).slice(1), 16),
  edgesIntensity: get(rendering.effects.edges.intensity),
  resolution: get(rendering.resolution),
  scene: get(scene.source),
  title: get(meta.title),
});
