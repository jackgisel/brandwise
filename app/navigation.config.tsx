import configuration from '~/configuration';
import {
  Bars3BottomLeftIcon,
  ChatBubbleBottomCenterIcon,
  Cog8ToothIcon,
  Squares2X2Icon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

const NAVIGATION_CONFIG = {
  items: [
    {
      label: 'common:dashboardTabLabel',
      path: configuration.paths.appHome,
      Icon: ({ className }: { className: string }) => {
        return <Squares2X2Icon className={className} />;
      },
    },
    {
      label: 'common:accountsTabLabel',
      path: '/accounts',
      Icon: ({ className }: { className: string }) => {
        return <UserCircleIcon className={className} />;
      },
    },
    {
      label: 'common:postsTabLabel',
      path: '/posts',
      Icon: ({ className }: { className: string }) => {
        return <Bars3BottomLeftIcon className={className} />;
      },
    },
    {
      label: 'common:commentsTabLabel',
      path: '/comments',
      Icon: ({ className }: { className: string }) => {
        return <ChatBubbleBottomCenterIcon className={className} />;
      },
    },
    {
      label: 'common:settingsTabLabel',
      path: '/settings',
      Icon: ({ className }: { className: string }) => {
        return <Cog8ToothIcon className={className} />;
      },
    },
  ],
};

export default NAVIGATION_CONFIG;
