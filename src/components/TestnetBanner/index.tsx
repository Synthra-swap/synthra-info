import { X } from 'react-feather'
import styled from 'styled-components'

import { useTestnetBanner } from './context'

const BannerContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(90deg, #1a1a1a, #6114f1, #a362ff, #1a1a1a);
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  padding: 8px 48px 8px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 13px;
    padding: 8px 40px 8px 12px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    padding: 6px 36px 6px 10px;
  }
`

const BannerText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  @media (max-width: 480px) {
    gap: 4px;
  }
`

const TestnetBadge = styled.span`
  background: rgba(255, 255, 255, 0.15);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  
  @media (max-width: 480px) {
    padding: 1px 6px;
    font-size: 11px;
  }
`

const CloseButton = styled.button`
  position: absolute;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;
  color: #fff;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  @media (max-width: 480px) {
    right: 12px;
    width: 20px;
    height: 20px;
  }
`

const WarningIcon = styled.span`
  font-size: 16px;
  
  @media (max-width: 480px) {
    font-size: 14px;
  }
`

export const TestnetBanner = () => {
  const { isBannerVisible, hideBanner } = useTestnetBanner()

  return (
    <div>
      {isBannerVisible && (
        <BannerContainer
    
        >
          <BannerText>
            <WarningIcon>⚠️</WarningIcon>
            <TestnetBadge>
              <p>Testnet</p>
            </TestnetBadge>
            <span>
              <p>Synthra platform is live on testnet - All token values are for testing purposes only</p>
            </span>
          </BannerText>
          <CloseButton onClick={hideBanner} aria-label="Close banner">
            <X size={14} />
          </CloseButton>
        </BannerContainer>
      )}
    </div>
  )
}
