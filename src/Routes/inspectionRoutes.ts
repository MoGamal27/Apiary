import express from 'express';
import {
    createInspection,
    getInspections,
    getInspectionById,
    updateInspection,
    deleteInspection
} from '../Controller/inspectionController';
import {
    createInspectionValidator,
    inspectionIdValidator
} from '../utils/validator/inspectionValidaor';

const router = express.Router();

router.post('/', createInspectionValidator, createInspection);
router.get('/', getInspections);
router.get('/:id', inspectionIdValidator, getInspectionById);
router.put('/:id', inspectionIdValidator, updateInspection);
router.delete('/:id', inspectionIdValidator, deleteInspection);

export default router;