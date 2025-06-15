import { RowFixed, RowBetween } from 'components/Row'
import { SUPPORTED_NETWORK_VERSIONS } from 'constants/networks'
import useTheme from 'hooks/useTheme'
import React, { useState, useRef } from 'react'
import { ChevronDown } from 'react-feather'
import { useActiveNetworkVersion } from 'state/application/hooks'
import styled from 'styled-components'
import { StyledInternalLink, TYPE } from 'theme'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import { AutoColumn } from 'components/Column'
import { UomiNetworkInfo } from '../../constants/networks'

const Container = styled.div`
  position: relative;
  z-index: 40;
`

const Wrapper = styled.div`
  border-radius: 12px;
  background-color: ${({ theme }) => theme.bg1};
  padding: 6px 8px;
  margin-right: 12px;

  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

const LogaContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const LogoWrapper = styled.img`
  width: 20px;
  height: 20px;
`

const FlyOut = styled.div`
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  position: absolute;
  top: 50px;
  left: 0;
  border-radius: 20px;
  padding: 1.5rem;
  width: 300px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
`

const NetworkRow = styled(RowBetween)<{ active?: boolean; disabled?: boolean }>`
  padding: 12px 16px;
  background: ${({ theme, active }) => 
    active 
      ? `linear-gradient(135deg, ${theme.primary1}, ${theme.primary2})` 
      : 'rgba(255, 255, 255, 0.03)'
  };
  border-radius: 16px;
  margin: 0.5rem 0;
  transition: all 0.3s ease;
  opacity: ${({ disabled }) => (disabled ? '0.5' : 1)};
  
  :hover {
    cursor: ${({ disabled }) => (disabled ? 'initial' : 'pointer')};
    background: ${({ theme, active, disabled }) => 
      disabled 
        ? 'rgba(255, 255, 255, 0.03)' 
        : active 
          ? `linear-gradient(135deg, ${theme.primary1}, ${theme.primary2})` 
          : 'rgba(255, 255, 255, 0.08)'
    };
    transform: ${({ disabled }) => disabled ? 'none' : 'translateY(-1px)'};
  }
`

const GreenDot = styled.div`
  height: 12px;
  width: 12px;
  margin-right: 12px;
  background-color: ${({ theme }) => theme.green1};
  border-radius: 50%;
  position: absolute;
  border: 2px solid black;
  right: -16px;
  bottom: -4px;
`

export default function NetworkDropdown() {
  const [activeNetwork] = useActiveNetworkVersion()
  const theme = useTheme()

  const [showMenu, setShowMenu] = useState(false)

  const node = useRef<HTMLDivElement>(null)
  useOnClickOutside(node, () => setShowMenu(false))

  return (
    <Container ref={node}>
      <Wrapper onClick={() => setShowMenu(!showMenu)}>
        <RowFixed>
          <LogoWrapper src={activeNetwork.imageURL} />
          <TYPE.main fontSize="14px" color={theme?.white} ml="8px" mt="-2px" mr="2px" style={{ whiteSpace: 'nowrap' }}>
            {activeNetwork.name}
          </TYPE.main>
          <ChevronDown size="20px" />
        </RowFixed>
      </Wrapper>
      {showMenu && (
        <FlyOut>
          <AutoColumn $gap="16px">
            <TYPE.main color={theme?.text3} fontWeight={600} fontSize="16px">
              Select network
            </TYPE.main>
            {SUPPORTED_NETWORK_VERSIONS.map((n) => {
              return (
                <StyledInternalLink key={n.id} to={`${n === UomiNetworkInfo ? '' : '/' + n.route}/`}>
                  <NetworkRow
                    onClick={() => {
                      setShowMenu(false)
                    }}
                    active={activeNetwork.id === n.id}
                  >
                    <RowFixed>
                      <LogaContainer>
                        <LogoWrapper src={n.imageURL} />
                        {activeNetwork.id === n.id && <GreenDot />}
                      </LogaContainer>
                      <TYPE.main ml="12px" color={theme?.white}>
                        {n.name}
                      </TYPE.main>
                    </RowFixed>
                  </NetworkRow>
                </StyledInternalLink>
              )
            })}
          </AutoColumn>
        </FlyOut>
      )}
    </Container>
  )
}
