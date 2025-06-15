import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { darken } from 'polished'
import styled from 'styled-components'
import LogoDark from '../../assets/svg/vana-logo-white.svg'
import Menu from '../Menu'
import Row, { RowFixed, RowBetween } from '../Row'
import SearchSmall from 'components/Search'
import NetworkDropdown from 'components/Menu/NetworkDropdown'
import { useActiveNetworkVersion } from 'state/application/hooks'
import { networkPrefix } from 'utils/networkPrefix'
import { AutoColumn } from 'components/Column'

const HeaderFrame = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  top: 0;
  position: relative;
  padding: 2rem 3rem;
  z-index: 2;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  
  @media (max-width: 1080px) {
    grid-template-columns: 1fr;
    padding: 1.5rem 2rem;
    width: calc(100%);
    position: relative;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 1rem;
  `}
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  @media (max-width: 1080px) {
    display: none;
  }
`

const HeaderRow = styled(RowFixed)`
  @media (max-width: 1080px) {
    width: 100%;
  }
`

const HeaderLinks = styled(Row)`
  justify-content: center;
  @media (max-width: 1080px) {
    padding: 0.5rem;
    justify-content: flex-end;
  }
`

const Title = styled(NavLink)`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 3rem;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 800;
  color: ${({ theme }) => theme.text1};
  
  :hover {
    cursor: pointer;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
    margin-right: 1rem;
  `};
`

const UniIcon = styled.div`
  transition: all 0.3s ease;
  margin-right: 0.75rem;
  
  :hover {
    transform: scale(1.05) rotate(-5deg);
  }
  
  img {
    border-radius: 50%;
    box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
  }
`

const StyledNavLink = styled(NavLink)<{ $isActive: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 600;
  width: fit-content;
  margin: 0 1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  background: ${({ theme, $isActive }) => 
    $isActive 
      ? `linear-gradient(135deg, ${theme.primary1}, ${theme.primary2})` 
      : 'transparent'
  };
  
  color: ${({ theme, $isActive }) => ($isActive ? '#FFFFFF' : theme.text2)};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, ${({ theme }) => theme.primary1}, ${({ theme }) => theme.primary2});
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  :hover {
    color: #FFFFFF;
    transform: translateY(-2px);
    
    &::before {
      opacity: ${({ $isActive }) => ($isActive ? 1 : 0.8)};
    }
  }

  :focus {
    color: #FFFFFF;
  }
`

export const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};
  margin-left: 8px;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }

  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`

const SmallContentGrouping = styled.div`
  width: 100%;
  display: none;
  @media (max-width: 1080px) {
    display: initial;
  }
`

export default function Header() {
  const [activeNewtork] = useActiveNetworkVersion()

  const { pathname } = useLocation()

  return (
    <HeaderFrame>
      <HeaderRow>
        <Title to={networkPrefix(activeNewtork)}>
          <UniIcon>
            <img width={'40px'} height={'40px'} src="https://avatars.githubusercontent.com/u/204498666?s=200&v=4" alt="logo" />
          </UniIcon>
          Synthra
        </Title>
        <HeaderLinks>
          <StyledNavLink id={`pool-nav-link`} to={networkPrefix(activeNewtork)} $isActive={pathname === '/'}>
            Overview
          </StyledNavLink>
          <StyledNavLink
            id={`stake-nav-link`}
            to={networkPrefix(activeNewtork) + 'pools'}
            $isActive={pathname.includes('pools')}
          >
            Pools
          </StyledNavLink>
          <StyledNavLink
            id={`stake-nav-link`}
            to={networkPrefix(activeNewtork) + 'tokens'}
            $isActive={pathname.includes('tokens')}
          >
            Tokens
          </StyledNavLink>
        </HeaderLinks>
      </HeaderRow>
      <HeaderControls>
        <NetworkDropdown />
        <SearchSmall />
        <Menu />
      </HeaderControls>
      <SmallContentGrouping>
        <AutoColumn $gap="sm">
          <RowBetween>
            <NetworkDropdown />
            <Menu />
          </RowBetween>
          <SearchSmall />
        </AutoColumn>
      </SmallContentGrouping>
    </HeaderFrame>
  )
}
