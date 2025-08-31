import type { ResourceName } from "../contexts/CoreContext/CoreeContext";
import { v4 as uuidv4 } from "uuid";
import {
  BRICK_NODE_RECIPE,
  CHARCOAL_NODE_RECIPE,
  CLAY_NODE_RECIPE,
  DIRT_NODE_RECIPE,
  FARM_NODE_RECIPE,
  HOUSE_NODE_RECIPE,
  MUD_NODE_RECIPE,
  STONE_NODE_RECIPE,
  TOOL_NODE_RECIPE,
  WATER_NODE_RECIPE,
  WELL_NODE_RECIPE,
  WOOD_NODE_RECIPE,
  YURT_NODE_RECIPE,
  type ProducerConsumerNode,
} from "./recipes";

export function randomNodePosition() {
  return {
    x: Math.random() * 100,
    y: Math.random() * 100,
  };
}

// Create a central map of all recipes
export const NODE_RECIPES: Record<string, ProducerConsumerNode> = {
  dirt: DIRT_NODE_RECIPE,
  water: WATER_NODE_RECIPE,
  mud: MUD_NODE_RECIPE,
  wood: WOOD_NODE_RECIPE,
  yurt: YURT_NODE_RECIPE,
  stone: STONE_NODE_RECIPE,
  clay: CLAY_NODE_RECIPE,
  brick: BRICK_NODE_RECIPE,
  charcoal: CHARCOAL_NODE_RECIPE,
  tool: TOOL_NODE_RECIPE,
  house: HOUSE_NODE_RECIPE,
  farm: FARM_NODE_RECIPE,
  well: WELL_NODE_RECIPE,
};

// Then your function becomes tiny
export function createNewNode(resource: ResourceName) {
  const recipe = NODE_RECIPES[resource];
  if (!recipe) throw new Error(`Unknown resource: ${resource}`);

  return {
    data: { node: recipe },
    position: randomNodePosition(),
    id: uuidv4(),
    type: "dynamicNode",
  };
}
