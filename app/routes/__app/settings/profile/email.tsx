import { Trans } from 'react-i18next';
import type { MetaFunction } from '@remix-run/node';

import If from '~/core/ui/If';
import Alert from '~/core/ui/Alert';

import UpdateEmailForm from '~/components/profile/UpdateEmailForm';
import SettingsTile from '~/components/settings/SettingsTile';
import useUser from '~/core/hooks/use-user';
export const meta: MetaFunction = () => {
  return {
    title: 'Update Email',
  };
};

const ProfileEmailSettings = () => {
  const { data: user } = useUser();

  if (!user) {
    return null;
  }

  const canUpdateEmail = user.identities?.some(
    (item) => item.provider === `email`
  );

  return (
    <>
      <SettingsTile
        heading={<Trans i18nKey={'profile:emailTab'} />}
        subHeading={<Trans i18nKey={'profile:emailTabTabSubheading'} />}
      >
        <If
          condition={canUpdateEmail}
          fallback={<WarnCannotUpdateEmailAlert />}
        >
          <UpdateEmailForm user={user} />
        </If>
      </SettingsTile>
    </>
  );
};

function WarnCannotUpdateEmailAlert() {
  return (
    <Alert type={'warn'}>
      <Trans i18nKey={'profile:cannotUpdateEmail'} />
    </Alert>
  );
}

export default ProfileEmailSettings;
