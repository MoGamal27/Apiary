import prisma from '../utils/prismaClient';
import asyncHandler from 'express-async-handler';
import { SuccessResponse } from '../utils/response';
import { Request, Response } from 'express';
import { NotFound } from '../Errors';
import { IFeeding } from '../interface/IFeeding.interface'


// Create Feeding
export const createFeeding = asyncHandler(async (req: Request, res: Response) => {
  const {
    apiary_id,
    apply_to_all_hives,
    hive_id,
    name,
    feeding_date,
    feeding_type,
    food_type,
    ratio,
    note,
    input_as,
    quantity,
    unit,
    notes
  }: IFeeding = req.body;

  // Validate required fields
  if (!apiary_id || !feeding_date) {
    res.status(400);
    throw new Error('Apiary ID and feeding date are required');
  }

  // Check if apiary exists
  const apiary = await prisma.apiary.findUnique({
    where: { id: apiary_id }
  });

  if (!apiary) {
    res.status(404);
    throw new Error('Apiary not found');
  }

  // If not applying to all hives, validate specific hive
  if (!apply_to_all_hives) {
    if (!hive_id) {
      res.status(400);
      throw new Error('Hive ID is required when not applying to all hives');
    }

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

  // If applying to all hives, create feeding records for each hive in the apiary
  if (apply_to_all_hives) {
    const hives = await prisma.hive.findMany({
      where: { apiary_id }
    });

    if (hives.length === 0) {
      res.status(400);
      throw new Error('No hives found in the specified apiary');
    }

    const feedingPromises = hives.map(hive =>
      prisma.feeding.create({
        data: {
          apiary_id,
          apply_to_all_hives,
          hive_id: hive.id,
          name,
          feeding_date: new Date(feeding_date),
          feeding_type,
          food_type,
          ratio,
          note,
          input_as,
          quantity,
          unit,
          notes
        },
        include: {
          apiary: true,
          hive: true
        }
      })
    );

    const feedings = await Promise.all(feedingPromises);
    
    SuccessResponse(res, { 
      feedings, 
      count: feedings.length,
      message: `Feeding records created for ${feedings.length} hives` 
    }, 201);
  } else {
    // Create single feeding record
    const feeding = await prisma.feeding.create({
      data: {
        apiary_id,
        apply_to_all_hives,
        hive_id,
        name,
        feeding_date: new Date(feeding_date),
        feeding_type,
        food_type,
        ratio,
        note,
        input_as,
        quantity,
        unit,
        notes
      },
      include: {
        apiary: true,
        hive: true
      }
    });

    SuccessResponse(res, { feeding, message: 'Feeding created successfully' }, 201);
  }
});

// Get All Feedings
export const getAllFeedings = asyncHandler(async (req: Request, res: Response) => {
  const { apiary_id, hive_id, feeding_type, food_type, from_date, to_date } = req.query;

  const whereClause: any = {};

  if (apiary_id) {
    whereClause.apiary_id = parseInt(apiary_id as string);
  }

  if (hive_id) {
    whereClause.hive_id = parseInt(hive_id as string);
  }

  if (feeding_type) {
    whereClause.feeding_type = feeding_type as string;
  }

  if (food_type) {
    whereClause.food_type = food_type as string;
  }

  if (from_date || to_date) {
    whereClause.feeding_date = {};
    if (from_date) {
      whereClause.feeding_date.gte = new Date(from_date as string);
    }
    if (to_date) {
      whereClause.feeding_date.lte = new Date(to_date as string);
    }
  }

  const feedings = await prisma.feeding.findMany({
    where: whereClause,
    include: {
      apiary: true,
      hive: true
    },
    orderBy: {
      feeding_date: 'desc'
    }
  });

  SuccessResponse(res, { feedings});
});

// Get Feeding by ID
export const getFeedingById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    res.status(400);
    throw new Error('Valid feeding ID is required');
  }

  const feeding = await prisma.feeding.findUnique({
    where: { id: parseInt(id) },
    include: {
      apiary: true,
      hive: true
    }
  });

  if (!feeding) {
    res.status(404);
    throw new Error('Feeding not found');
  }

  SuccessResponse(res, { feeding });
});

// Update Feeding
export const updateFeeding = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    apiary_id,
    apply_to_all_hives,
    hive_id,
    name,
    feeding_date,
    feeding_type,
    food_type,
    ratio,
    note,
    input_as,
    quantity,
    unit,
    notes
  }: IFeeding = req.body;

  // Validate feeding ID
  if (!id || isNaN(parseInt(id))) {
    res.status(400);
    throw new Error('Valid feeding ID is required');
  }

  const feedingId = parseInt(id);

  // Check if feeding exists
  const existingFeeding = await prisma.feeding.findUnique({
    where: { id: feedingId }
  });

  if (!existingFeeding) {
    res.status(404);
    throw new Error('Feeding not found');
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

  // Update the feeding
  const feeding = await prisma.feeding.update({
    where: { id: feedingId },
    data: {
      apiary_id,
      apply_to_all_hives,
      hive_id,
      name,
      feeding_date: feeding_date ? new Date(feeding_date) : undefined,
      feeding_type,
      food_type,
      ratio,
      note,
      input_as,
      quantity,
      unit,
      notes
    },
    include: {
      apiary: true,
      hive: true
    }
  });

  SuccessResponse(res, { feeding, message: 'Feeding updated successfully' });
});

// Delete Feeding
export const deleteFeeding = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    res.status(400);
    throw new Error('Valid feeding ID is required');
  }

  const feedingId = parseInt(id);

  // Check if feeding exists
  const existingFeeding = await prisma.feeding.findUnique({
    where: { id: feedingId }
  });

  if (!existingFeeding) {
    res.status(404);
    throw new Error('Feeding not found');
  }

  // Delete the feeding
  await prisma.feeding.delete({
    where: { id: feedingId }
  });

  SuccessResponse(res, { message: 'Feeding deleted successfully' });
});




