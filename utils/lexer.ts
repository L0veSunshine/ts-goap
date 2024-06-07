import { NewToken, Token, TokenType } from './token';

const Reserved: Record<string, TokenType> = {
  'true': TokenType.Boolean,
  'false': TokenType.Boolean
};

export class Lexer {
  private pos: number;
  private cur: Char;
  private readonly expr: string;

  constructor(expr: string) {
    this.expr = expr;
    this.pos = 0;
    this.cur = new Char(this.expr[this.pos]);
  }

  advance(step: number = 1) {
    this.pos += step;
    if (this.pos >= this.expr.length) {
      this.cur = new Char();
    } else {
      this.cur = new Char(this.expr[this.pos]);
    }
  }

  peek(n: number = 1) {
    const peekPos = this.pos + n;
    if (peekPos >= this.expr.length) {
      return new Char();
    } else {
      return new Char(this.expr[peekPos]);
    }
  }

  number(): Token {
    let num = '';
    while (!this.cur.isNull() && this.cur.isDigital()) {
      num += this.cur.charValue;
      this.advance();
    }
    if (this.cur.equal('.')) {
      num += this.cur.charValue;
      this.advance();
      while (!this.cur.isNull() && this.cur.isDigital()) {
        num += this.cur.charValue;
        this.advance();
      }
      return NewToken(TokenType.Number, num);
    }
    return NewToken(TokenType.Number, num);
  }

  string(lf: string = '\"'): Token {
    this.advance();
    let str = '';
    while (!this.cur.equal(lf) && !this.cur.isNull()) {
      str += this.cur.charValue;
      this.advance();
    }
    this.advance();
    return NewToken(TokenType.String, str);
  }

  id(): Token {
    let id = '';
    while (!this.cur.isNull() && !this.cur.isSpace() && (this.cur.isAlpha() || this.cur.isDigital())) {
      id += this.cur.charValue;
      this.advance();
    }
    if (id in Reserved) {
      return NewToken(Reserved[id], id);
    }
    return NewToken(TokenType.Identity, id);
  }

  skipWhiteSpace() {
    while (this.cur.isSpace() && !this.cur.isNull()) {
      this.advance();
    }
  }

  nextToken(): Token {
    while (!this.cur.isNull()) {
      this.skipWhiteSpace();
      if (this.cur.isAlpha()) {
        return this.id();
      } else if (this.cur.isDigital()) {
        return this.number();
      } else if (this.cur.equal('=')) {
        if (this.peek().equal('=')) {
          this.advance(2);
          return NewToken(TokenType.Eq, '==');
        }
        this.advance();
        return NewToken(TokenType.Assign, '=');
      } else if (this.cur.equal('!')) {
        if (this.peek().equal('=')) {
          this.advance(2);
          return NewToken(TokenType.NotEq, '!=');
        }
      } else if (this.cur.equal('<')) {
        if (this.peek().equal('=')) {
          this.advance(2);
          return NewToken(TokenType.LTEq, '<=');
        }
        this.advance();
        return NewToken(TokenType.LT, '<');
      } else if (this.cur.equal('>')) {
        if (this.peek().equal('=')) {
          this.advance(2);
          return NewToken(TokenType.GTEq, '>=');
        }
        this.advance();
        return NewToken(TokenType.GT, '>');
      } else if (this.cur.equal('+')) {
        this.advance();
        return NewToken(TokenType.Plus, '+');
      } else if (this.cur.equal('-')) {
        this.advance();
        return NewToken(TokenType.Minus, '-');
      } else if (this.cur.equal('*')) {
        this.advance();
        return NewToken(TokenType.Mul, '*');
      } else if (this.cur.equal('/')) {
        this.advance();
        return NewToken(TokenType.Div, '/');
      } else if (this.cur.equal('\"')) {
        return this.string(this.cur.charValue);
      }
    }
    return NewToken(TokenType.Null, '');
  }

  getTokens(): Token[] {
    const tokens: Token[] = [];
    let token = this.nextToken();
    while (token.type !== TokenType.Null) {
      tokens.push(token);
      token = this.nextToken();
    }
    return tokens;
  }
}

const SpaceCharCode = [9, 11, 12, 13, 32, 0x85, 0xA0];

class Char {
  private readonly charCode: number;
  private readonly char: string = '';

  constructor(char?: string) {
    if (typeof char === 'string' && char.length === 1) {
      this.char = char;
      this.charCode = char.charCodeAt(0);
    } else {
      this.charCode = 0;
    }
  }

  get code() {
    return this.charCode;
  }

  get charValue() {
    return this.char;
  }

  equal(str: string): boolean {
    return this.char === str;
  }

  isNull() {
    return this.charCode === 0;
  }

  isDigital() {
    return 47 < this.charCode && this.charCode < 58;
  }

  isAlpha() {
    return (64 < this.charCode && this.charCode < 91) ||
      (96 < this.charCode && this.charCode < 123) ||
      this.charCode === 95;
  }

  isSpace() {
    return SpaceCharCode.includes(this.charCode);
  }
}
