// ConnectWallet.tsx
import { useWallet, Wallet, WalletId } from '@txnlab/use-wallet-react'
import { BsWallet2, BsCheckCircleFill } from 'react-icons/bs'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import Button from '../ui/Button'

interface ConnectWalletInterface {
  openModal: boolean
  closeModal: () => void
  openModalFn: () => void
}

const ConnectWallet = ({ openModal, closeModal, openModalFn }: ConnectWalletInterface) => {
  const { wallets, activeAddress } = useWallet()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Detect KMD (LocalNet dev wallet) since it has no icon
  const isKmd = (wallet: Wallet) => wallet.id === WalletId.KMD

  return (
    <>
      {/* Connect Wallet Button */}
      <Button
        variant="buy"
        onClick={() => openModalFn()}
      >
        <div className="flex items-center gap-2">
          <BsWallet2 className="text-lg" />
          <span>Connect Wallet</span>
        </div>
      </Button>

      {/* Modal Portal */}
      {openModal && isClient && createPortal(
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[9999] backdrop-blur-sm"
          onClick={() => closeModal()}
        >
          <div 
            className="bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 text-white rounded-3xl shadow-2xl border border-gray-700/50 p-6 sm:p-8 max-w-md w-full mx-4 relative backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
        <div className="text-center mb-6">
          <h3 className="flex items-center justify-center gap-3 text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 mb-3">
            <BsWallet2 className="text-3xl sm:text-4xl" />
            Connect Wallet
          </h3>
          <p className="text-gray-400 text-sm">Choose your preferred wallet provider</p>
        </div>

        <div className="space-y-3">
          {isClient && activeAddress && (
            <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30 rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-center gap-2 mb-3">
                <BsCheckCircleFill className="text-green-400 text-xl" />
                <span className="text-green-400 font-semibold">Connected</span>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-300 break-all font-mono mb-1">Address: {activeAddress}</div>
                <div className="text-sm text-gray-400">Network: Algorand Testnet</div>
              </div>
            </div>
          )}

          {(!isClient || !activeAddress) &&
            wallets?.map((wallet) => (
              <button
                data-test-id={`${wallet.id}-connect`}
                className="group w-full flex items-center gap-3 p-3 sm:p-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-gray-700/70 hover:to-gray-600/70 border border-gray-600/30 hover:border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg hover:shadow-xl"
                key={`provider-${wallet.id}`}
                onClick={() => wallet.connect()}
              >
                {!isKmd(wallet) && (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <img
                      alt={`wallet_icon_${wallet.id}`}
                      src={wallet.metadata.icon}
                      className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                    />
                  </div>
                )}
                {isKmd(wallet) && (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                    <BsWallet2 className="text-white text-sm sm:text-lg" />
                  </div>
                )}
                <span className="font-semibold text-sm sm:text-lg flex-1 text-left text-white group-hover:text-cyan-300 transition-colors">
                  {isKmd(wallet) ? 'LocalNet Wallet' : wallet.metadata.name}
                </span>
                {isClient && wallet.isActive && (
                  <BsCheckCircleFill className="text-2xl text-green-400 animate-pulse" />
                )}
              </button>
            ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            data-test-id="close-wallet-modal"
            className="flex-1 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white font-semibold py-3 px-4 sm:px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-gray-600/30 text-sm sm:text-base"
            onClick={() => closeModal()}
          >
            Close
          </button>
          {isClient && activeAddress && (
            <button
              className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold py-3 px-4 sm:px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl border border-red-500/30 text-sm sm:text-base"
              data-test-id="logout"
              onClick={async () => {
                if (wallets) {
                  const activeWallet = wallets.find((w) => w.isActive)
                  if (activeWallet) {
                    await activeWallet.disconnect()
                  } else {
                    localStorage.removeItem('@txnlab/use-wallet:v3')
                    window.location.reload()
                  }
                }
              }}
            >
              Disconnect
            </button>
          )}
        </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

export default ConnectWallet