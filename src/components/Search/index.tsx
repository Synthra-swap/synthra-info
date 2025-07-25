import React, { useRef, useCallback, useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import Row, { RowFixed } from 'components/Row'
import { HideSmall, TYPE } from 'theme'
import Hotkeys from 'react-hot-keys'
import { useFetchSearchResults } from 'data/search'
import { AutoColumn } from 'components/Column'
import CurrencyLogo from 'components/CurrencyLogo'
import { formatDollarAmount } from 'utils/numbers'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { GreyBadge } from 'components/Card'
import { feeTierPercent } from 'utils'
import { useSavedTokens, useSavedPools } from 'state/user/hooks'
import { SavedIcon } from 'components/Button'
import { useTokenDatas } from 'state/tokens/hooks'
import { usePoolDatas } from 'state/pools/hooks'
import HoverInlineText from 'components/HoverInlineText'
import { POOL_ALLOW_LIST, TOKEN_ALLOW_LIST } from '../../constants/index'
import { useActiveNetworkVersion } from 'state/application/hooks'
import { networkPrefix } from 'utils/networkPrefix'
import { useNavigate } from 'react-router-dom'

const Container = styled.div`
  position: relative;
  z-index: 30;
  width: 100%;
`

const Wrapper = styled(Row)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 20px;
  width: 500px;
  height: 44px;
  border-radius: 24px;
  position: relative;
  z-index: 9999;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(139, 92, 246, 0.3);
    background: rgba(255, 255, 255, 0.08);
  }

  &:focus-within {
    border-color: ${({ theme }) => theme.primary1};
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
  }

  @media (max-width: 1080px) {
    width: 100%;
  }
`

const StyledInput = styled.input`
  position: relative;
  display: flex;
  align-items: center;
  white-space: nowrap;
  background: none;
  border: none;
  width: 100%;
  font-size: 16px;
  outline: none;
  color: ${({ theme }) => theme.text1};

  ::placeholder {
    color: ${({ theme }) => theme.text3};
    font-size: 16px;
  }

  @media screen and (max-width: 640px) {
    ::placeholder {
      font-size: 1rem;
    }
  }
`

const Menu = styled.div<{ $hide: boolean }>`
  display: flex;
  flex-direction: column;
  z-index: 9999;
  width: 800px;
  top: 60px;
  max-height: 600px;
  overflow: auto;
  right: 0;
  padding: 2rem;
  position: absolute;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(139, 92, 246, 0.2);
  display: ${({ $hide }) => $hide && 'none'};

  ${({ theme }) => theme.mediaWidth.upToMedium`
    position: absolute;
    margin-top: 4px;
    z-index: 9999;
    width: 100%;
    max-height: 400px;
  `};
`

const Blackout = styled.div`
  position: absolute;
  min-height: 100vh;
  width: 100vw;
  z-index: -40;
  background-color: black;
  opacity: 0.7;
  left: 0;
  top: 0;
`

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 1.5fr repeat(3, 1fr);
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 1fr;
  `};
`

const Break = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.bg1};
  width: 100%;
`

const HoverText = styled.div<{ $hide?: boolean | undefined }>`
  color: ${({ theme }) => theme.blue1};
  display: ${({ $hide = false }) => $hide && 'none'};
  :hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const HoverRowLink = styled.div`
  :hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const OptionButton = styled.div<{ $enabled: boolean }>`
  width: fit-content;
  padding: 8px 16px;
  border-radius: 16px;
  display: flex;
  font-size: 14px;
  font-weight: 600;
  margin-right: 12px;
  justify-content: center;
  align-items: center;
  background: ${({ theme, $enabled }) => 
    $enabled 
      ? `linear-gradient(135deg, ${theme.primary1}, ${theme.primary2})` 
      : 'rgba(255, 255, 255, 0.05)'
  };
  color: ${({ theme, $enabled }) => ($enabled ? '#FFFFFF' : theme.text2)};
  transition: all 0.3s ease;
  
  :hover {
    cursor: pointer;
    background: ${({ theme, $enabled }) => 
      $enabled 
        ? `linear-gradient(135deg, ${theme.primary1}, ${theme.primary2})` 
        : 'rgba(255, 255, 255, 0.1)'
    };
    transform: translateY(-1px);
  }
`

const Search = ({ ...rest }: React.HTMLAttributes<HTMLDivElement>) => {
  const navigate = useNavigate()
  const [activeNetwork] = useActiveNetworkVersion()

  const ref = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  const handleDown = useCallback(() => {
    if (ref != null && ref.current !== null) {
      ref.current.focus()
    }
  }, [])

  const [focused, setFocused] = useState<boolean>(false)
  const [showMenu, setShowMenu] = useState(false)
  const [value, setValue] = useState('')

  const { tokens, pools } = useFetchSearchResults(value)

  useEffect(() => {
    if (value !== '') {
      setFocused(true)
    } else {
      setFocused(false)
    }
  }, [value])

  const [tokensShown, setTokensShown] = useState(3)
  const [poolsShown, setPoolsShown] = useState(3)

  const handleClick = (e: any) => {
    if (!(menuRef.current && menuRef.current.contains(e.target)) && !(ref.current && ref.current.contains(e.target))) {
      setPoolsShown(3)
      setTokensShown(3)
      setShowMenu(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
    }
  })

  // watchlist
  const [savedTokens, addSavedToken] = useSavedTokens()
  const [savedPools, addSavedPool] = useSavedPools()

  const handleNav = (to: string) => {
    setShowMenu(false)
    setPoolsShown(3)
    setTokensShown(3)
    navigate(to)
  }

  // get date for watchlist
  const watchListTokenData = useTokenDatas(savedTokens)
  const watchListPoolData = usePoolDatas(savedPools)

  // filter on view
  const [showWatchlist, setShowWatchlist] = useState(false)
  const tokensForList = useMemo(
    () => (showWatchlist ? watchListTokenData ?? [] : tokens.sort((t0, t1) => (t0.volumeUSD > t1.volumeUSD ? -1 : 1))),
    [showWatchlist, tokens, watchListTokenData],
  )
  const poolForList = useMemo(
    () => (showWatchlist ? watchListPoolData ?? [] : pools.sort((p0, p1) => (p0.volumeUSD > p1.volumeUSD ? -1 : 1))),
    [pools, showWatchlist, watchListPoolData],
  )

  return (
    <Hotkeys keyName="command+/" onKeyDown={handleDown}>
      {showMenu ? <Blackout /> : null}
      <Container>
        <Wrapper {...rest}>
          <StyledInput
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
            }}
            placeholder="Search pools or tokens"
            ref={ref}
            onFocus={() => {
              setFocused(true)
              setShowMenu(true)
            }}
            onBlur={() => setFocused(false)}
          />
          {!focused && <TYPE.gray pl="2px">⌘/</TYPE.gray>}
        </Wrapper>
        <Menu $hide={!showMenu} ref={menuRef}>
          <AutoColumn $gap="lg">
            <AutoColumn $gap="sm">
              <RowFixed>
                <OptionButton $enabled={!showWatchlist} onClick={() => setShowWatchlist(false)}>
                  Search
                </OptionButton>
                <OptionButton $enabled={showWatchlist} onClick={() => setShowWatchlist(true)}>
                  Watchlist
                </OptionButton>
              </RowFixed>
            </AutoColumn>
            <ResponsiveGrid>
              <TYPE.main>Tokens</TYPE.main>
              <HideSmall>
                <TYPE.main textAlign="end" fontSize="12px">
                  Volume 24H
                </TYPE.main>
              </HideSmall>
              <HideSmall>
                <TYPE.main textAlign="end" fontSize="12px">
                  TVL
                </TYPE.main>
              </HideSmall>
              <HideSmall>
                <TYPE.main textAlign="end" fontSize="12px">
                  Price
                </TYPE.main>
              </HideSmall>
            </ResponsiveGrid>
            {tokensForList
              .filter((t) => TOKEN_ALLOW_LIST[activeNetwork.id].includes(t.address))
              .slice(0, tokensShown)
              .map((t, i) => {
                return (
                  <HoverRowLink onClick={() => handleNav(networkPrefix(activeNetwork) + 'tokens/' + t.address)} key={i}>
                    <ResponsiveGrid>
                      <RowFixed>
                        <CurrencyLogo address={t.address} />
                        <TYPE.label ml="10px">
                          <HoverInlineText text={`${t.name} (${t.symbol})`} />{' '}
                        </TYPE.label>
                        <SavedIcon
                          id="watchlist-icon"
                          size={'16px'}
                          style={{ marginLeft: '8px' }}
                          fill={savedTokens.includes(t.address)}
                          onClick={(e) => {
                            e.stopPropagation()
                            addSavedToken(t.address)
                          }}
                        />
                      </RowFixed>
                      <HideSmall>
                        <TYPE.label textAlign="end">{formatDollarAmount(t.volumeUSD)}</TYPE.label>
                      </HideSmall>
                      <HideSmall>
                        <TYPE.label textAlign="end">{formatDollarAmount(t.tvlUSD)}</TYPE.label>
                      </HideSmall>
                      <HideSmall>
                        <TYPE.label textAlign="end">{formatDollarAmount(t.priceUSD)}</TYPE.label>
                      </HideSmall>
                    </ResponsiveGrid>
                  </HoverRowLink>
                )
              })}
            {tokensForList.length === 0 ? (
              <TYPE.main>{showWatchlist ? 'Saved tokens will appear here' : 'No results'}</TYPE.main>
            ) : null}
            <HoverText
              onClick={() => {
                setTokensShown(tokensShown + 5)
              }}
              $hide={!(tokensForList.length > 3 && tokensForList.length >= tokensShown)}
              ref={textRef}
            >
              See more...
            </HoverText>
            <Break />
            <ResponsiveGrid>
              <TYPE.main>Pools</TYPE.main>
              <HideSmall>
                <TYPE.main textAlign="end" fontSize="12px">
                  Volume 24H
                </TYPE.main>
              </HideSmall>
              <HideSmall>
                <TYPE.main textAlign="end" fontSize="12px">
                  TVL
                </TYPE.main>
              </HideSmall>
              <HideSmall>
                <TYPE.main textAlign="end" fontSize="12px">
                  Price
                </TYPE.main>
              </HideSmall>
            </ResponsiveGrid>
            {poolForList
              .filter((p) => POOL_ALLOW_LIST[activeNetwork.id].includes(p.address))
              .slice(0, poolsShown)
              .map((p, i) => {
                return (
                  <HoverRowLink onClick={() => handleNav(networkPrefix(activeNetwork) + 'pools/' + p.address)} key={i}>
                    <ResponsiveGrid key={i}>
                      <RowFixed>
                        <DoubleCurrencyLogo address0={p.token0.address} address1={p.token1.address} />
                        <TYPE.label ml="10px" style={{ whiteSpace: 'nowrap' }}>
                          <HoverInlineText maxCharacters={12} text={`${p.token0.symbol} / ${p.token1.symbol}`} />
                        </TYPE.label>
                        <GreyBadge ml="10px">{feeTierPercent(p.feeTier)}</GreyBadge>
                        <SavedIcon
                          id="watchlist-icon"
                          size={'16px'}
                          style={{ marginLeft: '10px' }}
                          fill={savedPools.includes(p.address)}
                          onClick={(e) => {
                            e.stopPropagation()
                            addSavedPool(p.address)
                          }}
                        />
                      </RowFixed>
                      <HideSmall>
                        <TYPE.label textAlign="end">{formatDollarAmount(p.volumeUSD)}</TYPE.label>
                      </HideSmall>
                      <HideSmall>
                        <TYPE.label textAlign="end">{formatDollarAmount(p.tvlUSD)}</TYPE.label>
                      </HideSmall>
                      <HideSmall>
                        <TYPE.label textAlign="end">{formatDollarAmount(p.token0Price)}</TYPE.label>
                      </HideSmall>
                    </ResponsiveGrid>
                  </HoverRowLink>
                )
              })}
            {poolForList.length === 0 ? (
              <TYPE.main>{showWatchlist ? 'Saved pools will appear here' : 'No results'}</TYPE.main>
            ) : null}
            <HoverText
              onClick={() => {
                setPoolsShown(poolsShown + 5)
              }}
              $hide={!(poolForList.length > 3 && poolForList.length >= poolsShown)}
              ref={textRef}
            >
              See more...
            </HoverText>
          </AutoColumn>
        </Menu>
      </Container>
    </Hotkeys>
  )
}

export default Search
