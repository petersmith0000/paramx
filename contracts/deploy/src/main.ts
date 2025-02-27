// import { getFullnodeUrl, EventId, SuiClient, SuiEvent, SuiEventFilter, QueryEventsParams } from '@mysten/sui/client';


// const PACKAGE_ADDRESS = "0xfa7e51f275d4a6b63b37c81d0dc0d7286e7bb33ed8759e916dc7981c1ebf921f";

// type BidCreated = {
// 	creator: string;
//     maturity_ms: number;
//     order_id: string;
//     sui_amount: number;
//     token_type: number[];
// };

// const indexChain = async (package_address : string, module_name : string, event_name : string) => {
//     const client = new SuiClient({ url: getFullnodeUrl('localnet') });
//     const qep : QueryEventsParams = {
//         query: {
//             MoveEventType: `${package_address}::${module_name}::${event_name}`
//         }
//     };
//     const {data, hasNextPage, nextCursor} = await client.queryEvents(qep);

//     for (const event of data) {
//         const d = event.parsedJson as BidCreated
//         console.log(d);
//     }

// }

// indexChain(PACKAGE_ADDRESS, "market", "BidCreated");



// // This is the event

// // {
// //     type: `${CONFIG.SWAP_CONTRACT.packageId}::lock`,
// //     filter: {
// //         MoveEventModule: {
// //             module: 'lock',
// //             package: CONFIG.SWAP_CONTRACT.packageId,
// //         },
// //     },
// //     callback: handleLockObjects,
// // },


// // SuiClient
// // client.queryEvents
// // query : SuiEventFilter
// // SuiEvent object
// // Uses prisma
// // const { data, hasNextPage, nextCursor } = await client.queryEvents({
// //     query: tracker.filter,
// //     cursor,
// //     order: 'ascending',
// // });


// // // You will need some db

// // Deploy localnet