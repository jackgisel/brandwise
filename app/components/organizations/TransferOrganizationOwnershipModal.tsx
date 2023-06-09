import { useCallback } from 'react';
import { Trans } from 'react-i18next';
import { useNavigation } from '@remix-run/react';

import useTransferOrganizationOwnership from '~/lib/organizations/hooks/use-transfer-organization-ownership';

import Button from '~/core/ui/Button';
import Modal from '~/core/ui/Modal';
import If from '~/core/ui/If';

const ModalHeading = <Trans i18nKey="organization:transferOwnership" />;

const TransferOrganizationOwnershipModal: React.FC<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  membershipId: number;
  targetDisplayName: string;
}> = ({ isOpen, setIsOpen, targetDisplayName, membershipId }) => {
  const transferOrganizationOwnership = useTransferOrganizationOwnership();

  const navigation = useNavigation();
  const submitting = navigation.state === 'submitting';

  const onConfirmTransferOwnership = useCallback(async () => {
    transferOrganizationOwnership(membershipId);

    setIsOpen(false);
  }, [transferOrganizationOwnership, membershipId, setIsOpen]);

  return (
    <Modal heading={ModalHeading} isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={'flex flex-col space-y-6 text-sm'}>
        <p>
          <Trans
            i18nKey={'organization:transferOwnershipDisclaimer'}
            values={{
              member: targetDisplayName,
            }}
            components={{ b: <b /> }}
          />
        </p>

        <p>
          <Trans i18nKey={'common:modalConfirmationQuestion'} />
        </p>

        <div className={'flex justify-end space-x-2'}>
          <Modal.CancelButton onClick={() => setIsOpen(false)} />

          <Button
            data-cy={'confirm-transfer-ownership-button'}
            color={'danger'}
            variant={'flat'}
            onClick={onConfirmTransferOwnership}
            loading={submitting}
          >
            <If
              condition={submitting}
              fallback={<Trans i18nKey={'organization:transferOwnership'} />}
            >
              <Trans i18nKey={'organization:transferringOwnership'} />
            </If>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TransferOrganizationOwnershipModal;
