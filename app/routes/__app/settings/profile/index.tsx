import type { MetaFunction } from '@remix-run/node';
import { useCallback, useContext } from 'react';
import { Trans } from 'react-i18next';
import type { User } from '@supabase/gotrue-js';

import UserSessionContext from '~/core/session/contexts/user-session';
import UpdateProfileForm from '~/components/profile/UpdateProfileForm';
import SettingsTile from '~/components/settings/SettingsTile';
import useUserSession from '~/core/hooks/use-user-session';
import type UserData from '~/core/session/types/user-data';

export const meta: MetaFunction = () => {
  return {
    title: 'Profile Settings',
  };
};

const ProfileDetailsPage = () => {
  const { userSession, setUserSession } = useContext(UserSessionContext);
  const user = useUserSession();

  const onUpdateProfileData = useCallback(
    (data: Partial<UserData>) => {
      const userRecordData = userSession?.data;

      if (userRecordData) {
        setUserSession({
          ...userSession,
          data: {
            ...userRecordData,
            ...data,
          },
        });
      }
    },
    [setUserSession, userSession]
  );

  const onUpdateAuthData = useCallback(
    (data: Partial<User>) => {
      const user = userSession?.auth;

      if (user) {
        setUserSession({
          ...userSession,
          auth: {
            ...user,
            ...data,
          },
        });
      }
    },
    [setUserSession, userSession]
  );

  if (!user) {
    return null;
  }

  return (
    <SettingsTile
      heading={<Trans i18nKey={'profile:generalTab'} />}
      subHeading={<Trans i18nKey={'profile:generalTabSubheading'} />}
    >
      <UpdateProfileForm
        user={user}
        onUpdateAuthData={onUpdateAuthData}
        onUpdateProfileData={onUpdateProfileData}
      />
    </SettingsTile>
  );
};

export default ProfileDetailsPage;
