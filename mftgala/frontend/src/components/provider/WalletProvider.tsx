"use client"

import { WalletProvider as TxnLabWalletProvider, WalletManager, NetworkId, WalletId } from '@txnlab/use-wallet-react'

interface WalletProviderProps {
  children: React.ReactNode
}

export default function WalletProvider({ children }: WalletProviderProps) {
  const manager = new WalletManager({
    wallets: [
      WalletId.PERA,
      WalletId.DEFLY,
      WalletId.LUTE,
      WalletId.KMD, // LocalNet wallet for development
    ],
    defaultNetwork: NetworkId.TESTNET,
  })

  return (
    <TxnLabWalletProvider manager={manager}>
      {children}
    </TxnLabWalletProvider>
  )
}
