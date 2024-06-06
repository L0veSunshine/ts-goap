/**
 *
 * @author Xuan
 * @since 2024/6/6 下午 11:21
 */
interface StateI {
}

type Expression = `${string}=${number}`
  | `${string}=str(${string})`
  | `${string}=True`
  | `${string}=False`

export class State implements StateI {
  private StateExp: Expression[];

  constructor(...initialState: Expression[]) {
    this.StateExp = initialState ?? [];
  }
}

let a = new State('a=True', 'b=str(1)','c=100');