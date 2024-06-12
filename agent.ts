import { State } from './state';
import { Action, ActionSet } from './action';
import { PriorityQueue } from './internal/priorityQueue';

/**
 *
 * @author Xuan
 * @since 2024/6/6 下午 11:21
 */
class Agent {
  private startState: State;
  private goalState: State;
  private action: ActionSet;
  private priorityQueue: PriorityQueue<Action>;

  constructor(start: State, goal: State, actionSet: ActionSet) {
    this.startState = start;
    this.goalState = goal;
    this.action = actionSet;
    this.priorityQueue = new PriorityQueue((a, b) => a.cost - b.cost > 0);
  }

  * getAction(): Generator<Action> {

  }
}