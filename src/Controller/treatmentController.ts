import prisma from '../utils/prismaClient';
import asyncHandler from 'express-async-handler';
import { SuccessResponse } from '../utils/response';
import { Request, Response } from 'express';
import { NotFound } from '../Errors';
import { ITreatment } from '../interface/ITreatment.interface'

// Create Treatment
export const createTreatment = asyncHandler(async (req: Request, res: Response) => {
  const {
    scope,
    apiary_id,
    apply_to_all_hives,
    hive_id,
    name,
    disease,
    treatment_product,
    start_date,
    end_date,
    input_as,
    total_quantity,
    doses,
    notes
  }: ITreatment = req.body;

  // Validate required fields
  if (!apiary_id || !start_date) {
    res.status(400);
    throw new Error('Apiary ID and start date are required');
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

  // If applying to all hives, create treatment records for each hive in the apiary
  if (apply_to_all_hives) {
    const hives = await prisma.hive.findMany({
      where: { apiary_id }
    });

    if (hives.length === 0) {
      res.status(400);
      throw new Error('No hives found in the specified apiary');
    }

    const treatmentPromises = hives.map(hive =>
      prisma.treatment.create({
        data: {
          scope,
          apiary_id,
          apply_to_all_hives,
          hive_id: hive.id,
          name,
          disease,
          treatment_product,
          start_date: new Date(start_date),
          end_date: end_date ? new Date(end_date) : undefined,
          input_as,
          total_quantity,
          doses,
          notes
        },
        include: {
          apiary: true,
          hive: true
        }
      })
    );

    const treatments = await Promise.all(treatmentPromises);
    
    SuccessResponse(res, { 
      treatments, 
      count: treatments.length,
      message: `Treatment records created for ${treatments.length} hives` 
    }, 201);
  } else {
    // Create single treatment record
    const treatment = await prisma.treatment.create({
      data: {
        scope,
        apiary_id,
        apply_to_all_hives,
        hive_id,
        name,
        disease,
        treatment_product,
        start_date: new Date(start_date),
        end_date: end_date ? new Date(end_date) : undefined,
        input_as,
        total_quantity,
        doses,
        notes
      },
      include: {
        apiary: true,
        hive: true
      }
    });

    SuccessResponse(res, { treatment, message: 'Treatment created successfully' }, 201);
  }
});

// Get All Treatments
export const getAllTreatments = asyncHandler(async (req: Request, res: Response) => {
  const { apiary_id, hive_id, disease, treatment_product, from_date, to_date, active_only } = req.query;

  const whereClause: any = {};

  if (apiary_id) {
    whereClause.apiary_id = parseInt(apiary_id as string);
  }

  if (hive_id) {
    whereClause.hive_id = parseInt(hive_id as string);
  }

  if (disease) {
    whereClause.disease = disease as string;
  }

  if (treatment_product) {
    whereClause.treatment_product = treatment_product as string;
  }

  if (from_date || to_date) {
    whereClause.start_date = {};
    if (from_date) {
      whereClause.start_date.gte = new Date(from_date as string);
    }
    if (to_date) {
      whereClause.start_date.lte = new Date(to_date as string);
    }
  }

  // Filter for active treatments (ongoing)
  if (active_only === 'true') {
    const now = new Date();
    whereClause.start_date = { ...whereClause.start_date, lte: now };
    whereClause.OR = [
      { end_date: null },
      { end_date: { gte: now } }
    ];
  }

  const treatments = await prisma.treatment.findMany({
    where: whereClause,
    include: {
      apiary: true,
      hive: true
    },
    orderBy: {
      start_date: 'desc'
    }
  });

  SuccessResponse(res, { treatments, count: treatments.length });
});

// Get Treatment by ID
export const getTreatmentById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    res.status(400);
    throw new Error('Valid treatment ID is required');
  }

  const treatment = await prisma.treatment.findUnique({
    where: { id: parseInt(id) },
    include: {
      apiary: true,
      hive: true
    }
  });

  if (!treatment) {
    res.status(404);
    throw new Error('Treatment not found');
  }

  SuccessResponse(res, { treatment });
});

// Update Treatment
export const updateTreatment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    scope,
    apiary_id,
    apply_to_all_hives,
    hive_id,
    name,
    disease,
    treatment_product,
    start_date,
    end_date,
    input_as,
    total_quantity,
    doses,
    notes
  }: ITreatment = req.body;

  // Validate treatment ID
  if (!id || isNaN(parseInt(id))) {
    res.status(400);
    throw new Error('Valid treatment ID is required');
  }

  const treatmentId = parseInt(id);

  // Check if treatment exists
  const existingTreatment = await prisma.treatment.findUnique({
    where: { id: treatmentId }
  });

  if (!existingTreatment) {
    res.status(404);
    throw new Error('Treatment not found');
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

  // Update the treatment
  const treatment = await prisma.treatment.update({
    where: { id: treatmentId },
    data: {
      scope,
      apiary_id,
      apply_to_all_hives,
      hive_id,
      name,
      disease,
      treatment_product,
      start_date: start_date ? new Date(start_date) : undefined,
      end_date: end_date ? new Date(end_date) : undefined,
      input_as,
      total_quantity,
      doses,
      notes
    },
    include: {
      apiary: true,
      hive: true
    }
  });

  SuccessResponse(res, { treatment, message: 'Treatment updated successfully' });
});

// Delete Treatment
export const deleteTreatment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    res.status(400);
    throw new Error('Valid treatment ID is required');
  }

  const treatmentId = parseInt(id);

  // Check if treatment exists
  const existingTreatment = await prisma.treatment.findUnique({
    where: { id: treatmentId }
  });

  if (!existingTreatment) {
    res.status(404);
    throw new Error('Treatment not found');
  }

  // Delete the treatment
  await prisma.treatment.delete({
    where: { id: treatmentId }
  });

  SuccessResponse(res, { message: 'Treatment deleted successfully' });
});
