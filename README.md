# Rospot PWA

This is a [Next.js](https://nextjs.org) project optimized for PWA.
It uses the library [Serwist](https://serwist.pages.dev/), please refer to the documentation for more details.
It also uses the library [daisyUI](https://daisyui.com/) & [tailwind](https://tailwindcss.com/) for stylings, please refer to the documentation for more details.

## Getting Started with `Rospot PWA`

**First and foremost**
You will need a `.env.local` file in the root of the project. Please contact your teammate to provide it.

Variables needed in `.env.local`

```bash
# Database
DATABASE_URL=postgresql://YOUR_DATABASE_USER:YOUR_DATABASE_PWD@YOUR_DATABASE_HOST:YOUR_DATABASE_PORT/YOUR_DATABASE_NAME

# Next auth
NEXTAUTH_SECRET=YOUR_NEXTAUTH_SECRET
NEXTAUTH_URL=YOUR_NEXTAUTH_URl

# Firebase config
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_NEXT_PUBLIC_FIREBASE_APP_ID

# Divers
NEXT_PUBLIC_API_URL=NEXT_PUBLIC_API_URL
NEXT_PUBLIC_ACCESS_CONTROL_ALLOW_ORIGIN_URL=YOUR_NEXT_PUBLIC_ACCESS_CONTROL_ALLOW_ORIGIN_URL
```

You will also need a `.env` file in the `prisma` folder in the root of the project. Please contact your teammate to provide it.

Variable needed in .env

```bash
# Database
DATABASE_URL=postgresql://YOUR_DATABASE_USER:YOUR_DATABASE_PWD@YOUR_DATABASE_HOST:YOUR_DATABASE_PORT/YOUR_DATABASE_NAME
```

### Installation

To install dependencies, run the install command:

> Note: Temporarily, with the new version of React v19.x.x, there are incompatibilities with some dependency libraries.

Instead of running this install dependencies command:

```bash
npm install
```

Please run this command to install dependencies:

```bash
npm install --force
```

### Development

To develop, run the development server command:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Project Structure

To develop your new feature, please refer to these `app/` main folders:

```bash
app, actions, api, components, context, hooks, lib, models, firebase, helpers, services, styles, analyses, observations, settings, login, resetPassword, offline
```

- `app`: The main folder contains all source codes.
- `app/actions`: Server actions, the new way to interact with the database.
- `app/api`: Classic API call routes handlers.
- `app/components`: Contains all components.
- `app/context`: Contains global states contexts.
- `app/firebase`: Contains the config file and authentications.
- `app/helpers`: Contains functions helpers.
- `app/hooks`: Custom react hooks.
- `app/lib`: Prisma database instance.
- `app/models`: Contains models (interfaces, types, enums, etc.).
- `app/services`: Contains the api call from your next app frontend.
- `app/styles`: Contains global CSS.
- `app/analyses`, `app/login`, `app/observations`, `app/offline`, `app/resetPassword`, `app/settings` are page route folders.

Other `app/` files:

`app/chantiers.ts`: Contains chantier object (for testing during development).
`app/layout.tsx`: Main layout.
`app/mockedData.ts`: Contains mocked data (using for UI & comparing with real data in DB) & fake data (for testing).
`app/page.tsx`: Home page.
`app/sw.ts`: PWA config file from Serwist library.

Other root folders:

```bash
prisma, public, scripts, utils,
```

- `prisma`: Contains prisma schema, migrations, `.env` for Prisma.
- `public`: Contains accessible contents publicly, logo, images folder for PWA.
- `scripts`: Contains files code instructions for all environments of GCP secret manager.
- `utils`: Contains utils functions.

Other root files:

`cloudbuild.yaml`: Contains instructions for building the container image.
`Dockerfile`: Contains docker instructions for app build.
`middleware.ts`: Control the protected routes.

### Building

To build the project, run the build command:

```bash
npm run build
```

### Production

To view the production build, run this command:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Enjoy & Keep coding great things
