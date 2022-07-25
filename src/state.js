import { writable } from 'svelte/store';
import DefaultAtlas from './shaders/atlas.wgsl';
import DefaultScene from './shaders/scene.wgsl';

export const atlas = writable(DefaultAtlas);
export const rendering = {
  clearColor: writable('#000000'),
  effects: {
    edges: {
      color: writable('#000000'),
      intensity: writable(0.3),
    },
  },
  gpu: null,
};
export const scene = writable(DefaultScene);
export const tool = writable('scene');
