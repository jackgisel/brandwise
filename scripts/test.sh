set -e

npm run supabase:start &
dotenv -e .env.test npm run build
dotenv -e .env.test npm run start &
npm run stripe:mock-server &
npm run cypress:headless
npm run supabase:stop
exit 0