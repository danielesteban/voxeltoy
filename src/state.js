import { writable } from 'svelte/store';
import DefaultAtlas from './shaders/atlas.wgsl';
import Example1 from './shaders/example1.wgsl';
import Example2 from './shaders/example2.wgsl';
import Example3 from './shaders/example3.wgsl';
import Example4 from './shaders/example4.wgsl';

export const atlas = writable(DefaultAtlas);
export const examples = [Example1, Example2, Example3, Example4];
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
export const scene = writable(examples[0]);
export const tool = writable('scene');
