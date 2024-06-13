/**
 *
 * @author Xuan
 * @since 2024/6/7 上午 03:15
 */
import { Token, TokenType } from './token';
import { Lexer } from './lexer';
import { AssignStatement, BinOpExpr, CompareStatement, NodeExpr, Statement } from './expression';

export class Parser {
  private readonly lexer: Lexer;
  private currentToken: Token;
  private peekToken: Token;

  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.currentToken = lexer.nextToken();
    this.peekToken = lexer.nextToken();
  }

  next() {
    this.currentToken = this.peekToken;
    this.peekToken = this.lexer.nextToken();
  }

  eat(...type: TokenType[]) {
    for (const t of type) {
      if (this.currentToken.type === t) {
        this.next();
        break;
      }
    }
  }

  parseAssignExpression(): Statement {
    const identity = this.currentToken;
    this.next();
    this.next(); // skip assign token
    if ([TokenType.String, TokenType.Number, TokenType.Boolean].includes(this.currentToken.type)) {
      const value = this.currentToken;
      this.next();
      return new AssignStatement(identity, new NodeExpr(value));
    } else if (this.currentToken.type === TokenType.Identity) {
      const id = this.currentToken;
      this.next();
      const op = this.currentToken;
      this.next();
      const value = this.currentToken;
      this.next();
      return new AssignStatement(identity, new BinOpExpr(id, op, value));
    }
    throw new Error('Unrecognized expression');
  }

  parse(): Statement {
    if (this.currentToken.type === TokenType.Identity) {
      switch (this.peekToken.type) {
        case TokenType.Assign:
          return this.parseAssignExpression();
        case TokenType.Eq:
        case TokenType.NotEq:
        case TokenType.LT:
        case TokenType.LTEq:
        case TokenType.GT:
        case TokenType.GTEq: {
          const id = this.currentToken;
          this.next();
          const op = this.currentToken;
          this.next();
          const value = this.currentToken;
          this.next();
          return new CompareStatement(id, op, value);
        }
        default:
          throw Error('Unrecognized expression');
      }
    } else {
      throw Error('Unrecognized expression');
    }
  }
}

export type Env = Record<string, string | number | boolean>

export class StateEnv {
  private env: Env = {};

  constructor(initEnv?: Env) {
    if (initEnv != null) {
      this.env = Object.assign({}, initEnv);
    }
  }

  get getEnv() {
    return this.env;
  }

  set setEnv(env: Env) {
    this.env = env;
  }

  run(statement: Statement) {
    if (statement instanceof AssignStatement) {
      const key = statement.id;
      const value = statement.value;
      if (value instanceof NodeExpr) {
        this.env[key.value] = value.realValue();
      } else if (value instanceof BinOpExpr) {
        const envValue = this.env[value.token.value];
        let opValue;
        if ([TokenType.Boolean, TokenType.Number, TokenType.String].includes(value.value.type)) {
          opValue = new NodeExpr(value.value).realValue();
        } else {
          if (!(value.value.value in this.env)) {
            throw new Error(`no variable ${value.value.value} in env`);
          } else {
            opValue = this.env[value.value.value];
          }
        }
        let newVariable: string | number | boolean;
        switch (value.op.value) {
          case '+':
            if (typeof envValue === 'number' && typeof opValue === 'number') {
              newVariable = envValue + opValue;
            } else if (typeof envValue === 'string' && typeof opValue === 'string') {
              newVariable = envValue + opValue;
            } else {
              console.warn(`illegal operate for ${envValue}${value.op.value}${opValue}`);
              newVariable = envValue;
            }
            break;
          case '-':
            if (typeof envValue === 'number' && typeof opValue === 'number') {
              newVariable = envValue - opValue;
            } else {
              console.warn(`illegal operate for ${envValue}${value.op.value}${opValue}`);
              newVariable = envValue;
            }
            break;
          case '*':
            if (typeof envValue === 'number' && typeof opValue === 'number') {
              newVariable = envValue * opValue;
            } else {
              console.warn(`illegal operate for ${envValue}${value.op.value}${opValue}`);
              newVariable = envValue;
            }
            break;
          case '/':
            if (typeof envValue === 'number' && typeof opValue === 'number') {
              newVariable = envValue / opValue;
            } else {
              console.warn(`illegal operate for ${envValue}${value.op.value}${opValue}`);
              newVariable = envValue;
            }
            break;
          default:
            throw new Error(`illegal operate`);
        }
        this.env[key.value] = newVariable;
      }
    }
  }


  isSatisfy(statement: Statement): boolean {
    if (statement instanceof CompareStatement) {
      const key = statement.id.value;
      if (!(key in this.env)) {
        return false;
      }
      const current = this.env[key];
      let wanted;
      if (statement.value.type === TokenType.Identity) {
        if (statement.value.value in this.env) {
          wanted = this.env[statement.value.value];
        } else {
          throw Error(`no var "${statement.value.value}" in env`);
        }
      } else {
        wanted = new NodeExpr(statement.value).realValue();
      }
      switch (statement.op.value) {
        case '==':
          if (typeof current === typeof wanted) {
            return current === wanted;
          } else {
            return false;
          }
        case '!=':
          if (typeof current !== typeof wanted) {
            return true;
          } else {
            return current !== wanted;
          }
        case '<':
          if (typeof current === 'number' && typeof wanted === 'number') {
            return current < wanted;
          } else {
            console.warn(`illegal compare for ${current}${statement.op.value}${wanted}`);
            return false;
          }
        case '<=':
          if (typeof current === 'number' && typeof wanted === 'number') {
            return current <= wanted;
          } else {
            console.warn(`illegal compare for ${current}${statement.op.value}${wanted}`);
            return false;
          }
        case '>=':
          if (typeof current === 'number' && typeof wanted === 'number') {
            return current >= wanted;
          } else {
            console.warn(`illegal compare for ${current}${statement.op.value}${wanted}`);
            return false;
          }
        case '>':
          if (typeof current === 'number' && typeof wanted === 'number') {
            return current > wanted;
          } else {
            console.warn(`illegal compare for ${current}${statement.op.value}${wanted}`);
            return false;
          }
        default:
          return false;
      }
    } else {
      throw new Error('need CompareStatement');
    }
  }
}
