import type { LoaderArgs } from '@remix-run/server-runtime';
import getLogger from '~/core/logger';

export async function loader({ request }: LoaderArgs) {
  const logger = getLogger();

  const host =
    request.headers.get('X-Forwarded-Host') ?? request.headers.get('host');

  try {
    const url = new URL('/', `http://${host}`);

    await Promise.all([
      fetch(url.toString(), { method: 'HEAD' }).then((r) => {
        if (!r.ok) {
          return Promise.reject(r);
        }
      }),
    ]);

    return new Response('OK');
  } catch (error) {
    logger.error(
      {
        error,
      },
      'Healthcheck ❌'
    );

    return new Response('ERROR', { status: 500 });
  }
}
