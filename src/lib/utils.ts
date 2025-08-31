import type { ProducerConsumerNode } from "./recipes";

export function getOutputNameForNode(node: ProducerConsumerNode) {
  return node.output?.name ?? node.name;
}
