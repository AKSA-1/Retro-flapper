/**
 * @fileOverview Schemas and types for the game AI flows.
 *
 * - obstacleParamsSchema - The schema for obstacle parameters.
 * - ObstacleParams - The type for obstacle parameters.
 */
import { z } from 'zod';

export const obstacleParamsSchema = z.object({
  gapY: z.number().describe("The vertical position of the center of the gap, from the top of the screen."),
  gapSize: z.number().describe("The size of the gap between pipes."),
});

export type ObstacleParams = z.infer<typeof obstacleParamsSchema>;
