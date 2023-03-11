import { Trans } from 'react-i18next';
import type { MetaFunction } from '@remix-run/node';

import UpdateOrganizationForm from '~/components/organizations/UpdateOrganizationForm';
import SettingsTile from '~/components/settings/SettingsTile';

export const meta: MetaFunction = () => {
  return {
    title: 'Organization Details',
  };
};

const OrganizationSettingsPage = () => {
  return (
    <SettingsTile
      heading={<Trans i18nKey={'organization:generalTabLabel'} />}
      subHeading={<Trans i18nKey={'organization:generalTabLabelSubheading'} />}
    >
      <UpdateOrganizationForm />
    </SettingsTile>
  );
};

export default OrganizationSettingsPage;
