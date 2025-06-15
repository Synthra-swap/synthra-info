import React from 'react'
import styled from 'styled-components'

const ToggleElement = styled.span<{ isActive?: boolean; isOnSwitch?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 18px;
  background: ${({ theme, isActive, isOnSwitch }) => 
    isActive 
      ? (isOnSwitch ? `linear-gradient(135deg, ${theme.primary1}, ${theme.primary2})` : 'transparent') 
      : 'transparent'
  };
  color: ${({ theme, isActive, isOnSwitch }) => 
    isActive 
      ? (isOnSwitch ? '#FFFFFF' : theme.text3) 
      : theme.text3
  };
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  
  :hover {
    user-select: none;
    color: ${({ theme, isActive, isOnSwitch }) => 
      isActive 
        ? (isOnSwitch ? '#FFFFFF' : theme.text2) 
        : theme.text2
    };
  }
`

const StyledToggle = styled.button<{ isActive?: boolean; activeElement?: boolean }>`
  border-radius: 20px;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  width: fit-content;
  cursor: pointer;
  outline: none;
  padding: 2px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
`

export interface ToggleProps {
  id?: string
  isActive: boolean
  toggle: () => void
}

export default function Toggle({ id, isActive, toggle }: ToggleProps) {
  return (
    <StyledToggle id={id} isActive={isActive} onClick={toggle}>
      <ToggleElement isActive={isActive} isOnSwitch={true}>
        On
      </ToggleElement>
      <ToggleElement isActive={!isActive} isOnSwitch={false}>
        Off
      </ToggleElement>
    </StyledToggle>
  )
}

export const ToggleWrapper = styled.button<{ width?: string }>`
  display: flex;
  align-items: center;
  width: ${({ width }) => width ?? '100%'}
  padding: 1px;
  background: ${({ theme }) => theme.bg2};
  border-radius: 12px;
  border: ${({ theme }) => '2px solid ' + theme.bg2};
  cursor: pointer;
  outline: none;
  color: ${({ theme }) => theme.text2};

`

export const ToggleElementFree = styled.span<{ isActive?: boolean; fontSize?: string }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 2px 10px;
  border-radius: 12px;
  justify-content: center;
  height: 100%;
  background: ${({ theme, isActive }) => (isActive ? theme.black : 'none')};
  color: ${({ theme, isActive }) => (isActive ? theme.text1 : theme.text2)};
  font-size: ${({ fontSize }) => fontSize ?? '1rem'};
  font-weight: 600;
  white-space: nowrap;
  :hover {
    user-select: initial;
    color: ${({ theme, isActive }) => (isActive ? theme.text2 : theme.text3)};
  }
  margin-top: 0.5px;
`
