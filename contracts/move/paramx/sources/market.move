module paramx::market;

use sui::balance::Balance;
use sui::coin::{Self, Coin};
use sui::sui::SUI;
use sui::event;
use paramx::yield_trading_protocol::{PxToken, t_amount, t_maturity_ms, t_token_type};

// --- Structs ---

/// Offer order to sell a YT token for SUI
public struct OfferOrder has key, store {
    id: UID,
    token: PxToken,
    token_type: u8,
    token_amount: u64,
    sui_amount: u64,
    creator: address,
}

/// Bid order to buy a YT token with SUI
public struct BidOrder has key, store {
    id: UID,
    sui_amount: Balance<SUI>,
    token_type: u8,
    token_amount: u64,
    maturity_ms: u64,
    creator: address,
}

// --- Events ---

/// Emitted when an offer order is created
public struct OfferCreated has copy, drop {
    order_id: ID,
    token_type: u8,  // "YT" or "PT"
    maturity_ms: u64,        // Maturity timestamp of the token
    token_amount: u64,             // Amount of CERT shares in the token
    initial_ratio: u256,     // Initial ratio of the token
    sui_amount: u64,         // Requested SUI amount
    creator: address,          // Order creator's address
}

/// Emitted when a bid order is created
public struct BidCreated has copy, drop {
    order_id: ID,
    token_type: u8,  // "YT" or "PT"
    maturity_ms: u64,        // Desired maturity timestamp
    sui_amount: u64,         // Offered SUI amount
    token_amount: u64,         // Amount of token requested
    creator: address,          // Order creator's address
}

/// Emitted when any order is closed
public struct OrderClosed has copy, drop {
    order_id: ID,
    closer: address,         // Address of the user who closed the order
}

// --- Error Codes ---

const E_INSUFFICIENT_SUI: u64 = 101;  // Provided SUI amount doesn't match
const E_MATURITY_MISMATCH: u64 = 102; // Token maturity doesn't match bid

// --- Functions ---


/// Places a limit offer to sell a PT token for a specified amount of SUI
public entry fun limit_offer(
    token: PxToken,
    sui_amount: u64,
    ctx: &mut TxContext
) {
    let creator = tx_context::sender(ctx);
    let order_uid = object::new(ctx);
    let order_id= order_uid.to_inner();
    let token_type =  token.t_token_type();
    let token_amount = token.t_amount();

    event::emit(OfferCreated {
        order_id,
        token_type,
        maturity_ms: token.t_maturity_ms(),
        token_amount,
        initial_ratio: token.t_initial_ratio(),
        sui_amount,
        creator,
    });


    let order = OfferOrder {
        id: order_uid,
        token,
        token_type,
        token_amount,
        sui_amount,
        creator
    };

    transfer::public_share_object(order);
    
}

/// Places a limit bid to buy a PT token with a specified maturity using SUI
public entry fun limit_bid(
    sui: Coin<SUI>,
    token_type: u8,
    token_amount: u64,
    maturity_ms: u64,
    ctx: &mut TxContext
) {
    let creator = tx_context::sender(ctx);
    let sui_amount = sui.value();
    let order_uid = object::new(ctx);
    let order_id = order_uid.to_inner();
    let order = BidOrder {
        id: order_uid,
        sui_amount: sui.into_balance(),
        token_amount,
        token_type,
        maturity_ms,
        creator
    };
    transfer::public_share_object(order);
    event::emit(BidCreated {
        order_id,
        token_type,
        maturity_ms,
        token_amount,
        sui_amount,
        creator,
    });
}

/// Closes an offer order for PT: Provide SUI to receive the PT token
public entry fun close_offer_pt(
    order: OfferOrder,
    sui: Coin<SUI>,
    ctx: &mut TxContext
) {
    let closer = tx_context::sender(ctx);
    let OfferOrder {id, token, token_type, token_amount, sui_amount, creator} = order; 
    assert!(sui.value() == sui_amount, E_INSUFFICIENT_SUI);

    transfer::public_transfer(sui, creator);
    transfer::public_transfer(token, closer);
    
    event::emit(OrderClosed {
        order_id: id.to_inner(),
        closer,
    });
    object::delete(id);
}

/// Closes a bid order for PT: Provide a PT token to receive the SUI
public entry fun close_bid_pt(
    order: BidOrder,
    token: PxToken,
    ctx: &mut TxContext
) {
    let closer = tx_context::sender(ctx);
    let BidOrder {id, sui_amount, token_type, token_amount, maturity_ms, creator} = order;
    assert!(token.t_maturity_ms() == maturity_ms, E_MATURITY_MISMATCH);

    transfer::public_transfer(token, creator);
    let sui_coin = coin::from_balance(sui_amount, ctx);
    transfer::public_transfer(sui_coin, closer);

    event::emit(OrderClosed {
        order_id: id.to_inner(),
        closer,
    });

    object::delete(id);
}