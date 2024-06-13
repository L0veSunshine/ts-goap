import { Planner } from './planner';
import { State } from './state';
import { Action, NewActionSet } from './action';

describe('GOAP planner test', () => {
  xit('basic', () => {
    const agent = new Planner();
    const start = new State(['a=1']);
    const end = new State(['a==3']);
    const actions = NewActionSet(
      new Action('plus1', 1, null, start.cloneAndExecute('a=a+1'))
    );
    const res = agent.plan(start, end, actions);
    expect(res.length).toBe(2);
  });
});