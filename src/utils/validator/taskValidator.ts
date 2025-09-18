const { check, param } = require('express-validator');
import { NotFound } from '../../Errors';
import validatorMiddleware from '../../middleware/validatorMiddleware';
import prisma from '../prismaClient';

export const createTaskValidator = [
  check('apiary_id')
    .isInt({ min: 1 })
    .withMessage('apiary_id must be a positive integer')
    .bail()
    .custom(async (value: string) => {
      const apiary = await prisma.apiary.findUnique({ where: { id: parseInt(value) } });
      if (!apiary) throw new NotFound('Apiary not found');
      return true;
    }),

  check('hive_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('hive_id must be a positive integer')
    .bail()
    .custom(async (value: string) => {
      const hive = await prisma.hive.findUnique({ 
        where: { id: parseInt(value) },
        include: { apiary: true }
      });
      if (!hive) throw new NotFound('Hive not found');
      return true;
    }),

  check('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title too long'),

  check('start_date')
    .notEmpty()
    .withMessage('Start date is required')
    .isDate()
    .withMessage('Start date must be date'),

  check('start_time')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in HH:MM format'),

  check('end_date')
    .optional()
    .isDate()
    .withMessage('End date must be ISO8601 date'),

  check('end_time')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in HH:MM format'),

  check('status')
    .optional()
    .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'OVERDUE'])
    .withMessage('Invalid status'),

  check('priority')
    .optional()
    .isIn(['LOW', 'NORMAL', 'HIGH', 'URGENT'])
    .withMessage('Invalid priority'),

  check('type')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Type too long'),

  check('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description too long'),

  check('reminder')
    .optional()
    .isBoolean()
    .withMessage('Reminder must be boolean'),

  check('reminder_me')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Reminder_me too long'),

  validatorMiddleware,
];

export const taskIdParamValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid task id')
    .bail()
    .custom(async (value: string) => {
      const task = await prisma.task.findUnique({ where: { id: parseInt(value) } });
      if (!task) throw new NotFound('Task not found');
      return true;
    }),
  validatorMiddleware,
];

export const updateTaskValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Invalid task id')
    .bail()
    .custom(async (value: string) => {
      const task = await prisma.task.findUnique({ where: { id: parseInt(value) } });
      if (!task) throw new NotFound('Task not found');
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

  check('title')
    .optional()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title too long'),

  check('start_date')
    .optional()
    .isDate()
    .withMessage('Start date must be date'),

  check('start_time')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Start time must be in HH:MM format'),

  check('end_date')
    .optional()
    .isDate()
    .withMessage('End date must be date'),

  check('end_time')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('End time must be in HH:MM format'),

  check('status')
    .optional()
    .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'OVERDUE'])
    .withMessage('Invalid status'),

  check('priority')
    .optional()
    .isIn(['LOW', 'NORMAL', 'HIGH', 'URGENT'])
    .withMessage('Invalid priority'),

  check('type')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Type too long'),

  check('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('Description too long'),

  check('reminder')
    .optional()
    .isBoolean()
    .withMessage('Reminder must be boolean'),

  check('reminder_me')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Reminder_me too long'),

  validatorMiddleware,
];

export const taskStatusParamValidator = [
  param('status')
    .isIn(['pending', 'in_progress', 'completed', 'cancelled', 'overdue'])
    .withMessage('Invalid status parameter'),
  validatorMiddleware,
];

export const taskPriorityParamValidator = [
  param('priority')
    .isIn(['low', 'normal', 'high', 'urgent'])
    .withMessage('Invalid priority parameter'),
  validatorMiddleware,
];