import { writable } from 'svelte/store';
import DefaultScene from './examples/default.wgsl';

export const scene = writable(DefaultScene);
export const tool = writable('scene');
