import { useCallback, useEffect, useMemo, useState } from "react";
import { useCoreContext } from "./contexts/CoreContext/CoreeContext";
import styles from "./App.module.scss";
import classNames from "classnames/bind";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  ReactFlow,
  useReactFlow,
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  type ReactFlowJsonObject,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  createNewNode,
  NODE_RECIPES,
  randomNodePosition,
} from "./lib/constants";
import { DynamicNode } from "./components/DynamicNode/DynamicNode";
import { DIRT_NODE_RECIPE, WATER_NODE_RECIPE } from "./lib/recipes";
const cx = classNames.bind(styles);

const initialNodes = [
  {
    id: "dirt-producer-1",
    position: randomNodePosition(),
    type: "dynamicNode",
    data: {
      node: DIRT_NODE_RECIPE,
    },
  },
  {
    id: "water-producer-1",
    position: randomNodePosition(),
    type: "dynamicNode",
    data: {
      node: WATER_NODE_RECIPE,
    },
  },
];
const initialEdges = [
  { id: "n1-n2-d", source: "dirt-producer-1", target: "dirt" },
  { id: "n1-n2-w", source: "water-producer-1", target: "water" },
];

const nodeTypes = {
  dynamicNode: DynamicNode,
};

function App() {
  const reactFlow = useReactFlow();
  const context = useCoreContext();
  const [loading, setLoading] = useState(true);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect: OnConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  useEffect(() => {
    const existingState = window.localStorage.getItem("idallic");
    context.loadState();

    if (existingState) {
      const parsed = JSON.parse(existingState) as ReactFlowJsonObject;
      setEdges(parsed.edges.length ? parsed.edges : initialEdges);
      setNodes(parsed.nodes.length ? parsed.nodes : initialNodes);
      reactFlow.setViewport(parsed.viewport);
    } else {
      setEdges(initialEdges);
      setNodes(initialNodes);
    }
    setLoading(false);

    setInterval(() => {
      context.consumeResourcesPerTick();
    }, 1000);
  }, []);

  if (loading) {
    return <h1>LOADING</h1>;
  }

  return (
    <div className={cx("mainWrapper")}>
      <SideBar />
      <div style={{ width: "100vw", height: "100vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background variant={BackgroundVariant.Dots} />
        </ReactFlow>
      </div>
    </div>
  );
}

const SideBar = () => {
  const coreContext = useCoreContext();
  const reactFlow = useReactFlow();
  const [sellIncrement, setSellIncrement] = useState(10);
  const [showSideBar, setShowSideBar] = useState(false);

  const m = useMemo(() => coreContext.resources, [coreContext.resources]);
  useEffect(() => {
    const id = setInterval(() => {
      console.log("saving...");
      window.localStorage.setItem(
        "idallic",
        JSON.stringify(reactFlow.toObject())
      );
      coreContext.saveState();
    }, 5000);

    return () => clearInterval(id);
  }, [reactFlow]);

  useEffect(() => {
    setTimeout(() => setShowSideBar(true));
  }, []);

  if (!showSideBar) return null;

  return (
    <div className={cx("sidebar")}>
      <button onClick={() => window.localStorage.removeItem("idallic")}>
        clear state
      </button>
      <p>coins @ {coreContext.coins}</p>
      <p>
        Population @ {coreContext.populationState.total} /{" "}
        {coreContext.populationState.capacity}
      </p>
      <p>Resources</p>
      <ul>
        {Object.entries(m).map(([name, amount]) => {
          return (
            <li key={name}>
              {name} | {amount}
            </li>
          );
        })}
      </ul>

      <p>Sell resource</p>
      <small>change increment</small>
      {[10, 20, 50, 100].map((value) => (
        <button key={value} onClick={() => setSellIncrement(value)}>
          {value} x
        </button>
      ))}
      <ul>
        {Object.entries(coreContext.resources).map(([name, amount]) => {
          const itemRecipe = NODE_RECIPES[name];
          if (!itemRecipe) return null;
          return (
            <li key={name}>
              <button
                onClick={() =>
                  coreContext.sell(name, sellIncrement, itemRecipe.sellCost)
                }
                disabled={amount < sellIncrement}
              >
                sell {sellIncrement} {name} for{" "}
                {itemRecipe.sellCost * sellIncrement}
              </button>
            </li>
          );
        })}
      </ul>

      <p>Buy Nodes</p>
      <ul>
        {Object.entries(NODE_RECIPES).map(([name, value]) => {
          const itemRecipe = value;

          return (
            <li key={name}>
              <button
                onClick={() => {
                  coreContext.buy(name, itemRecipe.cost);
                  reactFlow.addNodes(createNewNode(name));
                }}
                disabled={coreContext.coins < itemRecipe.cost}
              >
                buy {name} for {itemRecipe.cost}
              </button>
            </li>
          );
        })}
      </ul>

      <hr />
      <p>Recipes</p>
      {Object.entries(NODE_RECIPES).map(([name, value]) => {
        const itemRecipe = value;

        return (
          <div key={name} className={cx("recipeBlock")}>
            <p className={cx("recipeHeader")}>{itemRecipe.name}</p>
            {itemRecipe.input && (
              <p>
                input:{" "}
                {Object.entries(itemRecipe.input).map(([name, amount]) => (
                  <span key={name}>
                    {name}({amount}),
                  </span>
                ))}
              </p>
            )}
            {itemRecipe.output && (
              <p>
                output: {itemRecipe.output.name}({itemRecipe.output.amount})
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default App;
