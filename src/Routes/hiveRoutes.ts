import express from 'express';
import { createHive, deleteHive, getHiveById, getHives, updateHive } from '../Controller/hiveController';
import { createHiveValidator, hiveIdParamValidator, updateHiveValidator } from '../utils/validator/hiveValidator';

const router = express.Router();

router.route('/')
  .post(createHiveValidator, createHive)
  .get(getHives);

router.route('/:id')
  .get(hiveIdParamValidator, getHiveById)
  .put(updateHiveValidator, updateHive)
  .delete(hiveIdParamValidator, deleteHive);

export default router;


