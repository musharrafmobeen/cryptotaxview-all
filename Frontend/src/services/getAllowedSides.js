const allowableMaster = {
  incoming: [
    "receive",
    "buy",
    "airdrop",
    "staking reward",
    "interest",
    "gift",
    "chain split",
    "mining",
    "income",
    "cashback",
    "realised profit",
    "fiat deposit",
    "borrow",
    "ignore",
    "distribution",
    "isolatedmargin loan",
    "large otc trading",
    "margin loan",
    "p2p trading",
    "pos savings interest",
    "pos savings redemption",
    "deposit",
    "reward",
  ],
  outgoing: [
    "sell",
    "send",
    "lost/stolen",
    "liquidation",
    "fee",
    "loan fee",
    "loan repayment",
    "personal use",
    "realised loss",
    "fiat withdrawl",
    "mint",
    "funding fee",
    "isolatedmargin repayment",
    "margin repayment",
    "pos savings purchase",
    "realize profit and loss",
    "small assets exchange bnb",
    "withdraw",
  ],
};
export const checkAllowedSide = (side) => {
  const incomingState = allowableMaster.incoming.includes(side);
  const outgoingState = allowableMaster.outgoing.includes(side);
  if (incomingState) {
    return 1;
  } else if (outgoingState) {
    return 2;
  } else return 0;
};
export const allowedSides = (side) => {
  if (side != null) {
    let allowableFilter = [];
    let incomingState = allowableMaster.incoming.includes(side);
    let outgoingState = allowableMaster.outgoing.includes(side);
    if (incomingState) {
      allowableFilter = allowableMaster.incoming;
    }
    if (outgoingState) {
      allowableFilter = allowableMaster.outgoing;
    }

    const allowableReturnArray = [];
    for (let i = 0; i < allowableFilter.length; i++) {
      allowableReturnArray.push({
        value: allowableFilter[i],
        label: allowableFilter[i],
      });
    }
    return allowableReturnArray;
  }
};
