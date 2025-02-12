# Combat Tix Backend

Backend API for Combat Tix, a ticketing platform for combat sports events.

## Prerequisites

- Node.js (v14 or higher) - v22.13.0
- npm
- pnpm (install with corepack) -v9.15.4

## Getting Started

### 1. Clone the Repository
```bash
git clone [repository-url]
cd combat-tix-backend
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Environment Setup
The project requires certain environment variables to run. Follow these steps:

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the `.env` file with the required values:
```env
PORT=4000                    # Port for the server to run on
NODE_ENV=development        # Environment (development/production)
MONGODB_URI=                # MongoDB connection string (get from maintainer)
```

3. Contact the project maintainer to get the MongoDB connection string and any other required credentials.

Note: Never commit the `.env` file or share sensitive credentials.

### 4. Start the Server
```bash
# Development mode

pnpm run dev

# Production mode
pnpm start
```

### 5. Verify Setup
Visit `http://localhost:4000/health` to verify the server is running and connected to the database. You should see:
```json
{
  "status": "ok",
  "database": "connected"
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
  import request from 'supertest';
  import app from '../path/to/app';
  ```

### Best Practices

- Write unit tests for individual functions
- Create integration tests for API endpoints
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

## Managing Different Node Versions with NVM

- Download and install nvm from [https://github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases)

- Install node version using `nvm install 22.13.0`

- View all node versions installed with nvm `nvm list`

- Switch node versions using `nvm use 22.13.0`

## Installing PNPM with Corepack

- Enable corepack in the project `corepack enable`

- Install `PNPM` version 9.15.4 corepack prepare `pnpm@9.15.4 --activate`
