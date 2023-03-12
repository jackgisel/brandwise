import { Link } from '@remix-run/react';
import Container from '~/core/ui/Container';
import LogoImage from '~/core/ui/Logo/LogoImage';
import configuration from '~/configuration';
import Heading from '~/core/ui/Heading';
import NewsletterSignup from '~/components/NewsletterSignup';

const YEAR = new Date().getFullYear();

function Footer() {
  return (
    <footer className={'py-8 lg:py-24'}>
      <Container>
        <div className={'flex flex-col space-y-8 lg:flex-row lg:space-y-0'}>
          <div
            className={
              'flex w-full space-x-4 lg:w-4/12 lg:space-x-6 xl:w-3/12 xl:space-x-6 2xl:space-x-8'
            }
          >
            <div className={'flex flex-col space-y-4'}>
              <div>
                <LogoImage className={'w-[85px] md:w-[115px]'} />
              </div>

              <div>
                <p className={'text-sm text-gray-500 dark:text-gray-400'}>
                  Your AI powered brand manager
                </p>
              </div>

              <div className={'flex text-xs text-gray-500 dark:text-gray-400'}>
                <p>
                  © Copyright {YEAR} {configuration.site.siteName}. All Rights
                  Reserved.
                </p>
              </div>
            </div>
          </div>

          <div
            className={
              'flex flex-col space-y-8 lg:space-y-0 lg:space-x-10' +
              ' xl:space-x-16 2xl:space-x-20' +
              ' w-full lg:flex-row lg:justify-end'
            }
          >
            <div>
              <div className={'flex flex-col space-y-2'}>
                <Heading type={6}>Product</Heading>

                <FooterSectionList>
                  <FooterLink>
                    <Link to={'/'}>Home</Link>
                  </FooterLink>
                  <FooterLink>
                    <Link to={'/pricing'}>Pricing</Link>
                  </FooterLink>
                  <FooterLink>
                    <Link to={'/contact'}>Contact</Link>
                  </FooterLink>
                </FooterSectionList>
              </div>
            </div>

            <div>
              <div className={'flex flex-col space-y-2'}>
                <Heading type={6}>Company</Heading>

                <FooterSectionList>
                  <FooterLink>
                    <Link to={'https://twitter.com/BrandwiseAI'}>Twitter</Link>
                  </FooterLink>
                  <FooterLink>
                    <Link
                      to={'https://www.linkedin.com/company/brandwiseai/about/'}
                    >
                      Linkedin
                    </Link>
                  </FooterLink>
                  <FooterLink>
                    <Link to={'/terms'}>Terms of Service</Link>
                  </FooterLink>
                  <FooterLink>
                    <Link to={'/privacy'}>Privacy Policy</Link>
                  </FooterLink>
                </FooterSectionList>
              </div>
            </div>

            {/* <NewsletterSignup /> */}
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterSectionList(props: React.PropsWithChildren) {
  return (
    <ul className={'flex flex-col space-y-4 text-gray-500 dark:text-gray-400'}>
      {props.children}
    </ul>
  );
}

function FooterLink(props: React.PropsWithChildren) {
  return (
    <li
      className={
        'text-sm [&>a]:transition-colors [&>a]:hover:text-gray-800' +
        ' dark:[&>a]:hover:text-white'
      }
    >
      {props.children}
    </li>
  );
}

export default Footer;
