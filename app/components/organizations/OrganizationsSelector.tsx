import { useCallback, useContext, useState } from 'react';
import { Trans } from 'react-i18next';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { SelectArrow } from '@radix-ui/react-select';
import { useLocation, useNavigate } from '@remix-run/react';

import type Organization from '~/lib/organizations/types/organization';
import useUserOrganizationsQuery from '~/lib/organizations/hooks/use-user-organizations-query';

import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectSeparator,
  SelectGroup,
  SelectAction,
  SelectLabel,
  SelectValue,
} from '~/core/ui/Select';

import If from '~/core/ui/If';

import UserSessionContext from '~/core/session/contexts/user-session';
import CreateOrganizationModal from './CreateOrganizationModal';
import type MembershipRole from '~/lib/organizations/types/membership-role';
import useCurrentOrganization from '~/lib/organizations/hooks/use-current-organization';

const OrganizationsSelector = () => {
  const [isOrganizationModalOpen, setIsOrganizationModalOpen] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const organization = useCurrentOrganization();
  const { userSession } = useContext(UserSessionContext);

  const userId = userSession?.data?.id as string;
  const selectedOrganizationId = organization?.id.toString() ?? '';
  const pathName = location.pathname;

  const { data, isLoading, refetch } = useUserOrganizationsQuery(userId);
  const value = getPath(selectedOrganizationId, pathName);

  const onCreate = useCallback(
    (organizationId: string) => {
      navigate(getPath(organizationId, pathName));

      return refetch();
    },
    [pathName, navigate, refetch]
  );

  return (
    <>
      <Select
        open={isSelectOpen}
        value={value}
        onOpenChange={setIsSelectOpen}
        onValueChange={navigate}
      >
        <SelectTrigger
          data-cy={'organization-selector'}
          className={'!bg-transparent'}
        >
          <span
            className={'max-w-[5rem] text-sm lg:max-w-[12rem] lg:text-base'}
          >
            <OrganizationItem organization={organization} />

            <span hidden>
              <SelectValue />
            </span>
          </span>
        </SelectTrigger>

        <SelectContent position={'popper'}>
          <SelectArrow />

          <SelectGroup>
            <SelectLabel>Your Organizations</SelectLabel>

            <SelectSeparator />

            <OrganizationsOptions
              organizations={data ?? []}
              organizationId={organization?.id}
            />

            <If condition={isLoading}>
              <SelectItem value={selectedOrganizationId ?? ''}>
                <OrganizationItem organization={organization} />
              </SelectItem>
            </If>
          </SelectGroup>

          <SelectSeparator />

          <SelectGroup>
            <SelectAction
              onClick={() => {
                setIsSelectOpen(false);
                setIsOrganizationModalOpen(true);
              }}
            >
              <span
                data-cy={'create-organization-button'}
                className={'flex flex-row items-center space-x-2 truncate'}
              >
                <PlusCircleIcon className={'h-5'} />

                <span>
                  <Trans
                    i18nKey={'organization:createOrganizationDropdownLabel'}
                  />
                </span>
              </span>
            </SelectAction>
          </SelectGroup>
        </SelectContent>
      </Select>

      <CreateOrganizationModal
        setIsOpen={setIsOrganizationModalOpen}
        isOpen={isOrganizationModalOpen}
        onCreate={onCreate}
      />
    </>
  );
};

function OrganizationsOptions(
  props: React.PropsWithChildren<{
    organizations: Array<{
      organization: Organization;
      role: MembershipRole;
    }>;
    organizationId: Maybe<number>;
  }>
) {
  const location = useLocation();

  return (
    <>
      {props.organizations.map(({ organization }) => {
        const path = getPath(organization.id.toString(), location.pathname);

        return (
          <SelectItem
            data-cy={`organization-selector-${organization.name}`}
            value={path}
            key={organization.id}
          >
            <OrganizationItem organization={organization} />
          </SelectItem>
        );
      })}
    </>
  );
}

function OrganizationItem({
  organization,
}: {
  organization: Maybe<Organization>;
}) {
  const imageSize = 18;

  if (!organization) {
    return null;
  }

  const { logoURL, name } = organization;

  return (
    <span
      data-cy={'organization-selector-item'}
      className={`flex max-w-[12rem] items-center space-x-2`}
    >
      <If condition={logoURL}>
        <span className={'flex items-center'}>
          <img
            decoding={'async'}
            loading={'lazy'}
            style={{
              width: imageSize,
              height: imageSize,
            }}
            width={imageSize}
            height={imageSize}
            alt={`${name} Logo`}
            className={'object-contain'}
            src={logoURL as string}
          />
        </span>
      </If>

      <span className={'w-auto truncate text-sm font-medium'}>{name}</span>
    </span>
  );
}

export default OrganizationsSelector;

function getPath(organizationId: string, path: string) {
  return ['', organizationId, path.slice(1, path.length)].join('/');
}
