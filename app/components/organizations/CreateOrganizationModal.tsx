import { useEffect } from 'react';

import { useFetcher, useNavigation } from '@remix-run/react';
import { Trans, useTranslation } from 'react-i18next';
import toaster from 'react-hot-toast';

import Modal from '~/core/ui/Modal';
import TextField from '~/core/ui/TextField';
import Button from '~/core/ui/Button';
import configuration from '~/configuration';
import AuthenticityToken from '~/components/AuthenticityToken';

const Heading = (
  <Trans i18nKey={'organization:createOrganizationModalHeading'} />
);

const CreateOrganizationModal: React.FC<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => unknown;
  onCreate: (organizationId: string) => unknown;
}> = ({ isOpen, setIsOpen, onCreate }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data.error) {
        toaster.error(t<string>('organization:createOrganizationError'));
      } else if (fetcher.data.organizationId) {
        toaster.success(t<string>('organization:createOrganizationSuccess'));
        onCreate(fetcher.data.organizationId);
      }

      setIsOpen(false);
    }
  }, [fetcher.data, onCreate, setIsOpen, t]);

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} heading={Heading}>
      <fetcher.Form
        action={configuration.paths.api.organizations.create}
        method={'post'}
      >
        <div className={'flex flex-col space-y-6'}>
          <TextField>
            <TextField.Label>
              <Trans i18nKey={'organization:organizationNameLabel'} />

              <TextField.Input
                data-cy={'create-organization-name-input'}
                name={'name'}
                minLength={3}
                required
                placeholder={'ex. IndieCorp'}
              />
            </TextField.Label>
          </TextField>

          <AuthenticityToken />

          <div className={'flex justify-end space-x-2'}>
            <Modal.CancelButton onClick={() => setIsOpen(false)} />

            <Button
              data-cy={'confirm-create-organization-button'}
              variant={'flat'}
              loading={navigation.state === `submitting`}
            >
              <Trans i18nKey={'organization:createOrganizationSubmitLabel'} />
            </Button>
          </div>
        </div>
      </fetcher.Form>
    </Modal>
  );
};

export default CreateOrganizationModal;
