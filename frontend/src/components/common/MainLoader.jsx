import styled from "styled-components";

import { motion } from "framer-motion";

const PathsContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;
`;

const StyledSvg = styled.svg`
  width: 100%;
  height: 100%;
  color: #0f172a;

  .dark & {
    color: white;
  }
`;

const MotionLoaderContainer = styled(motion.div)`
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: white;

  .dark & {
    background-color: #171717;
  }
`;

const PathsWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
  text-align: center;
`;

const AnimatedContainer = styled(motion.div)`
  max-width: 56rem;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-family: Geist;
  color: var(--dark-800);
  font-weight: 700;
  font-style: normal;
  margin-bottom: 2rem;
  font-size: 3rem;
  line-height: 120%;
  letter-spacing: 10px;

  @media (min-width: 640px) {
    font-size: 4.5rem;
  }

  @media (min-width: 768px) {
    font-size: 6rem;
  }
`;

const Word = styled.span`
  display: inline-block;
  margin-right: 1rem;

  &:last-child {
    margin-right: 0;
  }
`;

const Letter = styled(motion.span)`
  display: inline-block;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-image: linear-gradient(to right, #111827, rgba(55, 65, 81, 0.8));

  .dark & {
    background-image: linear-gradient(
      to right,
      white,
      rgba(255, 255, 255, 0.8)
    );
  }
`;

const PlaceholderDiv = styled.div`
  display: inline-block;
  position: relative;
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1),
    rgba(255, 255, 255, 0.1)
  );
  padding: 1px;
  border-radius: 1rem;
  backdrop-filter: blur(8px);
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: box-shadow 300ms ease;

  &:hover {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  .dark & {
    background-image: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.1),
      rgba(0, 0, 0, 0.1)
    );
  }
`;

function FloatingPaths({ position }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <PathsContainer>
      <StyledSvg viewBox="0 0 696 316" fill="none">
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </StyledSvg>
    </PathsContainer>
  );
}

const MainLoader = ({ title = "Cargando." }) => {
  const words = title.split(" ");

  return (
    <MotionLoaderContainer
      animate={{ opacity: 1 }} // Siempre visible
    >
      <PathsWrapper>
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </PathsWrapper>

      <ContentWrapper>
        <AnimatedContainer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          <Title>
            {words.map((word, wordIndex) => (
              <Word key={wordIndex}>
                {word.split("").map((letter, letterIndex) => (
                  <Letter
                    key={`${wordIndex}-${letterIndex}`}
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: wordIndex * 0.1 + letterIndex * 0.03,
                      type: "spring",
                      stiffness: 150,
                      damping: 25,
                    }}
                  >
                    {letter}
                  </Letter>
                ))}
              </Word>
            ))}
          </Title>

          <PlaceholderDiv />
        </AnimatedContainer>
      </ContentWrapper>
    </MotionLoaderContainer>
  );
};

export default MainLoader;
