const { check, param } = require('express-validator');
import { NotFound } from '../../Errors';
import validatorMiddleware from '../../middleware/validatorMiddleware';
import prisma from '../prismaClient';

export const createHiveValidator = [
  check('apiary_id')
    .isInt({ min: 1 })
    .withMessage('apiary_id must be a positive integer')
    .bail()
    .custom(async (value: string) => {
      const apiary = await prisma.apiary.findUnique({ where: { id: parseInt(value) } });
      if (!apiary) throw new NotFound('Apiary not found');
      return true;
    }),

  check('status').optional().isLength({ max: 100 }).withMessage('status too long'),
  check('hive_identifier').optional().isLength({ max: 100 }).withMessage('hive_identifier too long'),
  check('color').optional().isLength({ max: 50 }).withMessage('color too long'),
  check('type').optional().isIn(['LANGSTROTH','TOP_BAR','WARRE','FLOW','NATIONAL','COMMERCIAL','OTHER']).withMessage('invalid type'),
  check('source').optional().isLength({ max: 100 }).withMessage('source too long'),
  check('purpose').optional().isIn(['HONEY_PRODUCTION','POLLINATION','QUEEN_BREEDING','NUC_PRODUCTION','RESEARCH','EDUCATION','CONSERVATION','OTHER']).withMessage('invalid purpose'),
  check('created_date').optional().isISO8601().withMessage('created_date must be ISO8601 date'),
  check('note').optional().isLength({ max: 2000 }).withMessage('note too long'),

  // Colony info validation
  check('colony_info.strength').optional().isInt({ min: 0, max: 100 }).withMessage('strength must be between 0-100'),
  check('colony_info.strength_category').optional().isLength({ max: 50 }).withMessage('strength_category too long'),
  check('colony_info.temperament').optional().isLength({ max: 50 }).withMessage('temperament too long'),
  check('colony_info.supers_count').optional().isInt({ min: 0 }).withMessage('supers_count must be positive integer'),
  check('colony_info.frames_count').optional().isInt({ min: 0 }).withMessage('frames_count must be positive integer'),

  // Queen info validation
  check('queen_info.has_queen').optional().isBoolean().withMessage('has_queen must be boolean'),
  check('queen_info.queen_status').optional().isLength({ max: 50 }).withMessage('queen_status too long'),
  check('queen_info.queen_id').optional().isLength({ max: 100 }).withMessage('queen_id too long'),
  check('queen_info.queen_hatched_year').optional().isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('queen_hatched_year must be valid year'),
  check('queen_info.queen_installed_date').optional().isISO8601().withMessage('queen_installed_date must be ISO8601 date'),
  check('queen_info.queen_state').optional().isLength({ max: 50 }).withMessage('queen_state too long'),
  check('queen_info.queen_race').optional().isLength({ max: 50 }).withMessage('queen_race too long'),
  check('queen_info.queen_clipped').optional().isBoolean().withMessage('queen_clipped must be boolean'),
  check('queen_info.queen_marked').optional().isBoolean().withMessage('queen_marked must be boolean'),
  check('queen_info.queen_note').optional().isLength({ max: 1000 }).withMessage('queen_note too long'),
  check('queen_info.queen_origin').optional().isLength({ max: 100 }).withMessage('queen_origin too long'),

  validatorMiddleware,
];

export const hiveIdParamValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid hive id')
    .bail()
    .custom(async (value: string) => {
      const hive = await prisma.hive.findUnique({ where: { id: parseInt(value) } });
      if (!hive) throw new NotFound('Hive not found');
      return true;
    }),
  validatorMiddleware,
];

export const updateHiveValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid hive id')
    .bail()
    .custom(async (value: string) => {
      const hive = await prisma.hive.findUnique({ where: { id: parseInt(value) } });
      if (!hive) throw new NotFound('Hive not found');
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

  check('status').optional().isLength({ max: 100 }).withMessage('status too long'),
  check('hive_identifier').optional().isLength({ max: 100 }).withMessage('hive_identifier too long'),
  check('color').optional().isLength({ max: 50 }).withMessage('color too long'),
  check('type').optional().isIn(['LANGSTROTH','TOP_BAR','WARRE','FLOW','NATIONAL','COMMERCIAL','OTHER']).withMessage('invalid type'),
  check('source').optional().isLength({ max: 100 }).withMessage('source too long'),
  check('purpose').optional().isIn(['HONEY_PRODUCTION','POLLINATION','QUEEN_BREEDING','NUC_PRODUCTION','RESEARCH','EDUCATION','CONSERVATION','OTHER']).withMessage('invalid purpose'),
  check('created_date').optional().isISO8601().withMessage('created_date must be ISO8601 date'),
  check('note').optional().isLength({ max: 2000 }).withMessage('note too long'),

  // Colony info validation for updates
  check('colony_info.strength').optional().isInt({ min: 0, max: 100 }).withMessage('strength must be between 0-100'),
  check('colony_info.strength_category').optional().isLength({ max: 50 }).withMessage('strength_category too long'),
  check('colony_info.temperament').optional().isLength({ max: 50 }).withMessage('temperament too long'),
  check('colony_info.supers_count').optional().isInt({ min: 0 }).withMessage('supers_count must be positive integer'),
  check('colony_info.frames_count').optional().isInt({ min: 0 }).withMessage('frames_count must be positive integer'),

  // Queen info validation for updates
  check('queen_info.has_queen').optional().isBoolean().withMessage('has_queen must be boolean'),
  check('queen_info.queen_status').optional().isLength({ max: 50 }).withMessage('queen_status too long'),
  check('queen_info.queen_id').optional().isLength({ max: 100 }).withMessage('queen_id too long'),
  check('queen_info.queen_hatched_year').optional().isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('queen_hatched_year must be valid year'),
  check('queen_info.queen_installed_date').optional().isISO8601().withMessage('queen_installed_date must be ISO8601 date'),
  check('queen_info.queen_state').optional().isLength({ max: 50 }).withMessage('queen_state too long'),
  check('queen_info.queen_race').optional().isLength({ max: 50 }).withMessage('queen_race too long'),
  check('queen_info.queen_clipped').optional().isBoolean().withMessage('queen_clipped must be boolean'),
  check('queen_info.queen_marked').optional().isBoolean().withMessage('queen_marked must be boolean'),
  check('queen_info.queen_note').optional().isLength({ max: 1000 }).withMessage('queen_note too long'),
  check('queen_info.queen_origin').optional().isLength({ max: 100 }).withMessage('queen_origin too long'),

  validatorMiddleware,
];

