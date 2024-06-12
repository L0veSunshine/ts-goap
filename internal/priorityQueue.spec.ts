/**
 *
 * @author Xuan
 * @since 2024/6/13 上午 03:06
 */
import { PriorityQueue } from './priorityQueue';
import { Action } from '../action';

describe('Test Priority Queue', () => {
  it('basic test', () => {
    const queue = new PriorityQueue<number>();
    queue.push(3);
    queue.push(1);
    queue.push(5);
    expect(queue.pop()).toEqual(1);
    expect(queue.pop()).toEqual(3);
    expect(queue.pop()).toEqual(5);
    expect(queue.pop()).toBeNull();
  });

  it('test object', () => {
    const queue = new PriorityQueue<{ cost: number, name: string }>((a, b) => a.cost > b.cost);
    queue.push({ name: 'a', cost: 10 });
    queue.push({ name: 'b', cost: 1 });
    queue.push({ name: 'c', cost: 1000 });
    expect(queue.pop()).toEqual({ name: 'b', cost: 1 });
  });
});