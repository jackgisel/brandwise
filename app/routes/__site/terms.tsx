import type { MetaFunction } from '@remix-run/node';

import configuration from '~/configuration';
import Hero from '~/core/ui/Hero';
import Container from '~/core/ui/Container';
import SubHeading from '~/core/ui/SubHeading';

export const meta: MetaFunction = () => {
  return {
    title: `Terms of Service - ${configuration.site.siteName}`,
  };
};

const Terms = () => {
  return (
    <div>
      <Container>
        <div className={'flex flex-col space-y-14'}>
          <div className={'flex flex-col items-center'}>
            <Hero>Terms of Service</Hero>
            <SubHeading>Website Terms and Conditions of Use</SubHeading>
          </div>

          <div
            className={
              'm-auto flex w-full max-w-xl flex-col items-center space-y-8' +
              ' justify-center text-gray-600 dark:text-gray-400'
            }
          >
            <SubHeading>1. Terms</SubHeading>

            <div>
              By accessing this Website, accessible from brandwise.ai, you are
              agreeing to be bound by these Website Terms and Conditions of Use
              and agree that you are responsible for the agreement with any
              applicable local laws. If you disagree with any of these terms,
              you are prohibited from accessing this site. The materials
              contained in this Website are protected by copyright and trade
              mark law.
            </div>

            <SubHeading>2. Use License</SubHeading>

            <div>
              Permission is granted to temporarily download one copy of the
              materials on Brandwise's Website for personal, non-commercial
              transitory viewing only. This is the grant of a license, not a
              transfer of title, and under this license you may not: modify or
              copy the materials; use the materials for any commercial purpose
              or for any public display; attempt to reverse engineer any
              software contained on Brandwise's Website; remove any copyright or
              other proprietary notations from the materials; or transferring
              the materials to another person or "mirror" the materials on any
              other server. This will let Brandwise to terminate upon violations
              of any of these restrictions. Upon termination, your viewing right
              will also be terminated and you should destroy any downloaded
              materials in your possession whether it is printed or electronic
              format. These Terms of Service has been created with the help of
              the Terms Of Service Generator.
            </div>

            <SubHeading>3. Disclaimer</SubHeading>

            <div>
              All the materials on Brandwise’s Website are provided "as is".
              Brandwise makes no warranties, may it be expressed or implied,
              therefore negates all other warranties. Furthermore, Brandwise
              does not make any representations concerning the accuracy or
              reliability of the use of the materials on its Website or
              otherwise relating to such materials or any sites linked to this
              Website.
            </div>

            <SubHeading>4. Limitations</SubHeading>

            <div>
              Brandwise or its suppliers will not be hold accountable for any
              damages that will arise with the use or inability to use the
              materials on Brandwise’s Website, even if Brandwise or an
              authorize representative of this Website has been notified, orally
              or written, of the possibility of such damage. Some jurisdiction
              does not allow limitations on implied warranties or limitations of
              liability for incidental damages, these limitations may not apply
              to you.
            </div>

            <SubHeading>5. Revisions and Errata</SubHeading>

            <div>
              The materials appearing on Brandwise’s Website may include
              technical, typographical, or photographic errors. Brandwise will
              not promise that any of the materials in this Website are
              accurate, complete, or current. Brandwise may change the materials
              contained on its Website at any time without notice. Brandwise
              does not make any commitment to update the materials.
            </div>

            <SubHeading>6. Links</SubHeading>

            <div>
              Brandwise has not reviewed all of the sites linked to its Website
              and is not responsible for the contents of any such linked site.
              The presence of any link does not imply endorsement by Brandwise
              of the site. The use of any linked website is at the user’s own
              risk.
            </div>

            <SubHeading>7. Site Terms of Use Modifications</SubHeading>

            <div>
              Brandwise may revise these Terms of Use for its Website at any
              time without prior notice. By using this Website, you are agreeing
              to be bound by the current version of these Terms and Conditions
              of Use.
            </div>

            <SubHeading>8. Your Privacy</SubHeading>

            <div>Please read our Privacy Policy.</div>

            <SubHeading>9. Governing Law</SubHeading>

            <div>
              Any claim related to Brandwise's Website shall be governed by the
              laws of us without regards to its conflict of law provisions.
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Terms;
