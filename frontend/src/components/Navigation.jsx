import Image from 'next/image';
import Link from 'next/link';

import { useNearWallet } from '@/components/near-provider';
import NearLogo from '/public/near-logo.svg';

export const Navigation = () => {
  const { signedAccountId, loading, signIn, signOut } = useNearWallet();

  const handleAction = () => {
    if (signedAccountId) {
      void signOut();
    } else {
      void signIn();
    }
  };

  const label = loading
    ? 'Loading...'
    : signedAccountId
      ? `Logout ${signedAccountId}`
      : 'Login';

  return (
    <nav className="navbar bg-body border-bottom">
      <div className="container-fluid">
        <Link href="/" className="navbar-brand d-flex align-items-center gap-2">
          <Image priority src={NearLogo} alt="NEAR" width="30" height="24" />
          <span className="fw-semibold">Counter</span>
        </Link>
        <div className='navbar-nav pt-1'>
          <button className="btn btn-secondary" onClick={handleAction} > {label} </button>
        </div>
      </div>
    </nav>
  );
};
