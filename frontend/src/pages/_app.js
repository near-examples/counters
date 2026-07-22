import '@/styles/globals.css';

import { useEffect } from 'react';
import { NearProvider } from 'near-connect-hooks';

import { Navigation } from '@/components/Navigation';
import { NetworkId } from '@/config';

export default function App({ Component, pageProps }) {
  // Keep Bootstrap's color mode in sync with the system preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () =>
      document.documentElement.setAttribute('data-bs-theme', mq.matches ? 'dark' : 'light');
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return (
    <NearProvider config={{ network: NetworkId }}>
      <Navigation />
      <Component {...pageProps} />
    </NearProvider>
  );
}
