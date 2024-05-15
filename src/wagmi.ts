import { http, createConfig } from 'wagmi'
import { pulsechainV4, pulsechain } from 'wagmi/chains'
import { coinbaseWallet, metaMask, walletConnect } from 'wagmi/connectors'

export const config = createConfig({
  chains: [pulsechain, pulsechainV4],
  connectors: [
    metaMask(),
    coinbaseWallet({ appName: 'Create Wagmi' }),
    walletConnect({ projectId: process.env.REACT_APP_WC_PROJECT_ID as string }),
  ],
  transports: {
    [pulsechain.id]: http(),
    [pulsechainV4.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}