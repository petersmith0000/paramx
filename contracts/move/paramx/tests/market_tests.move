// #[test_only]
// module paramx::market_tests;

// use sui::test_scenario::{Self, next_tx, Scenario, TransactionEffects};
// use sui::coin::{Self, Coin};
// use sui::sui::SUI;
// use sui::clock::{Self, Clock};
// use volo_local::native_pool::{Self, NativePool};
// use volo_local::cert::{Self, Metadata, CERT};
// use paramx::yield_trading_protocol::{
//     Self, Vault, PTToken, YTToken,
//     mint_PT_YT, pt_maturity_ms, yt_maturity_ms, pt_amount, yt_amount
// };
// use paramx::market::{
//     Self, OfferOrderYT, OfferOrderPT, BidOrderYT, BidOrderPT,
//     limit_offer_yt, limit_offer_pt, limit_bid_yt, limit_bid_pt,
//     close_offer_yt, close_offer_pt, close_bid_yt, close_bid_pt,
//     OfferCreated, BidCreated, OrderClosed
// };
// use sui_system::sui_system::{SuiSystemState};
// use sui_system::governance_test_utils::{create_validator_for_testing, create_sui_system_state_for_testing};

// // Constants
// const ADMIN: address = @0x0;
// const USER1: address = @0x1; // PT/YT creator and offer maker
// const USER2: address = @0x2; // Bid maker and order closer
// const MIST_PER_SUI: u64 = 1_000_000_000;
// const TEST_AMOUNT: u64 = 100 * MIST_PER_SUI; // Amount of CERT to mint PT/YT
// const SUI_OFFER_AMOUNT: u64 = 10 * MIST_PER_SUI; // Amount of SUI for trading

// // Error codes from market.move
// const E_INSUFFICIENT_SUI: u64 = 101;
// const E_MATURITY_MISMATCH: u64 = 102;

// // Test setup: Initialize environment and mint PT/YT tokens
// fun setup_and_mint_pt_yt(scenario: &mut Scenario): u64 {
//     // Initialize dependencies
//     next_tx(scenario, ADMIN);
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

//     // USER1 stakes SUI to get CERT
//     next_tx(scenario, USER1);
//     {
//         let sui = coin::mint_for_testing<SUI>(TEST_AMOUNT, scenario.ctx());
//         let mut pool = test_scenario::take_shared<NativePool>(scenario);
//         let mut metadata = test_scenario::take_shared<Metadata<CERT>>(scenario);
//         let mut system_state = test_scenario::take_shared<SuiSystemState>(scenario);
//         native_pool::stake(&mut pool, &mut metadata, &mut system_state, sui, scenario.ctx());
//         test_scenario::return_shared(pool);
//         test_scenario::return_shared(metadata);
//         test_scenario::return_shared(system_state);
//     };

//     // USER1 mints PT and YT
//     let maturity_ms;
//     next_tx(scenario, USER1);
//     {
//         let mut clock = test_scenario::take_shared<Clock>(scenario);
//         let current_time = clock::timestamp_ms(&clock);
//         maturity_ms = current_time + 1000;
//         let cert_coin = test_scenario::take_from_sender<Coin<CERT>>(scenario);
//         let pool = test_scenario::take_shared<NativePool>(scenario);
//         let metadata = test_scenario::take_shared<Metadata<CERT>>(scenario);
//         mint_PT_YT(cert_coin, &pool, &metadata, maturity_ms, scenario.ctx());
//         test_scenario::return_shared(clock);
//         test_scenario::return_shared(pool);
//         test_scenario::return_shared(metadata);
//     };

//     maturity_ms
// }

// // Test 1: Create and close a YT offer order
// #[test]
// fun test_limit_offer_yt_and_close() {
//     let mut scenario = test_scenario::begin(ADMIN);
//     let maturity_ms = setup_and_mint_pt_yt(&mut scenario);

//     // USER1 creates a limit offer for YT
//     next_tx(&mut scenario, USER1);
//     {
//         let yt_token = test_scenario::take_from_sender<YTToken>(&scenario);
//         limit_offer_yt(yt_token, SUI_OFFER_AMOUNT, scenario.ctx());
//     };

//     // Verify OfferCreated event and order creation
//     next_tx(&mut scenario, USER1);
//     {
//         let offer = test_scenario::take_shared<OfferOrderYT>(&scenario);
//         assert!(offer.offer_yt_sui_amount() == SUI_OFFER_AMOUNT, 100);
//         assert!(offer.offer_yt_creator() == USER1, 101);
//         assert!(yt_maturity_ms(offer.offer_yt_token()) == maturity_ms, 102);
//         assert!(yt_amount(offer.offer_yt_token()) == TEST_AMOUNT, 103);
//         test_scenario::return_shared(offer);
//     };

//     // USER2 closes the offer
//     next_tx(&mut scenario, USER2);
//     {
//         let sui = coin::mint_for_testing<SUI>(SUI_OFFER_AMOUNT, scenario.ctx());
//         let offer = test_scenario::take_shared<OfferOrderYT>(&scenario);
//         close_offer_yt(offer, sui, scenario.ctx());
//     };

//     // Verify OrderClosed event and asset transfers
//     next_tx(&mut scenario, USER2);
//     {
//         let yt_token = test_scenario::take_from_sender<YTToken>(&scenario);
//         assert!(yt_maturity_ms(&yt_token) == maturity_ms, 104);
//         assert!(yt_amount(&yt_token) == TEST_AMOUNT, 105);
//         test_scenario::return_to_sender(&scenario, yt_token);
//     };

//     next_tx(&mut scenario, USER1);
//     {
//         let sui = test_scenario::take_from_sender<Coin<SUI>>(&scenario);
//         assert!(sui.value() == SUI_OFFER_AMOUNT, 106);
//         test_scenario::return_to_sender(&scenario, sui);
//     };

//     test_scenario::end(scenario);
// }

// // Test 2: Create and close a PT offer order
// #[test]
// fun test_limit_offer_pt_and_close() {
//     let mut scenario = test_scenario::begin(ADMIN);
//     let maturity_ms = setup_and_mint_pt_yt(&mut scenario);

//     // USER1 creates a limit offer for PT
//     next_tx(&mut scenario, USER1);
//     {
//         let pt_token = test_scenario::take_from_sender<PTToken>(&scenario);
//         limit_offer_pt(pt_token, SUI_OFFER_AMOUNT, scenario.ctx());
//     };

//     // Verify OfferCreated event and order creation
//     next_tx(&mut scenario, USER1);
//     {
//         let offer = test_scenario::take_shared<OfferOrderPT>(&scenario);
//         assert!(offer.offer_pt_sui_amount() == SUI_OFFER_AMOUNT, 200);
//         assert!(offer.offer_pt_creator() == USER1, 201);
//         assert!(pt_maturity_ms(offer.offer_pt_token()) == maturity_ms, 202);
//         assert!(pt_amount(offer.offer_pt_token()) == TEST_AMOUNT, 203);
//         test_scenario::return_shared(offer);
//     };

//     // USER2 closes the offer
//     next_tx(&mut scenario, USER2);
//     {
//         let sui = coin::mint_for_testing<SUI>(SUI_OFFER_AMOUNT, scenario.ctx());
//         let offer = test_scenario::take_shared<OfferOrderPT>(&scenario);
//         close_offer_pt(offer, sui, scenario.ctx());
//     };

//     // Verify OrderClosed event and asset transfers
//     next_tx(&mut scenario, USER2);
//     {
//         let pt_token = test_scenario::take_from_sender<PTToken>(&scenario);
//         assert!(pt_maturity_ms(&pt_token) == maturity_ms, 204);
//         assert!(pt_amount(&pt_token) == TEST_AMOUNT, 205);
//         test_scenario::return_to_sender(&scenario, pt_token);
//     };

//     next_tx(&mut scenario, USER1);
//     {
//         let sui = test_scenario::take_from_sender<Coin<SUI>>(&scenario);
//         assert!(sui.value() == SUI_OFFER_AMOUNT, 206);
//         test_scenario::return_to_sender(&scenario, sui);
//     };

//     test_scenario::end(scenario);
// }

// // Test 3: Create and close a YT bid order
// #[test]
// fun test_limit_bid_yt_and_close() {
//     let mut scenario = test_scenario::begin(ADMIN);
//     let maturity_ms = setup_and_mint_pt_yt(&mut scenario);

//     // USER2 creates a limit bid for YT
//     next_tx(&mut scenario, USER2);
//     {
//         let sui = coin::mint_for_testing<SUI>(SUI_OFFER_AMOUNT, scenario.ctx());
//         limit_bid_yt(sui, maturity_ms, scenario.ctx());
//     };

//     // Verify BidCreated event and order creation
//     next_tx(&mut scenario, USER2);
//     {
//         let bid = test_scenario::take_shared<BidOrderYT>(&scenario);
//         assert!(bid.bid_yt_sui_balance().value() == SUI_OFFER_AMOUNT, 300);
//         assert!(bid.bid_yt_maturity_ms() == maturity_ms, 301);
//         assert!(bid.bid_yt_creator() == USER2, 302);
//         test_scenario::return_shared(bid);
//     };

//     // USER1 closes the bid with YT
//     next_tx(&mut scenario, USER1);
//     {
//         let yt_token = test_scenario::take_from_sender<YTToken>(&scenario);
//         let bid = test_scenario::take_shared<BidOrderYT>(&scenario);
//         close_bid_yt(bid, yt_token, scenario.ctx());
//     };

//     // Verify OrderClosed event and asset transfers
//     next_tx(&mut scenario, USER1);
//     {
//         let sui = test_scenario::take_from_sender<Coin<SUI>>(&scenario);
//         assert!(sui.value() == SUI_OFFER_AMOUNT, 303);
//         test_scenario::return_to_sender(&scenario, sui);
//     };

//     next_tx(&mut scenario, USER2);
//     {
//         let yt_token = test_scenario::take_from_sender<YTToken>(&scenario);
//         assert!(yt_maturity_ms(&yt_token) == maturity_ms, 304);
//         assert!(yt_amount(&yt_token) == TEST_AMOUNT, 305);
//         test_scenario::return_to_sender(&scenario, yt_token);
//     };

//     test_scenario::end(scenario);
// }

// // Test 4: Create and close a PT bid order
// #[test]
// fun test_limit_bid_pt_and_close() {
//     let mut scenario = test_scenario::begin(ADMIN);
//     let maturity_ms = setup_and_mint_pt_yt(&mut scenario);

//     // USER2 creates a limit bid for PT
//     next_tx(&mut scenario, USER2);
//     {
//         let sui = coin::mint_for_testing<SUI>(SUI_OFFER_AMOUNT, scenario.ctx());
//         limit_bid_pt(sui, maturity_ms, scenario.ctx());
//     };

//     // Verify BidCreated event and order creation
//     next_tx(&mut scenario, USER2);
//     {
//         let bid = test_scenario::take_shared<BidOrderPT>(&scenario);
//         assert!(bid.bid_pt_sui_balance().value() == SUI_OFFER_AMOUNT, 400);
//         assert!(bid.bid_pt_maturity_ms() == maturity_ms, 401);
//         assert!(bid.bid_pt_creator() == USER2, 402);
//         test_scenario::return_shared(bid);
//     };

//     // USER1 closes the bid with PT
//     next_tx(&mut scenario, USER1);
//     {
//         let pt_token = test_scenario::take_from_sender<PTToken>(&scenario);
//         let bid = test_scenario::take_shared<BidOrderPT>(&scenario);
//         close_bid_pt(bid, pt_token, scenario.ctx());
//     };

//     // Verify OrderClosed event and asset transfers
//     next_tx(&mut scenario, USER1);
//     {
//         let sui = test_scenario::take_from_sender<Coin<SUI>>(&scenario);
//         assert!(sui.value() == SUI_OFFER_AMOUNT, 403);
//         test_scenario::return_to_sender(&scenario, sui);
//     };

//     next_tx(&mut scenario, USER2);
//     {
//         let pt_token = test_scenario::take_from_sender<PTToken>(&scenario);
//         assert!(pt_maturity_ms(&pt_token) == maturity_ms, 404);
//         assert!(pt_amount(&pt_token) == TEST_AMOUNT, 405);
//         test_scenario::return_to_sender(&scenario, pt_token);
//     };

//     test_scenario::end(scenario);
// }