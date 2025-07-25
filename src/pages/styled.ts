import styled from 'styled-components'

export const PageWrapper = styled.div`
  width: 95%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 0;
  
  @media (max-width: 1200px) {
    width: 90%;
  }
  
  @media (max-width: 768px) {
    width: 95%;
    padding: 1rem 0;
  }
`

export const ThemedBackground = styled.div<{ $backgroundColor: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  max-width: 100vw !important;
  height: 200vh;
  mix-blend-mode: color;
  background: ${({ $backgroundColor }) =>
    `radial-gradient(50% 50% at 50% 50%, ${$backgroundColor} 0%, rgba(255, 255, 255, 0) 100%)`};
  transform: translateY(-176vh);
`

export const ThemedBackgroundGlobal = styled.div<{ $backgroundColor: string }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  max-width: 100vw !important;
  height: 200vh;
  mix-blend-mode: color;
  background: ${({ $backgroundColor }) =>
    `radial-gradient(50% 50% at 50% 50%, ${$backgroundColor} 0%, rgba(255, 255, 255, 0) 100%)`};
  transform: translateY(-150vh);
`
