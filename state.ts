/**
 *
 * @author Xuan
 * @since 2024/6/6 下午 11:21
 */
interface StateI {
}

type StateValue = string | number | boolean;
type StateStore = Record<string, StateValue>

export class State implements StateI {
  private store: StateStore;

  constructor(initialState?: Record<string, StateValue>) {
    this.store = initialState ?? {};
  }
}