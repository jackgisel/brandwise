import type { ReactNode } from 'react';
import { Suspense, useEffect, useState } from 'react';

function ClientOnly({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const fallbackElement = fallback ?? null;

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? (
    <Suspense fallback={fallbackElement}>{children}</Suspense>
  ) : (
    <>{fallbackElement}</>
  );
}

export default ClientOnly;
