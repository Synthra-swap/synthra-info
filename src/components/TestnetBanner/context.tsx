import { createContext, useContext, useState, ReactNode } from 'react'

interface TestnetBannerContextType {
  isBannerVisible: boolean
  hideBanner: () => void
}

const TestnetBannerContext = createContext<TestnetBannerContextType | undefined>(undefined)

export const useTestnetBanner = () => {
  const context = useContext(TestnetBannerContext)
  if (!context) {
    throw new Error('useTestnetBanner must be used within a TestnetBannerProvider')
  }
  return context
}

export const TestnetBannerProvider = ({ children }: { children: ReactNode }) => {
  const [isBannerVisible, setIsBannerVisible] = useState(() => {
    // Check localStorage to see if banner was previously dismissed
    const isDismissed = localStorage.getItem('testnet-banner-dismissed') === 'true'
    return !isDismissed
  })

  const hideBanner = () => {
    setIsBannerVisible(false)
    localStorage.setItem('testnet-banner-dismissed', 'true')
  }

  return (
    <TestnetBannerContext.Provider value={{ isBannerVisible, hideBanner }}>
      {children}
    </TestnetBannerContext.Provider>
  )
}
