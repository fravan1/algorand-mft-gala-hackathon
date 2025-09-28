from algopy import ARC4Contract, arc4, BoxMap

class AssetInfo(arc4.Struct):
    price: arc4.UInt64           # current price per token
    algo_liquidity: arc4.UInt64  # ALGO in pool for buy/sell
    token_liquidity: arc4.UInt64 # ASA tokens in pool
    total_supply: arc4.UInt64
    creator: arc4.Address
    asa_id: arc4.UInt64
    hype_factor: arc4.UInt64
    last_stream_value: arc4.UInt64
    last_update_round: arc4.UInt64

class MFTGala(ARC4Contract):
    def __init__(self) -> None:
        # Map: asset_id → AssetInfo
        self.assets: BoxMap[arc4.UInt64, AssetInfo] = BoxMap(
            arc4.UInt64, AssetInfo, key_prefix="assets"
        )
        # ALGO royalty vault
        self.royalty_vault: BoxMap[arc4.UInt64, arc4.UInt64] = BoxMap(
            arc4.UInt64, arc4.UInt64, key_prefix="royalty_vault"
        )
        # Track creator ALGO balances
        self.creator_balance: BoxMap[arc4.Address, arc4.UInt64] = BoxMap(
            arc4.Address, arc4.UInt64, key_prefix="creator_balance"
        )

    @arc4.abimethod
    def insert_asset(
        self,
        asset_id: arc4.UInt64,
        asa_id: arc4.UInt64,
        total_supply: arc4.UInt64,
        base_price: arc4.UInt64,
        publisher: arc4.Address,
        algo_seed: arc4.UInt64
    ) -> bool:

        info: AssetInfo = AssetInfo(
            price=base_price,             # initial price
            algo_liquidity=algo_seed,     # ALGO seed provided by publisher
            token_liquidity=total_supply, # all ASA now in pool
            total_supply=total_supply,
            creator=publisher,
            asa_id=asa_id,
            hype_factor=arc4.UInt64(1),
            last_stream_value=arc4.UInt64(0),
            last_update_round=arc4.UInt64(0)
        )

        # Store in contract
        self.assets[asset_id] = info.copy()

        # Initialize royalty vault for this asset
        self.royalty_vault[asset_id] = arc4.UInt64(0)

        return True


    @arc4.abimethod
    def buy(
        self,
        asset_id: arc4.UInt64,
        amount: arc4.UInt64,
        buyer: arc4.Address,
        payment: arc4.UInt64
    ) -> bool:
        info: AssetInfo = self.assets[asset_id].copy()

        # total price = base price * amount * hype
        total_price_native = info.price.native * amount.native * info.hype_factor.native
        total_price = arc4.UInt64(total_price_native)

        if payment.native < total_price.native:
            return False  # not enough ALGO sent

        if info.token_liquidity < amount:
            return False  # not enough tokens in pool

        # Split ALGO
        liquidity_share = (payment.native * 80) // 100
        royalty_share = (payment.native * 10) // 100
        creator_share = payment.native - liquidity_share - royalty_share  # remaining 10%

        # Update pools
        info.token_liquidity = arc4.UInt64(info.token_liquidity.native - amount.native)
        info.algo_liquidity = arc4.UInt64(info.algo_liquidity.native + liquidity_share)
        self.royalty_vault[asset_id] = arc4.UInt64(
            self.royalty_vault[asset_id].native + royalty_share
        )

        # Update creator balance
        current_creator_balance = self.creator_balance[info.creator] if info.creator in self.creator_balance else arc4.UInt64(0)
        self.creator_balance[info.creator] = arc4.UInt64(current_creator_balance.native + creator_share)

        # Small price increase after buy
        price_increase = (info.price.native * 1) // 100  # increase by 1%
        info.price = arc4.UInt64(info.price.native + price_increase)

        self.assets[asset_id] = info.copy()
        return True

    @arc4.abimethod
    def sell(
        self,
        asset_id: arc4.UInt64,
        amount: arc4.UInt64,
        seller: arc4.Address
    ) -> bool:
        info: AssetInfo = self.assets[asset_id].copy()

        if info.token_liquidity.native + amount.native > info.total_supply.native:
            return False  # cannot exceed total supply

        payout_native = info.price.native * amount.native
        if info.algo_liquidity.native < payout_native:
            return False  # not enough ALGO in pool

        # Update pools
        info.token_liquidity = arc4.UInt64(info.token_liquidity.native + amount.native)
        info.algo_liquidity = arc4.UInt64(info.algo_liquidity.native - payout_native)

        # Small price decrease after sell
        price_decrease = (info.price.native * 1) // 100  # decrease by 1%

        price_candidate = info.price.native - price_decrease
        if price_candidate < 1:
            info.price = arc4.UInt64(1)
        else:
            info.price = arc4.UInt64(price_candidate)

        self.assets[asset_id] = info.copy()
        return True

    @arc4.abimethod
    def claim_royalty(
        self,
        asset_id: arc4.UInt64,
        user_balance: arc4.UInt64,
        user: arc4.Address
    ) -> arc4.UInt64:
        vault: arc4.UInt64 = self.royalty_vault[asset_id]
        total_supply: arc4.UInt64 = self.assets[asset_id].total_supply

        # Compute user share
        share_native = (vault.native * user_balance.native) // total_supply.native
        share = arc4.UInt64(share_native)

        # Deduct from royalty vault
        self.royalty_vault[asset_id] = arc4.UInt64(vault.native - share.native)

        # In practice, contract would send ALGO to `user` here
        return share

    @arc4.abimethod
    def set_hype_price(
        self,
        asset_id: arc4.UInt64,
        hype_factor: arc4.UInt64,
        new_price: arc4.UInt64,
        new_stream_value: arc4.UInt64,
        current_round: arc4.UInt64
    ) -> bool:
        info: AssetInfo = self.assets[asset_id].copy()

        info.hype_factor = hype_factor
        info.price = new_price
        info.last_stream_value = new_stream_value
        info.last_update_round = current_round

        self.assets[asset_id] = info.copy()
        return True

    @arc4.abimethod
    def get_asset_info(self, asset_id: arc4.UInt64) -> AssetInfo:
        return self.assets[asset_id]
