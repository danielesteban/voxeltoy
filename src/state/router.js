import { writable } from 'svelte/store';
import { deserialize } from './app.js';
import { scene } from './server.js';

export const view = writable({ id: 'scene' });

let $view;
view.subscribe((view) => {
  $view = view;
});

let fetching = false;
const router = () => {
  if (fetching) {
    fetching.abort();
    fetching = false;
  }
  const [route, ...params] = location.hash.slice(2).split('/');
  if (route === 'gallery') {
    view.set({ id: 'gallery', filter: params[0] || 'latest' });
    return;
  }
  if (route) {
    fetching = new AbortController();
    return scene
      .load(route, fetching.signal)
      .then((scene) => {
        fetching = false;
        deserialize(scene);
        view.set({ id: 'scene' });
      })
      .catch((e) => {
        if (e.name !== 'AbortError') {
          fetching = false;
          location.hash = '/';
        }
      });
  }
  if ($view.id === 'gallery') {
    view.set({ id: 'scene' });
  } 
};

export const init = () => {
  window.addEventListener('hashchange', router, false);
  return router();
};

export const goTo = (path, force = false) => {
  if (path === location.hash.slice(1)) {
    if (force) {
      router();
    }
    return;
  }
  location.hash = path;
};
