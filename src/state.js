import { writable } from 'svelte/store';
import DefaultAtlas from './shaders/atlas.wgsl';
import DefaultScene from './shaders/scene.wgsl';

export const atlas = writable(DefaultAtlas);
export const scene = writable(DefaultScene);
export const tool = writable('scene');
