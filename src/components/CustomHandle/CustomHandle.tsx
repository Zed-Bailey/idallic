import {
  useNodeConnections,
  useNodesData,
  Handle,
  Position,
} from "@xyflow/react";
import { useEffect } from "react";
import styles from "./CustomHandle.module.scss";
import classNames from "classnames/bind";
import type { ProducerConsumerNode } from "../../lib/recipes";
const cx = classNames.bind(styles);

export function CustomHandle({
  id,
  label,
  onChange,
}: {
  id: string;
  label: string;
  onChange: (e: ProducerConsumerNode[]) => void;
}) {
  const connections = useNodeConnections({
    handleType: "target",
  });

  const nodeData = useNodesData(connections.map((c) => c.source));

  useEffect(() => {
    onChange(nodeData?.map((e) => e.data?.node) as ProducerConsumerNode[]);
  }, []);

  useEffect(() => {
    onChange(nodeData?.map((e) => e.data?.node) as ProducerConsumerNode[]);
  }, [nodeData]);

  return (
    <div className={cx(styles)}>
      <Handle
        type="target"
        position={Position.Top}
        id={id}
        className="handle"
      />
      <label htmlFor="red" className="label">
        {label}
      </label>
    </div>
  );
}
