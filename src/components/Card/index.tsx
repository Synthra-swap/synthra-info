import styled from 'styled-components'
import { Box } from 'rebass/styled-components'

const Card = styled(Box)<{
  width?: string
  padding?: string
  border?: string
  borderRadius?: string
  $minHeight?: number
}>`
  width: ${({ width }) => width ?? '100%'};
  border-radius: 24px;
  padding: 1.5rem;
  padding: ${({ padding }) => padding};
  border: ${({ border }) => border || 'none'};
  border-radius: ${({ borderRadius }) => borderRadius};
  min-height: ${({ $minHeight }) => `${$minHeight}px`};
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(139, 92, 246, 0.1) 0%, 
      rgba(244, 114, 182, 0.05) 50%, 
      transparent 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
  
  &:hover::before {
    opacity: 1;
  }
`
export default Card

export const LightCard = styled(Card)`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
`

export const LightGreyCard = styled(Card)`
  background: rgba(255, 255, 255, 0.04);
`

export const GreyCard = styled(Card)`
  background: rgba(255, 255, 255, 0.02);
`

export const DarkGreyCard = styled(Card)`
  background: rgba(0, 0, 0, 0.4);
`

export const OutlineCard = styled(Card)`
  border: 1px solid rgba(139, 92, 246, 0.2);
  background: rgba(139, 92, 246, 0.05);
`

export const YellowCard = styled(Card)`
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.05));
  border: 1px solid rgba(251, 191, 36, 0.2);
  color: ${({ theme }) => theme.yellow1};
  font-weight: 500;
`

export const PinkCard = styled(Card)`
  background: linear-gradient(135deg, rgba(244, 114, 182, 0.1), rgba(236, 72, 153, 0.05));
  border: 1px solid rgba(244, 114, 182, 0.2);
  color: ${({ theme }) => theme.pink1};
  font-weight: 500;
`

export const BlueCard = styled(Card)`
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05));
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: ${({ theme }) => theme.blue1};
  border-radius: 16px;
  width: fit-content;
`

export const ScrollableX = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;

  ::-webkit-scrollbar {
    display: none;
  }
`

export const GreyBadge = styled(Card)`
  width: fit-content;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.08);
  color: ${({ theme }) => theme.text1};
  padding: 6px 12px;
  font-weight: 500;
  font-size: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`
