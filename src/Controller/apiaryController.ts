import prisma from '../utils/prismaClient';
import asyncHandler from "express-async-handler";
import { SuccessResponse } from '../utils/response';
import { Request, Response } from 'express';
import { IApiary } from '../interface/IApiary.interface';
import { NotFound } from '../Errors';

export const createApiary = asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    forages,
    type,
    sun_exposure,
    description,
    address,
    zip,
    city,
    state,
    country,
    latitude,
    longitude
  }: IApiary = req.body;

  const apiary = await prisma.apiary.create({
    data: {
      name,
      forages,
      type,
      sun_exposure,
      description,
      address,
      zip,
      city,
      state,
      country,
      latitude,
      longitude
    }
  });

  SuccessResponse(res, {message:  'Apiary created successfully'}, 201);
});

export const getApiaries = asyncHandler(async (req: Request, res: Response) => {
  const apiaries = await prisma.apiary.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  SuccessResponse(res, {message: 'Apiaries retrieved successfully', data: apiaries }, 200);
});

export const getApiaryById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const apiary = await prisma.apiary.findUnique({
    where: {
      id: parseInt(id)
    }
  });

  SuccessResponse(res, {message: 'Apiary retrieved successfully', data: apiary}, 200);
});

export const updateApiary = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    name,
    forages,
    type,
    sun_exposure,
    description,
    address,
    zip,
    city,
    state,
    country,
    latitude,
    longitude
  }: Partial<IApiary> = req.body;

  // Check if apiary exists
  const existingApiary = await prisma.apiary.findUnique({
    where: { id: parseInt(id) }
  });

  const apiary = await prisma.apiary.update({
    where: {
      id: parseInt(id)
    },
    data: {
      name,
      forages,
      type,
      sun_exposure,
      description,
      address,
      zip,
      city,
      state,
      country,
      latitude,
      longitude
    }
  });

  SuccessResponse(res, {message: 'Apiary updated successfully', data: apiary}, 200);
});

export const deleteApiary = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if apiary exists
  const existingApiary = await prisma.apiary.findUnique({
    where: { id: parseInt(id) }
  });

  if (!existingApiary) {
    res.status(404);
    throw new NotFound('Apiary not found');
  }

  await prisma.apiary.delete({
    where: {
      id: parseInt(id)
    }
  });

  SuccessResponse(res, 'Apiary deleted successfully');
});

