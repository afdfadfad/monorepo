pragma solidity ^0.5.2;
pragma experimental ABIEncoderV2;
import './optimizedForceMove.sol';

contract TESTOptimizedForceMove is OptimizedForceMove {
    // Public wrappers for internal methods:

    function isAddressInArray(address suspect, address[] memory addresses)
        public
        pure
        returns (bool)
    {
        return _isAddressInArray(suspect, addresses);
    }

    function validSignatures(
        uint256 largestTurnNum,
        address[] memory participants,
        bytes32[] memory stateHashes,
        Signature[] memory sigs,
        uint8[] memory whoSignedWhat // whoSignedWhat[i] is the index of the state in stateHashes that was signed by participants[i]
    ) public pure returns (bool) {
        return _validSignatures(largestTurnNum, participants, stateHashes, sigs, whoSignedWhat);
    }

    function acceptableWhoSignedWhat(
        uint8[] memory whoSignedWhat,
        uint256 largestTurnNum,
        uint256 nParticipants,
        uint256 nStates
    ) public pure returns (bool) {
        return _acceptableWhoSignedWhat(whoSignedWhat, largestTurnNum, nParticipants, nStates);
    }

    function recoverSigner(bytes32 _d, uint8 _v, bytes32 _r, bytes32 _s)
        public
        pure
        returns (address)
    {
        return _recoverSigner(_d, _v, _r, _s);
    }

}
