import { useState, useEffect } from "react";
import BidBoxes from "../reusable/BidBoxes";
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import constants from "../../constants.json";

const indexChain = async (packageAddress, module_name, event_name) => {
  // console.log("Called Index Chain")
  const client = new SuiClient({ url: getFullnodeUrl('localnet') });
  // console.log("Created Client")
  const qep = {
      query: {
          MoveEventType: `${packageAddress}::${module_name}::${event_name}`
      }
  };
  // console.log("Making Query:", qep)
  const {data, hasNextPage, nextCursor} = await client.queryEvents(qep);
  // console.log("Got Data:", data)
  let results = []
  for (const event of data) {
      results.push(event.parsedJson);
  }
  return results;
}

const RightOrderbook = ({type, selectedMaturity}) => {
  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);
  const typeS = type == 1 ? "YT" : "PT";
  const headingsData = ["Sui Amount", typeS+" Token Amount", "APY"];
  useEffect(() => {
    // console.log("Helo")
    const fetchData = async (Type) => {
      try {
        const responses = await indexChain(constants["ParamXPackageAddress"], "market", Type);
        const response = responses.filter((obj) => { 
          // console.log(obj)
          // console.log(selectedMaturity)
          return obj.token_type == type && obj.maturity_ms == selectedMaturity
        }).map(
          (obj) => {
            // console.log(obj);
            if(obj.token_type == 1){
              const rate = (Number(obj.sui_amount) / Number(obj.token_amount) * (12 / 3) * 100).toFixed(2)
              obj['rate'] = rate;
            } else if(obj.token_type == 0){
              const rate = (((Number(obj.token_amount) / Number(obj.sui_amount)) - 1.0) * (12 / 3) * 100).toFixed(2)
              obj['rate'] = rate;
            }
            return obj;
          }
        ).sort((obja, objb) => {
          return Number(obja.rate) - Number(objb.rate); // Ensure `rate` is a number for sorting
        });
        if(Type == "BidCreated"){
          setBids(response);
        } else {
          setAsks(response.reverse());
        }
        // setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData("OfferCreated")
    fetchData("BidCreated")
  }, [selectedMaturity]);

  

  return (
    <>
      {/* Bids */}
      <BidBoxes
        title={"Bids"}
        headingsData={headingsData}
        contentData={bids}
      />

      {/* Asks */}
      <BidBoxes
        title={"Asks"}
        headingsData={headingsData}
        contentData={asks}
      />
    </>
  );
};

export default RightOrderbook;
