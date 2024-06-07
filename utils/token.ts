export enum TokenType {
  Number,
  String,
  Boolean,

  Identity,
  Assign,

  Plus, // +
  Minus, // -
  Mul, // *
  Div, // /

  Eq, // ==
  NotEq, // !=
  LT, // <
  LTEq, // <=
  GT, // >
  GTEq, // >=

  Null
}

export type Token = {
  value: string
  type: TokenType
}

export function NewToken(type: TokenType, value: string,): Token {
  return { type, value };
}