//!
//! Stylus Hello World
//!
//! The following contract implements the Counter example from Foundry.
//!
//! ```
//! contract Counter {
//!     uint256 public number;
//!     function setNumber(uint256 newNumber) public {
//!         number = newNumber;
//!     }
//!     function increment() public {
//!         number++;
//!     }
//! }
//! ```
//!
//! The program is ABI-equivalent with Solidity, which means you can call it from both Solidity and Rust.
//! To do this, run `cargo stylus export-abi`.
//!
//! Note: this code is a template-only and has not been audited.
//!

// Allow `cargo stylus export-abi` to generate a main function.
#![cfg_attr(not(feature = "export-abi"), no_main)]
pub mod pay_as_you_go_elec;

extern crate alloc;

/// Import items from the SDK. The prelude contains common traits and macros.


/// Import items from the SDK. The prelude contains common traits and macros.
// use scale::{Encode, Decode};
use parity_scale_codec::{Encode, Decode};
use alloc::vec::Vec;
use alloc::{string::ToString, vec};

use stylus_sdk::alloy_primitives::U256;
use stylus_sdk::{alloy_primitives::Address, alloy_sol_types::sol, evm, prelude::*, ArbResult};



// sol! macro event declaration
// Up to 3 parameters can be indexed.
// Indexed parameters helps you filter the logs by the indexed parameter
// Declare events and Solidity error types
sol! {
    event Log(address indexed sender, string message);
    event AlreadyRegistered(string message);
    event InvalidAmount(uint256 amount);
    event AnotherLog();
}

// // Represents the ways methods may fail.
// #[derive(SolidityError)]
// pub enum Erc20Error {
//     AlreadyRegistered(AlreadyRegistered),
// }

// Define some persistent storage using the Solidity ABI.
// `Counter` will be the entrypoint.
sol_storage! {
    #[entrypoint]
    pub struct Counter {
        uint256 number;
    }

    pub struct PayAsYouGoElectricity {
        address owner;
        mapping(address => User) users;
        mapping(address => bool) registered_meters;
    }

    pub struct User {
        uint256 balance;
        bool is_registered;
    }
}

/// Declare that `Counter` is a contract with the following external methods.
#[public]
impl Counter {
    /// Gets the number from storage.
    pub fn number(&self) -> U256 {
        self.number.get()
    }

    /// Sets a number in storage to a user-specified value.
    pub fn set_number(&mut self, new_number: U256) {
        self.number.set(new_number);
    }

    /// Sets a number in storage to a user-specified value.
    pub fn mul_number(&mut self, new_number: U256) {
        self.number.set(new_number * self.number.get());
    }

    /// Sets a number in storage to a user-specified value.
    pub fn add_number(&mut self, new_number: U256) {
        self.number.set(new_number + self.number.get());
    }

    /// Increments `number` and updates its value in storage.
    pub fn increment(&mut self) {
        let number = self.number.get();
        self.set_number(number + U256::from(1));
    }
}


/// Declare that `PayAsYouGoElectricity` is a contract with the following external methods.
#[public]
impl PayAsYouGoElectricity {
    /// Initializes the contract and sets the owner.
    pub fn init(&mut self) {
        self.owner.set(stylus_sdk::msg::sender());
    }

    /// Registers a new user by the contract owner.
    pub fn register_user(&mut self, user: Address) {
        self.only_owner();
        let user_data = self.users.get(user);
        if user_data.is_registered.get() {
            evm::log(AlreadyRegistered { message: "User already registered".to_string() });
            return;
        }
        self.users.setter(user).balance.set(U256::ZERO);
        self.users.setter(user).is_registered.set(true);
        evm::log(Log {
            sender: user,
            message: "User registered successfully".to_string(),
        });
    }

    /// Registers a new IoT meter by the contract owner.
    pub fn register_meter(&mut self, meter: Address) {
        self.only_owner();
        if self.registered_meters.get(meter) {
            evm::log(AlreadyRegistered { message: "User already registered".to_string() });
            return;
        }
        self.registered_meters.setter(meter).set(true);
        evm::log(Log {
            sender: meter,
            message: "Meter registered successfully".to_string(),
        });
    }

    /// Allows registered users to top up their electricity credits.
    pub fn top_up(&mut self) {
        let caller = stylus_sdk::msg::sender();
        self.only_registered_user(caller);

        let amount = stylus_sdk::msg::value();
        if amount == U256::ZERO {
            evm::log(InvalidAmount { amount: amount });
            return;
        }

        let mut user_data = self.users.get(caller);
        let current_balance = user_data.balance.get();
        self.users.setter(caller).balance.set(current_balance + amount);
        evm::log(Log {
            sender: caller,
            message: "Balance Topped up successfully".to_string(),
        });


    }

    /// Deducts electricity credits based on usage reported by IoT meters.
    pub fn use_electricity(&mut self, user: Address, amount: U256) {
        let meter = stylus_sdk::msg::sender();
        self.only_registered_meter(meter);

        let mut user_data = self.users.get(user);
        if user_data.balance < amount {
            evm::log(InvalidAmount { amount: amount });
            return;
        }

        user_data.balance -= amount;
        self.users.set(user, user_data);

        stylus_sdk::emit_event::<ElectricityUsed>(ElectricityUsed {
            user,
            amount,
        });
    }

    /// Withdraws contract funds by the owner.
    pub fn withdraw(&mut self) {
        self.only_owner();

        let balance = stylus_sdk::msg::balance();
        let success = stylus_sdk::msg::transfer(self.owner.get(), balance);
        if !success {
            stylus_sdk::revert_with("WithdrawFailed");
        }
    }

    /// Internal function to check if the caller is the owner.
    fn only_owner(&self) {
        if stylus_sdk::msg::sender() != self.owner.get() {
            stylus_sdk::revert_with("Unauthorized");
        }
    }

    /// Internal function to check if the caller is a registered user.
    fn only_registered_user(&self, user: Address) {
        let user_data = self.users.get(user);
        if !user_data.is_registered {
            stylus_sdk::revert_with("Unauthorized");
        }
    }

    /// Internal function to check if the caller is a registered IoT meter.
    fn only_registered_meter(&self, meter: Address) {
        if !self.registered_meters.get(meter) {
            stylus_sdk::revert_with("MeterNotRegistered");
        }
    }
}

// Define custom events
#[derive(Encode, Decode)]
pub struct TopUp {
    user: Address,
    amount: U256,
}

#[derive(Encode, Decode)]
pub struct ElectricityUsed {
    user: Address,
    amount: U256,
}