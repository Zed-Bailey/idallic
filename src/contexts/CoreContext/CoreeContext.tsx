import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ProducerConsumerNode } from "../../lib/recipes";
import { NODE_RECIPES } from "../../lib/constants";

const CoreContext = createContext<CoreContextType>(null);

type CoreContextType = ReturnType<typeof useCore> | null;

export type ResourceName = keyof typeof NODE_RECIPES;

export type Resource = {
  name: ResourceName;
  amount: number;
};

type LocalStorageSavedState = {
  populationState: PopulationState;
  resources: Record<ResourceName, number>;
  coins: number;
};

interface PopulationState {
  total: number;
  capacity: number;
  foodPerTick: number;
  waterPerTick: number;
}

function useCore() {
  const [resources, setResources] = useState<Record<ResourceName, number>>({});
  const [coins, setCoins] = useState(0);
  const [populationState, setPopulationState] = useState<PopulationState>({
    total: 0,
    capacity: 0,
    foodPerTick: 1,
    waterPerTick: 1,
  });
  const resourcesRef = useRef(resources);
  const populationStateRef = useRef(populationState);
  const coinsRef = useRef(coins);

  useEffect(() => {
    coinsRef.current = coins;
  }, [coins]);

  useEffect(() => {
    populationStateRef.current = populationState;
  }, [populationState]);

  useEffect(() => {
    resourcesRef.current = resources;
  }, [resources]);

  const getResourceAmount = (name: ResourceName) => {
    return resourcesRef.current[name] ?? 0;
  };

  const incrementResource = useCallback((node: ProducerConsumerNode) => {
    setResources((prev) => {
      const next = { ...prev };
      const { name, productionPerTick, level } = node;
      const amountToIncrement = level * productionPerTick;

      const item = prev[name];
      if (!item) {
        next[node.name] = amountToIncrement;
        return next;
      }

      next[name] = item + amountToIncrement;
      return next;
    });
  }, []);

  function handleStarvation(requiredFood: number, requiredWater: number) {
    let lost = 0;
    setResources((curr) => {
      const next = { ...curr };
      if (curr.food < requiredFood) {
        lost += requiredFood - curr.food;
        next.food = 0;
      }
      if (curr.water < requiredWater) {
        lost += requiredWater - curr.water;
        next.water = 0;
      }
      return next;
    });

    // Kill off people (1 per missing unit)
    setPopulationState((curr) => ({
      ...curr,
      total: Math.max(0, curr.total - lost),
    }));
    if (lost > 0) {
      console.warn(`Starvation! Lost ${lost} population.`);
    }
  }

  function consumeResourcesPerTick() {
    const requiredFood = populationState.total * populationState.foodPerTick;
    const requiredWater = populationState.total * populationState.waterPerTick;

    // Check if enough resources exist
    if (
      resourcesRef.current.food >= requiredFood &&
      resourcesRef.current.water >= requiredWater
    ) {
      // Consume them
      setResources((prev) => {
        const next = { ...prev };
        next.food -= requiredFood;
        next.water -= requiredWater;
        return next;
      });
    } else {
      // Not enough → starvation event
      handleStarvation(requiredFood, requiredWater);
    }
  }

  function saveState() {
    const state = {
      resources: resourcesRef.current,
      populationState: populationStateRef.current,
      coins: coinsRef.current,
    };

    window.localStorage.setItem("idallicstate", JSON.stringify(state));
  }

  function loadState() {
    const state = window.localStorage.getItem("idallicstate");
    if (state) {
      const parsedState = JSON.parse(state) as LocalStorageSavedState;
      setResources(parsedState.resources);
      setCoins(parsedState.coins);
      setPopulationState(parsedState.populationState);
    }
  }

  function purchaseLevelUpgrade(cost: number) {
    setCoins((p) => p - cost);
  }

  function addNodeToPopulation(node: ProducerConsumerNode) {
    setPopulationState((prev) => {
      const next = { ...prev };

      if (node.population?.growth) {
        next.total += node.population.growth;
      }

      if (node.population?.capacity) {
        next.capacity += node.population.capacity;
      }

      // Cap total at capacity
      if (next.total > next.capacity) {
        next.total = populationState.capacity;
      }
      return next;
    });
  }

  function createResource(
    requirements: Record<ResourceName, number>,
    amountToProduce: number,
    resourceToProduce: ResourceName,
    nodeName: ResourceName
  ) {
    setResources((prev) => {
      const next = { ...prev };
      // remove the requirements
      Object.entries(requirements).forEach(([item, required]) => {
        next[item] = next[item] - required;
      });
      next[resourceToProduce] =
        (next[resourceToProduce] ?? 0) + 1 * amountToProduce;

      return next;
    });
    if (NODE_RECIPES[nodeName].population) {
      addNodeToPopulation(NODE_RECIPES[nodeName]);
    }
  }

  function sell(name: ResourceName, amount: number, costPerUnit: number) {
    setResources((prev) => {
      const next = { ...prev };
      next[name] -= amount;
      return next;
    });
    setCoins((p) => p + costPerUnit * amount);
  }

  function buy(name: ResourceName, cost: number) {
    setCoins((p) => {
      return p - cost;
    });
  }

  return {
    resources,
    incrementResource,
    buy,
    sell,
    getResourceAmount,
    createResource,
    coins,
    purchaseLevelUpgrade,
    consumeResourcesPerTick,
    populationState,
    saveState,
    loadState,
  };
}

export const CoreContextProvider = ({ children }: React.PropsWithChildren) => {
  const core = useCore();
  return <CoreContext value={core}>{children}</CoreContext>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCoreContext = () => {
  const context = useContext(CoreContext);
  if (!context) {
    throw new Error("useCoreContext can only be used within a corecontext");
  }

  return context;
};
