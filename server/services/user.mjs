import { badRequest, unauthorized } from '@hapi/boom';
import { body } from 'express-validator';
import passport from 'passport';
import { User } from '../models/index.mjs';
import { checkValidationResult } from './errorHandler.mjs';

export const login = [
  body('email')
    .isEmail()
    .normalizeEmail(),
  body('password')
    .trim()
    .not().isEmpty(),
  checkValidationResult,
  (req, res, next) => {
    passport.authenticate('local', (err, user) => {
      if (err || !user) {
        next(err || unauthorized());
        return;
      }
      res.json(user.getSession());
    })(req, res);
  },
];

export const register = [
  body('email')
    .isEmail()
    .normalizeEmail(),
  body('name')
    .trim()
    .isLength({ min: 3, max: 15 }),
  body('password')
    .trim()
    .not().isEmpty(),
  checkValidationResult,
  (req, res, next) => {
    const user = new User({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
    });
    return user
      .save()
      .then(() => (
        res.json(user.getSession())
      ))
      .catch((err) => (
        next(err.code === 11000  ? badRequest() : err)
      ));
  },
];
