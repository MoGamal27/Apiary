const { check } = require('express-validator');
import validatorMiddleware from '../../middleware/validatorMiddleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createHarvestValidator = [
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

        
    check("harvest_date")
        .notEmpty()
        .withMessage("Harvest date is required")
        .isISO8601()
        .withMessage("Invalid date format"),

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
        .isLength({ max: 100 })
        .withMessage("Name must be less than 100 characters"),

    check("product_type")
        .optional()
        .isIn(['HONEY', 'WAX', 'PROPOLIS', 'POLLEN', 'ROYAL_JELLY', 'BEE_BREAD', 'COMB_HONEY', 'OTHER'])
        .withMessage("Invalid product type"),

    check("variety")
        .optional()
        .isString()
        .withMessage("Variety must be a string")
        .isLength({ max: 100 })
        .withMessage("Variety must be less than 100 characters"),

    check("total_quantity")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Total quantity must be a non-negative number"),

    check("unit")
        .optional()
        .isIn(['kg', 'lb', 'g', 'oz'])
        .withMessage("Unit must be one of 'kg', 'lb', 'g', or 'oz'"),

    check("notes")
        .optional()
        .isString()
        .withMessage("Notes must be a string")
        .isLength({ max: 500 })
        .withMessage("Notes must be less than 500 characters"),

    validatorMiddleware,
];

export const updateHarvestValidator = [
    check("id")
        .notEmpty()
        .withMessage("Harvest ID is required")
        .isInt({ min: 1 })
        .withMessage("Invalid harvest ID")
        .custom(async (value: string) => {
            const harvest = await prisma.harvest.findUnique({
                where: { id: parseInt(value) }
            });
            if (!harvest) {
                throw new Error("Harvest not found");
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
   

    check("harvest_date")
        .optional()
        .isDate()
        .withMessage("Invalid date format"),

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
        .isLength({ max: 100 })
        .withMessage("Name must be less than 100 characters"),

    check("product_type")
        .optional()
        .isIn(['HONEY', 'WAX', 'PROPOLIS', 'POLLEN', 'ROYAL_JELLY', 'BEE_BREAD', 'COMB_HONEY', 'OTHER'])
        .withMessage("Invalid product type"),

    check("variety")
        .optional()
        .isString()
        .withMessage("Variety must be a string")
        .isLength({ max: 100 })
        .withMessage("Variety must be less than 100 characters"),

    check("total_quantity")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Total quantity must be a non-negative number"),

    check("unit")
        .optional()
        .isIn(['kg', 'lb', 'g', 'oz'])
        .withMessage("Unit must be one of 'kg', 'lb', 'g', or 'oz'"),

    check("notes")
        .optional()
        .isString()
        .withMessage("Notes must be a string")
        .isLength({ max: 500 })
        .withMessage("Notes must be less than 500 characters"),

    validatorMiddleware,
];

export const harvestIdValidator = [
    check("id")
        .isInt({ min: 1 })
        .withMessage("Invalid harvest ID")
        .custom(async (value: string) => {
            const harvest = await prisma.harvest.findUnique({
                where: { id: parseInt(value) }
            });
            if (!harvest) {
                throw new Error("Harvest not found");
            }
            return true;
        }),

    validatorMiddleware,
];