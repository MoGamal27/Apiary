import prisma from '../utils/prismaClient';
import asyncHandler from 'express-async-handler';
import { SuccessResponse } from '../utils/response';
import { Request, Response } from 'express';
import { NotFound } from '../Errors';
import { ITask } from '../interface/ITask.interface'

// Create Task
export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const {
    status,
    type,
    apiary_id,
    hive_id,
    priority,
    title,
    start_date,
    start_time,
    end_date,
    end_time,
    description,
    reminder,
    reminder_me
  }: ITask = req.body;

  // Validate required fields
  if (!apiary_id || !title || !start_date) {
    res.status(400);
    throw new Error('Apiary ID, title, and start date are required');
  }

  // Check if apiary exists
  const apiary = await prisma.apiary.findUnique({
    where: { id: apiary_id }
  });

  if (!apiary) {
    res.status(404);
    throw new Error('Apiary not found');
  }

  // Check if hive exists and belongs to the apiary (if hive_id is provided)
  if (hive_id) {
    const hive = await prisma.hive.findUnique({
      where: { id: hive_id },
      include: { apiary: true }
    });

    if (!hive) {
      res.status(404);
      throw new Error('Hive not found');
    }

    if (hive.apiary_id !== apiary_id) {
      res.status(400);
      throw new Error('Hive does not belong to the specified apiary');
    }
  }

  // Create the task
  const task = await prisma.task.create({
    data: {
      status: status as any,
      type,
      apiary_id,
      hive_id,
      priority: priority as any,
      title,
      start_date: new Date(start_date),
      start_time,
      end_date: end_date ? new Date(end_date) : undefined,
      end_time,
      description,
      reminder,
      reminder_me
    },
    include: {
      apiary: true,
      hive: true
    }
  });

  SuccessResponse(res, {message: 'Task created successfully' }, 201);
});

// Get All Tasks
export const getAllTasks = asyncHandler(async (req: Request, res: Response) => {
  const { apiary_id, hive_id, status, priority, type } = req.query;

  const whereClause: any = {};

  if (apiary_id) {
    whereClause.apiary_id = parseInt(apiary_id as string);
  }

  if (hive_id) {
    whereClause.hive_id = parseInt(hive_id as string);
  }

  if (status) {
    whereClause.status = status as string;
  }

  if (priority) {
    whereClause.priority = priority as string;
  }

  if (type) {
    whereClause.type = type as string;
  }

  const tasks = await prisma.task.findMany({
    where: whereClause,
    include: {
      apiary: true,
      hive: true
    },
    orderBy: {
      start_date: 'asc'
    }
  });

  SuccessResponse(res, {message: 'Tasks retrieved successfully', data: tasks });
});

// Get Task by ID
export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    res.status(400);
    throw new Error('Valid task ID is required');
  }

  const task = await prisma.task.findUnique({
    where: { id: parseInt(id) },
    include: {
      apiary: true,
      hive: true
    }
  });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  SuccessResponse(res, {message: 'Task retrieved successfully', data: task });
});

// Update Task
export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    status,
    type,
    apiary_id,
    hive_id,
    priority,
    title,
    start_date,
    start_time,
    end_date,
    end_time,
    description,
    reminder,
    reminder_me
  }: ITask = req.body;

  // Validate task ID
  if (!id || isNaN(parseInt(id))) {
    res.status(400);
    throw new Error('Valid task ID is required');
  }

  const taskId = parseInt(id);

  // Check if task exists
  const existingTask = await prisma.task.findUnique({
    where: { id: taskId }
  });

  if (!existingTask) {
    res.status(404);
    throw new Error('Task not found');
  }

  // If apiary_id is being updated, validate it exists
  if (apiary_id) {
    const apiary = await prisma.apiary.findUnique({
      where: { id: apiary_id }
    });

    if (!apiary) {
      res.status(404);
      throw new Error('Apiary not found');
    }
  }

  // If hive_id is being updated, validate the relationship
  if (hive_id && apiary_id) {
    const hive = await prisma.hive.findUnique({
      where: { id: hive_id },
      include: { apiary: true }
    });

    if (!hive) {
      res.status(404);
      throw new Error('Hive not found');
    }

    if (hive.apiary_id !== apiary_id) {
      res.status(400);
      throw new Error('Hive does not belong to the specified apiary');
    }
  }

  // Update the task
  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      status: status as any,
      type,
      apiary_id,
      hive_id,
      priority: priority as any,
      title,
      start_date: start_date ? new Date(start_date) : undefined,
      start_time,
      end_date: end_date ? new Date(end_date) : undefined,
      end_time,
      description,
      reminder,
      reminder_me
    },
    include: {
      apiary: true,
      hive: true
    }
  });

  SuccessResponse(res, { task, message: 'Task updated successfully' });
});

// Delete Task
export const deleteTask = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    res.status(400);
    throw new Error('Valid task ID is required');
  }

  const taskId = parseInt(id);

  // Check if task exists
  const existingTask = await prisma.task.findUnique({
    where: { id: taskId }
  });

  if (!existingTask) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Delete the task
  await prisma.task.delete({
    where: { id: taskId }
  });

  SuccessResponse(res, { message: 'Task deleted successfully' });
});

// Get Tasks by Status
export const getTasksByStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.params;
  const { apiary_id, hive_id } = req.query;

  const whereClause: any = { status: status.toUpperCase() };

  if (apiary_id) {
    whereClause.apiary_id = parseInt(apiary_id as string);
  }

  if (hive_id) {
    whereClause.hive_id = parseInt(hive_id as string);
  }

  const tasks = await prisma.task.findMany({
    where: whereClause,
    include: {
      apiary: true,
      hive: true
    },
    orderBy: {
      start_date: 'asc'
    }
  });

  SuccessResponse(res, { tasks, count: tasks.length });
});


// Mark Task as Completed
export const markTaskCompleted = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    res.status(400);
    throw new Error('Valid task ID is required');
  }

  const taskId = parseInt(id);

  // Check if task exists
  const existingTask = await prisma.task.findUnique({
    where: { id: taskId }
  });

  if (!existingTask) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Update task status to completed
  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      status: 'COMPLETED'
    },
    include: {
      apiary: true,
      hive: true
    }
  });

  SuccessResponse(res, { task, message: 'Task marked as completed' });
});