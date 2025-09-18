import express from 'express';
import { 
    createHarvest,
    getAllHarvests,
    getHarvestById,
    updateHarvest,
    deleteHarvest
} from "../Controller/harvestController";

import {
    createHarvestValidator,
    harvestIdValidator,
    updateHarvestValidator
} from '../utils/validator/harvestValidator';


const router = express.Router();

router.post('/', createHarvestValidator, createHarvest);
router.get('/', getAllHarvests);
router.get('/:id', harvestIdValidator, getHarvestById);
router.put('/:id', harvestIdValidator, updateHarvestValidator, updateHarvest);
router.delete('/:id', harvestIdValidator, deleteHarvest);

export default router;