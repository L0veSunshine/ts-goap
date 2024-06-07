class Lexer {
  private pos: number
  private cur: Char
  private readonly expr: string

  constructor(expr: string) {
    this.expr = expr
    this.pos = 0
    this.cur = new Char()
  }

  advance(step: number = 1) {
    this.pos += step
    if (this.pos >= this.expr.length) {
      this.cur = new Char()
    } else {
      this.cur = new Char(this.expr[this.pos])
    }
  }

  peek(n: number = 1) {
    const peekPos = this.pos + n
    if (peekPos >= this.expr.length) {
      return new Char()
    } else {
      return new Char(this.expr[peekPos])
    }
  }
}

const SpaceCharCode = [9, 11, 12, 13, 32, 0x85, 0xA0]

class Char {
  private readonly charCode: number

  constructor(char?: string) {
    if (typeof char === 'string' && char.length === 1) {
      this.charCode = char.charCodeAt(0)
    } else {
      this.charCode = 0
    }
  }

  get code() {
    return this.charCode
  }

  isNull() {
    return this.charCode === 0
  }

  isDigital() {
    return 47 < this.charCode && this.charCode < 58
  }

  isAlpha() {
    return (64 < this.charCode && this.charCode < 91) ||
      (96 < this.charCode && this.charCode < 123) ||
      this.charCode === 95
  }

  isSpace() {
    return SpaceCharCode.includes(this.charCode);
  }
}