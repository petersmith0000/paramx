// module paramx::yield_trading_protocol;

// use sui::balance::{Self, Balance};
// use sui::coin::{Self, Coin};
// use sui::pay;
// use sui::clock::Clock;
// use volo_local::cert::{Metadata, CERT};
// use volo_local::native_pool::{NativePool, get_ratio};

// ///
// /// Data Structures
// ///

// /// Vault holds the locked CERT coin until redemption.
// /// - Initially, the vault stores the entire locked CERT coin in `locked_cert`.
// /// - After splitting (via `ensure_split`), `locked_cert` is emptied, and the CERT is divided into
// ///   `pt_cert` (Principal Token portion) and `yt_cert` (Yield Token portion).
// public struct Vault has key, store {
//     id: UID,
//     locked_cert: Balance<CERT>,  // CERT balance before splitting
//     pt_cert: Balance<CERT>,      // Principal portion after splitting
//     yt_cert: Balance<CERT>,      // Yield portion after splitting
//     redeemed: bool,              // Tracks if the vault has been split
// }

// public struct PXToken has key, store {
//     id: UID,
//     vault_id: ID,                // References the associated Vault
//     maturity_ms: u64,            // Timestamp (ms) when the token can be redeemed
//     amount: u64,                 // Total CERT shares locked at mint
//     initial_ratio: u256,         // Ratio (r₀) at mint time from NativePool
//     token_type: u8, // 0 is PT 1 is YT
// }


// /// Principal Token (PT) - Represents the principal portion of the locked CERT.
// /// Redeemed for `total * r0 / r1` CERT at maturity.
// public struct PTToken has key, store {
//     id: UID,
//     vault_id: ID,                // References the associated Vault
//     maturity_ms: u64,            // Timestamp (ms) when the token can be redeemed
//     amount: u64,                 // Total CERT shares locked at mint
//     initial_ratio: u256,         // Ratio (r₀) at mint time from NativePool
// }

// /// Yield Token (YT) - Represents the yield portion of the locked CERT.
// /// Redeemed for `total - (total * r0 / r1)` CERT at maturity.
// public struct YTToken has key, store {
//     id: UID,
//     vault_id: ID,                // References the associated Vault
//     maturity_ms: u64,            // Timestamp (ms) when the token can be redeemed
//     amount: u64,                 // Total CERT shares locked at mint
//     initial_ratio: u256,         // Ratio (r₀) at mint time from NativePool
// }

// // Test-only accessors for struct fields to allow testing internal state
// #[test_only]
// public fun vault_locked_cert(vault: &Vault): u64 { vault.locked_cert.value() }
// #[test_only]
// public fun vault_pt_cert(vault: &Vault): u64 { vault.pt_cert.value() }
// #[test_only]
// public fun vault_yt_cert(vault: &Vault): u64 { vault.yt_cert.value() }
// #[test_only]
// public fun vault_redeemed(vault: &Vault): bool { vault.redeemed }
// #[test_only]
// public fun vault_id(vault: &Vault): &ID { vault.id.as_inner() }
// #[test_only]
// public fun pt_vault_id(pt: &PTToken): &ID { &pt.vault_id }
// #[test_only]
// public fun yt_vault_id(yt: &YTToken): &ID { &yt.vault_id }


// public fun pt_amount(pt: &PTToken): u64 { pt.amount }
// public fun yt_amount(yt: &YTToken): u64 { yt.amount }

// public fun pt_initial_ratio(pt: &PTToken): u256 { pt.initial_ratio }
// public fun yt_initial_ratio(yt: &YTToken): u256 { yt.initial_ratio }

// public fun pt_maturity_ms(pt: &PTToken): u64 { pt.maturity_ms }
// public fun yt_maturity_ms(yt: &YTToken): u64 { yt.maturity_ms }

// ///
// /// Helper Function
// ///

// /// Splits the locked CERT in the vault into PT and YT portions if not already split.
// /// - Uses the initial ratio (r₀) from mint and current ratio (r₁) from NativePool.
// /// - PT portion = total × r₀ / r₁ (principal adjusted by ratio change).
// /// - YT portion = total - PT portion (remaining yield).
// /// - Only executes if `redeemed` is false; otherwise, no-op.
// fun ensure_split(vault: &mut Vault, r0: u256, r1: u256) {
//     if (!vault.redeemed) {
//         let total = vault.locked_cert.value();
//         assert!(r1 > 0, 104); // Prevent division by zero
//         let pt_shares = ((total as u256 * r0) / r1) as u64;
//         // Fix: Ensure pt_shares doesn't exceed total (if r1 < r0)
//         let pt_shares = if (pt_shares > total) total else pt_shares; // Cap PT at total
//         let yt_shares = total - pt_shares;

//         let pt_cert = vault.locked_cert.split(pt_shares);
//         let yt_cert = vault.locked_cert.split(yt_shares);
//         vault.pt_cert.join(pt_cert);
//         vault.yt_cert.join(yt_cert);
//         vault.redeemed = true;
//     }
// }

// // Error codes
// const EMATURITY_NOT_REACHED: u64 = 100; // Redemption before maturity
// const EVAULT_MISMATCH: u64 = 102;       // Token vault_id doesn't match Vault

// ///
// /// Entry Functions
// ///

// /// Mints PT and YT tokens from a CERT coin.
// /// - Locks the CERT in a new shared Vault.
// /// - Records the current NativePool ratio (r₀) and CERT amount.
// /// - Creates PT and YT tokens with references to the Vault and transfers them to the sender.
// public entry fun mint_PT_YT(
//     cert: Coin<CERT>,
//     native_pool: &NativePool,
//     metadata: &Metadata<CERT>,
//     maturity_ms: u64,
//     ctx: &mut TxContext
// ) {
//     let initial_ratio = get_ratio(native_pool, metadata);
//     let amount = coin::value(&cert);
//     assert!(amount > 0, 105); // Prevent minting with zero CERT
    
//     // Create the vault and share it
//     let vault = Vault {
//         id: object::new(ctx),
//         locked_cert: cert.into_balance(),
//         pt_cert: balance::zero(),
//         yt_cert: balance::zero(),
//         redeemed: false
//     };
//     let vault_id = *object::uid_as_inner(&vault.id);

//     // Create PT and YT tokens
//     let pt_token = PTToken {
//         id: object::new(ctx),
//         vault_id,
//         maturity_ms,
//         amount,
//         initial_ratio,
//     };
//     let yt_token = YTToken {
//         id: object::new(ctx),
//         vault_id,
//         maturity_ms,
//         amount,
//         initial_ratio,
//     };

//     transfer::transfer(pt_token, tx_context::sender(ctx));
//     transfer::transfer(yt_token, tx_context::sender(ctx));
//     transfer::public_share_object(vault);
// }

// /// Redeems a PT token for the principal portion of the CERT.
// /// - Requires maturity time to be reached.
// /// - Splits the vault if not already split using r₀ and current r₁.
// /// - Transfers the PT portion to the sender and deletes the PT token.
// public entry fun redeem_PT(
//     pt: PTToken,
//     vault: &mut Vault,
//     native_pool: &NativePool,
//     metadata: &Metadata<CERT>,
//     clock: &Clock,
//     ctx: &mut TxContext
// ) {
//     let now = clock.timestamp_ms();
//     let PTToken { id, vault_id, maturity_ms, amount: _, initial_ratio } = pt;
//     assert!(now >= maturity_ms, EMATURITY_NOT_REACHED);
//     assert!(vault_id == *object::uid_as_inner(&vault.id), EVAULT_MISMATCH);

//     let r1 = get_ratio(native_pool, metadata);
//     ensure_split(vault, initial_ratio, r1);

//     let pt_coin = coin::from_balance(vault.pt_cert.withdraw_all(), ctx);
//     pay::keep(pt_coin, ctx);
//     object::delete(id);
// }

// /// Redeems a YT token for the yield portion of the CERT.
// /// - Requires maturity time to be reached.
// /// - Splits the vault if not already split using r₀ and current r₁.
// /// - Transfers the YT portion to the sender and deletes the YT token.
// public entry fun redeem_YT(
//     yt: YTToken,
//     vault: &mut Vault,
//     native_pool: &NativePool,
//     metadata: &Metadata<CERT>,
//     clock: &Clock,
//     ctx: &mut TxContext
// ) {
//     let now = clock.timestamp_ms();
//     let YTToken { id, vault_id, maturity_ms, amount: _, initial_ratio } = yt;
//     assert!(now >= maturity_ms, EMATURITY_NOT_REACHED);
//     assert!(vault_id == *object::uid_as_inner(&vault.id), EVAULT_MISMATCH);

//     let r1 = get_ratio(native_pool, metadata);
//     ensure_split(vault, initial_ratio, r1);

//     let yt_coin = coin::from_balance(vault.yt_cert.withdraw_all(), ctx);
//     pay::keep(yt_coin, ctx);
//     object::delete(id);
// }

// public entry fun split_PT(
//     token: PTToken,
//     amount_split: u64,
//     ctx: &mut TxContext
// ) {
//     let PTToken {id, vault_id, maturity_ms, amount, initial_ratio} = token;

//     let pt_token_amount = PTToken {
//         id: object::new(ctx),
//         vault_id,
//         maturity_ms,
//         amount: amount_split,
//         initial_ratio,
//     };

//     let pt_token_rest = PTToken {
//         id: object::new(ctx),
//         vault_id,
//         maturity_ms,
//         amount: amount - amount_split,
//         initial_ratio,
//     };

//     object::delete(id);

//     transfer::transfer(pt_token_amount, tx_context::sender(ctx));
//     transfer::transfer(pt_token_rest, tx_context::sender(ctx));
// }


// public entry fun split_YT(
//     token: YTToken,
//     amount_split: u64,
//     ctx: &mut TxContext
// ) {
//     let YTToken {id, vault_id, maturity_ms, amount, initial_ratio} = token;

//     let yt_token_amount = YTToken {
//         id: object::new(ctx),
//         vault_id,
//         maturity_ms,
//         amount: amount_split,
//         initial_ratio,
//     };

//     let yt_token_rest = YTToken {
//         id: object::new(ctx),
//         vault_id,
//         maturity_ms,
//         amount: amount - amount_split,
//         initial_ratio,
//     };

//     object::delete(id);

//     transfer::transfer(yt_token_amount, tx_context::sender(ctx));
//     transfer::transfer(yt_token_rest, tx_context::sender(ctx));
// }

