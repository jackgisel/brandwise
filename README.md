# MakerKit - SaaS Starter for Remix and Supabase

MakerKit is a SaaS starter project built with Remix, Supabase and Tailwind
CSS.

This repository has been kickstarted using the Remix Indie Stack.

### What's in the stack

Some of the features that have been used from the Indie Stack are:

- [Fly app deployment](https://fly.io) with [Docker](https://www.docker.com/)
- [GitHub Actions](https://github.com/features/actions) for deploy on merge to production and staging environments
- Styling with [Tailwind](https://tailwindcss.com/)
- End-to-end testing with [Cypress](https://cypress.io)
- Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

## Quick Start

### Requirements

- Node.js
- Git
- Docker

### Cloning the Repository

Clone this repository and name it according to your preferences:

```
git clone https://github.com/makerkit/remix-supabase-saas-kit.git your-saas --depth=1
```

Move to the folder just cloned:

```
cd your-saas
```

Reinitialize Git and set this repository as your upstream fork, so you can
pull updates when needed:

```
rm -rf .git
git init
git remote add upstream https://github.com/makerkit/remix-supabase-saas-kit
```

We recommend to watch to the repository, so you know when there's an update.
To pull the latest updates, use:

```
git pull upstream main --allow-unrelated-histories
```

In case we change the same files, you will need to resolve the conflicts.

Alternatively, you can cherry-pick changes so to reduce the amount of
conflicts across the files.

### Installing the Node Modules

Install the Node modules with the following command:

```
npm i
```

### Adding the environment variables file

The kit comes with a template of what your `.env` file should look like named `.env.template`. 

**Before you continue**: rename `.env.template` to `.env`, or copy its contents to `.env`.

**This file won't be committed to git**. When you deploy your production app, ensure you add the environment variables using your CI/Service.

NB: Remix does not use the `.env` file when bundling the application in production mode.

### Starting the Remix server and Supabase

Start the Supabase server with the following command:

```
npm run supabase:start
```

#### Adding the Supabase Keys to the Environment Variables

If this is the first time you run this command, we will need to get the Supabase keys and add them to our local environment variables configuration file `.env`.

When running the command, we will see a message like this:

```bash
> supabase start

Applying migration 20221215192558_schema.sql...
Seeding data supabase/seed.sql...
Started supabase local development setup.

         API URL: http://localhost:54321
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: ****************************************************
service_role key: ****************************************************
```

Now, we need to copy the `anon key` and `service_role key` values and add them to the `.env` file:

```
SUPABASE_ANON_KEY=****************************************************
SUPABASE_SERVICE_ROLE_KEY=****************************************************
```

#### Database types

Now, generate the DB types with:

```
npm run typegen
```

#### Starting the Remix server

Start the application and the Supabase local environment:

```
npm run dev
```

The application should be running at [http://localhost:3000](http://localhost:3000).

### Stopping Supabase
When you need to stop your development environment, use:

```
npm run supabase:stop
```

### Running the Stripe CLI

If you're testing Stripe, also run the Stripe server (requires Docker running):

```
npm run stripe:listen
```

Then, copy the printed webhook key and add it to your environment files.
This can also be used for running the E2E tests.

### After Creating your Supabase Project

Make sure to add the environment variables to the provider you're deploying.

### Running Tests

Before running tests, add the required environment variables to your `.env.test` file:

```
SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Retrieve the keys after starting the Supabase server and paste them in the `.env.test` file.

NB: if you are deploying the application with a different server target, ensure you set the environment `node-cjs` when running the tests. 

You could do so by setting the target in your environment variables file `.env.test`：

```
BUILD_TARGET=node-cjs
```

And then setting the environment variable in your `remix.config.js` file:

```
// can be 'vercel' or a different target
serverBuildTarget: process.env.BUILD_TARGET || 'vercel',
```

To run the Cypress tests, please run the command:

```
npm test:e2e
```

NB: this command will start all the services required, execute the tests and
then exit.

#### Stripe Testing

To run the Stripe tests and enable Stripe in development mode, you need to:

1. Enable the tests using the environment variable `ENABLE_STRIPE_TESTING` in
   `.env.test`
2. Have Docker installed and running in your local machine to run the Stripe
   Emulator
3. Generate a webhook key and set the environment variable
   `STRIPE_WEBHOOK_SECRET`

The first two steps are only required to run the Cypress E2E tests for
Stripe. Generating a webhook key and running the Stripe CLI server is
always required for developing your Stripe functionality locally.

To generate a webhook key, run the following command:

```
npm run stripe:listen
```

If it worked, it will print the webhook key. Then, paste it into
your environment files as `STRIPE_WEBHOOK_SECRET`.

This key is also needed to run Stripe during development to receive the
Stripe webhooks to your local server.

```
ENABLE_STRIPE_TESTING=true
```

### Vitest

For lower level tests of utilities and individual components, we use `vitest`. We have DOM-specific assertion helpers via [`@testing-library/jest-dom`](https://testing-library.com/jest-dom).

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `npm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.
