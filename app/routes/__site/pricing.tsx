import type { MetaFunction } from '@remix-run/node';

import Container from '~/core/ui/Container';
import PricingTable from '~/components/PricingTable';
import Hero from '~/core/ui/Hero';
import SubHeading from '~/core/ui/SubHeading';

import configuration from '~/configuration';

export const meta: MetaFunction = () => {
  return {
    title: `Pricing - ${configuration.site.siteName}`,
  };
};

function Pricing() {
  return (
    <Container>
      <div className={'flex flex-col space-y-8'}>
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
  );
}

export default Pricing;
