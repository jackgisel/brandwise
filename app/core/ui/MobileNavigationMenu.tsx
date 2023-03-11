import { Link, useLocation } from '@remix-run/react';
import { useMemo } from 'react';
import { Trans } from 'react-i18next';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

import {
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenu,
} from '~/core/ui/Dropdown';

const MobileNavigationDropdown: React.FC<{
  links: Array<{
    path: string;
    label: string;
  }>;
}> = ({ links }) => {
  const location = useLocation();
  const path = location.pathname;

  const items = useMemo(
    function MenuItems() {
      return Object.values(links).map((link) => {
        return (
          <DropdownMenuItem key={link.path}>
            <Link
              className={'flex h-full w-full items-center'}
              to={link.path}
            >
              <Trans i18nKey={link.label} defaults={link.label} />
            </Link>
          </DropdownMenuItem>
        );
      });
    },
    [links]
  );

  const currentPathName = useMemo(() => {
    return Object.values(links).find((link) => link.path === path)?.label;
  }, [links, path]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={'w-full'}>
        <div
          className={
            'Button w-full justify-start ring-2 ring-gray-100 dark:ring-black-300'
          }
        >
          <span
            className={
              'ButtonNormal flex w-full items-center justify-between space-x-2'
            }
          >
            <span>
              <Trans i18nKey={currentPathName} defaults={currentPathName} />
            </span>

            <ChevronDownIcon className={'h-5'} />
          </span>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent>{items}</DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MobileNavigationDropdown;
