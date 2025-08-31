import type { ProducerConsumerNode } from "../../lib/recipes";
import { useEffect, useState } from "react";
import { useCoreContext } from "../../contexts/CoreContext/CoreeContext";
import styles from "./DynamicNode.module.scss";
import classNames from "classnames/bind";
import {
  Handle,
  NodeToolbar,
  Position,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { CustomHandle } from "../CustomHandle/CustomHandle";
import { getOutputNameForNode } from "../../lib/utils";

const cx = classNames.bind(styles);

type DynamicNode = Node<{
  node: ProducerConsumerNode;
}>;

export const DynamicNode = (props: NodeProps<DynamicNode>) => {
  const context = useCoreContext();

  const [nodeData, setNodeData] = useState(props.data.node);

  const [consumerState, setConsumerState] = useState<{
    [key: string]: ProducerConsumerNode;
  }>({});

  const upgradeCost = nodeData.level * nodeData.productionPerTick;

  useEffect(() => {
    const id = setInterval(() => {
      const requirements = Object.entries(nodeData.input ?? {});
      const outputs = nodeData.output;
      const hasRequirements = requirements.length > 0;
      const hasOutputs = Boolean(outputs);

      if (hasRequirements) {
        // check we satisfy all the requirements
        const canMake = requirements.every(([item, amount]) => {
          const hasConnection = Boolean(consumerState[item]);

          const a = context.getResourceAmount(item);

          if (amount == null) {
            console.log("amount was undefined");
            return false;
          }

          return a >= amount && hasConnection;
        });

        if (canMake) {
          context.createResource(
            Object.fromEntries(requirements) as Record<string, number>,
            nodeData.productionPerTick * nodeData.level,
            getOutputNameForNode(nodeData),
            nodeData.name
          );
        }
      } else if (hasOutputs) {
        context.incrementResource(nodeData);
      }
    }, nodeData.time);

    return () => clearInterval(id);
  }, [consumerState, nodeData]);

  const onUpgradeClick = () => {
    context.purchaseLevelUpgrade(upgradeCost);
    setNodeData((prev) => ({
      ...prev,
      level: prev.level + 1,
    }));
  };

  return (
    <div className={cx("dynamicNode")}>
      <NodeToolbar position={Position.Top}>
        <button onClick={onUpgradeClick} disabled={context.coins < upgradeCost}>
          upgrade to lvl {nodeData.level + 1} for ${upgradeCost}
        </button>
      </NodeToolbar>
      <div className={cx("inputs")}>
        {nodeData.input &&
          Object.entries(nodeData.input).map((input) => {
            return (
              <CustomHandle
                id={input[0]}
                key={input[0]}
                label={input[0]}
                onChange={(e: ProducerConsumerNode[]) => {
                  setConsumerState(
                    Object.fromEntries(
                      e.map((item) => {
                        return [getOutputNameForNode(item), item];
                      })
                    )
                  );
                }}
              />
            );
          })}
      </div>

      {nodeData.name}
      <small>
        lvl {nodeData.level} | {nodeData.productionPerTick * nodeData.level}ppt
      </small>

      <div className={cx("outputs")}>
        {nodeData.output &&
          Object.entries(nodeData.output).map(([item]) => {
            return (
              <Handle
                position={Position.Bottom}
                id={props.id + item}
                type="source"
                key={props.id + item}
              />
            );
          })}
      </div>
    </div>
  );
};
