const { check } = require('express-validator');
import validatorMiddleware from '../../middleware/validatorMiddleware';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createInspectionValidator = [
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
        .notEmpty()
        .withMessage("Hive ID is required")
        .isInt({ min: 1 })
        .withMessage("Hive ID must be a positive integer")
        .custom(async (value: string) => {
            const hive = await prisma.hive.findUnique({
                where: { id: parseInt(value) }
            });
            if (!hive) {
                throw new Error("Hive not found");
            }
            return true;
        }),

    check("inspection_date")
        .notEmpty()
        .withMessage("Inspection date is required")
        .isDate()
        .withMessage("Invalid date format"),

    check("name")
        .optional()
        .isLength({ max: 100 })
        .withMessage("Name must be less than 100 characters"),

    check("strength")
        .optional()
        .isInt({ min: 0, max: 100 })
        .withMessage("Strength must be between 0 and 100"),

    check("strength_category")
        .optional()
        .isIn(['VERY_WEAK', 'WEAK', 'MODERATE', 'STRONG', 'VERY_STRONG'])
        .withMessage("Invalid strength category"),

    check("temperament")
        .optional()
        .isIn(['CALM', 'NORMAL', 'NERVOUS', 'AGGRESSIVE', 'DEFENSIVE'])
        .withMessage("Invalid temperament"),

    check("inspection_time")
        .optional()
        .isString()
        .withMessage("Inspection time must be a string")
        .isLength({ max: 50 })
        .withMessage("Inspection time must be less than 50 characters"),

    check("supers_count")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Supers count must be a non-negative integer"),

    check("frames_count")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Frames count must be a non-negative integer"),

    check("notes")
        .optional()
        .isString()
        .withMessage("Notes must be a string")
        .isLength({ max: 500 })
        .withMessage("Notes must be less than 500 characters"),

    check("weight")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Weight must be a non-negative number"),

    check("weight_unit")
        .optional()
        .isIn(['kg', 'lb'])
        .withMessage("Weight unit must be either 'kg' or 'lb'"),

    check("include_weather")
        .optional()
        .isBoolean()
        .withMessage("Include weather must be a boolean"),

    check("weather_conditions")
        .optional()
        .isString()
        .withMessage("Weather conditions must be a string")
        .isLength({ max: 200 })
        .withMessage("Weather conditions must be less than 200 characters"),

    check("temperature")
        .optional()
        .isFloat({ min: -50, max: 50 })
        .withMessage("Temperature must be a number between -50 and 50"),

    check("inspectionQueen.queen_seen")
        .optional()
        .isBoolean()
        .withMessage("Queen seen must be a boolean"),

    check("inspectionQueen.queen_cells")
        .optional()
        .isIn(['NONE', 'SWARM', 'SUPERSEDURE', 'EMERGENCY'])
        .withMessage("Invalid queen cells value"),

    check("inspectionQueen.swarmed")
        .optional()
        .isBoolean()
        .withMessage("Swarmed must be a boolean"),

    check("inspectionBrood.eggs_present")
        .optional()
        .isBoolean()
        .withMessage("Eggs present must be a boolean"),

    check("inspectionBrood.capped_brood")
        .optional()
        .isBoolean()
        .withMessage("Capped brood must be a boolean"),

    check("inspectionBrood.uncapped_brood")
        .optional()
        .isBoolean()
        .withMessage("Uncapped brood must be a boolean"),

    check("inspectionBrood.excessive_drones")
        .optional()
        .isBoolean()
        .withMessage("Excessive drones must be a boolean"),

    check("inspectionBrood.laying_pattern")
        .optional()
        .isIn(['NONE', 'NOT_UNIFORM', 'MOSTLY_UNIFORM', 'UNIFORM'])
        .withMessage("Invalid laying pattern value"),

    check("inspectionBrood.population_level")
        .optional()
        .isIn(['LOW', 'AVERAGE', 'HIGH'])
        .withMessage("Invalid population level value"),

    check("inspectionConditions.equipment_condition")
        .optional()
        .isIn(['DAMAGED', 'FAIR', 'GOOD'])
        .withMessage("Invalid equipment condition value"),

    check("inspectionConditions.odor")
        .optional()
        .isIn(['NORMAL', 'FOUL', 'SOUR'])
        .withMessage("Invalid odor value"),

    check("inspectionConditions.brace_comb")
        .optional()
        .isBoolean()
        .withMessage("Brace comb must be a boolean"),

    check("inspectionConditions.excessive_propolis")
        .optional()
        .isBoolean()
        .withMessage("Excessive propolis must be a boolean"),

    check("inspectionConditions.dead_bees")
        .optional()
        .isBoolean()
        .withMessage("Dead bees must be a boolean"),

    check("inspectionConditions.moisture")
        .optional()
        .isBoolean()
        .withMessage("Moisture must be a boolean"),

    check("inspectionConditions.mold")
        .optional()
        .isBoolean()
        .withMessage("Mold must be a boolean"),

    check("inspectionFrames.frames_bees")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Frames bees must be a non-negative integer"),

    check("inspectionFrames.frames_brood")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Frames brood must be a non-negative integer"),

    check("inspectionFrames.frames_honey")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Frames honey must be a non-negative integer"),

    check("inspectionFrames.frames_pollen")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Frames pollen must be a non-negative integer"),

    check("inspectionFrames.frames_foundation")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Frames foundation must be a non-negative integer"),

    check("inspectionFrames.honey_stores")
        .optional()
        .isIn(['LOW', 'AVERAGE', 'HIGH', 'ABUNDANT'])
        .withMessage("Invalid honey stores value"),

    check("inspectionFrames.pollen_stores")
        .optional()
        .isIn(['LOW', 'AVERAGE', 'HIGH', 'ABUNDANT'])
        .withMessage("Invalid pollen stores value"),

    check("inspectionActivities.bee_activity")
        .optional()
        .isIn(['LOW', 'AVERAGE', 'HIGH'])
        .withMessage("Invalid bee activity level"),

    check("inspectionActivities.orientation_flights")
        .optional()
        .isIn(['LOW', 'AVERAGE', 'HIGH'])
        .withMessage("Invalid orientation flights level"),

    check("inspectionActivities.pollen_arriving")
        .optional()
        .isIn(['LOW', 'AVERAGE', 'HIGH'])
        .withMessage("Invalid pollen arriving level"),

    check("inspectionActivities.foraging_bees")
        .optional()
        .isIn(['LOW', 'AVERAGE', 'HIGH'])
        .withMessage("Invalid foraging bees level"),

    check("inspectionActivities.bees_per_minute")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Bees per minute must be a non-negative integer"),

    check("inspectionProblems.diseases")
        .optional()
        .isString()
        .withMessage("Diseases must be a string")
        .isLength({ max: 200 })
        .withMessage("Diseases must be less than 200 characters"),

    check("inspectionProblems.pests")
        .optional()
        .isString()
        .withMessage("Pests must be a string")
        .isLength({ max: 200 })
        .withMessage("Pests must be less than 200 characters"),

    check("inspectionProblems.predation")
        .optional()
        .isString()
        .withMessage("Predation must be a string")
        .isLength({ max: 200 })
        .withMessage("Predation must be less than 200 characters"),

    check("inspectionTreatments.treatments")
        .optional()
        .isString()
        .withMessage("Treatments must be a string")
        .isLength({ max: 200 })
        .withMessage("Treatments must be less than 200 characters"),

    check("inspectionTreatments.varroa_drop_count")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Varroa drop count must be a non-negative integer"),

    check("inspectionTreatments.actions_taken")
        .optional()
        .isString()
        .withMessage("Actions taken must be a string")
        .isLength({ max: 200 })
        .withMessage("Actions taken must be less than 200 characters"),

    validatorMiddleware,
];

export const updateInspectionValidator = [
    check("id")
        .notEmpty()
        .withMessage("Inspection ID is required")
        .isInt({ min: 1 })
        .withMessage("Invalid inspection ID")
        .custom(async (value: string) => {
            const inspection = await prisma.inspection.findUnique({
                where: { id: parseInt(value) }
            });
            if (!inspection) {
                throw new Error("Inspection not found");
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
        .withMessage("Hive ID must be a positive integer")
        .custom(async (value: string) => {
            const hive = await prisma.hive.findUnique({
                where: { id: parseInt(value) }
            });
            if (!hive) {
                throw new Error("Hive not found");
            }
            return true;
        }),

    check("inspection_date")
        .optional()
        .isISO8601()
        .withMessage("Invalid date format"),

    check("name")
        .optional()
        .isLength({ max: 100 })
        .withMessage("Name must be less than 100 characters"),

    check("strength")
        .optional()
        .isInt({ min: 0, max: 100 })
        .withMessage("Strength must be between 0 and 100"),

    check("strength_category")
        .optional()
        .isIn(['VERY_WEAK', 'WEAK', 'MODERATE', 'STRONG', 'VERY_STRONG'])
        .withMessage("Invalid strength category"),

    check("temperament")
        .optional()
        .isIn(['CALM', 'NORMAL', 'NERVOUS', 'AGGRESSIVE', 'DEFENSIVE'])
        .withMessage("Invalid temperament"),

    check("inspection_time")
        .optional()
        .isString()
        .withMessage("Inspection time must be a string")
        .isLength({ max: 50 })
        .withMessage("Inspection time must be less than 50 characters"),

    check("supers_count")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Supers count must be a non-negative integer"),

    check("frames_count")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Frames count must be a non-negative integer"),

    check("notes")
        .optional()
        .isString()
        .withMessage("Notes must be a string")
        .isLength({ max: 500 })
        .withMessage("Notes must be less than 500 characters"),

    check("weight")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Weight must be a non-negative number"),

    check("weight_unit")
        .optional()
        .isIn(['kg', 'lb'])
        .withMessage("Weight unit must be either 'kg' or 'lb'"),

    check("include_weather")
        .optional()
        .isBoolean()
        .withMessage("Include weather must be a boolean"),

    check("weather_conditions")
        .optional()
        .isString()
        .withMessage("Weather conditions must be a string")
        .isLength({ max: 200 })
        .withMessage("Weather conditions must be less than 200 characters"),

    check("temperature")
        .optional()
        .isFloat({ min: -50, max: 50 })
        .withMessage("Temperature must be a number between -50 and 50"),

    check("inspectionQueen.queen_seen")
        .optional()
        .isBoolean()
        .withMessage("Queen seen must be a boolean"),

    check("inspectionQueen.queen_cells")
        .optional()
        .isIn(['NONE', 'SWARM', 'SUPERSEDURE', 'EMERGENCY'])
        .withMessage("Invalid queen cells value"),

    check("inspectionQueen.swarmed")
        .optional()
        .isBoolean()
        .withMessage("Swarmed must be a boolean"),

    check("inspectionBrood.eggs_present")
        .optional()
        .isBoolean()
        .withMessage("Eggs present must be a boolean"),

    check("inspectionBrood.capped_brood")
        .optional()
        .isBoolean()
        .withMessage("Capped brood must be a boolean"),

    check("inspectionBrood.uncapped_brood")
        .optional()
        .isBoolean()
        .withMessage("Uncapped brood must be a boolean"),

    check("inspectionBrood.excessive_drones")
        .optional()
        .isBoolean()
        .withMessage("Excessive drones must be a boolean"),

    check("inspectionBrood.laying_pattern")
        .optional()
        .isIn(['NONE', 'NOT_UNIFORM', 'MOSTLY_UNIFORM', 'UNIFORM'])
        .withMessage("Invalid laying pattern value"),

    check("inspectionBrood.population_level")
        .optional()
        .isIn(['LOW', 'AVERAGE', 'HIGH'])
        .withMessage("Invalid population level value"),

    check("inspectionConditions.equipment_condition")
        .optional()
        .isIn(['DAMAGED', 'FAIR', 'GOOD'])
        .withMessage("Invalid equipment condition value"),

    check("inspectionConditions.odor")
        .optional()
        .isIn(['NORMAL', 'FOUL', 'SOUR'])
        .withMessage("Invalid odor value"),

    check("inspectionConditions.brace_comb")
        .optional()
        .isBoolean()
        .withMessage("Brace comb must be a boolean"),

    check("inspectionConditions.excessive_propolis")
        .optional()
        .isBoolean()
        .withMessage("Excessive propolis must be a boolean"),

    check("inspectionConditions.dead_bees")
        .optional()
        .isBoolean()
        .withMessage("Dead bees must be a boolean"),

    check("inspectionConditions.moisture")
        .optional()
        .isBoolean()
        .withMessage("Moisture must be a boolean"),

    check("inspectionConditions.mold")
        .optional()
        .isBoolean()
        .withMessage("Mold must be a boolean"),

    check("inspectionFrames.frames_bees")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Frames bees must be a non-negative integer"),

    check("inspectionFrames.frames_brood")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Frames brood must be a non-negative integer"),

    check("inspectionFrames.frames_honey")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Frames honey must be a non-negative integer"),

    check("inspectionFrames.frames_pollen")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Frames pollen must be a non-negative integer"),

    check("inspectionFrames.frames_foundation")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Frames foundation must be a non-negative integer"),

    check("inspectionFrames.honey_stores")
        .optional()
        .isIn(['LOW', 'AVERAGE', 'HIGH', 'ABUNDANT'])
        .withMessage("Invalid honey stores value"),

    check("inspectionFrames.pollen_stores")
        .optional()
        .isIn(['LOW', 'AVERAGE', 'HIGH', 'ABUNDANT'])
        .withMessage("Invalid pollen stores value"),

    check("inspectionActivities.bee_activity")
        .optional()
        .isIn(['LOW', 'AVERAGE', 'HIGH'])
        .withMessage("Invalid bee activity level"),

    check("inspectionActivities.orientation_flights")
        .optional()
        .isIn(['LOW', 'AVERAGE', 'HIGH'])
        .withMessage("Invalid orientation flights level"),

    check("inspectionActivities.pollen_arriving")
        .optional()
        .isIn(['LOW', 'AVERAGE', 'HIGH'])
        .withMessage("Invalid pollen arriving level"),

    check("inspectionActivities.foraging_bees")
        .optional()
        .isIn(['LOW', 'AVERAGE', 'HIGH'])
        .withMessage("Invalid foraging bees level"),

    check("inspectionActivities.bees_per_minute")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Bees per minute must be a non-negative integer"),

    check("inspectionProblems.diseases")
        .optional()
        .isString()
        .withMessage("Diseases must be a string")
        .isLength({ max: 200 })
        .withMessage("Diseases must be less than 200 characters"),

    check("inspectionProblems.pests")
        .optional()
        .isString()
        .withMessage("Pests must be a string")
        .isLength({ max: 200 })
        .withMessage("Pests must be less than 200 characters"),

    check("inspectionProblems.predation")
        .optional()
        .isString()
        .withMessage("Predation must be a string")
        .isLength({ max: 200 })
        .withMessage("Predation must be less than 200 characters"),

    check("inspectionTreatments.treatments")
        .optional()
        .isString()
        .withMessage("Treatments must be a string")
        .isLength({ max: 200 })
        .withMessage("Treatments must be less than 200 characters"),

    check("inspectionTreatments.varroa_drop_count")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Varroa drop count must be a non-negative integer"),

    check("inspectionTreatments.actions_taken")
        .optional()
        .isString()
        .withMessage("Actions taken must be a string")
        .isLength({ max: 200 })
        .withMessage("Actions taken must be less than 200 characters"),

    validatorMiddleware,
];

export const inspectionIdValidator = [
    check("id")
        .isInt({ min: 1 })
        .withMessage("Invalid inspection ID")
        .custom(async (value: string) => {
            const inspection = await prisma.inspection.findUnique({
                where: { id: parseInt(value) }
            });
            if (!inspection) {
                throw new Error("Inspection not found");
            }
            return true;
        }),

    validatorMiddleware,
];