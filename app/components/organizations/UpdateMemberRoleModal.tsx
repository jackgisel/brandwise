import { useCallback, useState } from 'react';
import { Trans } from 'react-i18next';
import { useNavigation } from '@remix-run/react';

import Button from '~/core/ui/Button';
import Modal from '~/core/ui/Modal';
import type MembershipRole from '~/lib/organizations/types/membership-role';

import useUpdateMemberRequest from '~/lib/organizations/hooks/use-update-member-role';
import MembershipRoleSelector from '~/components/organizations/MembershipRoleSelector';

const Heading = <Trans i18nKey={'organization:updateMemberRoleModalHeading'} />;

const UpdateMemberRoleModal: React.FCC<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  membershipId: number;
  memberRole: MembershipRole;
}> = ({ isOpen, setIsOpen, memberRole, membershipId }) => {
  const [role, setRole] = useState<MembershipRole>(memberRole);
  const updateMember = useUpdateMemberRequest(membershipId);
  const navigation = useNavigation();

  const submitting = navigation.state === 'submitting';

  const onRoleUpdated = useCallback(() => {
    if (role !== undefined) {
      updateMember({ role });

      setIsOpen(false);
    }
  }, [role, updateMember, setIsOpen]);

  return (
    <Modal heading={Heading} isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={'flex flex-col space-y-6'}>
        <MembershipRoleSelector value={role} onChange={setRole} />

        <div className={'flex justify-end space-x-2'}>
          <Modal.CancelButton onClick={() => setIsOpen(false)} />

          <Button
            data-cy={'confirm-update-member-role'}
            variant={'flat'}
            loading={submitting}
            onClick={onRoleUpdated}
          >
            <Trans i18nKey={'organization:updateRoleSubmitLabel'} />
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateMemberRoleModal;
