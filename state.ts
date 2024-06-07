import { Env, Parser, StateEnv } from './utils/stateParser';
import { Lexer } from './utils/lexer';

/**
 *
 * @author Xuan
 * @since 2024/6/6 下午 11:21
 */
interface StateI {
}

export class State implements StateI {
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
}

const s = new State();
s.execute('a=111', 'b=10', 'alive=true');
s.execute('a=a+1000', 'b=10', 'alive=true');
console.log(s.isSatisfy('a>1100', 'a>=2'));
