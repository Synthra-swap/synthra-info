import React, { HTMLAttributes } from 'react'
import styled from 'styled-components'
import { darken, lighten } from 'polished'

import { RowBetween } from '../Row'
import { ChevronDown, Check, Star } from 'react-feather'
import { Button as RebassButton, ButtonProps } from 'rebass/styled-components'
import useTheme from 'hooks/useTheme'

const Base = styled(RebassButton as any)<{
  padding?: string
  width?: string
  borderRadius?: string
  altDisabledStyle?: boolean
}>`
  padding: ${({ padding }) => (padding ? padding : '12px 24px')};
  width: ${({ width }) => (width ? width : '100%')};
  font-weight: 600;
  text-align: center;
  border-radius: 16px;
  border-radius: ${({ borderRadius }) => borderRadius && borderRadius};
  outline: none;
  border: none;
  color: white;
  text-decoration: none;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
  overflow: hidden;
  
  &:disabled {
    cursor: auto;
  }

  > * {
    user-select: none;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s ease;
  }
  
  &:hover::before {
    transform: translateX(100%);
  }
`

export const ButtonPrimary = styled(Base)<{ bgColor?: string; altDisabledStyle?: boolean }>`
  background: linear-gradient(135deg, ${({ theme, bgColor }) => bgColor ?? theme.primary1}, ${({ theme, bgColor }) => bgColor ?? theme.primary2});
  color: white;
  border: none;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
  
  &:focus {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.6);
  }
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.6);
  }
  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
  }
  &:disabled {
    background: ${({ theme, altDisabledStyle, disabled }) =>
      altDisabledStyle ? (disabled ? theme.bg3 : 'linear-gradient(135deg, ' + theme.primary1 + ', ' + theme.primary2 + ')') : theme.bg3};
    color: ${({ theme, altDisabledStyle, disabled }) =>
      altDisabledStyle ? (disabled ? theme.text3 : 'white') : theme.text3};
    cursor: auto;
    box-shadow: none;
    border: none;
    transform: none;
    opacity: ${({ altDisabledStyle }) => (altDisabledStyle ? '0.5' : '1')};
  }
`

export const ButtonLight = styled(Base)`
  background-color: ${({ theme }) => theme.primary5};
  color: ${({ theme }) => theme.primaryText1};
  font-size: 16px;
  font-weight: 500;
  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme, disabled }) => !disabled && darken(0.03, theme.primary5)};
    background-color: ${({ theme, disabled }) => !disabled && darken(0.03, theme.primary5)};
  }
  &:hover {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.03, theme.primary5)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme, disabled }) => !disabled && darken(0.05, theme.primary5)};
    background-color: ${({ theme, disabled }) => !disabled && darken(0.05, theme.primary5)};
  }
  :disabled {
    opacity: 0.4;
    :hover {
      cursor: auto;
      background-color: ${({ theme }) => theme.primary5};
      box-shadow: none;
      border: 1px solid transparent;
      outline: none;
    }
  }
`

export const ButtonGray = styled(Base)`
  background-color: ${({ theme }) => theme.bg3};
  color: ${({ theme }) => theme.text2};
  font-size: 16px;
  font-weight: 500;
  outline: none;
  &:focus {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.05, theme.bg4)};
    outline: none;
  }
  &:hover {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.05, theme.bg4)};
    outline: none;
  }
  &:active {
    background-color: ${({ theme, disabled }) => !disabled && darken(0.1, theme.bg4)};
    outline: none;
  }
`

export const ButtonSecondary = styled(Base)<{ padding?: string }>`
  border: 1px solid ${({ theme }) => theme.primary4};
  color: ${({ theme }) => theme.primary1};
  background-color: transparent;
  font-size: 16px;
  border-radius: 12px;
  padding: ${({ padding }) => (padding ? padding : '10px')};

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.primary4};
    border: 1px solid ${({ theme }) => theme.primary3};
  }
  &:hover {
    border: 1px solid ${({ theme }) => theme.primary3};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => theme.primary4};
    border: 1px solid ${({ theme }) => theme.primary3};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
  a:hover {
    text-decoration: none;
  }
`

export const ButtonPink = styled(Base)`
  background-color: ${({ theme }) => theme.primary1};
  color: white;

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.primary1)};
    background-color: ${({ theme }) => darken(0.05, theme.primary1)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.primary1)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.primary1)};
    background-color: ${({ theme }) => darken(0.1, theme.primary1)};
  }
  &:disabled {
    background-color: ${({ theme }) => theme.primary1};
    opacity: 50%;
    cursor: auto;
  }
`

export const ButtonUNIGradient = styled(ButtonPrimary)`
  color: white;
  padding: 4px 8px;
  height: 36px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.bg3};
  background: radial-gradient(174.47% 188.91% at 1.84% 0%, #ff007a 0%, #2172e5 100%), #edeef2;
  width: fit-content;
  position: relative;
  cursor: pointer;
  border: none;
  white-space: no-wrap;
  :hover {
    opacity: 0.8;
  }
  :active {
    opacity: 0.9;
  }
`

export const ButtonOutlined = styled(Base)`
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: transparent;
  color: ${({ theme }) => theme.text1};

  &:focus {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }
  &:hover {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }
  &:active {
    box-shadow: 0 0 0 1px ${({ theme }) => theme.bg4};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

export const ButtonEmpty = styled(Base)`
  background-color: transparent;
  color: ${({ theme }) => theme.primary1};
  display: flex;
  justify-content: center;
  align-items: center;

  &:focus {
    text-decoration: underline;
  }
  &:hover {
    text-decoration: none;
  }
  &:active {
    text-decoration: none;
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

export const ButtonWhite = styled(Base)`
  border: 1px solid #edeef2;
  background-color: ${({ theme }) => theme.bg1};
  color: black;

  &:focus {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    box-shadow: 0 0 0 1pt ${darken(0.05, '#edeef2')};
  }
  &:hover {
    box-shadow: 0 0 0 1pt ${darken(0.1, '#edeef2')};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${darken(0.1, '#edeef2')};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

const ButtonConfirmedStyle = styled(Base)`
  background-color: ${({ theme }) => lighten(0.5, theme.green1)};
  color: ${({ theme }) => theme.green1};
  border: 1px solid ${({ theme }) => theme.green1};

  &:disabled {
    opacity: 50%;
    cursor: auto;
  }
`

const ButtonErrorStyle = styled(Base)`
  background-color: ${({ theme }) => theme.red1};
  border: 1px solid ${({ theme }) => theme.red1};

  &:focus {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.05, theme.red1)};
    background-color: ${({ theme }) => darken(0.05, theme.red1)};
  }
  &:hover {
    background-color: ${({ theme }) => darken(0.05, theme.red1)};
  }
  &:active {
    box-shadow: 0 0 0 1pt ${({ theme }) => darken(0.1, theme.red1)};
    background-color: ${({ theme }) => darken(0.1, theme.red1)};
  }
  &:disabled {
    opacity: 50%;
    cursor: auto;
    box-shadow: none;
    background-color: ${({ theme }) => theme.red1};
    border: 1px solid ${({ theme }) => theme.red1};
  }
`

export function ButtonConfirmed({
  confirmed,
  altDisabledStyle,
  ...rest
}: { confirmed?: boolean; altDisabledStyle?: boolean } & ButtonProps) {
  if (confirmed) {
    return <ButtonConfirmedStyle {...rest} />
  } else {
    return <ButtonPrimary {...rest} altDisabledStyle={altDisabledStyle} />
  }
}

export function ButtonError({ error, ...rest }: { error?: boolean } & ButtonProps) {
  if (error) {
    return <ButtonErrorStyle {...rest} />
  } else {
    return <ButtonPrimary {...rest} />
  }
}

export function ButtonDropdown({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
  return (
    <ButtonPrimary {...rest} disabled={disabled}>
      <RowBetween>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
        <ChevronDown size={24} />
      </RowBetween>
    </ButtonPrimary>
  )
}

export function ButtonDropdownGrey({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
  return (
    <ButtonGray {...rest} disabled={disabled} style={{ borderRadius: '20px' }}>
      <RowBetween>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
        <ChevronDown size={24} />
      </RowBetween>
    </ButtonGray>
  )
}

export function ButtonDropdownLight({ disabled = false, children, ...rest }: { disabled?: boolean } & ButtonProps) {
  return (
    <ButtonOutlined {...rest} disabled={disabled}>
      <RowBetween>
        <div style={{ display: 'flex', alignItems: 'center' }}>{children}</div>
        <ChevronDown size={24} />
      </RowBetween>
    </ButtonOutlined>
  )
}

export function ButtonRadio({ active, ...rest }: { active?: boolean } & ButtonProps) {
  if (!active) {
    return <ButtonWhite {...rest} />
  } else {
    return <ButtonPrimary {...rest} />
  }
}

const ActiveOutlined = styled(ButtonOutlined)`
  border: 1px solid;
  border-color: ${({ theme }) => theme.primary1};
`

const Circle = styled.div`
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.primary1};
  display: flex;
  align-items: center;
  justify-content: center;
`

const CheckboxWrapper = styled.div`
  width: 30px;
  padding: 0 10px;
`

export function ButtonRadioChecked({ active = false, children, ...rest }: { active?: boolean } & ButtonProps) {
  if (!active) {
    return (
      <ButtonOutlined borderRadius="12px" padding="12px 8px" {...rest}>
        {<RowBetween>{children}</RowBetween>}
      </ButtonOutlined>
    )
  } else {
    return (
      <ActiveOutlined {...rest} padding="12px 8px" borderRadius="12px">
        {
          <RowBetween>
            {children}
            <CheckboxWrapper>
              <Circle>
                <Check size={13} />
              </Circle>
            </CheckboxWrapper>
          </RowBetween>
        }
      </ActiveOutlined>
    )
  }
}

const HoverIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  :hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

export const SavedIcon = ({
  fill = false,
  size = '20px',
  ...rest
}: { fill: boolean; size?: string } & HTMLAttributes<HTMLDivElement>) => {
  const theme = useTheme()
  return (
    <HoverIcon {...rest}>
      <Star stroke={theme?.text2} fill={fill ? theme?.text2 : 'transparent'} size={size} />
    </HoverIcon>
  )
}

export const SmallOptionButton = styled(Base)<{ $active?: boolean }>`
  padding: 4px;
  width: fit-content;
  font-size: 12px;
  border-radius: 4px;
  min-width: 36px;
  background-color: ${({ $active, theme }) => ($active ? theme.bg2 : theme.bg1)};
  color: ${({ $active, theme }) => ($active ? theme.text1 : theme.text2)};

  :hover {
    opacity: 0.6;
  }
`

export const SmallOption = styled(ButtonOutlined)`
  padding: 4px;
`
