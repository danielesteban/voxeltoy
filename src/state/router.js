import { view, deserialize } from './app.js';
import { scene } from './server.js';

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
  const [id] = location.hash.slice(2).split('/');
  if (id === 'gallery') {
    view.set('gallery');
  } else if (id) {
    fetching = new AbortController();
    scene
      .load(id, fetching.signal)
      .then((scene) => {
        fetching = false;
        deserialize(scene);
        view.set('scene');
      })
      .catch((e) => {
        if (e.name !== 'AbortError') {
          fetching = false;
          location.hash = '/';
        }
      });
  } else if ($view === 'gallery') {
    view.set('scene');
  } 
};

export const init = () => {
  window.addEventListener('hashchange', router, false);
  router();
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
