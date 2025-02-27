// SPDX-License-Identifier: MIT
module volo_local::native_pool;

use volo_local::cert::{Metadata, CERT, mint, burn, total_supply};
use sui::coin::{Self, Coin};
use sui::sui::SUI;
use sui_system::sui_system::SuiSystemState;

#[allow(lint(coin_field))]
public struct NativePool has key {
    id: UID,
    staked: Coin<SUI>,
    ratio: u256,
}

const EInsufficientSui: u64 = 1;

fun init(ctx: &mut TxContext) {
    transfer::share_object(NativePool {
        id: object::new(ctx),
        staked: coin::zero<SUI>(ctx),
        ratio: 1_000_000_000_000_000_000u256,
    });
}

public entry fun stake(
    self: &mut NativePool,
    metadata: &mut Metadata<CERT>,
    _wrapper: &mut SuiSystemState,
    coin: Coin<SUI>,
    ctx: &mut TxContext
) {
    let amount = coin::value(&coin) as u256;
    let shares = (amount * 1_000_000_000_000_000_000u256) / self.ratio;
    
    coin::join(&mut self.staked, coin);
    let cert = mint(metadata, (shares as u64), ctx);
    transfer::public_transfer(cert, tx_context::sender(ctx));
}

public entry fun unstake(
    self: &mut NativePool,
    metadata: &mut Metadata<CERT>,
    _wrapper: &SuiSystemState,
    cert: Coin<CERT>,
    ctx: &mut TxContext
) {
    let shares = coin::value(&cert) as u256;
    burn(metadata, cert);
    let amount = (shares * self.ratio) / 1_000_000_000_000_000_000u256;
    let coin = coin::split(&mut self.staked, (amount as u64), ctx);
    transfer::public_transfer(coin, tx_context::sender(ctx));
}

public entry fun update_ratio(
    self: &mut NativePool,
    metadata: &Metadata<CERT>,
    new_ratio: u256,
    mut sui_coin: Coin<SUI>,
    ctx: &mut TxContext
) {
    let total_shares = total_supply(metadata) as u256;
    let current_staked = coin::value(&self.staked) as u256;
    let required_staked = (total_shares * new_ratio) / 1_000_000_000_000_000_000u256;

    if (required_staked > current_staked) {
        let needed = required_staked - current_staked;
        let available = coin::value(&sui_coin) as u256;
        assert!(available >= needed, EInsufficientSui);
        let coin_to_take = coin::split(&mut sui_coin, (needed as u64), ctx);
        coin::join(&mut self.staked, coin_to_take);
    } else if (required_staked < current_staked) {
        let excess = current_staked - required_staked;
        let coin_to_return = coin::split(&mut self.staked, (excess as u64), ctx);
        transfer::public_transfer(coin_to_return, tx_context::sender(ctx));
    };

    self.ratio = new_ratio;
    transfer::public_transfer(sui_coin, tx_context::sender(ctx));
}

public fun get_ratio(pool: &NativePool, _metadata: &Metadata<CERT>): u256 {
    pool.ratio
}

#[test_only]
public fun test_init(ctx: &mut TxContext) {
    init(ctx)
}

#[test_only]
public fun get_staked(pool: &NativePool): u64 {
    coin::value(&pool.staked)
}