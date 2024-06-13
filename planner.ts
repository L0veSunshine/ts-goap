import { State } from './state';
import { Action, ActionSet } from './action';
import { PriorityQueue } from './internal/priorityQueue';
import { AStartNode } from './internal/node';

/**
 *
 * @author Xuan
 * @since 2024/6/6 下午 11:21
 */
export class Planner {
  private readonly openList: PriorityQueue<AStartNode>;
  private readonly closeList: PriorityQueue<AStartNode>;

  constructor() {
    this.openList = new PriorityQueue((a, b) => a.cost > b.cost);
    this.closeList = new PriorityQueue((a, b) => a.cost > b.cost);
  }

  plan(current: State, goal: State, actionSet: ActionSet): Action[] {
    this.openList.clear();
    this.closeList.clear();
    const startNode = new AStartNode(goal, current, null, 0, null);
    this.openList.push(startNode);
    while (!this.openList.empty()) {
      const node = this.openList.pop()!;
      this.closeList.push(node);
      const reachGoal = node.curState.match(goal);
      if (reachGoal) {
        return node.getPlan();
      }
      const neighbors = actionSet.getPossibleTrans(node, goal, current);
      for (const neighbor of neighbors) {
        // if (this.closeList.contains(neighbor)) {
        //   continue;
        // }
        this.openList.push(neighbor);
      }
    }
    return [];
  }
}