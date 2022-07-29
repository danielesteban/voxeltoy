import nocache from 'nocache';
import { requireAuth } from './services/passport.mjs';
import * as scene from './services/scene.mjs';
import * as user from './services/user.mjs';

const preventCache = nocache();

export default (api) => {
  api.get(
    '/scenes/:filter/:page',
    preventCache,
    scene.list
  );

  api.post(
    '/scene',
    preventCache,
    requireAuth,
    scene.create
  );

  api.get(
    '/scene/:slug',
    preventCache,
    scene.load
  );

  api.get(
    '/scene/:slug/screenshot',
    scene.screenshot
  );

  api.put(
    '/scene/:slug',
    preventCache,
    requireAuth,
    scene.update
  );

  api.put(
    '/user',
    preventCache,
    user.login
  );

  api.get(
    '/user',
    preventCache,
    requireAuth,
    user.refreshSession
  );

  api.post(
    '/user',
    preventCache,
    user.register
  );
};
