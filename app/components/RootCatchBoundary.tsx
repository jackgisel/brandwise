import { Links, Meta, Scripts, useCatch } from '@remix-run/react';
import { Trans } from 'react-i18next';

import HttpStatusCode from '~/core/generic/http-status-code.enum';

import Button from '~/core/ui/Button';
import If from '~/core/ui/If';
import Head from '~/core/ui/Head';
import Heading from '~/core/ui/Heading';
import SiteHeader from '~/components/SiteHeader';

function RootCatchBoundary() {
  const error = useCatch();

  return (
    <html>
      <head>
        <Head />
        <Meta />
        <Links />
        <Scripts />
      </head>
      <body>
        <div className={'flex h-screen flex-1 flex-col justify-between'}>
          <SiteHeader />

          <div className={'m-auto flex w-screen items-center justify-center'}>
            <div className={'flex flex-col space-y-8'}>
              <div
                className={
                  'flex flex-col items-center space-y-8 divide-gray-100 lg:flex-row lg:space-y-0 lg:space-x-8 lg:divide-x'
                }
              >
                <div className={'flex justify-center'}>
                  <Heading type={1}>
                    <span
                      data-cy={'catch-route-status-code'}
                      className={'text-primary-500'}
                    >
                      {error.status === HttpStatusCode.NotFound ? 404 : 500}
                    </span>
                  </Heading>
                </div>

                <div className={'flex flex-col space-y-4 pl-8'}>
                  <div className={'flex flex-col space-y-2'}>
                    <div>
                      <Heading type={1}>
                        <If
                          condition={error.status === HttpStatusCode.NotFound}
                          fallback={
                            <Trans i18nKey={'common:genericServerError'} />
                          }
                        >
                          <Trans i18nKey={'common:pageNotFound'} />
                        </If>
                      </Heading>
                    </div>

                    <p className={'text-gray-500 dark:text-gray-300'}>
                      <If
                        condition={error.status === HttpStatusCode.NotFound}
                        fallback={
                          <Trans i18nKey={'common:genericServerErrorHeading'} />
                        }
                      >
                        <Trans i18nKey={'common:pageNotFoundSubHeading'} />
                      </If>
                    </p>
                  </div>

                  <div className={'flex space-x-4'}>
                    <Button color={'secondary'} href={'/'}>
                      <Trans i18nKey={'common:contactUs'} />
                    </Button>

                    <Button href={'/'}>
                      <Trans i18nKey={'common:backToHomePage'} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

export default RootCatchBoundary;
