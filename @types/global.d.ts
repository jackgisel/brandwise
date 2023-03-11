declare global {
  type StringObject = Record<string, string>;
  type NumberObject = Record<string, number>;
  type UnknownObject = Record<string, unknown>;
  type BooleanObject = Record<string, boolean>;
  type UnixTimestamp = number;

  type WithId<T> = T & {
    id: number | string;
  };

  type Truthy<T> = false extends T
    ? never
    : 0 extends T
    ? never
    : '' extends T
    ? never
    : null extends T
    ? never
    : undefined extends T
    ? never
    : T;

  type Falsy = false | 0 | '' | null | undefined;
  type Maybe<T> = T | undefined;

  type EmptyCallback = () => void;

  type HttpMethod = `GET` | `POST` | `PUT` | 'PATCH' | 'DELETE' | 'HEAD';

  namespace Cypress {
    interface Chainable {
      cyGet(name: string): Chainable<JQuery>;

      signIn(
        redirectPath?: string,
        credentials?: { email: string; password: string }
      ): void;

      clearStorage(): void;

      signOutSession(): void;

      resetDatabase(): void;
    }
  }

  interface Window {
    ENV: {
      SITE_TITLE: string;
      SITE_DESCRIPTION: string;
      ENVIRONMENT: string;
      DEFAULT_LOCALE: string;
      SITE_URL: string;
      SENTRY_DSN: string;
      NODE_ENV: string;
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
      IS_CI: string;
    };
  }
}

declare module 'react' {
  type FCC<Props = Record<string, unknown>> = React.FC<
    React.PropsWithChildren<Props>
  >;
}

export {};
