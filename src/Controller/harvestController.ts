import prisma from '../utils/prismaClient';
import asyncHandler from 'express-async-handler';
import { SuccessResponse } from '../utils/response';
import { Request, Response } from 'express';
import { NotFound } from '../Errors';
import { IHarvest } from '../interface/IHarvest.interface'

// Create Harvest
export const createHarvest = asyncHandler(async (req: Request, res: Response) => {
  const {
    scope,
    apiary_id,
    apply_to_all_hives,
    hive_id,
    name,
    harvest_date,
    product_type,
    variety,
    total_quantity,
    unit,
    notes
  }: IHarvest = req.body;

  // Validate required fields
  if (!apiary_id || !harvest_date) {
    res.status(400);
    throw new Error('Apiary ID and harvest date are required');
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

  // If applying to all hives, create harvest records for each hive in the apiary
  if (apply_to_all_hives) {
    const hives = await prisma.hive.findMany({
      where: { apiary_id }
    });

    if (hives.length === 0) {
      res.status(400);
      throw new Error('No hives found in the specified apiary');
    }

    const harvestPromises = hives.map(hive =>
      prisma.harvest.create({
        data: {
          scope,
          apiary_id,
          apply_to_all_hives,
          hive_id: hive.id,
          name,
          harvest_date: new Date(harvest_date),
          product_type: product_type as any,
          variety,
          total_quantity,
          unit,
          notes
        },
        include: {
          apiary: true,
          hive: true
        }
      })
    );

    const harvests = await Promise.all(harvestPromises);
    
    SuccessResponse(res, { 
      harvests, 
      count: harvests.length,
      message: `Harvest records created for ${harvests.length} hives` 
    }, 201);
  } else {
    // Create single harvest record
    const harvest = await prisma.harvest.create({
      data: {
        scope,
        apiary_id,
        apply_to_all_hives,
        hive_id,
        name,
        harvest_date: new Date(harvest_date),
        product_type: product_type as any,
        variety,
        total_quantity,
        unit,
        notes
      },
      include: {
        apiary: true,
        hive: true
      }
    });

    SuccessResponse(res, { harvest, message: 'Harvest created successfully' }, 201);
  }
});

// Get All Harvests
export const getAllHarvests = asyncHandler(async (req: Request, res: Response) => {
  const { apiary_id, hive_id, product_type, variety, from_date, to_date } = req.query;

  const whereClause: any = {};

  if (apiary_id) {
    whereClause.apiary_id = parseInt(apiary_id as string);
  }

  if (hive_id) {
    whereClause.hive_id = parseInt(hive_id as string);
  }

  if (product_type) {
    whereClause.product_type = product_type as string;
  }

  if (variety) {
    whereClause.variety = variety as string;
  }

  if (from_date || to_date) {
    whereClause.harvest_date = {};
    if (from_date) {
      whereClause.harvest_date.gte = new Date(from_date as string);
    }
    if (to_date) {
      whereClause.harvest_date.lte = new Date(to_date as string);
    }
  }

  const harvests = await prisma.harvest.findMany({
    where: whereClause,
    include: {
      apiary: true,
      hive: true
    },
    orderBy: {
      harvest_date: 'desc'
    }
  });

  SuccessResponse(res, { harvests, count: harvests.length });
});

// Get Harvest by ID
export const getHarvestById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    res.status(400);
    throw new Error('Valid harvest ID is required');
  }

  const harvest = await prisma.harvest.findUnique({
    where: { id: parseInt(id) },
    include: {
      apiary: true,
      hive: true
    }
  });

  if (!harvest) {
    res.status(404);
    throw new Error('Harvest not found');
  }

  SuccessResponse(res, { harvest });
});

// Update Harvest
export const updateHarvest = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    scope,
    apiary_id,
    apply_to_all_hives,
    hive_id,
    name,
    harvest_date,
    product_type,
    variety,
    total_quantity,
    unit,
    notes
  }: IHarvest = req.body;

  // Validate harvest ID
  if (!id || isNaN(parseInt(id))) {
    res.status(400);
    throw new Error('Valid harvest ID is required');
  }

  const harvestId = parseInt(id);

  // Check if harvest exists
  const existingHarvest = await prisma.harvest.findUnique({
    where: { id: harvestId }
  });

  if (!existingHarvest) {
    res.status(404);
    throw new Error('Harvest not found');
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

  // Update the harvest
  const harvest = await prisma.harvest.update({
    where: { id: harvestId },
    data: {
      scope,
      apiary_id,
      apply_to_all_hives,
      hive_id,
      name,
      harvest_date: harvest_date ? new Date(harvest_date) : undefined,
      product_type: product_type as any,
      variety,
      total_quantity,
      unit,
      notes
    },
    include: {
      apiary: true,
      hive: true
    }
  });

  SuccessResponse(res, { harvest, message: 'Harvest updated successfully' });
});

// Delete Harvest
export const deleteHarvest = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    res.status(400);
    throw new Error('Valid harvest ID is required');
  }

  const harvestId = parseInt(id);

  // Check if harvest exists
  const existingHarvest = await prisma.harvest.findUnique({
    where: { id: harvestId }
  });

  if (!existingHarvest) {
    res.status(404);
    throw new Error('Harvest not found');
  }

  // Delete the harvest
  await prisma.harvest.delete({
    where: { id: harvestId }
  });

  SuccessResponse(res, { message: 'Harvest deleted successfully' });
});

