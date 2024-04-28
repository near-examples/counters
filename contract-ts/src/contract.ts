import { NearBindgen, near, call, view } from 'near-sdk-js'

@NearBindgen({})
class Counter {
  val: number = 0;
  acc: number = 0;

  @view({}) // Public read-only method: Returns the counter value.
  get_num(): number {
    return this.val
  }

  @view({}) // Public read-only method: Returns the counter value.
  get_acc(): number {
    return this.acc
  }

  @call({}) // Public method: Increment the counter.
  increment() {
    this.val += 1;
    this.acc += 1;
    near.log(`Increased number to ${this.val}`)
  }

  @call({}) // Public method: Decrement the counter.
  decrement() {
    this.val -= 1;
    this.acc += 1;
    near.log(`Decreased number to ${this.val}`)
  }

  @call({}) // Public method - Reset to zero.
  reset() {
    this.val = 0;
    this.acc += 1;
    near.log(`Reset counter to zero`)
  }
}