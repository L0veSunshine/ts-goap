/**
 *
 * @author Xuan
 * @since 2024/6/6 下午 11:21
 */
interface StateI {
}

type AssignExpression = `${string}=${number}`
  | `${string}="${string}"`
  | `${string}=True`
  | `${string}=False`

type BinaryCmpExpression =
  `${string}<${number}`
  | `${string}<=${number}`
  | `${string}==${number}`
  | `${string}>${number}`
  | `${string}>=${number}`

type BinaryOpExpression = `${string}=${string}-${string}` | `${string}=${string}+${string}`

type Expression = AssignExpression | BinaryCmpExpression | BinaryOpExpression

export class State implements StateI {
  private StateExp: Expression[];

  constructor(...initialState: Expression[]) {
    this.StateExp = initialState ?? [];
  }
}
