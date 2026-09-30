use near_api::types::{AccountId, NearToken};
use near_sdk::serde_json::json;

#[tokio::test]
async fn test_contract_is_operational() -> testresult::TestResult<()> {
    // Initialize the sandbox
    let sandbox = near_sandbox::Sandbox::start_sandbox().await?;
    let sandbox_network =
        near_api::NetworkConfig::from_rpc_url("sandbox", sandbox.rpc_addr.parse()?);

    // Build the contract
    let contract_wasm_path = cargo_near_build::build_with_cli(Default::default())?;
    let contract_wasm = std::fs::read(contract_wasm_path)?;

    // Create accounts
    let user_account = create_subaccount(&sandbox, "user.sandbox").await?;
    let contract = create_subaccount(&sandbox, "counter.sandbox")
        .await?
        .as_contract();

    // Initialize signer for the contract deployment
    let signer = near_api::Signer::from_secret_key(
        near_sandbox::config::DEFAULT_GENESIS_ACCOUNT_PRIVATE_KEY
            .parse()
            .unwrap(),
    )?;

    // Deploy the contract
    near_api::Contract::deploy(contract.account_id().clone())
        .use_code(contract_wasm)
        .without_init_call()
        .with_signer(signer.clone())
        .send_to(&sandbox_network)
        .await?
        .assert_success();

    // The counter starts at zero
    let counter_in_zero: i8 = contract
        .call_function("get_num", ())
        .read_only()
        .fetch_from(&sandbox_network)
        .await?
        .data;
    assert_eq!(counter_in_zero, 0);

    // Increment, decrement, and increment again
    contract
        .call_function("increment", json!({}))
        .transaction()
        .with_signer(user_account.account_id().clone(), signer.clone())
        .send_to(&sandbox_network)
        .await?
        .assert_success();

    contract
        .call_function("decrement", json!({}))
        .transaction()
        .with_signer(user_account.account_id().clone(), signer.clone())
        .send_to(&sandbox_network)
        .await?
        .assert_success();

    contract
        .call_function("increment", json!({}))
        .transaction()
        .with_signer(user_account.account_id().clone(), signer.clone())
        .send_to(&sandbox_network)
        .await?
        .assert_success();

    let counter_in_one: i8 = contract
        .call_function("get_num", ())
        .read_only()
        .fetch_from(&sandbox_network)
        .await?
        .data;
    assert_eq!(counter_in_one, 1);

    Ok(())
}

#[tokio::test]
async fn test_can_be_incremented_with_points() -> testresult::TestResult<()> {
    // Initialize the sandbox
    let sandbox = near_sandbox::Sandbox::start_sandbox().await?;
    let sandbox_network =
        near_api::NetworkConfig::from_rpc_url("sandbox", sandbox.rpc_addr.parse()?);

    // Build the contract
    let contract_wasm_path = cargo_near_build::build_with_cli(Default::default())?;
    let contract_wasm = std::fs::read(contract_wasm_path)?;

    // Create accounts
    let user_account = create_subaccount(&sandbox, "user.sandbox").await?;
    let contract = create_subaccount(&sandbox, "counter.sandbox")
        .await?
        .as_contract();

    // Initialize signer for the contract deployment
    let signer = near_api::Signer::from_secret_key(
        near_sandbox::config::DEFAULT_GENESIS_ACCOUNT_PRIVATE_KEY
            .parse()
            .unwrap(),
    )?;

    // Deploy the contract
    near_api::Contract::deploy(contract.account_id().clone())
        .use_code(contract_wasm)
        .without_init_call()
        .with_signer(signer.clone())
        .send_to(&sandbox_network)
        .await?
        .assert_success();

    // Increment by ten
    contract
        .call_function("increment", json!({ "number": 10 }))
        .transaction()
        .with_signer(user_account.account_id().clone(), signer.clone())
        .send_to(&sandbox_network)
        .await?
        .assert_success();

    let counter_in_ten: i8 = contract
        .call_function("get_num", ())
        .read_only()
        .fetch_from(&sandbox_network)
        .await?
        .data;
    assert_eq!(counter_in_ten, 10);

    Ok(())
}

#[tokio::test]
async fn test_can_be_decremented() -> testresult::TestResult<()> {
    // Initialize the sandbox
    let sandbox = near_sandbox::Sandbox::start_sandbox().await?;
    let sandbox_network =
        near_api::NetworkConfig::from_rpc_url("sandbox", sandbox.rpc_addr.parse()?);

    // Build the contract
    let contract_wasm_path = cargo_near_build::build_with_cli(Default::default())?;
    let contract_wasm = std::fs::read(contract_wasm_path)?;

    // Create accounts
    let user_account = create_subaccount(&sandbox, "user.sandbox").await?;
    let contract = create_subaccount(&sandbox, "counter.sandbox")
        .await?
        .as_contract();

    // Initialize signer for the contract deployment
    let signer = near_api::Signer::from_secret_key(
        near_sandbox::config::DEFAULT_GENESIS_ACCOUNT_PRIVATE_KEY
            .parse()
            .unwrap(),
    )?;

    // Deploy the contract
    near_api::Contract::deploy(contract.account_id().clone())
        .use_code(contract_wasm)
        .without_init_call()
        .with_signer(signer.clone())
        .send_to(&sandbox_network)
        .await?
        .assert_success();

    // Decrement twice
    contract
        .call_function("decrement", json!({}))
        .transaction()
        .with_signer(user_account.account_id().clone(), signer.clone())
        .send_to(&sandbox_network)
        .await?
        .assert_success();

    contract
        .call_function("decrement", json!({}))
        .transaction()
        .with_signer(user_account.account_id().clone(), signer.clone())
        .send_to(&sandbox_network)
        .await?
        .assert_success();

    let counter_in_minus_two: i8 = contract
        .call_function("get_num", ())
        .read_only()
        .fetch_from(&sandbox_network)
        .await?
        .data;
    assert_eq!(counter_in_minus_two, -2);

    Ok(())
}

#[tokio::test]
async fn test_can_be_reset() -> testresult::TestResult<()> {
    // Initialize the sandbox
    let sandbox = near_sandbox::Sandbox::start_sandbox().await?;
    let sandbox_network =
        near_api::NetworkConfig::from_rpc_url("sandbox", sandbox.rpc_addr.parse()?);

    // Build the contract
    let contract_wasm_path = cargo_near_build::build_with_cli(Default::default())?;
    let contract_wasm = std::fs::read(contract_wasm_path)?;

    // Create accounts
    let user_account = create_subaccount(&sandbox, "user.sandbox").await?;
    let contract = create_subaccount(&sandbox, "counter.sandbox")
        .await?
        .as_contract();

    // Initialize signer for the contract deployment
    let signer = near_api::Signer::from_secret_key(
        near_sandbox::config::DEFAULT_GENESIS_ACCOUNT_PRIVATE_KEY
            .parse()
            .unwrap(),
    )?;

    // Deploy the contract
    near_api::Contract::deploy(contract.account_id().clone())
        .use_code(contract_wasm)
        .without_init_call()
        .with_signer(signer.clone())
        .send_to(&sandbox_network)
        .await?
        .assert_success();

    // Increment and then reset
    contract
        .call_function("increment", json!({}))
        .transaction()
        .with_signer(user_account.account_id().clone(), signer.clone())
        .send_to(&sandbox_network)
        .await?
        .assert_success();

    contract
        .call_function("reset", json!({}))
        .transaction()
        .with_signer(user_account.account_id().clone(), signer.clone())
        .send_to(&sandbox_network)
        .await?
        .assert_success();

    let counter_reset: i8 = contract
        .call_function("get_num", ())
        .read_only()
        .fetch_from(&sandbox_network)
        .await?
        .data;
    assert_eq!(counter_reset, 0);

    Ok(())
}

async fn create_subaccount(
    sandbox: &near_sandbox::Sandbox,
    name: &str,
) -> testresult::TestResult<near_api::Account> {
    let account_id: AccountId = name.parse().unwrap();
    sandbox
        .create_account(account_id.clone())
        .initial_balance(NearToken::from_near(10))
        .send()
        .await?;
    Ok(near_api::Account(account_id))
}
