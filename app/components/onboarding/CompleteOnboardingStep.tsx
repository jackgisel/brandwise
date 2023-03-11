import { useCallback, useEffect, useRef } from 'react';
import { useSubmit } from '@remix-run/react';
import Spinner from '~/core/ui/Spinner';

interface CompleteOnboardingStepData {
  organization: string;
}

const CompleteOnboardingStep: React.FC<{
  data: CompleteOnboardingStepData;
}> = ({ data }) => {
  const submit = useSubmit();
  const onboardingCompleteRequested = useRef(false);

  const callRequestCallback = useCallback(() => {
    return submit(
      { data: JSON.stringify(data) },
      {
        action: '/onboarding?index',
        method: 'post',
      }
    );
  }, [submit, data]);

  useEffect(() => {
    // React will run the effect twice
    // so we use the ref to prevent it
    if (!onboardingCompleteRequested.current) {
      onboardingCompleteRequested.current = true;
      void callRequestCallback();
    }
  }, [callRequestCallback]);

  return (
    <div className={'flex flex-1 flex-col items-center space-y-8'}>
      <span>
        <Spinner className={'h-12 w-12'} />
      </span>

      <span>Getting Started. Please wait...</span>
    </div>
  );
};

export default CompleteOnboardingStep;
