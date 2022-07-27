import { get, writable } from 'svelte/store';

export const baseURL = __SERVER__;

const request = ({
  body,
  endpoint,
  method = 'GET',
  session,
  signal,
}) => {
  let contentType;
  if (body && !(body instanceof FormData)) {
    contentType = 'application/json';
    body = JSON.stringify(body);
  }
  return fetch(`${baseURL}${endpoint}`, {
    headers: {
      ...(session ? { Authorization: `Bearer ${session}` } : {}),
      ...(contentType ? { 'Content-Type': contentType } : {}),
    },
    body,
    method,
    signal,
  })
    .then((res) => {
      const { status } = res;
      if (status < 200 || status >= 400) {
        throw new Error(status);
      }
      if ((res.headers.get('content-type') || '').indexOf('application/json') === 0) {
        return res.json();
      }
      return res.arrayBuffer();
    });
};

export const session = (() => {
  const key = 'voxeltoy:session';
  let stored = localStorage.getItem(key) || false;
  if (stored) {
    try {
      stored = JSON.parse(stored);
    } catch (e) {
      stored = false;
    }
  }
  const { subscribe, set } = writable(stored);
  return {
    subscribe,
    set: (value) => {
      set(value);
      if (value) {
        localStorage.setItem(key, JSON.stringify(value));
      } else {
        localStorage.removeItem(key);
      }
    },
  };
})();

export const scene = {
  create(scene) {
    return request({
      body: scene,
      endpoint: 'scene',
      method: 'POST',
      session: get(session).session,
    });
  },
  load(id, signal) {
    return request({
      endpoint: `scene/${id}`,
      method: 'GET',
      signal,
    });
  },
  list(page, signal) {
    return request({
      endpoint: `scenes/${page}`,
      method: 'GET',
      signal,
    });
  },
  update(id, update) {
    return request({
      body: update,
      endpoint: `scene/${id}`,
      method: 'PUT',
      session: get(session).session,
    });
  },
};

export const user = {
  login({ email, password }) {
    return request({
      body: { email, password },
      endpoint: 'user',
      method: 'PUT',
    })
      .then((s) => session.set(s));
  },
  logout() {
    session.set(false);
  },
  register({ email, name, password }) {
    return request({
      body: { email, name, password },
      endpoint: 'user',
      method: 'POST',
    })
      .then((s) => session.set(s));
  },
};
