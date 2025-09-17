const { check } = require('express-validator');
import { NotFound } from '../../Errors';
import validatorMiddleware from '../../middleware/validatorMiddleware';
import prisma from '../prismaClient';

export const createApiaryValidator = [
    check("name")
        .notEmpty()
        .withMessage("Apiary name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Apiary name must be between 2 and 100 characters"),

    check("forages")
        .optional()
        .isLength({ max: 200 })
        .withMessage("Forages description must be less than 200 characters"),

    check("type")
        .optional()
        .isIn(['COMMERCIAL', 'HOBBY', 'RESEARCH', 'EDUCATIONAL', 'OTHER'])
        .withMessage("Type must be one of: COMMERCIAL, HOBBY, RESEARCH, EDUCATIONAL, OTHER"),

    check("sun_exposure")
        .optional()
        .isIn(['FULL_SUN', 'PARTIAL_SUN', 'SHADE', 'PARTIAL_SHADE'])
        .withMessage("Sun exposure must be one of: FULL_SUN, PARTIAL_SUN, SHADE, PARTIAL_SHADE"),

    check("description")
        .optional()
        .isLength({ max: 500 })
        .withMessage("Description must be less than 500 characters"),

    check("address")
        .optional()
        .isLength({ max: 200 })
        .withMessage("Address must be less than 200 characters"),

    check("zip")
        .optional()
        .isLength({ max: 20 })
        .withMessage("ZIP code must be less than 20 characters"),

    check("city")
        .optional()
        .isLength({ max: 100 })
        .withMessage("City must be less than 100 characters"),

    check("state")
        .optional()
        .isLength({ max: 100 })
        .withMessage("State must be less than 100 characters"),

    check("country")
        .optional()
        .isLength({ max: 100 })
        .withMessage("Country must be less than 100 characters"),

    check("latitude")
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude must be a valid number between -90 and 90"),

    check("longitude")
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude must be a valid number between -180 and 180"),

    validatorMiddleware,
];

export const updateApiaryValidator = [
    check("id")
        .isInt({ min: 1 })
        .withMessage("Invalid apiary ID")
        .custom(async (value: string) => {
            const apiaryDoc = await prisma.apiary.findUnique({
                where: { id: parseInt(value) }
            });
            if (!apiaryDoc) {
                throw new NotFound("Apiary not found");
            }
            return true;
        }),

    check("name")
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage("Apiary name must be between 2 and 100 characters"),

    check("forages")
        .optional()
        .isLength({ max: 200 })
        .withMessage("Forages description must be less than 200 characters"),

    check("type")
        .optional()
        .isIn(['COMMERCIAL', 'HOBBY', 'RESEARCH', 'EDUCATIONAL', 'OTHER'])
        .withMessage("Type must be one of: COMMERCIAL, HOBBY, RESEARCH, EDUCATIONAL, OTHER"),

    check("sun_exposure")
        .optional()
        .isIn(['FULL_SUN', 'PARTIAL_SUN', 'SHADE', 'PARTIAL_SHADE'])
        .withMessage("Sun exposure must be one of: FULL_SUN, PARTIAL_SUN, SHADE, PARTIAL_SHADE"),

    check("description")
        .optional()
        .isLength({ max: 500 })
        .withMessage("Description must be less than 500 characters"),

    check("address")
        .optional()
        .isLength({ max: 200 })
        .withMessage("Address must be less than 200 characters"),

    check("zip")
        .optional()
        .isLength({ max: 20 })
        .withMessage("ZIP code must be less than 20 characters"),

    check("city")
        .optional()
        .isLength({ max: 100 })
        .withMessage("City must be less than 100 characters"),

    check("state")
        .optional()
        .isLength({ max: 100 })
        .withMessage("State must be less than 100 characters"),

    check("country")
        .optional()
        .isLength({ max: 100 })
        .withMessage("Country must be less than 100 characters"),

    check("latitude")
        .optional()
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude must be a valid number between -90 and 90"),

    check("longitude")
        .optional()
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude must be a valid number between -180 and 180"),

    validatorMiddleware,
];

export const apiaryIdValidator = [
    check("id")
        .isInt({ min: 1 })
        .withMessage("Invalid apiary ID")
        .custom(async (value: string) => {
            const apiaryDoc = await prisma.apiary.findUnique({
                where: { id: parseInt(value) }
            });
            if (!apiaryDoc) {
                throw new NotFound("Apiary not found");
            }
            return true;
        }),

    validatorMiddleware,
];

