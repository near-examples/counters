use near_api::{AccountId, NearToken};
use near_sdk::serde_json::json;

#[tokio::test]
async fn test_contract_is_operational() -> Result<(), Box<dyn std::error::Error>> {
    // let (user_account, contract, sandbox_network, signer) = prepare_test_environment().await?;

    // Build the contract wasm file
    let contract_wasm_path = cargo_near_build::build_with_cli(Default::default())?;
    let contract_wasm = std::fs::read(contract_wasm_path)?;

    // Initialize the sandbox
    let sandbox = near_sandbox::Sandbox::start_sandbox().await?;
    let sandbox_network =
        near_api::NetworkConfig::from_rpc_url("sandbox", sandbox.rpc_addr.parse()?);

    let user_account = create_subaccount(&sandbox, "user.sandbox").await.unwrap();
    let contract = create_subaccount(&sandbox, "contract.sandbox")
        .await
        .unwrap()
        .as_contract();

    let signer = near_api::Signer::from_secret_key(
        near_sandbox::config::DEFAULT_GENESIS_ACCOUNT_PRIVATE_KEY
            .parse()
            .unwrap(),
    )?;

    near_api::Contract::deploy(contract.account_id().clone())
        .use_code(contract_wasm)
        .without_init_call()
        .with_signer(signer.clone())
        .send_to(&sandbox_network)
        .await?
        .assert_success();

    // Test initial counter value
    let counter_value: i8 = contract
        .call_function("get_num", ())
        .read_only()
        .fetch_from(&sandbox_network)
        .await?
        .data;

    assert_eq!(counter_value, 0);

    // Test decrement by default value (1)
    contract
        .call_function("decrement", json!({}))
        .transaction()
        .with_signer(user_account.account_id().clone(), signer.clone())
        .send_to(&sandbox_network)
        .await?
        .assert_success();

    let counter_value: i8 = contract
        .call_function("get_num", ())
        .read_only()
        .fetch_from(&sandbox_network)
        .await?
        .data;

    assert_eq!(counter_value, -1);

    // Test increment by default value (1)
    contract
        .call_function("increment", json!({}))
        .transaction()
        .with_signer(user_account.account_id().clone(), signer.clone())
        .send_to(&sandbox_network)
        .await?
        .assert_success();

    let counter_value: i8 = contract
        .call_function("get_num", ())
        .read_only()
        .fetch_from(&sandbox_network)
        .await?
        .data;

    assert_eq!(counter_value, 0);

    // Test increment by specific value (10)
    contract
        .call_function("increment", json!({"number": 10}))
        .transaction()
        .with_signer(user_account.account_id().clone(), signer.clone())
        .send_to(&sandbox_network)
        .await?
        .assert_success();

    // Test decrement by specific value (5)
    contract
        .call_function("decrement", json!({"number": 5}))
        .transaction()
        .with_signer(user_account.account_id().clone(), signer.clone())
        .send_to(&sandbox_network)
        .await?
        .assert_success();

    let counter_value: i8 = contract
        .call_function("get_num", ())
        .read_only()
        .fetch_from(&sandbox_network)
        .await?
        .data;

    assert_eq!(counter_value, 5);

    // Test reset to zero
    contract
        .call_function("reset", ())
        .transaction()
        .with_signer(user_account.account_id().clone(), signer.clone())
        .send_to(&sandbox_network)
        .await?
        .assert_success();

    let counter_value: i8 = contract
        .call_function("get_num", ())
        .read_only()
        .fetch_from(&sandbox_network)
        .await?
        .data;

    assert_eq!(counter_value, 0);

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
