/**
 *
 * @author Xuan
 * @since 2024/6/13 上午 01:47
 */
import { State } from './state';

describe('State', () => {
  it('initial state', () => {
    const s = new State();
    s.execute('a=111', 'b=10', 'alive=true');
    expect(s.internal).toEqual({
      a: 111,
      b: 10,
      alive: true,
    });
    s.execute('a=a+1000', 'b=10', 'alive=true');
    expect(s.match('a>1100', 'a>=2')).toBe(true);
  });

  it('remove key', () => {
    const s = new State({ a: '123', b: 100 });
    s.removeKey('a');
    expect(s.internal).toEqual({ b: 100 });
    expect(s.match('b==100')).toBe(true);
  });
});
