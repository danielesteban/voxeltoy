import { notFound } from '@hapi/boom';
import { body, param } from 'express-validator';
import { Scene, Screenshot, User } from '../models/index.mjs';
import { checkValidationResult } from './errorHandler.mjs';

export const create = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 25 }),
  body('atlas')
    .trim()
    .not().isEmpty(),
  body('background')
    .isInt()
    .toInt(),
  body('edgesColor')
    .isInt()
    .toInt(),
  body('edgesIntensity')
    .isFloat()
    .toFloat(),
  body('resolution')
    .isInt()
    .toInt()
    .isIn([100, 200, 300, 400]),
  body('scene')
    .trim()
    .not().isEmpty(),
  body('screenshot')
    .isBase64(),
  checkValidationResult,
  (req, res, next) => {
    const scene = new Scene({
      author: req.user._id,
      title: req.body.title,
      atlas: req.body.atlas,
      background: req.body.background,
      edgesColor: req.body.edgesColor,
      edgesIntensity: req.body.edgesIntensity,
      resolution: req.body.resolution,
      scene: req.body.scene,
    });
    const screenshot = new Screenshot({
      buffer: Buffer.from(req.body.screenshot, 'base64'),
      scene: scene.id,
    });
    Promise.all([
      scene.save(),
      screenshot.save(),
    ])
      .then(([{ slug }]) => (
        res.json(slug)
      ))
      .catch(next);
  },
];

export const list = [
  param('filter')
    .trim()
    .not().isEmpty(),
  param('page')
    .isInt()
    .toInt(),
  checkValidationResult,
  (req, res, next) => {
    const { filter, page } = req.params;
    const pageSize = 9;
    (filter === 'latest' ? (
      Promise.resolve(({ selector: {}, sorting: '-createdAt' }))
    ) : (
      User
        .findOne({ name: filter })
        .select('_id')
        .then((user) => {
          if (!user) {
            throw notFound();
          }
          return { selector: { user: user._id }, sorting: '-updatedAt' };
        })
    ))
      .then(({ selector, sorting }) => (
        Scene
          .countDocuments(selector)
          .then((count) => (
            Scene
              .find(selector)
              .sort(sorting)
              .skip(page * pageSize)
              .limit(pageSize)
              .select('-_id author title slug')
              .populate('author', '-_id name')
              .lean()
              .then((scenes) => (
                res.json({
                  pages: Math.ceil(count / pageSize),
                  scenes: scenes.map(({ title, slug: id, author: { name: author } }) => ({
                    id, author, title
                  })),
                })
              ))
          ))
      ))
      .catch(next);
  },
];

export const load = [
  param('slug')
    .trim()
    .not().isEmpty(),
  checkValidationResult,
  (req, res, next) => {
    Scene
      .findOne({ slug: req.params.slug })
      .select('-_id -__v -createdAt -updatedAt')
      .populate('author', '-_id name')
      .lean()
      .then((scene) => {
        if (!scene) {
          throw notFound();
        }
        res.json({
          ...scene,
          id: scene.slug,
          author: scene.author.name,
          slug: undefined,
        });
      })
      .catch(next);
  },
];

export const screenshot = [
  param('slug')
    .trim()
    .not().isEmpty(),
  checkValidationResult,
  (req, res, next) => {
    Scene
      .findOne({ slug: req.params.slug })
      .select('_id')
      .lean()
      .then((scene) => {
        if (!scene) {
          throw notFound();
        }
        return Screenshot
          .findOne({ scene: scene._id })
          .select('updatedAt')
          .lean()
          .then((screenshot) => {
            if (!screenshot) {
              throw notFound();
            }
            const lastModified = screenshot.updatedAt.toUTCString();
            if (req.get('if-modified-since') === lastModified) {
              return res.status(304).end();
            }
            return Screenshot
              .findById(screenshot._id)
              .select('-_id buffer')
              .lean()
              .then(({ buffer }) => (
                res
                  .set('Cache-Control', 'must-revalidate')
                  .set('Content-Type', 'image/webp')
                  .set('Last-Modified', lastModified)
                  .send(buffer.buffer)
              ));
          })
      })
      .catch(next);
  },
];

export const update = [
  param('slug')
    .trim()
    .not().isEmpty(),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 25 }),
  body('atlas')
    .optional()
    .trim()
    .not().isEmpty(),
  body('background')
    .optional()
    .isInt()
    .toInt(),
  body('edgesColor')
    .optional()
    .isInt()
    .toInt(),
  body('edgesIntensity')
    .optional()
    .isFloat()
    .toFloat(),
  body('resolution')
    .optional()
    .isInt()
    .toInt()
    .isIn([100, 200, 300]),
  body('scene')
    .optional()
    .trim()
    .not().isEmpty(),
  body('screenshot')
    .optional()
    .isBase64(),
  checkValidationResult,
  (req, res, next) => {
    const update = {};
    if (req.body.title) {
      update.title = req.body.title;
    }
    if (req.body.atlas) {
      update.atlas = req.body.atlas;
    }
    if (req.body.background !== undefined) {
      update.background = req.body.background;
    }
    if (req.body.edgesColor !== undefined) {
      update.edgesColor = req.body.edgesColor;
    }
    if (req.body.edgesIntensity !== undefined) {
      update.edgesIntensity = req.body.edgesIntensity;
    }
    if (req.body.resolution) {
      update.resolution = req.body.resolution;
    }
    if (req.body.scene) {
      update.scene = req.body.scene;
    }
    Scene
      .findOneAndUpdate({ author: req.user._id, slug: req.params.slug }, { $set: update }, { new: true })
      .select('_id slug')
      .then((scene) => {
        if (!scene) {
          throw notFound();
        }
        if (req.body.screenshot) {
          return Screenshot
            .updateOne({ scene: scene._id }, { $set: { buffer: Buffer.from(req.body.screenshot, 'base64') } })
            .then(() => scene.slug);
        }
        return scene.slug;
      })
      .then((slug) => res.json(slug))
      .catch(next);
  },
];
