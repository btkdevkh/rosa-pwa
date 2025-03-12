# Rospot PWA

This is a [Next.js](https://nextjs.org) project optimized for PWA.
It uses the library [Serwist](https://serwist.pages.dev/), please refer to the documentation for more details.

## Getting Started with `Rospot PWA`

**First and foremost**, you will need a `.env.local` file in the root of the project. Please contact your teammate to provide it.

Variables env. needed

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
NEXT_PUBLIC_API_URL=YOUR_NEXTAUTH_URL
NEXT_PUBLIC_ACCESS_CONTROL_ALLOW_ORIGIN_URL=YOUR_NEXT_PUBLIC_ACCESS_CONTROL_ALLOW_ORIGIN_URL
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

To develop your new feature, please refer to these main folders:

```bash
app, actions, api, components, hooks, models, firebase, services
```

- `app`: The main folder contains all source codes.
- `actions`: Server actions, the new way to interact with the database.
- `api`: Classic API call routes handlers.
- `components`: Contains all components.
- `hooks`: Hooks that interact with the database.
- `models`: Contains all models (interfaces, types, enums, etc.).
- `firebase`: Contains the config file and authentications.
- `services`: Contains the api call from your next app frontend.
- Other folders like `analyses`, `observations`, `settings`, etc. are page route folders.
- Other files:
  `sw.ts`: PWA config file from .

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
