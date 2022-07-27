import { notFound } from '@hapi/boom';
import { body, param } from 'express-validator';
import { Scene, Screenshot } from '../models/index.mjs';
import { checkValidationResult } from './errorHandler.mjs';

export const create = [
  body('name')
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
    .isIn([100, 200, 300]),
  body('scene')
    .trim()
    .not().isEmpty(),
  body('screenshot')
    .isBase64(),
  checkValidationResult,
  (req, res, next) => {
    const scene = new Scene({
      name: req.body.name,
      atlas: req.body.atlas,
      background: req.body.background,
      edgesColor: req.body.edgesColor,
      edgesIntensity: req.body.edgesIntensity,
      resolution: req.body.resolution,
      scene: req.body.scene,
      user: req.user._id,
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

export const list = (filter) => ([
  param('page')
    .isInt()
    .toInt(),
  checkValidationResult,
  (req, res, next) => {
    const { page } = req.params;
    const pageSize = 10;
    const selector = {};
    let sorting;
    switch (filter) {
      default:
        sorting = '-createdAt';
        break;
    }
    Scene
      .countDocuments(selector)
      .then((count) => (
        Scene
          .find(selector)
          .sort(sorting)
          .skip(page * pageSize)
          .limit(pageSize)
          .select('-_id name slug user')
          .populate('user', '-_id name')
          .lean()
          .then((scenes) => (
            res.json({
              pages: Math.ceil(count / pageSize),
              scenes: scenes.map(({ name, slug: id, user: { name: user } }) => ({
                id, name, user,
              })),
            })
          ))
      ))
      .catch(next);
  },
]);

export const load = [
  param('slug')
    .trim()
    .not().isEmpty(),
  checkValidationResult,
  (req, res, next) => {
    Scene
      .findOne({ slug: req.params.slug })
      .select('-_id -__v -slug -createdAt -updatedAt')
      .populate('user', '-_id name')
      .lean()
      .then((scene) => {
        if (!scene) {
          throw notFound();
        }
        res.json({
          ...scene,
          user: scene.user.name,
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
  body('name')
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
  checkValidationResult,
  (req, res, next) => {
    const update = {};
    if (req.body.name) {
      update.name = req.body.name;
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
      .updateOne({ slug: req.params.slug, user: req.user._id }, { $set: update })
      .then(() => (
        res.status(200).end()
      ))
      .catch(next);
  },
];
