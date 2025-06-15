import React, { useRef, useState } from 'react'
import { BookOpen, Code, Info, MessageCircle } from 'react-feather'
import styled from 'styled-components'
import { ReactComponent as MenuIcon } from '../../assets/images/menu.svg'
import { useOnClickOutside } from '../../hooks/useOnClickOutside'

import { ExternalLink } from '../../theme'

const StyledMenuIcon = styled(MenuIcon)`
  path {
    stroke: ${({ theme }) => theme.text1};
  }
`


const StyledMenuButton = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  margin: 0;
  padding: 0;
  height: 40px;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background: rgba(139, 92, 246, 0.2);
    transform: scale(1.05);
  }

  svg {
    margin-top: 0;
  }
`

const StyledMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`

const MenuFlyout = styled.span`
  min-width: 12rem;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 20px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 3.5rem;
  right: 0rem;
  z-index: 1000;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
`

const MenuItem = styled(ExternalLink)`
  flex: 1;
  padding: 1rem;
  margin: 0.25rem 0;
  color: ${({ theme }) => theme.text2};
  border-radius: 16px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  font-weight: 500;
  background: transparent;
  
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
    background: rgba(139, 92, 246, 0.1);
    transform: translateX(4px);
  }
  
  > svg {
    margin-right: 12px;
    opacity: 0.7;
    transition: opacity 0.3s ease;
  }
  
  :hover > svg {
    opacity: 1;
  }
`

const CODE_LINK = 'https://github.com/Synthra-swap/synthra-info'

export default function Menu() {
  const node = useRef<HTMLDivElement>(null)
  const [isOpen, setOpen] = useState(false)

  useOnClickOutside(node, isOpen ? () => setOpen(false) : undefined)

  return (
    <StyledMenu ref={node}>
      <StyledMenuButton onClick={() => setOpen((open) => !open)}>
        <StyledMenuIcon />
      </StyledMenuButton>

      {isOpen && (
        <MenuFlyout>
          <MenuItem id="link" href="https://synthra.org/">
            <Info size={14} />
            About
          </MenuItem>
          <MenuItem id="link" href="https://docs.synthra.org/">
            <BookOpen size={14} />
            Docs
          </MenuItem>
          <MenuItem id="link" href={CODE_LINK}>
            <Code size={14} />
            Github
          </MenuItem>
          <MenuItem id="link" href="https://discord.gg/eesEKPRDtd">
            <MessageCircle size={14} />
            Discord
          </MenuItem>
        </MenuFlyout>
      )}
    </StyledMenu>
  )
}
