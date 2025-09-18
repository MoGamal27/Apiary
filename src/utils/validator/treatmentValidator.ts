const { check } = require('express-validator');
import validatorMiddleware from '../../middleware/validatorMiddleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createTreatmentValidator = [
    check("apiary_id")
        .notEmpty()
        .withMessage("Apiary ID is required")
        .isInt({ min: 1 })
        .withMessage("Apiary ID must be a positive integer")
        .custom(async (value: string) => {
            const apiary = await prisma.apiary.findUnique({
                where: { id: parseInt(value) }
            });
            if (!apiary) {
                throw new Error("Apiary not found");
            }
            return true;
        }),

    check("hive_id")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Hive ID must be a positive integer"),

    check("start_date")
        .notEmpty()
        .withMessage("Start date is required")
        .isDate()
        .withMessage("Invalid start date format"),

    check("scope")
        .optional()
        .isString()
        .withMessage("Scope must be a string")
        .isLength({ max: 50 })
        .withMessage("Scope must be less than 50 characters"),

    check("apply_to_all_hives")
        .optional()
        .isBoolean()
        .withMessage("Apply to all hives must be a boolean"),

    check("name")
        .optional()
        .isString()
        .withMessage("Name must be a string")
        .isLength({ max: 100 })
        .withMessage("Name must be less than 100 characters"),

    check("disease")
        .optional()
        .isString()
        .withMessage("Disease must be a string")
        .isLength({ max: 100 })
        .withMessage("Disease must be less than 100 characters"),

    check("treatment_product")
        .optional()
        .isString()
        .withMessage("Treatment product must be a string")
        .isLength({ max: 100 })
        .withMessage("Treatment product must be less than 100 characters"),

    check("end_date")
        .optional()
        .isDate()
        .withMessage("Invalid end date format"),

    check("input_as")
        .optional()
        .isString()
        .withMessage("Input as must be a string")
        .isLength({ max: 50 })
        .withMessage("Input as must be less than 50 characters"),

    check("total_quantity")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Total quantity must be a non-negative number"),

    check("doses")
        .optional()
        .isString()
        .withMessage("Doses must be a string")
        .isLength({ max: 200 })
        .withMessage("Doses must be less than 200 characters"),

    check("notes")
        .optional()
        .isString()
        .withMessage("Notes must be a string")
        .isLength({ max: 500 })
        .withMessage("Notes must be less than 500 characters"),

    validatorMiddleware,
];

export const updateTreatmentValidator = [
    check("id")
        .notEmpty()
        .withMessage("Treatment ID is required")
        .isInt({ min: 1 })
        .withMessage("Invalid treatment ID")
        .custom(async (value: string) => {
            const treatment = await prisma.treatment.findUnique({
                where: { id: parseInt(value) }
            });
            if (!treatment) {
                throw new Error("Treatment not found");
            }
            return true;
        }),

    check("apiary_id")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Apiary ID must be a positive integer")
        .custom(async (value: string) => {
            const apiary = await prisma.apiary.findUnique({
                where: { id: parseInt(value) }
            });
            if (!apiary) {
                throw new Error("Apiary not found");
            }
            return true;
        }),

    check("hive_id")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Hive ID must be a positive integer"),

    check("start_date")
        .optional()
        .isDate()
        .withMessage("Invalid start date format"),

    check("scope")
        .optional()
        .isString()
        .withMessage("Scope must be a string")
        .isLength({ max: 50 })
        .withMessage("Scope must be less than 50 characters"),

    check("apply_to_all_hives")
        .optional()
        .isBoolean()
        .withMessage("Apply to all hives must be a boolean"),

    check("name")
        .optional()
        .isString()
        .withMessage("Name must be a string")
        .isLength({ max: 100 })
        .withMessage("Name must be less than 100 characters"),

    check("disease")
        .optional()
        .isString()
        .withMessage("Disease must be a string")
        .isLength({ max: 100 })
        .withMessage("Disease must be less than 100 characters"),

    check("treatment_product")
        .optional()
        .isString()
        .withMessage("Treatment product must be a string")
        .isLength({ max: 100 })
        .withMessage("Treatment product must be less than 100 characters"),

    check("end_date")
        .optional()
        .isDate()
        .withMessage("Invalid end date format"),

    check("input_as")
        .optional()
        .isString()
        .withMessage("Input as must be a string")
        .isLength({ max: 50 })
        .withMessage("Input as must be less than 50 characters"),

    check("total_quantity")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Total quantity must be a non-negative number"),

    check("doses")
        .optional()
        .isString()
        .withMessage("Doses must be a string")
        .isLength({ max: 200 })
        .withMessage("Doses must be less than 200 characters"),

    check("notes")
        .optional()
        .isString()
        .withMessage("Notes must be a string")
        .isLength({ max: 500 })
        .withMessage("Notes must be less than 500 characters"),

    validatorMiddleware,
];

export const treatmentIdValidator = [
    check("id")
        .isInt({ min: 1 })
        .withMessage("Invalid treatment ID")
        .custom(async (value: string) => {
            const treatment = await prisma.treatment.findUnique({
                where: { id: parseInt(value) }
            });
            if (!treatment) {
                throw new Error("Treatment not found");
            }
            return true;
        }),

    validatorMiddleware,
];