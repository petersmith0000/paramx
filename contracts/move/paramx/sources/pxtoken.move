// SPDX-License-Identifier: MIT
module paramx::pxtoken;

use sui::balance;
use sui::balance::Supply;
use sui::coin;
use sui::coin::Coin;
use sui::url;
use sui::url::Url;

// const VERSION: u64 = 1;
const DECIMALS: u8 = 9;

// public struct PXTOKEN has drop {}

// public struct Metadata<phantom T> has key, store {
//     id: UID,
//     version: u64,
//     total_supply: Supply<T>,
// }

// fun init(ctx: &mut TxContext) {
// }

// public entry fun createPair<T : drop>(otw: T, ctx: &mut TxContext){
//     let (treasury_cap, metadata) = coin::create_currency<T>(
//         otw, DECIMALS, b"vSUI LN", b"Volo Staked SUI (Localnet)",
//         b"(Localnet) Volo's SUI staking solution provides the best user experience and highest level of decentralization, security, combined with an attractive reward mechanism and instant staking liquidity through a bond-like synthetic token called voloSUI.",
//         option::some<Url>(url::new_unsafe_from_bytes(b"https://volo.fi/vSUI.png")),
//         ctx
//     );

// }

//     let (treasury_cap, metadata) = coin::create_currency<PXTOKEN>(
//         witness, DECIMALS, b"vSUI LN", b"Volo Staked SUI (Localnet)",
//         b"(Localnet) Volo's SUI staking solution provides the best user experience and highest level of decentralization, security, combined with an attractive reward mechanism and instant staking liquidity through a bond-like synthetic token called voloSUI.",
//         option::some<Url>(url::new_unsafe_from_bytes(b"https://volo.fi/vSUI.png")),
//         ctx
//     );
//     transfer::public_freeze_object(metadata);

//     let supply = coin::treasury_into_supply(treasury_cap);
//     transfer::share_object(Metadata<PXTOKEN> {
//             id: object::new(ctx),
//             version: VERSION,
//             total_supply: supply,
//     });
// }

/// Pool can mint and burn coins
// public(package) fun mint(
//     metadata: &mut Metadata<PXTOKEN>, shares: u64, ctx: &mut TxContext
// ): Coin<PXTOKEN> {
//     let minted_balance = balance::increase_supply(&mut metadata.total_supply, shares);
//     coin::from_balance(minted_balance, ctx)
// }

// public(package) fun burn(
//     metadata: &mut Metadata<PXTOKEN>, coin: Coin<PXTOKEN>
// ): u64 {
//     balance::decrease_supply(&mut metadata.total_supply, coin::into_balance(coin))
// }

// public(package) fun total_supply(
//     metadata: &Metadata<PXTOKEN>
// ): u64 {
//     balance::supply_value(&metadata.total_supply)
// }
