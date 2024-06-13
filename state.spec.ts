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
    const cond = new State(['a>1100', 'a>=20']);
    expect(s.match(cond)).toBe(true);
    const cond2 = new State(['a>1100', 'a>=20', 'b>20']);
    expect(s.match(cond2)).toBe(false);
  });

  it('remove key', () => {
    const s = new State({ a: '123', b: 100 });
    s.removeKey('a');
    expect(s.internal).toEqual({ b: 100 });
    const cond = new State(['b==100']);
    expect(s.match(cond)).toBe(true);
    const cond2 = new State(['b!=100']);
    expect(s.match(cond2)).toBe(false);
  });

  it('state compare', () => {
    const s1 = new State(['a=100', 'b=120']);
    const cond = new State(['a>=b']);
    expect(s1.match(cond)).toBe(false);
  });

  it('state contain', () => {
    const s1 = new State(['a=100', 'b=120']);
    const s2 = new State(['a=100']);
    const s3 = new State(['c=1']);
    expect(s2.containsAny(s1)).toBe(true);
    expect(s1.containsAny(s2)).toBe(true);
    expect(s1.containsAny(s3)).toBe(false);
    expect(s3.containsAny(s1)).toBe(false);
  });

  it('clone execute', () => {
    const s = new State(['a=100', 'v=true']);
    const copy = s.cloneAndExecute('a=a+1');
    expect(copy.match(new State(['a==101']))).toBe(true);
  });
});
