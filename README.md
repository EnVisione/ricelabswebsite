# Rice Labs website

The Rice Labs website presents the team's Minecraft modpacks, projects, and members. It includes pages for the team, downloads, contact information, and Over Stars: The One Ring.

## Run locally

Use a current Node.js version supported by Vite 8.

```sh
npm ci
npm run dev
```

Open the local address printed by Vite. For a production build and a local preview:

```sh
npm run build
npm run preview
```

Run the repository's lint check with `npm run lint`.

## Project layout

- `src/pages/` contains the site's pages.
- `src/components/` contains shared interface components.
- `src/data/` contains page and project data.
- `public/` contains assets served directly.
- `scripts/` contains project-data, prerendering, and sitemap tasks used by the build.

The repository also includes [server-status relay setup notes](docs/configuration/documentation.md) for the website's live Minecraft server status.
