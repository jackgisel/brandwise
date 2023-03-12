import {
  FireIcon,
  UserGroupIcon,
  UserIcon,
  BuildingLibraryIcon,
  CubeIcon,
  PaintBrushIcon,
  DocumentIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  EyeSlashIcon,
  AdjustmentsHorizontalIcon,
  ChatBubbleLeftRightIcon,
  LanguageIcon,
} from '@heroicons/react/24/outline';

import Heading from '~/core/ui/Heading';
import Button from '~/core/ui/Button';
import Hero from '~/core/ui/Hero';
import SubHeading from '~/core/ui/SubHeading';

import Divider from '~/core/ui/Divider';
import Container from '~/core/ui/Container';
import SlideUpTransition from '~/core/ui/SlideUpTransition';
import PricingTable from '~/components/PricingTable';

export default function Index() {
  return (
    <div>
      <Container>
        <SlideUpTransition>
          <div
            className={
              'my-12 flex flex-col items-center md:flex-row lg:my-24' +
              ' mx-auto flex-1 justify-center'
            }
          >
            <div
              className={'flex w-full flex-1 flex-col items-center space-y-10'}
            >
              <Button variant={'flat'} size={'small'} round>
                <span className={'flex items-center space-x-2 font-normal'}>
                  <span>Start your trial today</span>

                  <ChevronRightIcon className={'h-3'} />
                </span>
              </Button>

              <HeroTitle>
                <span>Meet your AI powered</span>

                <span
                  className={
                    'bg-gradient-to-br bg-clip-text text-transparent' +
                    ' from-primary-500 to-primary-400' +
                    ' to-primary-400 leading-[1.2]'
                  }
                >
                  brand manager
                </span>
              </HeroTitle>

              <div
                className={
                  'text-center text-gray-500 dark:text-gray-400' +
                  ' flex w-10/12 flex-col space-y-1 font-heading md:w-full'
                }
              >
                <span>Brandwise automatically hides brand-damaging,</span>

                <span>hateful, racist comments and spam from</span>

                <span>your social media posts and ads.</span>
              </div>

              <div className={'flex space-x-4'}>
                <Button round href={'/auth/sign-up'}>
                  <span className={'flex items-center space-x-2'}>
                    <span>Start now for free</span>
                    <ChevronRightIcon className={'h-3'} />
                  </span>
                </Button>

                <Button round color={'secondary'} href={'/pricing'}>
                  <span className={'flex items-center space-x-2'}>
                    <span>View Pricing</span>
                  </span>
                </Button>
              </div>
            </div>
          </div>

          <div className={'flex justify-center py-12'}>
            <img
              decoding={'async'}
              loading={'lazy'}
              className={
                'hero-image-shadow rounded-2xl' +
                ' shadow-primary-500/40 dark:shadow-primary-500/30'
              }
              width={2894}
              height={1950}
              src={`/assets/images/dashboard-dark.webp`}
              alt={`App`}
            />
          </div>
        </SlideUpTransition>
      </Container>

      <Divider />

      <Container>
        <div
          className={
            'flex flex-col items-center justify-center space-y-24 py-12'
          }
        >
          <div
            className={
              'flex max-w-3xl flex-col items-center space-y-4 text-center'
            }
          >
            <div className={'flex flex-col items-center space-y-2'}>
              <div>
                <FireIcon className={'h-6 text-primary-500'} />
              </div>

              <b className={'text-primary-500'}>Features</b>
            </div>

            <Hero>Protect your brand with peace of mind</Hero>

            <SubHeading>
              24/7 protection across paid and organic social media
            </SubHeading>
          </div>

          <div>
            <div className={'grid gap-12 lg:grid-cols-3'}>
              <div className={'flex flex-col space-y-3 text-center'}>
                <FeatureIcon>
                  <MagnifyingGlassIcon className={'h-6'} />
                </FeatureIcon>

                <Heading type={3}>Sentiment Analysis</Heading>

                <div className={'text-gray-500 dark:text-gray-400'}>
                  Automatically hides brand-damaging, hateful, racist comments
                  and spam from your posts and ads
                </div>
              </div>

              <div className={'flex flex-col space-y-3 text-center'}>
                <FeatureIcon>
                  <EyeSlashIcon className={'h-6'} />
                </FeatureIcon>

                <Heading type={3}>Discreet</Heading>

                <div className={'text-gray-500 dark:text-gray-400'}>
                  Damaging comments are hidden from everyone except for the
                  person that posted them
                </div>
              </div>

              <div className={'flex flex-col space-y-3 text-center'}>
                <FeatureIcon>
                  <AdjustmentsHorizontalIcon className={'h-6'} />
                </FeatureIcon>

                <Heading type={3}>Customizable</Heading>

                <div className={'text-gray-500 dark:text-gray-400'}>
                  Add your own custom keywords that will automatically be
                  removed when detected
                </div>
              </div>

              <div className={'flex flex-col space-y-3 text-center'}>
                <FeatureIcon>
                  <ChatBubbleLeftRightIcon className={'h-6'} />
                </FeatureIcon>

                <Heading type={3}>Respond to Comments</Heading>

                <div className={'text-gray-500 dark:text-gray-400'}>
                  Comments that require a response are automatically flagged and
                  you can easily reply in the dashboard
                </div>
              </div>

              <div className={'flex flex-col space-y-3 text-center'}>
                <FeatureIcon>
                  <LanguageIcon className={'h-6'} />
                </FeatureIcon>

                <Heading type={3}>Multi-lingual</Heading>

                <div className={'text-gray-500 dark:text-gray-400'}>
                  Pre-built UI Components to Speed Up Your Development
                </div>
              </div>

              <div className={'flex flex-col space-y-3 text-center'}>
                <FeatureIcon>
                  <UserGroupIcon className={'h-6'} />
                </FeatureIcon>

                <Heading type={3}>Team Accounts</Heading>

                <div className={'text-gray-500 dark:text-gray-400'}>
                  Set up unlimited user accounts under your organization to give
                  employees easy access
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Divider />

      <Container>
        <div className={'mb-10 flex flex-col space-y-8'}>
          <div className={'flex flex-col items-center'}>
            <Hero>Pricing</Hero>
            <SubHeading>
              Flexible monthly pricing for teams of all sizes. Start with a free
              7-day trial.
            </SubHeading>
          </div>

          <PricingTable />
        </div>
      </Container>

      <Divider />

      <Container>
        <div className={'py-12'}>
          <div
            className={
              'flex flex-col justify-between rounded-lg lg:flex-row' +
              ' space-y-4 bg-primary-50 px-8 py-10 dark:bg-primary-500/5' +
              ' lg:space-y-0'
            }
          >
            <div className={'flex flex-col justify-between space-y-2'}>
              <Heading type={3}>
                <p className={'text-gray-800 dark:text-white'}>
                  What are you waiting for?
                </p>
              </Heading>

              <Heading type={4}>
                <p className={'text-primary-500'}>
                  Sign up now and get your first 7 days for free.
                </p>
              </Heading>
            </div>

            <div className={'flex flex-col justify-end space-y-2'}>
              <div>
                <Button
                  className={'w-full lg:w-auto'}
                  size={'large'}
                  href={'/auth/sign-up'}
                >
                  Get Started
                </Button>
              </div>

              <div className="flex flex-col space-y-2 text-center">
                <span className={'text-xs'}>No credit-card required</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

function HeroTitle({ children }: React.PropsWithChildren) {
  return (
    <h1
      className={
        'text-center text-4xl text-black-500 dark:text-white md:text-5xl' +
        ' flex flex-col space-y-1 font-heading xl:text-7xl'
      }
    >
      {children}
    </h1>
  );
}

function FeatureIcon(props: React.PropsWithChildren) {
  return (
    <div className={'flex justify-center'}>
      <div
        className={'rounded-xl bg-primary-500/10 p-4 dark:bg-primary-500/20'}
      >
        {props.children}
      </div>
    </div>
  );
}
