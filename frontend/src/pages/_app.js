import '@/styles/globals.css';
import { Navigation } from '@/components/Navigation';
import { NearProvider } from '@/components/near-provider';

export default function MyApp({ Component, pageProps }) {
  return (
    <NearProvider>
      <Navigation />
      <Component {...pageProps} />
    </NearProvider>
  );
}
