//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import '@openzeppelin/contracts/utils/Context.sol';

/**
 * @dev AccessControl allows role-based access control mechanisms
 * for contracts inheriting from it. 
 */
abstract contract AccessControl is Context {
    address public admin;
    address public ceo;
    address public manager;
    address public minter;
    address public burner;

    constructor() {
        admin = _msgSender();
        ceo = _msgSender();
        manager = _msgSender();
        minter = _msgSender();
        burner = _msgSender();
    }

    modifier onlyAdmin {
        require(_msgSender() == admin, 'AccessControl: caller not admin');
        _;
    }

    modifier onlyCEO {
        require(_msgSender() == ceo, 'AccessControl: caller not ceo');
        _;
    }

    modifier onlyManager {
        require(_msgSender() == manager, 'AccessControl: caller not manager');
        _;
    }

    modifier onlyMinter {
        require(_msgSender() == minter, 'AccessControl: caller not minter');
        _;
    }

    modifier onlyBurner {
        require(_msgSender() == burner, 'AccessControl: caller not burner');
        _;
    }

    modifier onlyAdminOrCEO() {
        require(
            _msgSender() == admin || _msgSender() == ceo,
            'AccessControl: caller not admin or ceo'
        );
        _;
    }

    modifier allRoles() {
        require(
            _msgSender() == admin ||
            _msgSender() == ceo ||
            _msgSender() == manager ||
            _msgSender() == minter ||
            _msgSender() == burner,
            'AccessControl: caller not any of the roles'
        );
        _;
    }

    function newAdmin(address _new) public onlyAdmin {
        require(_new != address(0), 'AccessControl: new admin is the zero address');
        admin = _new;
    }

    function newCEO(address _new) public onlyAdmin {
        require(_new != address(0), 'AccessControl: new ceo is the zero address');
        ceo = _new;
    }

    function newManager(address _new) public onlyAdmin {
        require(_new != address(0), 'AccessControl: new manager is the zero address');
        manager = _new;
    }

    function newMinter(address _new) public onlyAdmin {
        require(_new != address(0), 'AccessControl: new minter is the zero address');
        minter = _new;
    }

    function newBurner(address _new) public onlyAdmin {
        require(_new != address(0), 'AccessControl: new burner is the zero address');
        burner = _new;
    }
}