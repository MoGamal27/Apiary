import express from 'express';
import { 
  createFeeding, 
  deleteFeeding, 
  getAllFeedings, 
  getFeedingById, 
  updateFeeding 
} from '../Controller/feedingController';
import { 
  createFeedingValidator, 
  feedingIdParamValidator, 
  updateFeedingValidator 
} from '../utils/validator/feedingValidator';

const router = express.Router();

// Basic CRUD routes
router.route('/')
  .post(createFeedingValidator, createFeeding)
  .get(getAllFeedings);

router.route('/:id')
  .get(feedingIdParamValidator, getFeedingById)
  .put(updateFeedingValidator, updateFeeding)
  .delete(feedingIdParamValidator, deleteFeeding);

export default router;