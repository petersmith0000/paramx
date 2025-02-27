// #[test_only]
// module paramx::yield_trading_protocol_tests;

// use sui::test_scenario::{Self, next_tx};
// use sui::coin::{Self, Coin};
// use sui::sui::SUI;
// use sui::clock::{Self, Clock};
// use volo_local::native_pool::{Self, NativePool};
// use volo_local::cert::{Self, Metadata, CERT};
// use paramx::yield_trading_protocol::{
//     Self, Vault, PTToken, YTToken,
//     vault_locked_cert, vault_pt_cert, vault_yt_cert, vault_redeemed, vault_id,
//     pt_vault_id, pt_maturity_ms, pt_amount, pt_initial_ratio,
//     yt_vault_id, yt_maturity_ms, yt_amount, yt_initial_ratio
// };
// use sui_system::sui_system::{SuiSystemState};
// use sui_system::governance_test_utils::{create_validator_for_testing, create_sui_system_state_for_testing};

// // Constants
// const ADMIN: address = @0x0;
// const USER: address = @0x1;
// const USER2: address = @0x2; // Second user for YT holder
// const MIST_PER_SUI: u64 = 1_000_000_000;
// const TEST_AMOUNT: u64 = 100 * MIST_PER_SUI;

// // Test minting and redeeming with a ratio increase from 1 to 2 (single user)
// #[test]
// fun test_mint_and_redeem_with_ratio_increase() {
//     let mut scenario = test_scenario::begin(ADMIN);
//     {
//         let ctx = scenario.ctx();
//         cert::test_init(ctx);
//         native_pool::test_init(ctx);
//         let clock = clock::create_for_testing(ctx);
//         clock.share_for_testing();
//         create_sui_system_state_for_testing(
//             vector[create_validator_for_testing(@0xAB1, 100, ctx)],
//             100,
//             100,
//             ctx
//         );
//     };

//     // User stakes SUI to get CERT
//     next_tx(&mut scenario, USER);
//     {
//         let sui = coin::mint_for_testing<SUI>(TEST_AMOUNT, scenario.ctx());
//         let mut pool = test_scenario::take_shared<NativePool>(&scenario);
//         let mut metadata = test_scenario::take_shared<Metadata<CERT>>(&scenario);
//         let mut system_state = test_scenario::take_shared<SuiSystemState>(&scenario);
//         native_pool::stake(&mut pool, &mut metadata, &mut system_state, sui, scenario.ctx());
//         test_scenario::return_shared(pool);
//         test_scenario::return_shared(metadata);
//         test_scenario::return_shared(system_state);
//     };

//     // Verify CERT received
//     next_tx(&mut scenario, USER);
//     {
//         let cert_coin = scenario.take_from_sender<Coin<CERT>>();
//         assert!(cert_coin.balance().value() == TEST_AMOUNT, 100);
//         test_scenario::return_to_sender(&scenario, cert_coin);
//     };

//     // Mint PT and YT
//     let maturity_ms;
//     next_tx(&mut scenario, USER);
//     {
//         let mut clock = test_scenario::take_shared<Clock>(&scenario);
//         let current_time = clock::timestamp_ms(&clock);
//         maturity_ms = current_time + 1000;
//         let cert_coin = scenario.take_from_sender<Coin<CERT>>();
//         let pool = test_scenario::take_shared<NativePool>(&scenario);
//         let metadata = test_scenario::take_shared<Metadata<CERT>>(&scenario);
//         yield_trading_protocol::mint_PT_YT(cert_coin, &pool, &metadata, maturity_ms, scenario.ctx());
//         test_scenario::return_shared(clock);
//         test_scenario::return_shared(pool);
//         test_scenario::return_shared(metadata);
//     };

//     // Verify vault and tokens
//     next_tx(&mut scenario, USER);
//     {
//         let pt_token = scenario.take_from_sender<PTToken>();
//         let yt_token = scenario.take_from_sender<YTToken>();
//         let vault = test_scenario::take_shared<Vault>(&scenario);
//         assert!(*pt_vault_id(&pt_token) == *vault_id(&vault), 101);
//         assert!(*yt_vault_id(&yt_token) == *vault_id(&vault), 102);
//         assert!(pt_maturity_ms(&pt_token) == maturity_ms, 103);
//         assert!(yt_maturity_ms(&yt_token) == maturity_ms, 104);
//         assert!(pt_amount(&pt_token) == TEST_AMOUNT, 105);
//         assert!(yt_amount(&yt_token) == TEST_AMOUNT, 106);
//         assert!(pt_initial_ratio(&pt_token) == 1_000_000_000_000_000_000u256, 107);
//         assert!(yt_initial_ratio(&yt_token) == 1_000_000_000_000_000_000u256, 108);
//         assert!(vault_locked_cert(&vault) == TEST_AMOUNT, 109);
//         assert!(vault_pt_cert(&vault) == 0, 110);
//         assert!(vault_yt_cert(&vault) == 0, 111);
//         assert!(!vault_redeemed(&vault), 112);
//         test_scenario::return_to_sender(&scenario, pt_token);
//         test_scenario::return_to_sender(&scenario, yt_token);
//         test_scenario::return_shared(vault);
//     };

//     // Update ratio to 2
//     next_tx(&mut scenario, ADMIN);
//     {
//         let sui_for_ratio = coin::mint_for_testing<SUI>(TEST_AMOUNT, scenario.ctx());
//         let mut pool = test_scenario::take_shared<NativePool>(&scenario);
//         let metadata = test_scenario::take_shared<Metadata<CERT>>(&scenario);
//         native_pool::update_ratio(&mut pool, &metadata, 2_000_000_000_000_000_000u256, sui_for_ratio, scenario.ctx());
//         test_scenario::return_shared(pool);
//         test_scenario::return_shared(metadata);
//     };

//     // Verify ratio
//     next_tx(&mut scenario, ADMIN);
//     {
//         let pool = test_scenario::take_shared<NativePool>(&scenario);
//         let metadata = test_scenario::take_shared<Metadata<CERT>>(&scenario);
//         assert!(native_pool::get_ratio(&pool, &metadata) == 2_000_000_000_000_000_000u256, 113);
//         test_scenario::return_shared(pool);
//         test_scenario::return_shared(metadata);
//     };

//     // Advance clock past maturity
//     next_tx(&mut scenario, USER);
//     {
//         let mut clock = test_scenario::take_shared<Clock>(&scenario);
//         clock::set_for_testing(&mut clock, maturity_ms + 1);
//         test_scenario::return_shared(clock);
//     };

//     // Redeem PT
//     next_tx(&mut scenario, USER);
//     {
//         let pt_token = scenario.take_from_sender<PTToken>();
//         let mut vault = test_scenario::take_shared<Vault>(&scenario);
//         let pool = test_scenario::take_shared<NativePool>(&scenario);
//         let metadata = test_scenario::take_shared<Metadata<CERT>>(&scenario);
//         let clock = test_scenario::take_shared<Clock>(&scenario);
//         yield_trading_protocol::redeem_PT(pt_token, &mut vault, &pool, &metadata, &clock, scenario.ctx());
//         test_scenario::return_shared(vault);
//         test_scenario::return_shared(pool);
//         test_scenario::return_shared(metadata);
//         test_scenario::return_shared(clock);
//     };

//     // Verify PT payout: 100 * 1 / 2 = 50 CERT
//     next_tx(&mut scenario, USER);
//     {
//         let cert_coin = scenario.take_from_sender<Coin<CERT>>();
//         assert!(cert_coin.balance().value() == 50 * MIST_PER_SUI, 114);
//         test_scenario::return_to_sender(&scenario, cert_coin);
//     };

//     // Verify vault after PT redemption
//     next_tx(&mut scenario, USER);
//     {
//         let vault = test_scenario::take_shared<Vault>(&scenario);
//         assert!(vault_pt_cert(&vault) == 0, 115);
//         assert!(vault_yt_cert(&vault) == 50 * MIST_PER_SUI, 116);
//         assert!(vault_redeemed(&vault), 117);
//         test_scenario::return_shared(vault);
//     };

//     // Redeem YT
//     next_tx(&mut scenario, USER);
//     {
//         let yt_token = scenario.take_from_sender<YTToken>();
//         let mut vault = test_scenario::take_shared<Vault>(&scenario);
//         let pool = test_scenario::take_shared<NativePool>(&scenario);
//         let metadata = test_scenario::take_shared<Metadata<CERT>>(&scenario);
//         let clock = test_scenario::take_shared<Clock>(&scenario);
//         yield_trading_protocol::redeem_YT(yt_token, &mut vault, &pool, &metadata, &clock, scenario.ctx());
//         test_scenario::return_shared(vault);
//         test_scenario::return_shared(pool);
//         test_scenario::return_shared(metadata);
//         test_scenario::return_shared(clock);
//     };

//     // Verify YT payout: 100 - 50 = 50 CERT
//     next_tx(&mut scenario, USER);
//     {
//         let cert_coin = scenario.take_from_sender<Coin<CERT>>();
//         assert!(cert_coin.balance().value() == 50 * MIST_PER_SUI, 118);
//         test_scenario::return_to_sender(&scenario, cert_coin);
//     };

//     // Verify vault after YT redemption
//     next_tx(&mut scenario, USER);
//     {
//         let vault = test_scenario::take_shared<Vault>(&scenario);
//         assert!(vault_yt_cert(&vault) == 0, 119);
//         assert!(vault_pt_cert(&vault) == 0, 120);
//         test_scenario::return_shared(vault);
//     };

//     test_scenario::end(scenario);
// }

// // Test minting and redeeming with different PT and YT holders and ratio change
// #[test]
// fun test_mint_and_redeem_with_different_holders() {
//     let mut scenario = test_scenario::begin(ADMIN);
//     {
//         let ctx = scenario.ctx();
//         cert::test_init(ctx);
//         native_pool::test_init(ctx);
//         let clock = clock::create_for_testing(ctx);
//         clock.share_for_testing();
//         create_sui_system_state_for_testing(
//             vector[create_validator_for_testing(@0xAB1, 100, ctx)],
//             100,
//             100,
//             ctx
//         );
//     };

//     // USER stakes SUI to get CERT
//     next_tx(&mut scenario, USER);
//     {
//         let sui = coin::mint_for_testing<SUI>(TEST_AMOUNT, scenario.ctx());
//         let mut pool = test_scenario::take_shared<NativePool>(&scenario);
//         let mut metadata = test_scenario::take_shared<Metadata<CERT>>(&scenario);
//         let mut system_state = test_scenario::take_shared<SuiSystemState>(&scenario);
//         native_pool::stake(&mut pool, &mut metadata, &mut system_state, sui, scenario.ctx());
//         test_scenario::return_shared(pool);
//         test_scenario::return_shared(metadata);
//         test_scenario::return_shared(system_state);
//     };

//     // Verify CERT received by USER
//     next_tx(&mut scenario, USER);
//     {
//         let cert_coin = scenario.take_from_sender<Coin<CERT>>();
//         assert!(cert_coin.balance().value() == TEST_AMOUNT, 200);
//         test_scenario::return_to_sender(&scenario, cert_coin);
//     };

//     // USER mints PT and YT
//     let maturity_ms;
//     next_tx(&mut scenario, USER);
//     {
//         let mut clock = test_scenario::take_shared<Clock>(&scenario);
//         let current_time = clock::timestamp_ms(&clock);
//         maturity_ms = current_time + 1000;
//         let cert_coin = scenario.take_from_sender<Coin<CERT>>();
//         let pool = test_scenario::take_shared<NativePool>(&scenario);
//         let metadata = test_scenario::take_shared<Metadata<CERT>>(&scenario);
//         yield_trading_protocol::mint_PT_YT(cert_coin, &pool, &metadata, maturity_ms, scenario.ctx());
//         test_scenario::return_shared(clock);
//         test_scenario::return_shared(pool);
//         test_scenario::return_shared(metadata);
//     };

//     // USER transfers YT to USER2
//     next_tx(&mut scenario, USER);
//     {
//         let yt_token = scenario.take_from_sender<YTToken>();
//         transfer::public_transfer(yt_token, USER2);
//     };

//     // Verify PT (USER) and YT (USER2) ownership and vault state
//     next_tx(&mut scenario, USER);
//     {
//         let pt_token = scenario.take_from_sender<PTToken>();
//         let vault = test_scenario::take_shared<Vault>(&scenario);
//         assert!(*pt_vault_id(&pt_token) == *vault_id(&vault), 201);
//         assert!(pt_maturity_ms(&pt_token) == maturity_ms, 202);
//         assert!(pt_amount(&pt_token) == TEST_AMOUNT, 203);
//         assert!(pt_initial_ratio(&pt_token) == 1_000_000_000_000_000_000u256, 204);
//         assert!(vault_locked_cert(&vault) == TEST_AMOUNT, 205);
//         assert!(vault_pt_cert(&vault) == 0, 206);
//         assert!(vault_yt_cert(&vault) == 0, 207);
//         assert!(!vault_redeemed(&vault), 208);
//         test_scenario::return_to_sender(&scenario, pt_token);
//         test_scenario::return_shared(vault);
//     };
//     next_tx(&mut scenario, USER2);
//     {
//         let yt_token = scenario.take_from_sender<YTToken>();
//         let vault = test_scenario::take_shared<Vault>(&scenario);
//         assert!(*yt_vault_id(&yt_token) == *vault_id(&vault), 209);
//         assert!(yt_maturity_ms(&yt_token) == maturity_ms, 210);
//         assert!(yt_amount(&yt_token) == TEST_AMOUNT, 211);
//         assert!(yt_initial_ratio(&yt_token) == 1_000_000_000_000_000_000u256, 212);
//         test_scenario::return_to_sender(&scenario, yt_token);
//         test_scenario::return_shared(vault);
//     };

//     // Update ratio to 2 (requires 100 more SUI)
//     next_tx(&mut scenario, ADMIN);
//     {
//         let sui_for_ratio = coin::mint_for_testing<SUI>(TEST_AMOUNT, scenario.ctx());
//         let mut pool = test_scenario::take_shared<NativePool>(&scenario);
//         let metadata = test_scenario::take_shared<Metadata<CERT>>(&scenario);
//         native_pool::update_ratio(&mut pool, &metadata, 2_000_000_000_000_000_000u256, sui_for_ratio, scenario.ctx());
//         test_scenario::return_shared(pool);
//         test_scenario::return_shared(metadata);
//     };

//     // Verify ratio
//     next_tx(&mut scenario, ADMIN);
//     {
//         let pool = test_scenario::take_shared<NativePool>(&scenario);
//         let metadata = test_scenario::take_shared<Metadata<CERT>>(&scenario);
//         assert!(native_pool::get_ratio(&pool, &metadata) == 2_000_000_000_000_000_000u256, 213);
//         test_scenario::return_shared(pool);
//         test_scenario::return_shared(metadata);
//     };

//     // Advance clock past maturity
//     next_tx(&mut scenario, ADMIN);
//     {
//         let mut clock = test_scenario::take_shared<Clock>(&scenario);
//         clock::set_for_testing(&mut clock, maturity_ms + 1);
//         test_scenario::return_shared(clock);
//     };

//     // USER redeems PT
//     next_tx(&mut scenario, USER);
//     {
//         let pt_token = scenario.take_from_sender<PTToken>();
//         let mut vault = test_scenario::take_shared<Vault>(&scenario);
//         let pool = test_scenario::take_shared<NativePool>(&scenario);
//         let metadata = test_scenario::take_shared<Metadata<CERT>>(&scenario);
//         let clock = test_scenario::take_shared<Clock>(&scenario);
//         yield_trading_protocol::redeem_PT(pt_token, &mut vault, &pool, &metadata, &clock, scenario.ctx());
//         test_scenario::return_shared(vault);
//         test_scenario::return_shared(pool);
//         test_scenario::return_shared(metadata);
//         test_scenario::return_shared(clock);
//     };

//     // Verify PT payout for USER: 100 * 1 / 2 = 50 CERT
//     next_tx(&mut scenario, USER);
//     {
//         let cert_coin = scenario.take_from_sender<Coin<CERT>>();
//         assert!(cert_coin.balance().value() == 50 * MIST_PER_SUI, 214);
//         test_scenario::return_to_sender(&scenario, cert_coin);
//     };

//     // Verify vault after PT redemption
//     next_tx(&mut scenario, USER);
//     {
//         let vault = test_scenario::take_shared<Vault>(&scenario);
//         assert!(vault_pt_cert(&vault) == 0, 215);
//         assert!(vault_yt_cert(&vault) == 50 * MIST_PER_SUI, 216);
//         assert!(vault_redeemed(&vault), 217);
//         test_scenario::return_shared(vault);
//     };

//     // USER2 redeems YT
//     next_tx(&mut scenario, USER2);
//     {
//         let yt_token = scenario.take_from_sender<YTToken>();
//         let mut vault = test_scenario::take_shared<Vault>(&scenario);
//         let pool = test_scenario::take_shared<NativePool>(&scenario);
//         let metadata = test_scenario::take_shared<Metadata<CERT>>(&scenario);
//         let clock = test_scenario::take_shared<Clock>(&scenario);
//         yield_trading_protocol::redeem_YT(yt_token, &mut vault, &pool, &metadata, &clock, scenario.ctx());
//         test_scenario::return_shared(vault);
//         test_scenario::return_shared(pool);
//         test_scenario::return_shared(metadata);
//         test_scenario::return_shared(clock);
//     };

//     // Verify YT payout for USER2: 100 - 50 = 50 CERT
//     next_tx(&mut scenario, USER2);
//     {
//         let cert_coin = scenario.take_from_sender<Coin<CERT>>();
//         assert!(cert_coin.balance().value() == 50 * MIST_PER_SUI, 218);
//         test_scenario::return_to_sender(&scenario, cert_coin);
//     };

//     // Verify vault after YT redemption
//     next_tx(&mut scenario, USER2);
//     {
//         let vault = test_scenario::take_shared<Vault>(&scenario);
//         assert!(vault_yt_cert(&vault) == 0, 219);
//         assert!(vault_pt_cert(&vault) == 0, 220);
//         test_scenario::return_shared(vault);
//     };

//     test_scenario::end(scenario);
// }
