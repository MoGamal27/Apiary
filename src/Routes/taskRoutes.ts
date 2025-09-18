import express from 'express';
import { 
  createTask, 
  deleteTask, 
  getAllTasks, 
  getTaskById, 
  getTasksByStatus, 
  markTaskCompleted, 
  updateTask 
} from '../Controller/taskController';
import { 
  createTaskValidator, 
  taskIdParamValidator, 
  taskPriorityParamValidator, 
  taskStatusParamValidator, 
  updateTaskValidator 
} from '../utils/validator/taskValidator';

const router = express.Router();

// Basic CRUD routes
router.route('/')
  .post(createTaskValidator, createTask)
  .get(getAllTasks);

router.route('/:id')
  .get(taskIdParamValidator, getTaskById)
  .put(updateTaskValidator, updateTask)
  .delete(taskIdParamValidator, deleteTask);

// Special action routes
router.route('/:id/complete')
  .put(taskIdParamValidator, markTaskCompleted);

// Filter routes
router.route('/status/:status')
  .get(taskStatusParamValidator, getTasksByStatus);


export default router;