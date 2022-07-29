import { get, writable } from 'svelte/store';
import DefaultAtlas from '../shaders/atlas.wgsl';
import DefaultEffect from '../shaders/effect.wgsl';
import Example1 from '../shaders/example1.wgsl';
import Example2 from '../shaders/example2.wgsl';
import Example3 from '../shaders/example3.wgsl';
import Example4 from '../shaders/example4.wgsl';

export const examples = [Example1, Example2, Example3, Example4];

export const meta = {
  id: writable(''),
  author: writable(''),
  title: writable('Untitled'),
  hasModified: writable(false),
};

const trackedWritable = (value) => {
  const { subscribe, set } = writable(value);
  return {
    subscribe,
    set(value) {
      meta.hasModified.set(true);
      set(value);
    },
  }
};

export const scene = {
  errors: writable([]),
  source: trackedWritable(examples[0]),
};
export const atlas = {
  errors: writable([]),
  source: trackedWritable(DefaultAtlas),
};
export const effect = {
  errors: writable([]),
  source: trackedWritable(DefaultEffect),
};
export const rendering = {
  background: trackedWritable('#000000'),
  gpu: null,
  resolution: trackedWritable(200),
};

export const deserialize = (data) => {
  delete scene.editor;
  scene.source.set(data.scene);
  delete atlas.editor;
  atlas.source.set(data.atlas || DefaultAtlas);
  delete effect.editor;
  effect.source.set(data.effect || DefaultEffect);
  rendering.background.set(`#${('000000' + (data.background || 0).toString(16)).slice(-6)}`);
  rendering.resolution.set(data.resolution || 200);
  meta.id.set(data.id || '');
  meta.author.set(data.author || '');
  meta.title.set(data.title || 'Untitled');
  meta.hasModified.set(false);
};

export const serialize = () => ({
  scene: get(scene.source),
  atlas: get(atlas.source),
  effect: get(effect.source),
  background: parseInt(get(rendering.background).slice(1), 16),
  resolution: get(rendering.resolution),
  title: get(meta.title),
});
