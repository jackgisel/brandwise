import FacebookLogin from '@greatsumini/react-facebook-login';
import axios from 'axios';
import Button from '~/core/ui/Button';
import Heading from '~/core/ui/Heading';
import Tile from '~/core/ui/Tile';

const appSecret = process.env.FACEBOOK_SECRET;
const BASE_URL = 'https://graph.facebook.com/v15.0/';

const socialMedias = [
  {
    id: 'Facebook',
    name: 'Facebook',
    status: 'Live',
    buttonWrapper: (setAccounts) => (
      <FacebookLogin
        appId="5865701926823779"
        scope="email,public_profile,pages_manage_metadata,pages_read_user_content,pages_manage_engagement,pages_show_list,pages_read_engagement"
        onSuccess={async (response) => {
          const { accessToken, userID } = response;
          // Step 1 - Get a user's long lived access token
          const userData = await axios
            .get(
              `${BASE_URL}oauth/access_token?grant_type=fb_exchange_token&client_id=5865701926823779&client_secret=${appSecret}&fb_exchange_token=${accessToken}`
            )
            .then((response) => response.data)
            .catch(function (error) {
              console.error(
                'Failed to retrieve a long lived token for your Facebook user.'
              );
              console.error(error.response.data.error);
            });
          // Step 3 - Get connected pages
          const connectedPages = await axios
            .get(
              `${BASE_URL}${userID}/accounts?fields=name,access_token&access_token=${userData.access_token}`
            )
            .then(async function (response) {
              const { data } = response;
              console.debug(data);
              return data.data;
            })
            .catch(function (error) {
              console.error('Failed to retrieve connected Facebook pages.');
              console.error(error.data);
            });

          setAccounts([
            {
              id: userID,
              accessToken: userData.access_token,
              name: userData.name,
            },
            ...connectedPages.map((pageData) => ({
              id: pageData.id,
              accessToken: pageData.access_token,
              name: pageData.name,
            })),
          ]);
        }}
        onFail={(error) => {
          console.log('Login Failed!', error);
        }}
        render={({ onClick, logout }) => (
          <Button {...{ onClick }}>Connect</Button>
        )}
      />
    ),
  },
  {
    id: 'Instagram',
    name: 'Instagram',
    status: 'Testing',
  },
  {
    id: 'Tiktok',
    name: 'Tiktok',
    status: 'Coming soon',
  },
];

const AddAccountContainer: React.FC<{
  organizationId: string;
}> = ({ organizationId }) => {
  return (
    <div className={'flex flex-col items-center space-y-4'}>
      <Heading type={1}>Connect a new account</Heading>
      <div className={'mt-2 flex max-w-4xl justify-end'}>
        <SocialsList />
      </div>
    </div>
  );
};

function mapStatusToTrend(status: string): 'up' | 'down' | 'stale' {
  if (status == 'Live') {
    return 'up';
  }

  if (status == 'Coming soon') {
    return 'down';
  }

  return 'stale';
}

function SocialsList({}: React.PropsWithChildren<{}>) {
  return (
    <div className={'flex flex-col space-y-4'}>
      <table className={'Table'}>
        <thead>
          <tr>
            <th>Platform</th>
            <th>Status</th>
            <th>Logins</th>
          </tr>
        </thead>

        <tbody>
          {socialMedias.map((social) => {
            return (
              <tr key={social.id}>
                <td>{social.name}</td>
                <td>
                  <Tile.Badge trend={mapStatusToTrend(social.status)}>
                    {social.status}
                  </Tile.Badge>
                </td>
                <td>
                  {social.status === 'Live' &&
                    social.buttonWrapper &&
                    social.buttonWrapper()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default AddAccountContainer;
