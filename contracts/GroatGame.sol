//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract GroatGame is VRFConsumerBase {
    uint256 public stake; //Amount of ETH each player needs to stake.
    uint256 public max_players; //Maximum number of players.
    uint256 public entrance_fee; //Amount of LINK each player needs to add.
    uint256 public link_fee = 0.0001 * 10 ** 18; //Amount of LINK needed to request a random number.
    uint256 public payout;

    mapping(address => bool) public known_player; 

    mapping(address => uint256) public staked_eth; //Mapping from address to the amount of ETH the address has in the contract.
    mapping(address => uint256) public staked_link; //Mapping from address to the amount of LINK the address has in the contract.

    //Represents a single entry in the game queue.
    struct Entry {
        uint256 prev;
        uint256 next;
        address player;
    }
    //Represents an entry for a particular address.
    struct PlayerEntry {
        uint256 prev;
        uint256 next;
    }

    mapping(uint256 => Entry) public id_entries; //Used for global queue.
    uint256 public queue_size;
    uint256 public game_end_marker;

    mapping(address => mapping(uint256 => PlayerEntry)) public id_player_entries; //Used for address-level queue.
    mapping(address => uint256) public num_entries; //Mapping from address to the address's number of active entries.

    uint256 public head = 0;
    uint256 public tail = type(uint256).max;

    bytes32 internal keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;

    constructor(uint256 _stake, uint256 _max_players) 
        VRFConsumerBase(
            0x8C7382F9D8f56b33781fE506E897a4F1e2d17255,
            0x326C977E6efc84E512bB9C30f76E30c160eD06FB       
        )
    {
        require(_stake > 0, "Stake must be non-zero.");
        require(_max_players > 0, "Max players must be non-zero.");
        require(link_fee % (_max_players - 1) == 0, "LINK fee should be divided evenly.");
        require(stake % (_max_players - 1) == 0, "Stake should be divided evenly.");

        stake = _stake;
        max_players = _max_players;
        entrance_fee = link_fee / (max_players - 1);
        payout = stake + stake / (max_players - 1);


        id_entries[head] = Entry(head, tail, address(0));
        id_entries[tail] = Entry(head, tail, address(0));

        queue_size = 0;
        game_end_marker = 0;
    }
    //Returns the minimum of two 256-bit unsigned integers.
    function min(uint256 a, uint256 b) private pure returns (uint256) {
        return a <= b ? a : b;
    }
    //Returns the maximum to two 256-bit unsigned integers.
    function max(uint256 a, uint256 b) private pure returns (uint256) {
        return a <= b ? b : a;
    }

    function appendToPlayerEntryList(address from, uint256 new_id) private {
        if (!known_player[from]){
            id_player_entries[from][head] = PlayerEntry(head, tail);
            id_player_entries[from][tail] = PlayerEntry(head, tail);
            known_player[from] = true;
        }
        uint256 prev_id = id_player_entries[from][tail].prev;
        id_player_entries[from][new_id] = PlayerEntry(prev_id, tail);
        id_player_entries[from][prev_id].next = new_id;
        id_player_entries[from][tail].prev = new_id;
    }
    
    function appendToQueue(address from) private {
        uint256 prev_id = id_entries[tail].prev;
        uint256 new_id = prev_id + 1;
        id_entries[new_id] = Entry(prev_id, tail, from);
        id_entries[prev_id].next = new_id;
        id_entries[tail].prev = new_id;
        appendToPlayerEntryList(from, new_id);
    }


    function deleteFromPlayerEntryList(address from, uint256 id) private {
        PlayerEntry storage player_entry_to_delete = id_player_entries[from][id];
        id_player_entries[from][player_entry_to_delete.prev].next = player_entry_to_delete.next;
        id_player_entries[from][player_entry_to_delete.next].prev = player_entry_to_delete.prev;
        delete id_player_entries[from][id];
    }


    function deleteFromQueue(address from, uint256 id) private {
        Entry storage entry_to_delete = id_entries[id];
        id_entries[entry_to_delete.prev].next = entry_to_delete.next;
        id_entries[entry_to_delete.next].prev = entry_to_delete.prev;
        delete id_entries[id];
        deleteFromPlayerEntryList(from, id);
    }

    //Called whenever a player adds either ETH or LINK. Calculates the number of
    //new entries to allocate for the player.
    function findNumberOfNewEntries(address from) private view returns (uint256) {
        uint256 entry_count = num_entries[from];
        uint256 staked_eth_without_past_entries = staked_eth[from] - entry_count * stake;
        uint256 staked_link_without_past_entries = staked_link[from] - entry_count * entrance_fee;

        return min(
            staked_eth_without_past_entries / stake,
            staked_link_without_past_entries / entrance_fee
        );
    }
    //Called whenever a player adds either ETH or LINK. Adds entries for a player
    //and makes a request for a random number if necessary.
    function addNewEntries(address from) private {
        uint256 new_entry_count = findNumberOfNewEntries(from);
        if (queue_size < max_players) {
            uint256 new_entry_count_in_current_game = min(
                new_entry_count,
                max_players - queue_size
            );
            if (queue_size + new_entry_count_in_current_game == max_players) {
                game_end_marker = id_entries[tail].prev + new_entry_count_in_current_game;
                getRandomNumber();
            }
        }
        for (uint256 i = 0; i < new_entry_count; i++) {
            appendToQueue(from);
        }
        queue_size += new_entry_count;
        num_entries[from] += new_entry_count;
    }

    //Delete at most (number) entries. Returns the number of entries deleted
    //from the internal data structures.
    function removeEntries(uint256 number) public returns (uint256) {
        require(number > 0, "Should remove non-zero amount of entries.");
        require(number <= num_entries[msg.sender], "Cannot remove more entries than exist.");

        uint256 entries_being_removed = 0;
        uint256 curr_entry_id = id_player_entries[msg.sender][tail].prev;
        while (curr_entry_id != head && entries_being_removed < number && curr_entry_id > game_end_marker) {
            deleteFromQueue(msg.sender, curr_entry_id);
            entries_being_removed++;
            curr_entry_id = id_player_entries[msg.sender][tail].prev;
        }
        queue_size -= entries_being_removed;
        num_entries[msg.sender] -= entries_being_removed;
        return entries_being_removed;
    }


    //Called by the player to withdraw a certain amount of LINK and ETH. Since ETH and LINK are considered
    //locked in once a request for randomness has been made, there is no guarantee that a player will be
    //able to withdraw the full amount specified; the function will withdraw as much as it can and
    //return the amount of each currency withdrawn.
    function removeLinkEth(uint256 link_amount, uint256 eth_amount) public returns (uint256, uint256) {
        require(link_amount > 0 || eth_amount > 0, "Should remove non-zero amount.");
        require(staked_link[msg.sender] >= link_amount, "Too much LINK.");
        require(staked_eth[msg.sender] >= eth_amount, "Too much ETH.");


        uint256 new_desired_link_entries = (staked_link[msg.sender] - link_amount) / entrance_fee;
        uint256 new_desired_eth_entries = (staked_eth[msg.sender] - eth_amount) / stake;
        uint256 new_desired_entries = min(
            new_desired_link_entries,
            new_desired_eth_entries
        );
        uint256 desired_entry_difference = num_entries[msg.sender] - new_desired_entries;

        if (desired_entry_difference != 0) removeEntries(desired_entry_difference);

        //num_entries has been updated.
        uint256 link_amount_to_transfer = num_entries[msg.sender] <= new_desired_link_entries ? link_amount : link_amount - (entrance_fee * (num_entries[msg.sender] - new_desired_link_entries));
        uint256 eth_amount_to_transfer = num_entries[msg.sender] <= new_desired_eth_entries ? eth_amount : eth_amount - (stake * (num_entries[msg.sender] - new_desired_eth_entries));

        staked_link[msg.sender] -= link_amount_to_transfer;
        staked_eth[msg.sender] -= eth_amount_to_transfer;

        LINK.transfer(msg.sender, link_amount_to_transfer);
        payable(msg.sender).transfer(eth_amount_to_transfer);

        return (link_amount_to_transfer, eth_amount_to_transfer);

    }


    function depositEth() public payable {
        staked_eth[msg.sender] += msg.value;
        addNewEntries(msg.sender);
    }

    function onTokenTransfer(address from, uint256 amount, bytes calldata data) public returns (bool success) {
        require(
            msg.sender == address(LINK),
            "Function called outside LINK contract."
        );
        staked_link[from] += amount;
        addNewEntries(from);
        return true;
    }

    function getRandomNumber() private returns (bytes32 requestId) {
        require(
            LINK.balanceOf(address(this)) >= link_fee,
            "Not enough LINK to make request for randomness."
        );
        return requestRandomness(keyHash, link_fee);
    }


    function popPlayer() private returns (address) {
        uint256 entry_id = id_entries[head].next;
        address player = id_entries[entry_id].player;
        deleteFromQueue(player, entry_id);
        num_entries[player]--;
        staked_eth[player] -= stake;
        staked_link[player] -= entrance_fee;
        return player;
    }

    function rewardWinner() private {
        payable(popPlayer()).transfer(payout);
    }

    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        uint256 groat_index = randomness % max_players;

        //Candy crush effect
        while (queue_size >= max_players) {
            //Players before the groat.
            for (uint256 i = 0; i < groat_index; i++) {
                rewardWinner();
            }
            //Ignore the groat.
            popPlayer();
            //Players after the groat.
            for (uint256 i = groat_index + 1; i < max_players; i++) {
                rewardWinner();
            }
            queue_size -= max_players;
        }
    }
}