/**
 *
 * @author Xuan
 * @since 2024/6/13 上午 02:53
 */
import { State } from '../state';
import { Action } from '../action';

export class AStartNode {
  public parent: AStartNode | null;
  public curState: State;
  public goal: State;
  public cost: number;
  public action: Action | null;

  constructor(curState: State, goal: State, parent: AStartNode | null, cost: number, action: Action | null) {
    this.curState = curState;
    this.goal = goal;
    this.parent = parent;
    this.cost = cost;
    this.action = action;
  }

  getPlan(): Action[] {
    const actions: Action[] = [];
    let currentNode: AStartNode | null = this;
    while (currentNode !== null) {
      if (this.action) {
        actions.push(this.action);
        currentNode = currentNode.parent;
      }
    }
    return actions.reverse();
  }
}