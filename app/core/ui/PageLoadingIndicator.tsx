import type { PropsWithChildren } from 'react';

import LogoImage from '~/core/ui/Logo/LogoImage';
import If from '~/core/ui/If';
import Spinner from '~/core/ui/Spinner';

export default function PageLoadingIndicator({
  children,
  fullPage,
  displayLogo,
}: PropsWithChildren<{
  fullPage?: boolean;
  displayLogo?: boolean;
}>) {
  const useFullPage = fullPage ?? true;
  const shouldDisplayLogo = displayLogo ?? true;

  return (
    <div
      className={`flex flex-col items-center justify-center space-y-6 ${
        useFullPage
          ? 'fixed top-0 left-0 z-[100] h-screen w-screen bg-white' +
            ' dark:bg-black-500'
          : ''
      }`}
    >
      <If condition={shouldDisplayLogo}>
        <div className={'my-2'}>
          <LogoImage />
        </div>
      </If>

      <div className={'text-primary-500'}>
        <Spinner className={'h-12 w-12'} />
      </div>

      <div className={'text-sm font-medium'}>{children}</div>
    </div>
  );
}
