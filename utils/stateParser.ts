/**
 *
 * @author Xuan
 * @since 2024/6/7 上午 03:15
 */

type BasicValueType = 'unknown' | 'string' | 'number' | 'boolean';

interface Token {
  variable: string;
  value: string;
  type: BasicValueType;
}

function parseAssignment(input: string): Token {
  let state = 'variable';
  let variable = '';
  let value: string | number = '';
  let type: BasicValueType = 'unknown';

  for (let char of input) {
    switch (state) {
      case 'variable':
        if (char === '=') {
          state = 'equals';
        } else if (char !== ' ') {
          variable += char;
        }
        break;
      case 'equals':
        if (char !== ' ') {
          state = 'value';
          if (char === 's') {
            state = 'str';
          } else {
            value += char;
          }
        }
        break;
      case 'str':
        if (char === '(') {
          state = 'string';
          type = 'string';
        }
        break;
      case 'string':
        if (char !== ')') {
          value += char;
        }
        break;
      case 'value':
        if (char !== ' ') {
          value += char;
        }
        break;
    }
  }

  if (type === 'unknown') {
    if (value === 'True' || value === 'False') {
      type = 'boolean';
    } else if (!isNaN(Number(value))) {
      type = 'number';
    }
  }

  return {
    variable: variable,
    value: value,
    type: type,
  };
}

// 测试解析器
const assignments = ['a=True', 'b=str(1)', 'c=100'];
assignments.forEach((assignment) => {
  console.log(parseAssignment(assignment));
});


