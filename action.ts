import { State } from './state';

/**
 *
 * @author Xuan
 * @since 2024/6/6 下午 11:20
 */
interface ActionI {
  name: string;
  cost: number;
}


export class Action implements ActionI {
  private readonly _name: string;
  private readonly _cost: number;
  private _condition: State;
  private _effects: State | ((current?: State) => State);
  private _executor?: (current?: State) => void;

  constructor(name: string, cost: number, condition: State, effects: State | ((current?: State) => State),
              executor?: (current?: State) => void) {
    this._name = name;
    this._cost = cost;
    this._condition = condition;
    this._effects = effects;
    this._executor = executor;
  }

  get name() {
    return this._name;
  }

  get cost() {
    return this._cost;
  }

}

export type ActionSet = {
  actions: Readonly<Action[]>
  add(action: Action): void
  remove(name: string): void
}

export function NewActionSet(...args: Action[]): ActionSet {
  const actions = args;

  const add = (action: Action): void => {
    actions.push(action);
  };

  const remove = (name: ActionI['name']): void => {
    const idx = actions.findIndex(a => a.name === name);
    if (idx >= 0) {
      actions.splice(idx, 1);
    }
  };
  return {
    actions,
    add,
    remove
  };
}