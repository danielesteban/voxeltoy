import { badData, boomify } from '@hapi/boom';
import { validationResult } from 'express-validator';

const production = process.env.NODE_ENV === 'production';

export const checkValidationResult = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    throw badData(result);
  }
  next();
};

export const setup = (api) => {
  api.get('*', (req, res) => res.status(404).end());
  api.use((err, req, res, next) => {
    if (!err.isBoom) {
      err = boomify(err);
    }
    res.status(err.output.statusCode).end();
    if (!production && err.output.statusCode === 500) {
      console.error(err);
    }
  });
};
