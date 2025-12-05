from near_sdk_py import Contract, call, view, init


class Counter(Contract):
    """
    A simple counter smart contract that stores an integer value
    and provides methods to increment, decrement, reset, and view it.
    """
    @init
    def initialize(self):
        """Initialize the contract with a counter value of 0."""
        self.storage["val"] = 0

    @view
    def get_num(self) -> int:
        """
        Public read-only method: Returns the counter value.
        
        Returns:
            int: The current counter value
        """
        return self.storage.get("val", 0)

    @call
    def increment(self, number: int = 1):
        """
        Public method: Increment the counter.
        
        Args:
            number (int): The amount to increment by (default: 1)
        """
        current_val = self.storage.get("val", 0)
        self.storage["val"] = current_val + number
        self.log_info(f"Increased number to {self.storage['val']}")

    @call
    def decrement(self, number: int = 1):
        """
        Public method: Decrement the counter.
        
        Args:
            number (int): The amount to decrement by (default: 1)
        """
        current_val = self.storage.get("val", 0)
        self.storage["val"] = current_val - number
        self.log_info(f"Decreased number to {self.storage['val']}")

    @call
    def reset(self):
        """Public method: Reset the counter to zero."""
        self.storage["val"] = 0
        self.log_info("Reset counter to zero")
