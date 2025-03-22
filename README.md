# Combat Tix Backend

Backend API for Combat Tix, a ticketing platform for combat sports events.

## Prerequisites

- **Node.js (v14 or higher)** - v22.13.0
- **npm**
- **pnpm** (install with corepack) - v9.15.4

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Combat-Tix/combat-tix-backend.git
cd combat-tix-backend
```

Repository URL:- [https://github.com/Combat-Tix/combat-tix-backend.git](https://github.com/Combat-Tix/combat-tix-backend.git)

The URL above was gotten from the GitHub Repository Code Tab: Local Dropdown container

### 2. Download and install Node version manager from [NVM Releases](https://github.com/coreybutler/nvm-windows/releases)

- Install node version:

  ```bash
  nvm install 22.13.0
  ```

- View all node versions installed:

  ```bash
  nvm list
  ```

- Switch node versions:

  ```bash
  nvm use 22.13.0
  ```

#### Why Node version manager

To ensure consistency across the development environment, Node.js is installed using Node Version Manager (NVM). This approach prevents conflicts that may arise when different projects require
different Node.js versions. If Node.js is installed directly from the official website, it will replace any existing version on the developer’s machine. This could cause compatibility issues with
other projects that rely on an older version, potentially leading to problems with package installations. With NVM, multiple Node.js versions can coexist on the same machine, allowing developers to
switch between them as needed. For this project, it is recommended to set Node.js version 22.13.0 as the default.

### 3. Install PNPM with Corepack

- Enable corepack in the project:

```bash
   corepack enable
```

- Install PNPM version 9.15.4

```bash
   corepack prepare pnpm@9.15.4 --activate
```

#### Why Corepack

Corepack lets developers specify which version of a package manager (like npm, pnpm, or yarn) should be used in their project. This ensures that different projects can use different versions of
package managers without conflicts. For example, one project can use npm@6 and another can use npm@7—and Corepack will handle this versioning automatically for each project.

### 4. Install Dependencies

```bash
pnpm install
```

### 5. Environment Setup

The project requires certain environment variables to run. Follow these steps:

Copy the example environment file:

```bash
cp .env.example .env
```

Update the `.env` file with the required values:

```env
ALGOLIA_API_KEY=
ALGOLIA_APP_ID=
PORT=4000                    # Port for the server to run on
NODE_ENV=development         # Environment (development/production)
MONGODB_URI=                 # MongoDB connection string (get from maintainer)
API_KEY=your-secure-api-key  # API key for authenticating requests (get from maintainer)
```

Contact the project maintainer to get any additional required credentials.

> **Note:** Never commit the `.env` file or share sensitive credentials.

### 6. Start the Server

- Development mode

```bash
   pnpm run dev
```

- Production mode

```bash
   pnpm start
```

### 7. Verify Setup

In the VsCode terminal, you should see the following to confirm that the setup is correct.

```txt
MongoDB connected successfully
Server running on port 4000
GraphQL endpoint: http://localhost:4000/graphql
```

Visit [http://localhost:4000/graphql](http://localhost:4000/graphql) to access the Apollo Sandbox interface

The API above uses an API key for authentication. The API key must be included in the request headers of the apollo sandbox

```json
{
  "x-api-key": "your-secure-api-key"
}
```

Test the setup with this query:

```js
query {
  healthCheck {
    status
    database
  }
}
```

Expected response:

```json
{
   "data": {
     "healthCheck": {
       "status": "ok",
       "database": "connected"
     }
  }
}
```

## Testing

### Running Tests

```bash
# Run all tests

pnpm test

# Run tests in watch mode (re-run on file changes)
pnpm run test:watch
```

### Test Configuration

- Test runner: Jest
- Environment: Node.js
- Module system: ES Modules

### Writing Tests

- Place test files in the `src/__tests__` directory
- Use `.test.js` or `.spec.js` extension
- Import testing libraries:

  ```javascript
  import request from "supertest";
  import app from "../path/to/app";
  ```

### Best Practices

- Write unit tests for individual functions
- Create integration tests for Graphql queries and mutations
- Use `supertest` for HTTP assertion testing
- Ensure all tests are independent and reset state between runs

### Troubleshooting

- Ensure all import statements use `.js` extensions
- Use `NODE_OPTIONS=--experimental-vm-modules npx jest` for detailed error information
- Verify Node.js version is compatible (v14+)

## Available Scripts

- `pnpm run dev`: Start development server with nodemon
- `pnpm start`: Start production server
- `pnpm test`: Run integration tests
- `pnpm run lint`: Run Biome linter
- `pnpm run format`: Format code with Biome
