import { State } from './state';
import { AStartNode } from './internal/node';

/**
 *
 * @author Xuan
 * @since 2024/6/6 下午 11:20
 */
export class Action {
  public name: string;
  public cost: number;
  public condition: State | null;
  public outcome: State | ((current?: State) => State);
  public executor?: (current?: State) => void;

  constructor(name: string, cost: number, condition: State | null, outcome: State | ((current?: State) => State),
              executor?: (current?: State) => void) {
    this.name = name;
    this.cost = cost;
    this.condition = condition;
    this.outcome = outcome;
    this.executor = executor;
  }

  matchCondition(currentState: State): boolean {
    if (this.condition === null) {
      return true;
    }
    return currentState.match(this.condition);
  }

  effect(currentState: State): State {
    if (typeof this.outcome === 'function') {
      return this.outcome(currentState);
    }
    return this.outcome;
  }
}

export type ActionSet = {
  actions: Readonly<Action[]>
  add(action: Action): void
  remove(name: string): void
  getPossibleTrans(curNode: AStartNode, form: State, to: State): AStartNode[]
}

export function NewActionSet(...args: Action[]): ActionSet {
  const actions = args;

  const add = (action: Action): void => {
    actions.push(action);
  };

  const remove = (name: Action['name']): void => {
    const idx = actions.findIndex(a => a.name === name);
    if (idx >= 0) {
      actions.splice(idx, 1);
    }
  };

  const getPossibleTrans = (curNode: AStartNode, form: State, to: State): AStartNode[] => {
    const curState = curNode.curState;
    const neighbors: AStartNode[] = [];
    for (const action of actions) {
      if (action.matchCondition(curState)) {
        const nextState = action.effect(curState);
        neighbors.push(new AStartNode(nextState, to, curNode, curNode.cost + action.cost, action));
      }
    }
    return neighbors;
  };

  return {
    actions,
    add,
    remove,
    getPossibleTrans
  };
}