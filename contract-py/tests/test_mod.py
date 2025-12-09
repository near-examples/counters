from near_pytest.testing import NearTestCase
import json

class TestCounterContract(NearTestCase):
    """Test suite for the Counter contract."""

    @classmethod
    def setup_class(cls):
        """Set up the test environment once before all tests."""
        super().setup_class()

        # Compile the contract
        wasm_path = cls.compile_contract(
            "contract.py",
            single_file=True
        )

        # Deploy the contract
        cls.contract_account = cls.create_account("counter")
        cls.instance = cls.deploy_contract(cls.contract_account, wasm_path)

        # Initialize the contract
        result = cls.instance.call(
            method_name="initialize",
            args={}
        )

        # Create test user
        cls.user = cls.create_account("user")

        # Save state for future resets
        cls.save_state()

    def setup_method(self):
        """Reset to initial state before each test method."""
        self.reset_state()

    def test_initial_value(self):
        """Test that the counter starts at 0."""
        result = self.instance.call(
            method_name="get_num",
            args={}
        )
        assert int(result.value) == 0

    def test_increment_default(self):
        """Test incrementing the counter by default value (1)."""
        # Increment without arguments
        self.instance.call_as(
            account=self.user,
            method_name="increment",
            args={}
        )

        # Check the value
        result = self.instance.call(
            method_name="get_num",
            args={}
        )
        assert int(result.value) == 1

    def test_increment_with_number(self):
        """Test incrementing the counter by a specific number."""
        # Increment by 10
        self.instance.call_as(
            account=self.user,
            method_name="increment",
            args={"number": 10}
        )

        # Check the value
        result = self.instance.call(
            method_name="get_num",
            args={}
        )
        assert int(result.value) == 10

    def test_decrement_default(self):
        """Test decrementing the counter by default value (1)."""
        # Decrement without arguments
        self.instance.call_as(
            account=self.user,
            method_name="decrement",
            args={}
        )

        # Check the value
        result = self.instance.call(
            method_name="get_num",
            args={}
        )
        assert int(result.value) == -1

    def test_decrement_with_number(self):
        """Test decrementing the counter by a specific number."""
        # Decrement by 10
        self.instance.call_as(
            account=self.user,
            method_name="decrement",
            args={"number": 10}
        )

        # Check the value
        result = self.instance.call(
            method_name="get_num",
            args={}
        )
        assert int(result.value) == -10

    def test_increment_and_decrement(self):
        """Test a combination of increment and decrement operations."""
        # Increment by 5
        self.instance.call_as(
            account=self.user,
            method_name="increment",
            args={"number": 5}
        )

        # Decrement by 3
        self.instance.call_as(
            account=self.user,
            method_name="decrement",
            args={"number": 3}
        )

        # Check the value
        result = self.instance.call(
            method_name="get_num",
            args={}
        )
        assert int(result.value) == 2

    def test_reset(self):
        """Test resetting the counter to zero."""
        # Increment the counter
        self.instance.call_as(
            account=self.user,
            method_name="increment",
            args={"number": 42}
        )

        # Reset the counter
        self.instance.call_as(
            account=self.user,
            method_name="reset",
            args={}
        )

        # Check the value
        result = self.instance.call(
            method_name="get_num",
            args={}
        )
        assert int(result.value) == 0

    def test_multiple_increments(self):
        """Test multiple increment operations."""
        # Increment three times
        for i in range(3):
            self.instance.call_as(
                account=self.user,
                method_name="increment",
                args={"number": 1}
            )

        # Check the value
        result = self.instance.call(
            method_name="get_num",
            args={}
        )
        assert int(result.value) == 3

    def test_negative_values(self):
        """Test that the counter can handle negative values."""
        # Decrement by 50
        self.instance.call_as(
            account=self.user,
            method_name="decrement",
            args={"number": 50}
        )

        # Check the value
        result = self.instance.call(
            method_name="get_num",
            args={}
        )
        assert int(result.value) == -50

        # Increment by 25
        self.instance.call_as(
            account=self.user,
            method_name="increment",
            args={"number": 25}
        )

        # Check the value
        result = self.instance.call(
            method_name="get_num",
            args={}
        )
        assert int(result.value) == -25
