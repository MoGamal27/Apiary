import express from 'express';
import { 
    createTreatment,
    getAllTreatments,
    getTreatmentById,
    updateTreatment,
    deleteTreatment
} from "../Controller/treatmentController";

import {
    createTreatmentValidator,
    treatmentIdValidator,
    updateTreatmentValidator
} from '../utils/validator/treatmentValidator';

const router = express.Router();

router.post('/', createTreatmentValidator, createTreatment);
router.get('/', getAllTreatments);
router.get('/:id', treatmentIdValidator, getTreatmentById);
router.put('/:id', treatmentIdValidator, updateTreatmentValidator, updateTreatment);
router.delete('/:id', treatmentIdValidator, deleteTreatment);

export default router;