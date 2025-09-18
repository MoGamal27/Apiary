const { check, param } = require('express-validator');
import { NotFound } from '../../Errors';
import validatorMiddleware from '../../middleware/validatorMiddleware';
import prisma from '../prismaClient';

export const createFeedingValidator = [
  check('apiary_id')
    .isInt({ min: 1 })
    .withMessage('apiary_id must be a positive integer')
    .bail()
    .custom(async (value: string) => {
      const apiary = await prisma.apiary.findUnique({ where: { id: parseInt(value) } });
      if (!apiary) throw new NotFound('Apiary not found');
      return true;
    }),

  check('apply_to_all_hives')
    .optional()
    .isBoolean()
    .withMessage('apply_to_all_hives must be boolean'),

  check('hive_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('hive_id must be a positive integer')
    .bail()
    .custom(async (value: string) => {
      if (!value) return true;
      
      const hive = await prisma.hive.findUnique({ 
        where: { id: parseInt(value) },
        include: { apiary: true }
      });
      if (!hive) throw new NotFound('Hive not found');
      return true;
    }),


  check('name')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Name too long'),

  check('feeding_date')
    .notEmpty()
    .withMessage('Feeding date is required')
    .isDate()
    .withMessage('Feeding date must be date'),

  check('feeding_type')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Feeding type too long'),

  check('food_type')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Food type too long'),

  check('ratio')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Ratio too long'),

  check('note')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Note too long'),

  check('input_as')
    .optional()
    .isIn(['Total', 'Per Hive'])
    .withMessage('input_as must be either "Total" or "Per Hive"'),

  check('quantity')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Quantity must be a positive number'),

  check('unit')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Unit too long'),

  check('notes')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Notes too long'),

  validatorMiddleware,
];

export const feedingIdParamValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid feeding id')
    .bail()
    .custom(async (value: string) => {
      const feeding = await prisma.feeding.findUnique({ where: { id: parseInt(value) } });
      if (!feeding) throw new NotFound('Feeding not found');
      return true;
    }),
  validatorMiddleware,
];

export const updateFeedingValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid feeding id')
    .bail()
    .custom(async (value: string) => {
      const feeding = await prisma.feeding.findUnique({ where: { id: parseInt(value) } });
      if (!feeding) throw new NotFound('Feeding not found');
      return true;
    }),

  check('apiary_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('apiary_id must be a positive integer')
    .bail()
    .custom(async (value: string) => {
      const apiary = await prisma.apiary.findUnique({ where: { id: parseInt(value) } });
      if (!apiary) throw new NotFound('Apiary not found');
      return true;
    }),

  check('apply_to_all_hives')
    .optional()
    .isBoolean()
    .withMessage('apply_to_all_hives must be boolean'),

  check('hive_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('hive_id must be a positive integer')
    .bail()
    .custom(async (value: string) => {
      if (!value) return true;
      
      const hive = await prisma.hive.findUnique({ 
        where: { id: parseInt(value) },
        include: { apiary: true }
      });
      if (!hive) throw new NotFound('Hive not found');
      return true;
    }),

  check('name')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Name too long'),

  check('feeding_date')
    .optional()
    .isDate()
    .withMessage('Feeding date must date'),

  check('feeding_type')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Feeding type too long'),

  check('food_type')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Food type too long'),

  check('ratio')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Ratio too long'),

  check('note')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Note too long'),

  check('input_as')
    .optional()
    .isIn(['Total', 'Per Hive'])
    .withMessage('input_as must be either "Total" or "Per Hive"'),

  check('quantity')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Quantity must be a positive number'),

  check('unit')
    .optional()
    .isLength({ max: 20 })
    .withMessage('Unit too long'),

  check('notes')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Notes too long'),

  validatorMiddleware,
];


export const apiaryIdParamValidator = [
  param('apiary_id')
    .isInt({ min: 1 })
    .withMessage('Invalid apiary id')
    .bail()
    .custom(async (value: string) => {
      const apiary = await prisma.apiary.findUnique({ where: { id: parseInt(value) } });
      if (!apiary) throw new NotFound('Apiary not found');
      return true;
    }),
  validatorMiddleware,
];