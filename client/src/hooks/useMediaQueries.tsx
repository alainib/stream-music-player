import useMediaQuery from '@mui/material/useMediaQuery';

export default function useMediaQueries() {
  const isMobile = useMediaQuery('(max-width:600px)');

  return {
    isMobile,
    isDesktop: !isMobile,
  };
}
