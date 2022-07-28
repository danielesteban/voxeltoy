import { unauthorized } from '@hapi/boom';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import { User } from '../models/index.mjs';

const auth = (req, next) => {
  let token;
  if (req.headers.authorization) {
    const [type, value] = req.headers.authorization.split(' ');
    if (type === 'Bearer') {
      token = value;
    }
  }
  if (!token) {
    next();
    return;
  }
  User
    .fromToken(token)
    .then((user) => {
      if (user) {
        req.user = user;
      }
      next();
    })
    .catch(next);
};

export const authenticate = (req, res, next) => (
  auth(req, next)
);

export const requireAuth = (req, res, next) => (
  auth(req, (err) => {
    if (err || !req.user) {
      next(unauthorized(err));
      return;
    }
    next();
  })
);

export const setup = () => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false,
  }, (email, password, done) => (
    User
      .findOne({ email, password: { $exists: true } })
      .then((user) => {
        if (!user) {
          return done(null, false);
        }
        return user
          .comparePassword(password)
          .then((isMatch) => {
            if (!isMatch) {
              done(null, false);
              return;
            }
            done(null, user);
          });
      })
      .catch(done)
  )));
};
