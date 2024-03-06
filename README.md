### Spotify Data Visualizer

Visualizes some spotify data because data is beautiful.

## Local setup

Install dependencies

```bash
npm i
```

Copy environment variables

```bash
cp .env.example .env
```

Fill in the environment variables.

| ENV VAR                |    Value    |                                                                                         Description |
| ---------------------- | :---------: | --------------------------------------------------------------------------------------------------: |
| SPOTIFY_CLIENT_ID      |     ??      |                       https://developer.spotify.com/documentation/web-api/tutorials/getting-started |
| SPOTIFY_CLIENT_SECRET  |     ??      |                       https://developer.spotify.com/documentation/web-api/tutorials/getting-started |
| PUBLIC_AUTO_FETCH_DATA | true, false | Whether to trigger data fetching on page load as opposed to manual button click. Defaults to false. |
|                        |

Run application

```bash
npm run dev
```

Application is available under localhost:3000 (or whichever port is specified in `vite.config.ts`)
