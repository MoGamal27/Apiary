import prisma from '../utils/prismaClient';
import asyncHandler from 'express-async-handler';
import { SuccessResponse } from '../utils/response';
import { Request, Response } from 'express';
import { NotFound } from '../Errors';
import { IHive } from '../interface/IHive.interface';

// Create hive
export const createHive = asyncHandler(async (req: Request, res: Response) => {
  const {
    apiary_id,
    status,
    hive_identifier,
    color,
    type,
    source,
    purpose,
    created_date,
    note,
    colony_info,
    queen_info
  }: IHive = req.body;

  // Create the main hive record
  const hive = await prisma.hive.create({
    data: {
      apiary_id: Number(apiary_id),
      status,
      hive_identifier,
      color,
      type: type as any,
      source,
      purpose: purpose as any,
      created_date: created_date ? new Date(created_date) : undefined,
      note,
    },
  });

  // Create colony info if provided
  if (colony_info) {
    await prisma.hiveColonyInfo.create({
      data: {
        hive_id: hive.id,
        strength: colony_info.strength,
        strength_category: colony_info.strength_category,
        temperament: colony_info.temperament,
        supers_count: colony_info.supers_count,
        frames_count: colony_info.frames_count,
      },
    });
  }

  // Create queen info if provided
  if (queen_info) {
    await prisma.hiveQueen.create({
      data: {
        hive_id: hive.id,
        has_queen: queen_info.has_queen,
        queen_status: queen_info.queen_status,
        queen_id: queen_info.queen_id,
        queen_hatched_year: queen_info.queen_hatched_year,
        queen_installed_date: queen_info.queen_installed_date ? new Date(queen_info.queen_installed_date) : undefined,
        queen_state: queen_info.queen_state,
        queen_race: queen_info.queen_race,
        queen_clipped: queen_info.queen_clipped,
        queen_marked: queen_info.queen_marked,
        queen_note: queen_info.queen_note,
        queen_origin: queen_info.queen_origin,
      },
    });
  }


  SuccessResponse(res, { message: 'Hive created successfully'}, 201);
});

// List hives
export const getHives = asyncHandler(async (req: Request, res: Response) => {
  const hives = await prisma.hive.findMany({
    orderBy: { createdAt: 'desc' },
     include: {
        hiveColonyInfo: true,
        hiveQueen: true,
      },
  });

  SuccessResponse(res, { message: 'Hives retrieved successfully', data: hives }, 200);
});

// Get hive by id
export const getHiveById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const hive = await prisma.hive.findUnique({ where: { id: Number(id) },  
      include: {
        hiveColonyInfo: true,
        hiveQueen: true,
      }, });

  SuccessResponse(res, { message: 'Hive retrieved successfully', data: hive }, 200);
});

// Update hive
export const updateHive = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    apiary_id,
    status,
    hive_identifier,
    color,
    type,
    source,
    purpose,
    created_date,
    note,
  }: Partial<IHive> = req.body;

  const existingHive = await prisma.hive.findUnique({ where: { id: Number(id) } });
  if (!existingHive) {
    res.status(404);
    throw new NotFound('Hive not found');
  }

  const hive = await (prisma as any).hive.update({
    where: { id: Number(id) },
    data: {
      apiary_id: apiary_id !== undefined ? Number(apiary_id) : undefined,
      status,
      hive_identifier,
      color,
      type: type as any,
      source,
      purpose: purpose as any,
      created_date: created_date === null ? null : created_date ? new Date(created_date) : undefined,
      note,
    },
  });

  SuccessResponse(res, { message: 'Hive updated successfully'}, 200);
});

// Delete hive
export const deleteHive = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const existingHive = await prisma.hive.findUnique({ where: { id: Number(id) } });
  if (!existingHive) {
    res.status(404);
    throw new NotFound('Hive not found');
  }

  await (prisma as any).hive.delete({ where: { id: Number(id) } });
  SuccessResponse(res, { message: 'Hive deleted successfully' }, 200);
});


