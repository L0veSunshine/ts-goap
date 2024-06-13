import { Env, Parser, StateEnv } from './internal/stateParser';
import { Lexer } from './internal/lexer';
import { AssignStatement, CompareStatement } from './internal/expression';

export type Rule = string

/**
 *
 * @author Xuan
 * @since 2024/6/6 下午 11:21
 */
export class State {
  private env: StateEnv;
  private conditions: CompareStatement[] = [];

  constructor(rules?: Rule[])
  constructor(State?: Env)
  constructor(rulesOrState?: Rule[] | Env) {
    if (typeof rulesOrState === 'object' && !Array.isArray(rulesOrState)) {
      this.env = new StateEnv(rulesOrState);
    } else if (rulesOrState) {
      this.env = new StateEnv();
      for (const rule of rulesOrState) {
        const l = new Lexer(rule);
        const p = new Parser(l);
        const stmt = p.parse();
        if (stmt instanceof CompareStatement) {
          this.conditions.push(stmt);
        } else if (stmt instanceof AssignStatement) {
          this.env.run(stmt);
        }
      }
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

  cloneAndExecute(...commands: string[]): State {
    const cloned = this.clone();
    cloned.execute(...commands);
    return cloned;
  }

  match(other: State): boolean {
    let matched: boolean = other.conditions.length > 0;
    for (const stmt of other.conditions) {
      matched = this.env.isSatisfy(stmt) && matched;
    }
    return matched;
  }

  containsAny(other: State): boolean {
    const keys = Object.keys(this.internal);
    return keys.some(key => other.internal[key] === this.internal[key]);
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