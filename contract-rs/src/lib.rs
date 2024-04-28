// Find all our documentation at https://docs.near.org
use near_sdk::{log, near};

// Define the contract structure
#[near(contract_state)]
#[derive(Default)]
pub struct Counter {
    val: i8,
    acc: u64
}

// Implement the contract structure
#[near]
impl Counter {
    // Public read-only method: Returns the counter value.
    pub fn get_num(&self) -> i8 {
        return self.val;
    }

    // Public read-only method: Returns the counter value.
    pub fn get_acc(&self) -> u64 {
        return self.acc;
    }

    // Public method: Increment the counter.
    pub fn increment(&mut self) {
        self.val += 1;
        self.acc += 1;
        log!("Increased number to {}", self.val);
    }

    // Public method: Decrement the counter.
    pub fn decrement(&mut self) {
        self.val -= 1;
        self.acc += 1;
        log!("Decreased number to {}", self.val);
    }

    // Public method - Reset to zero.
    pub fn reset(&mut self) {
        self.val = 0;
        self.acc += 1;
        log!("Reset counter to zero");
    }
}

/*
 * The rest of this file holds the inline tests for the code above
 * to run these, the command will be: `cargo test`
 * Learn more about Rust tests: https://doc.rust-lang.org/book/ch11-01-writing-tests.html
 */
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn increment() {
        // instantiate a contract variable with the counter at zero
        let mut contract = Counter { val: 0 ,acc: 0 };
        contract.increment();
        assert_eq!(1, contract.get_num());
        assert_eq!(1, contract.get_acc());
    }

    #[test]
    fn decrement() {
        let mut contract = Counter { val: 0 ,acc: 0 };
        contract.decrement();
        assert_eq!(-1, contract.get_num());
        assert_eq!(1, contract.get_acc());
    }

    #[test]
    fn increment_and_reset() {
        let mut contract = Counter { val: 0 ,acc: 0 };
        contract.increment();
        contract.increment();
        contract.reset();
        assert_eq!(0, contract.get_num());
        assert_eq!(3, contract.get_acc());
    }


    #[test]
    fn decrement_and_reset() {
        let mut contract = Counter { val: 0 ,acc: 0 };
        contract.decrement();
        contract.decrement();
        contract.reset();
        assert_eq!(0, contract.get_num());
        assert_eq!(3, contract.get_acc());
    }

    #[test]
    #[should_panic]
    fn panics_on_overflow() {
        let mut contract = Counter { val: 127 ,acc: 0 };
        contract.increment();
    }

    #[test]
    #[should_panic]
    fn panics_on_underflow() {
        let mut contract = Counter { val: -128 ,acc: 0 };
        contract.decrement();
    }

    #[test]
    #[should_panic]
    fn panics_on_overflow_acc() {
        let mut contract = Counter { val: 0 ,acc: std::u64::MAX };
        contract.increment();
    }
    
}
