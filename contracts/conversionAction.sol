pragma solidity ^0.4.18;

contract conversionAction{

    event settingAction(int action, int hits);

    int private contract_id; // interact with RDB's contract indendifier
    int public action;
    int public hits;

    constructor(int contract_id) public{
        contract_id = contract_id;
    }

    function setAction(int action, int hits) public{
        emit settingAction(action, hits);
        action = action;
        hits = hits;
    }

    function getAction() public view returns (int action, int hits) {
        return (action, hits);
    }

    function getId() public view returns (int contract_id) {
      return (contract_id);
    }

}
