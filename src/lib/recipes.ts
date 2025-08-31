import type { ResourceName } from "../contexts/CoreContext/CoreeContext";

export type ProducerConsumerNode = {
  // conusmer
  input?: Partial<Record<ResourceName, number>>;

  // producer
  output?: {
    name: ResourceName;
    amount: number;
  };

  name: ResourceName;
  productionPerTick: number;
  level: number;
  type: "producer" | "consumer";
  time: number;
  sellCost: number;
  cost: number;

  population?: {
    capacity?: number; // how many people this node can house
    growth?: number; // how many people this node adds instantly
  };
};
export const DIRT_NODE_RECIPE: ProducerConsumerNode = {
  level: 1,
  name: "dirt",
  productionPerTick: 1,
  time: 1000,
  type: "producer",
  input: undefined,
  output: {
    name: "dirt",
    amount: 1,
  },
  sellCost: 1,
  cost: 5,
};

export const WATER_NODE_RECIPE: ProducerConsumerNode = {
  level: 1,
  name: "water",
  productionPerTick: 1,
  time: 1000,
  type: "producer",
  input: undefined,
  output: {
    name: "water",
    amount: 1,
  },
  sellCost: 1,
  cost: 5,
};

export const MUD_NODE_RECIPE: ProducerConsumerNode = {
  level: 1,
  name: "mud",
  productionPerTick: 2,
  time: 2000,
  type: "consumer",
  input: {
    dirt: 2,
    water: 1,
  },
  output: {
    name: "mud",
    amount: 1,
  },
  sellCost: 2,
  cost: 8,
};

export const WOOD_NODE_RECIPE: ProducerConsumerNode = {
  level: 1,
  name: "wood",
  productionPerTick: 2,
  time: 1000,
  type: "producer",
  input: undefined,
  output: {
    name: "wood",
    amount: 1,
  },
  sellCost: 2,
  cost: 10,
};

export const YURT_NODE_RECIPE: ProducerConsumerNode = {
  level: 1,
  name: "yurt",
  productionPerTick: 10,
  time: 5000,
  type: "consumer",
  input: {
    wood: 3,
    mud: 5,
    water: 1,
  },
  output: {
    name: "yurt",
    amount: 1,
  },
  sellCost: 20,
  cost: 50,
  population: {
    capacity: 5, // each yurt can house 5 people
  },
};
export const STONE_NODE_RECIPE: ProducerConsumerNode = {
  level: 1,
  name: "stone",
  productionPerTick: 1,
  time: 2000,
  type: "producer",
  input: undefined,
  output: {
    name: "stone",
    amount: 1,
  },
  sellCost: 2,
  cost: 10,
};

export const CLAY_NODE_RECIPE: ProducerConsumerNode = {
  level: 1,
  name: "clay",
  productionPerTick: 1,
  time: 3000,
  type: "consumer",
  input: {
    dirt: 3,
    water: 1,
  },
  output: {
    name: "clay",
    amount: 1,
  },
  sellCost: 3,
  cost: 12,
};

export const BRICK_NODE_RECIPE: ProducerConsumerNode = {
  level: 2,
  name: "brick",
  productionPerTick: 2,
  time: 4000,
  type: "consumer",
  input: {
    clay: 2,
    wood: 1,
  },
  output: {
    name: "brick",
    amount: 1,
  },
  sellCost: 6,
  cost: 25,
};

export const CHARCOAL_NODE_RECIPE: ProducerConsumerNode = {
  level: 2,
  name: "charcoal",
  productionPerTick: 2,
  time: 3000,
  type: "consumer",
  input: {
    wood: 3,
  },
  output: {
    name: "charcoal",
    amount: 1,
  },
  sellCost: 4,
  cost: 20,
};

export const TOOL_NODE_RECIPE: ProducerConsumerNode = {
  level: 2,
  name: "tool",
  productionPerTick: 5,
  time: 5000,
  type: "consumer",
  input: {
    wood: 2,
    stone: 2,
    charcoal: 1,
  },
  output: {
    name: "tool",
    amount: 1,
  },
  sellCost: 10,
  cost: 40,
};

export const HOUSE_NODE_RECIPE: ProducerConsumerNode = {
  level: 2,
  name: "house",
  productionPerTick: 20,
  time: 8000,
  type: "consumer",
  input: {
    wood: 5,
    brick: 4,
    mud: 2,
  },
  output: {
    name: "house",
    amount: 1,
  },
  sellCost: 50,
  cost: 150,
  population: {
    capacity: 10, // houses are bigger
  },
};

export const FARM_NODE_RECIPE: ProducerConsumerNode = {
  level: 1,
  name: "farm",
  productionPerTick: 3,
  time: 4000,
  type: "consumer",
  input: {
    dirt: 2,
    water: 2,
    tool: 1,
  },
  output: {
    name: "food",
    amount: 2,
  },
  sellCost: 5,
  cost: 30,
  population: {
    growth: 2, // each farm supports 2 new people
  },
};

export const WELL_NODE_RECIPE: ProducerConsumerNode = {
  level: 2,
  name: "well",
  productionPerTick: 5,
  time: 6000,
  type: "consumer",
  input: {
    stone: 4,
    wood: 2,
  },
  output: {
    name: "water",
    amount: 3,
  },
  sellCost: 4,
  cost: 35,
};
