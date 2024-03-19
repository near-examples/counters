#[tokio::test]
async fn test_contract_is_operational() -> Result<(), Box<dyn std::error::Error>> {
    let sandbox = near_workspaces::sandbox().await?;
    let contract_wasm = near_workspaces::compile_project("./").await?;

    let contract = sandbox.dev_deploy(&contract_wasm).await?;

    let user_account = sandbox.dev_create_account().await?;

    let increment = user_account
        .call(contract.id(), "increment")
        .args_json({})
        .transact()
        .await?;

    assert!(increment.is_success());

    let _increment = user_account
        .call(contract.id(), "increment")
        .args_json({})
        .transact()
        .await?;

    let decrement = user_account
        .call(contract.id(), "decrement")
        .args_json({})
        .transact()
        .await?;

    assert!(decrement.is_success());

    let get_num_result = contract.view("get_num").args_json({}).await?;

    assert_eq!(get_num_result.json::<i8>()?, 1);

    let reset_result = user_account
        .call(contract.id(), "reset")
        .args_json({})
        .transact()
        .await?;

    assert!(reset_result.is_success());

    let get_reset_num = contract.view("get_num").args_json({}).await?;

    assert_eq!(get_reset_num.json::<i8>()?, 0);

    Ok(())
}
