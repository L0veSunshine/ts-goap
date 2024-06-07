enum TokenType {
  Number,
  String,
  Boolean,

  Plus, // +
  Minus, // -
  Mul, // *
  Div, // /
  Mod, // //

  Eq, // ==
  NotEq, // !=
  LT, // <
  LTEq, // <=
  GT, // >
  GTEq // >=
}

type Token = {
  value: string
  type: TokenType
}

export function NewToken(value: string, type: TokenType): Token {
  return {type, value}
}