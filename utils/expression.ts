import { Token, TokenType } from './token';

/**
 *
 * @author Xuan
 * @since 2024/6/7 下午 10:28
 */
export interface Expression {
  string(): string;
}

export interface Statement {
  statement(): string;
}

export class BinOpExpr implements Expression {
  token: Token;
  op: Token;
  value: Token;

  constructor(token: Token, op: Token, value: Token) {
    this.token = token;
    this.op = op;
    this.value = value;
  }

  string(): string {
    return this.token.value + this.op.value + this.value.value;
  }
}

export class NodeExpr implements Expression {
  private token: Token;

  constructor(token: Token) {
    this.token = token;
  }

  realValue() {
    if (this.token.type === TokenType.Boolean) {
      return this.token.value === 'true';
    } else if (this.token.type === TokenType.Number) {
      return parseFloat(this.token.value);
    } else {
      return this.token.value;
    }
  }

  string(): string {
    return this.token.value;
  }
}

export class CompareStatement implements Statement {
  id: Token;
  op: Token;
  value: Token;

  constructor(identity: Token, op: Token, value: Token) {
    this.id = identity;
    this.op = op;
    this.value = value;
  }

  statement(): string {
    return this.id.value + this.op.value + this.value.value;
  }
}

export class AssignStatement implements Statement {
  id: Token;
  value: Expression;

  constructor(identity: Token, value: Expression) {
    this.id = identity;
    this.value = value;
  }

  statement(): string {
    return this.id.value + '=' + this.value.string();
  }
}

