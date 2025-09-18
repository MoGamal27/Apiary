import prisma from '../utils/prismaClient';
import asyncHandler from "express-async-handler";
import { SuccessResponse } from '../utils/response';
import { Request, Response } from 'express';
import { Iinspection } from '../interface/IInspection.interface';



export const createInspection = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    apiary_id,
    hive_id,
    inspection_date,
    inspection_time,
    strength,
    strength_category,
    temperament,
    supers_count,
    frames_count,
    notes,
    weight,
    weight_unit,
    include_weather,
    weather_conditions,
    temperature,
    queen,
    brood,
    conditions,
    frames,
    activities,
    problems,
    treatments
  }: Iinspection = req.body;

  // Validate required fields
  if (!apiary_id || !hive_id || !inspection_date) {
    res.status(400);
    throw new Error('Apiary ID, Hive ID, and inspection date are required');
  }

  // Check if apiary and hive exist and belong together
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

  // Create the main inspection record
  const inspection = await prisma.inspection.create({
    data: {
      name,
      apiary_id,
      hive_id,
      inspection_date: new Date(inspection_date),
      inspection_time,
      strength,
      strength_category: strength_category as any,
      temperament: temperament as any,
      supers_count,
      frames_count,
      notes,
      weight,
      weight_unit,
      include_weather,
      weather_conditions,
      temperature
    }
  });

  // Create related records if provided
  if (queen) {
    await prisma.inspectionQueen.create({
      data: {
        inspection_id: inspection.id,
        queen_seen: queen.queen_seen,
        queen_cells: queen.queen_cells as any,
        swarmed: queen.swarmed
      }
    });
  }

  if (brood) {
    await prisma.inspectionBrood.create({
      data: {
        inspection_id: inspection.id,
        eggs_present: brood.eggs_present,
        capped_brood: brood.capped_brood,
        uncapped_brood: brood.uncapped_brood,
        excessive_drones: brood.excessive_drones,
        laying_pattern: brood.laying_pattern as any,
        population_level: brood.population_level as any
      }
    });
  }

  if (conditions) {
    await prisma.inspectionConditions.create({
      data: {
        inspection_id: inspection.id,
        equipment_condition: conditions.equipment_condition as any,
        odor: conditions.odor as any,
        brace_comb: conditions.brace_comb,
        excessive_propolis: conditions.excessive_propolis,
        dead_bees: conditions.dead_bees,
        moisture: conditions.moisture,
        mold: conditions.mold
      }
    });
  }

  if (frames) {
    await prisma.inspectionFrames.create({
      data: {
        inspection_id: inspection.id,
        frames_bees: frames.frames_bees,
        frames_brood: frames.frames_brood,
        frames_honey: frames.frames_honey,
        frames_pollen: frames.frames_pollen,
        frames_foundation: frames.frames_foundation,
        honey_stores: frames.honey_stores as any,
        pollen_stores: frames.pollen_stores as any
      }
    });
  }

  if (activities) {
    await prisma.inspectionActivities.create({
      data: {
        inspection_id: inspection.id,
        bee_activity: activities.bee_activity as any,
        orientation_flights: activities.orientation_flights as any,
        pollen_arriving: activities.pollen_arriving as any,
        foraging_bees: activities.foraging_bees as any,
        bees_per_minute: activities.bees_per_minute
      }
    });
  }

  if (problems) {
    await prisma.inspectionProblems.create({
      data: {
        inspection_id: inspection.id,
        diseases: problems.diseases,
        pests: problems.pests,
        predation: problems.predation
      }
    });
  }

  if (treatments) {
    await prisma.inspectionTreatments.create({
      data: {
        inspection_id: inspection.id,
        treatments: treatments.treatments,
        varroa_drop_count: treatments.varroa_drop_count,
        actions_taken: treatments.actions_taken
      }
    });
  }

  // Update hive's colony info if provided
  if (strength !== undefined || strength_category !== undefined || temperament !== undefined || supers_count !== undefined || frames_count !== undefined) {
    await prisma.hiveColonyInfo.upsert({
      where: { hive_id },
      create: {
        hive_id,
        strength,
        strength_category,
        temperament,
        supers_count,
        frames_count
      },
      update: {
        strength,
        strength_category,
        temperament,
        supers_count,
        frames_count
      }
    });
  }

  SuccessResponse(res, { message: 'Inspection created successfully'}, 201);
});

export const getInspections = asyncHandler(async (req: Request, res: Response) => {
  
  const [inspections] = await Promise.all([
    prisma.inspection.findMany({
      orderBy: { inspection_date: 'desc' },
      include: {
        inspectionQueen: true, 
        inspectionBrood: true,
       inspectionConditions: true,
       inspectionFrames: true,
      inspectionActivities: true,
      inspectionProblems: true,
      inspectionTreatments: true,
        apiary: { select: { id: true, name: true } },
        hive: { select: { id: true, hive_identifier: true } }
      }
    })
  ]);

  SuccessResponse(res, {message: 'Inspections retrieved successfully', data: inspections}, 200);
});

export const getInspectionById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const inspection = await prisma.inspection.findUnique({
    where: { id: parseInt(id) },
    include: {
      inspectionQueen: true,
      inspectionBrood: true,
      inspectionConditions: true,
      inspectionFrames: true,
      inspectionActivities: true,
      inspectionProblems: true,
      inspectionTreatments: true,
      apiary: true,
      hive: true
    }
  });

  if (!inspection) {
    res.status(404);
    throw new Error('Inspection not found');
  }

  SuccessResponse(res, {message: 'Inspection retrieved successfully', data: inspection});
});


export const updateInspection = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    apiary_id,
    hive_id,
    inspection_date,
    inspection_time,
    strength,
    strength_category,
    temperament,
    supers_count,
    frames_count,
    notes,
    weight,
    weight_unit,
    include_weather,
    weather_conditions,
    temperature,
    queen,
    brood,
    conditions,
    frames,
    activities,
    problems,
    treatments
  }: Iinspection = req.body;

  // Validate inspection ID
  if (!id || isNaN(parseInt(id))) {
    res.status(400);
    throw new Error('Valid inspection ID is required');
  }

  const inspectionId = parseInt(id);

  // Check if inspection exists
  const existingInspection = await prisma.inspection.findUnique({
    where: { id: inspectionId }
  });

  if (!existingInspection) {
    res.status(404);
    throw new Error('Inspection not found');
  }

  // If hive_id or apiary_id are being updated, validate the relationship
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

  // Update the main inspection record
  const inspection = await prisma.inspection.update({
    where: { id: inspectionId },
    data: {
      name,
      apiary_id,
      hive_id,
      inspection_date: inspection_date ? new Date(inspection_date) : undefined,
      inspection_time,
      strength,
      strength_category: strength_category as any,
      temperament: temperament as any,
      supers_count,
      frames_count,
      notes,
      weight,
      weight_unit,
      include_weather,
      weather_conditions,
      temperature
    }
  });

  // Update or create related records if provided
  if (queen !== undefined) {
    await prisma.inspectionQueen.upsert({
      where: { inspection_id: inspectionId },
      create: {
        inspection_id: inspectionId,
        queen_seen: queen.queen_seen,
        queen_cells: queen.queen_cells as any,
        swarmed: queen.swarmed
      },
      update: {
        queen_seen: queen.queen_seen,
        queen_cells: queen.queen_cells as any,
        swarmed: queen.swarmed
      }
    });
  }

  if (brood !== undefined) {
    await prisma.inspectionBrood.upsert({
      where: { inspection_id: inspectionId },
      create: {
        inspection_id: inspectionId,
        eggs_present: brood.eggs_present,
        capped_brood: brood.capped_brood,
        uncapped_brood: brood.uncapped_brood,
        excessive_drones: brood.excessive_drones,
        laying_pattern: brood.laying_pattern as any,
        population_level: brood.population_level as any
      },
      update: {
        eggs_present: brood.eggs_present,
        capped_brood: brood.capped_brood,
        uncapped_brood: brood.uncapped_brood,
        excessive_drones: brood.excessive_drones,
        laying_pattern: brood.laying_pattern as any,
        population_level: brood.population_level as any
      }
    });
  }

  if (conditions !== undefined) {
    await prisma.inspectionConditions.upsert({
      where: { inspection_id: inspectionId },
      create: {
        inspection_id: inspectionId,
        equipment_condition: conditions.equipment_condition as any,
        odor: conditions.odor as any,
        brace_comb: conditions.brace_comb,
        excessive_propolis: conditions.excessive_propolis,
        dead_bees: conditions.dead_bees,
        moisture: conditions.moisture,
        mold: conditions.mold
      },
      update: {
        equipment_condition: conditions.equipment_condition as any,
        odor: conditions.odor as any,
        brace_comb: conditions.brace_comb,
        excessive_propolis: conditions.excessive_propolis,
        dead_bees: conditions.dead_bees,
        moisture: conditions.moisture,
        mold: conditions.mold
      }
    });
  }

  if (frames !== undefined) {
    await prisma.inspectionFrames.upsert({
      where: { inspection_id: inspectionId },
      create: {
        inspection_id: inspectionId,
        frames_bees: frames.frames_bees,
        frames_brood: frames.frames_brood,
        frames_honey: frames.frames_honey,
        frames_pollen: frames.frames_pollen,
        frames_foundation: frames.frames_foundation,
        honey_stores: frames.honey_stores as any,
        pollen_stores: frames.pollen_stores as any
      },
      update: {
        frames_bees: frames.frames_bees,
        frames_brood: frames.frames_brood,
        frames_honey: frames.frames_honey,
        frames_pollen: frames.frames_pollen,
        frames_foundation: frames.frames_foundation,
        honey_stores: frames.honey_stores as any,
        pollen_stores: frames.pollen_stores as any
      }
    });
  }

  if (activities !== undefined) {
    await prisma.inspectionActivities.upsert({
      where: { inspection_id: inspectionId },
      create: {
        inspection_id: inspectionId,
        bee_activity: activities.bee_activity as any,
        orientation_flights: activities.orientation_flights as any,
        pollen_arriving: activities.pollen_arriving as any,
        foraging_bees: activities.foraging_bees as any,
        bees_per_minute: activities.bees_per_minute
      },
      update: {
        bee_activity: activities.bee_activity as any,
        orientation_flights: activities.orientation_flights as any,
        pollen_arriving: activities.pollen_arriving as any,
        foraging_bees: activities.foraging_bees as any,
        bees_per_minute: activities.bees_per_minute
      }
    });
  }

  if (problems !== undefined) {
    await prisma.inspectionProblems.upsert({
      where: { inspection_id: inspectionId },
      create: {
        inspection_id: inspectionId,
        diseases: problems.diseases,
        pests: problems.pests,
        predation: problems.predation
      },
      update: {
        diseases: problems.diseases,
        pests: problems.pests,
        predation: problems.predation
      }
    });
  }

  if (treatments !== undefined) {
    await prisma.inspectionTreatments.upsert({
      where: { inspection_id: inspectionId },
      create: {
        inspection_id: inspectionId,
        treatments: treatments.treatments,
        varroa_drop_count: treatments.varroa_drop_count,
        actions_taken: treatments.actions_taken
      },
      update: {
        treatments: treatments.treatments,
        varroa_drop_count: treatments.varroa_drop_count,
        actions_taken: treatments.actions_taken
      }
    });
  }

  // Update hive's colony info if provided
  if (hive_id && (strength !== undefined || strength_category !== undefined || temperament !== undefined || supers_count !== undefined || frames_count !== undefined)) {
    await prisma.hiveColonyInfo.upsert({
      where: { hive_id: hive_id },
      create: {
        hive_id: hive_id,
        strength,
        strength_category,
        temperament,
        supers_count,
        frames_count
      },
      update: {
        strength,
        strength_category,
        temperament,
        supers_count,
        frames_count
      }
    });
  }

  SuccessResponse(res, { message: 'Inspection updated successfully' }, 200);
});

export const deleteInspection = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.inspection.delete({
    where: { id: parseInt(id) }
  });

  SuccessResponse(res, 'Inspection deleted successfully');
});