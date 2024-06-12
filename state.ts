import { Env, Parser, StateEnv } from './internal/stateParser';
import { Lexer } from './internal/lexer';

/**
 *
 * @author Xuan
 * @since 2024/6/6 下午 11:21
 */
export class State {
  private env: StateEnv;

  constructor(initialState?: Env) {
    if (initialState) {
      this.env = new StateEnv(initialState);
    } else {
      this.env = new StateEnv();
    }
  }

  execute(...commands: string[]) {
    for (const command of commands) {
      const l = new Lexer(command);
      const p = new Parser(l);
      this.env.run(p.parse());
    }
  }

  isSatisfy(...conditions: string[]): boolean {
    let satisfied: boolean = conditions.length > 0;
    for (const condition of conditions) {
      const l = new Lexer(condition);
      const p = new Parser(l);
      satisfied = this.env.isSatisfy(p.parse()) && satisfied;
    }
    return satisfied;
  }

  get internal(): Env {
    return this.env.getEnv;
  }

  merge(data: Env) {
    this.env.setEnv = Object.assign({}, this.env.getEnv, data);
  }

  clear() {
    this.env.setEnv = {};
  }

  removeKey(key: string) {
    if (key in this.internal) {
      delete this.internal[key];
    }
  }

  clone(): State {
    return new State(this.internal);
  }
}