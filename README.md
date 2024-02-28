### Contains

- Svelte as Frontend Framework
- TailwindCSS for component styling
- Playwright for E2E Testing
- Vitest for Unit Testing
- ESLint as linter
- Prettier for formatting
- clsx for dynamic class conditions
- dotenv for environment variables

## Push to another branch

Clone repository:

```bash
git clone <url_to_this_repository> your_project_directory
cd your_project_directory
```

Replace remotes:

```bash
git remote -v

git remote remove <remote_name> # typically origin
git remote add <your_new_repository_url>
```

Publish branch:

```bash
git push -u origin
```

## Local setup

Install dependencies

```bash
npm i
```

Copy environment variables

```bash
cp .env.example .env
```

Run application

```bash
npm run dev
```

Application is available under localhost:3000 (or whichever port is specified in `vite.config.ts`)
