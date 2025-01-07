import React from 'react';
import { CFooter } from '@coreui/react';
import styled, { keyframes } from 'styled-components';

const glowAndFade = keyframes`
  0% {
    opacity: 0.4;
    text-shadow: none;
    background-position: -100% center;
  }
  25% {
    opacity: 0.7;
    color: #1890ff;
    text-shadow: 0 0 5px rgba(24, 144, 255, 0.3),
                 0 0 10px rgba(24, 144, 255, 0.2);
    background-position: -50% center;
  }
  50% {
    opacity: 1;
    color: #1890ff;
    text-shadow: 0 0 5px rgba(24, 144, 255, 0.5),
                 0 0 10px rgba(24, 144, 255, 0.3),
                 0 0 15px rgba(24, 144, 255, 0.2);
    background-position: 0 center;
  }
  75% {
    opacity: 0.7;
    color: #1890ff;
    text-shadow: 0 0 5px rgba(24, 144, 255, 0.3),
                 0 0 10px rgba(24, 144, 255, 0.2);
    background-position: 50% center;
  }
  100% {
    opacity: 0.4;
    text-shadow: none;
    background-position: 100% center;
  }
`;

const Letter = styled.span`
  display: inline-block;
  opacity: ${props => {
    if (props.$isGlowing) return 1;
    if (props.$isAdjacent) return 0.6;
    return 0.4;
  }};
  animation: ${props => props.$isGlowing ? glowAndFade : 'none'} 1s ease-in-out;
  transition: opacity 0.3s ease;
  color: ${props => props.$isGlowing ? '#1890ff' : 'inherit'};
  text-shadow: ${props => props.$isGlowing ? 
    '0 0 5px rgba(24, 144, 255, 0.5), 0 0 10px rgba(24, 144, 255, 0.3)' : 
    'none'};
`;

const PartnerLink = styled.a`
  margin: 0 4px;
  display: inline-block;
  
  &:hover ${Letter} {
    opacity: 1;
    color: #1890ff;
    text-shadow: 0 0 5px rgba(24, 144, 255, 0.5),
                 0 0 10px rgba(24, 144, 255, 0.3);
  }
`;

const Separator = styled.span`
  margin: 0 4px;
  opacity: ${props => props.$isGlowing ? 0.8 : 0.4};
  transition: all 0.3s ease;
  color: ${props => props.$isGlowing ? '#1890ff' : 'inherit'};
`;

const FooterLink = styled.a`
  color: ${({ $isGlowing }) => ($isGlowing ? '#fff' : '#8a93a2')};
  text-decoration: none;
  margin: 0 10px;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    color: ${({ $isGlowing }) => ($isGlowing ? '#fff' : '#321fdb')};
    text-shadow: ${({ $isGlowing }) =>
      $isGlowing ? '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #0073e6' : 'none'};
  }

  ${({ $isAdjacent }) =>
    $isAdjacent &&
    `
    &:after {
      content: '•';
      position: absolute;
      right: -12px;
      color: #8a93a2;
    }
  `}
`;

const AppFooter = () => {
  const partners = [
    { name: 'CoreUI', url: 'https://coreui.io/react' },
    { name: 'ProductX', url: 'https://ProductX.cn' },
    { name: 'ChatGPT', url: 'https://chatgpt.com/' },
    { name: 'Cursor', url: 'https://www.cursor.com/' },
    { name: 'AnakkiX', url: 'https://github.com/Anyuei' },
    { name: 'BigBoy', url: 'https://github.com/mini-blog' }
  ];

  const [glowingLetterIndex, setGlowingLetterIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setGlowingLetterIndex(prev => (prev + 1) % allLetters.length);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const allLetters = partners.reduce((acc, partner, index) => {
    const letters = partner.name.split('').map((letter, letterIndex) => ({
      letter,
      partnerIndex: index,
      letterIndex,
      globalIndex: acc.length
    }));
    if (index < partners.length - 1) {
      letters.push({
        letter: '&',
        partnerIndex: index,
        letterIndex: -1,
        globalIndex: acc.length + letters.length,
        isSeparator: true
      });
    }
    return [...acc, ...letters];
  }, []);

  const isAdjacentLetter = (globalIndex) => {
    return Math.abs(globalIndex - glowingLetterIndex) === 1;
  };

  return (
    <CFooter className="px-4">
      <div>
        <PartnerLink 
          href="https://ProductX.cn" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <strong>ProductX</strong>
        </PartnerLink>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        {partners.map((partner, partnerIndex) => (
          <React.Fragment key={partner.name}>
            <PartnerLink
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {partner.name.split('').map((letter, letterIndex) => {
                const globalIndex = allLetters.findIndex(
                  l => l.partnerIndex === partnerIndex && l.letterIndex === letterIndex
                );
                return (
                  <Letter
                    key={`${partnerIndex}-${letterIndex}`}
                    $isGlowing={globalIndex === glowingLetterIndex}
                    $isAdjacent={isAdjacentLetter(globalIndex)}
                  >
                    {letter}
                  </Letter>
                );
              })}
            </PartnerLink>
            {partnerIndex < partners.length - 1 && (
              <Separator
                $isGlowing={allLetters[glowingLetterIndex]?.isSeparator && 
                          allLetters[glowingLetterIndex]?.partnerIndex === partnerIndex}
              >
                &
              </Separator>
            )}
          </React.Fragment>
        ))}
      </div>
    </CFooter>
  );
};

export default React.memo(AppFooter);
