import Logo from '~/core/ui/Logo';
import SlideUpTransition from '~/core/ui/SlideUpTransition';

function AuthPageShell({ children }: React.PropsWithChildren) {
  return (
    <SlideUpTransition>
      <div
        className={
          'flex h-screen flex-col items-center justify-center space-y-4' +
          ' md:space-y-8 lg:bg-gray-50 lg:dark:lg:bg-black-500'
        }
      >
        <div
          className={`flex w-full max-w-sm flex-col items-center space-y-4 rounded-xl border-transparent bg-white px-2 py-1 dark:bg-transparent md:w-8/12 md:border md:px-8 md:py-6 lg:w-5/12 lg:px-6 lg:shadow-xl dark:lg:border-black-400 lg:dark:bg-black-500 dark:lg:shadow-[0_0_1200px_0] lg:dark:shadow-primary-400/20 xl:w-4/12 2xl:w-3/12`}
        >
          <Logo />

          {children}
        </div>
      </div>
    </SlideUpTransition>
  );
}

export default AuthPageShell;
