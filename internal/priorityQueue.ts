/**
 *
 * @author Xuan
 * @since 2024/6/6 下午 11:24
 */

interface PriorityQueueI<T> {
  /**
   * Inserts the specified element into this priority queue.
   */
  push(value: T): void;

  /**
   * Returns true if this queue contains the specified element.
   */
  contains(value: T, comparator?: (item: T) => boolean): boolean;

  /**
   * Retrieves, but does not remove, the head of this queue, or returns null if this queue is empty.
   */
  top(): T | null;

  /**
   * Retrieves and removes the head of this queue, or returns null if this queue is empty.
   * Everytime pop element from queue, the queue is started "sift down" to rebuild the heap
   */
  pop(): T | null;

  /**
   * Returns the number of elements in this collection.
   */
  size(): number;

  /**
   * Checks whether the queue is empty.
   */
  empty(): boolean;

  /**
   * Removes all the elements from this priority queue.
   */
  clear(): void;

  /**
   * Returns an array containing all the elements in this queue.
   */
  toArray(): T[];
}

class PriorityQueue<T> implements PriorityQueueI <T> {
  private _queue: T[];
  private readonly _comparator: (item1: T, item2: T) => boolean = (item1, item2) => item1 > item2;

  constructor(comparator?: (item1: T, item2: T) => boolean) {
    this._queue = [];
    if (typeof comparator === 'function') {
      this._comparator = comparator;
    }
  }

  /**
   * Inserts the specified element into this priority queue.
   * Everytime adding new element to queue, the queue is started "sift up" to rebuild the heap
   * @param value
   */
  public push(value: T) {
    this._queue.push(value);
    let pos = this._queue.length - 1;

    while (
      pos !== 0 &&
      this._comparator(this._queue[this._parentOf(pos)], this._queue[pos])
      ) {
      this._swap(pos, this._parentOf(pos));
      pos = this._parentOf(pos);
    }
  }

  /**
   * Retrieves, but does not remove, the head of this queue, or returns null if this queue is empty.
   */
  public top() {
    return this._queue.length > 0 ? this._queue[0] : null;
  }

  /**
   * Retrieves and removes the head of this queue, or returns null if this queue is empty.
   * Everytime pop element from queue, the queue is started "sift down" to rebuild the heap
   */
  public pop() {
    if (this._queue.length === 0) {
      return null;
    }

    const item = this._queue[0];
    this._queue[0] = this._queue[this._queue.length - 1];
    this._swap(0, this._queue.length - 1);
    this._queue.pop();
    this._heapify(0);
    return item;
  }

  /**
   * Returns the number of elements in this collection.
   */
  public size() {
    return this._queue.length;
  }

  /**
   * Checks whether the queue is empty.
   */
  public empty() {
    return !this._queue.length;
  }

  /**
   * Returns an array containing all the elements in this queue.
   */
  public toArray() {
    return [...this._queue];
  }

  /**
   * Removes all the elements from this priority queue.
   */
  public clear() {
    this._queue = [];
  }

  /**
   * Returns true if this queue contains the specified element.
   * @param value
   * @param comparator
   */
  public contains(value: T, comparator?: (item: T) => boolean) {
    if (!this._queue.length) return false;

    const func = comparator || ((item: T): boolean => item === value);

    const mid = Math.floor(this._queue.length / 2);
    let childIndex1: number;
    let childIndex2: number;
    let index = 0;

    while (index <= mid - 1) {
      childIndex1 = 2 * index + 1;
      childIndex2 = 2 * index + 2;

      if (
        (this._queue[index] && func(this._queue[index])) ||
        (this._queue[childIndex1] && func(this._queue[childIndex1])) ||
        (this._queue[childIndex2] && func(this._queue[childIndex2]))
      ) {
        return true;
      }

      index++;
    }
    return false;
  }

  /**
   * Compare parent value and children value and swap them if conditions are satisfied
   * @param index
   */
  private _heapify(index: number) {
    const mid = Math.floor(this._queue.length / 2);
    let childIndex1: number;
    let childIndex2: number;
    let swapIndex: number;

    while (index <= mid - 1) {
      childIndex1 = 2 * index + 1;
      childIndex2 = 2 * index + 2;
      swapIndex = childIndex1;

      if (childIndex2 < this._queue.length && this._comparator(this._queue[childIndex1], this._queue[childIndex2])) {
        swapIndex = childIndex2;
      }

      if (this._comparator(this._queue[index], this._queue[swapIndex])) {
        this._swap(index, swapIndex);
      }

      index = swapIndex;
    }
  }

  /**
   * Swap 2 elements
   * @param index1
   * @param index2
   */
  private _swap(index1: number, index2: number) {
    const temp = this._queue[index1];
    this._queue[index1] = this._queue[index2];
    this._queue[index2] = temp;
  }

  /**
   * Get parent's index of the current element
   * @param position
   */
  private _parentOf(position: number) {
    return Math.floor((position - 1) / 2);
  }
}

export { PriorityQueue };