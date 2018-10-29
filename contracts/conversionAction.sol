pragma solidity ^0.4.18;

contract conversionAction{

    event settingAction(int download, int signUp, int hits, int buy);

    int private contract_idx; // interact with RDB's contract indendifier

    struct Action {
      int download;
      int signUp;
      int hits;
      int buy;
    }

    Action action;

    constructor(int idx) public{
        contract_idx = idx;
    }

    function setAction(int download, int signUp, int hits, int buy) public{
        emit settingAction(download, signUp, hits, buy);
        action = Action({
          download : download,
          signUp : signUp,
          hits : hits,
          buy : buy
        });
    }

    function getAction() public view returns (int download, int signUp, int hits, int buy) {
        return (action.download, action.signUp, action.hits, action.buy);
    }

}
