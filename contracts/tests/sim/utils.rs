use near_contract_standards::non_fungible_token::{TokenId};
use near_sdk_sim::{call, ContractAccount, deploy, init_simulator, STORAGE_AMOUNT, to_yocto, UserAccount};
use near_sdk_sim::runtime::GenesisConfig;

use ft::ContractContract as FtContract;
use main::{ContractContract as MainContract, Land, LandType, Zombie};
use nft_land::ContractContract as LandContract;
use nft_zombie::ContractContract as ZombieContract;

near_sdk_sim::lazy_static_include::lazy_static_include_bytes! {
    MAIN_CONTRACT_WASM_BYTES => "../out/main.wasm",
    FT_CONTRACT_WASM_BYTES => "../out/ft.wasm",
    ZOMBIE_CONTRACT_WASM_BYTES => "../out/zombie.wasm"
}

pub fn init() -> (
    UserAccount,
    ContractAccount<MainContract>,
    ContractAccount<FtContract>,
    ContractAccount<LandContract>,
    ContractAccount<ZombieContract>,
    UserAccount
) {
    let mut genesis = GenesisConfig::default();
    genesis.genesis_time = 1000000000000000000;
    genesis.genesis_height = 1000;
    let root = init_simulator(Some(genesis));

    let main_contract = deploy! {
        contract: MainContract,
        contract_id: "main",
        bytes: &MAIN_CONTRACT_WASM_BYTES,
        signer_account: root,
        deposit: STORAGE_AMOUNT
    };

    let ft_contract = deploy! {
        contract: FtContract,
        contract_id: "ft.main",
        bytes: &FT_CONTRACT_WASM_BYTES,
        signer_account: main_contract.user_account,
        deposit: STORAGE_AMOUNT / 10,
        init_method: new_default_meta(
            main_contract.valid_account_id(),
            to_yocto("1000000000").into()
        )
    };

    // let land_contract = deploy! {
    //     contract: LandContract,
    //     contract_id: "nft-land.main",
    //     bytes: &LAND_CONTRACT_WASM_BYTES,
    //     signer_account: main_contract.user_account,
    //     deposit: STORAGE_AMOUNT / 10,
    //     init_method: new_default_meta(
    //         main_contract.account_id()
    //     )
    // };

    let zombie_contract = deploy! {
        contract: ZombieContract,
        contract_id: "zombie.main",
        bytes: &ZOMBIE_CONTRACT_WASM_BYTES,
        signer_account: main_contract.user_account,
        deposit: STORAGE_AMOUNT / 10,
        init_method: new_default_meta(
            main_contract.account_id()
        )
    };

    let alice = root.create_user(
        "alice".to_string(),
        to_yocto("20"),
    );

    // Seed data - Zombie collections
    let collection_title = String::from("Collection 1");
    let collection_image = String::from("image-1");
    let collection_add_result = call!(
        root,
        main_contract.add_collection(collection_title, collection_image, "hash")
    );
    assert!(collection_add_result.is_ok());

    (root, main_contract, ft_contract, land_contract, zombie_contract, alice)
}


pub fn claim_land(main_contract: &ContractAccount<MainContract>, user: &UserAccount, land_type: LandType) -> Land {
    let deposit: u128 = match land_type {
        LandType::Small => to_yocto("0.01"),
        LandType::Medium => to_yocto("5"),
        LandType::Large => to_yocto("9"),
    };

    let land_result = call!(
        user,
        main_contract.mint_land_nft(),
        deposit = deposit
    );
    assert!(land_result.is_ok());
    land_result.unwrap_json()
}

pub fn claim_zombies(
    main_contract: &ContractAccount<MainContract>,
    user: &UserAccount,
    land_id: TokenId,
    land_type: LandType,
) -> Vec<Zombie> {
    let deposit: u128 = match land_type {
        LandType::Small => to_yocto("0.01"),
        LandType::Medium => to_yocto("0.035"),
        LandType::Large => to_yocto("0.07"),
    };

    let zombie_claim_result = call!(
        user,
        main_contract.mint_free_zombie_nft(land_id),
        deposit = deposit
    );

    assert!(zombie_claim_result.is_ok());
    zombie_claim_result.unwrap_json()
}
