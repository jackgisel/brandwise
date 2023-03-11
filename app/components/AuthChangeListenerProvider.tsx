import useAuthStateChangeListener from '~/core/hooks/use-auth-state-change-listener';

function AuthChangeListenerProvider({ children }: React.PropsWithChildren) {
  useAuthStateChangeListener();

  return <>{children}</>;
}

export default AuthChangeListenerProvider;
