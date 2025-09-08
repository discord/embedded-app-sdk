# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the Discord Embedded App SDK (`@discord/embedded-app-sdk`), a TypeScript library that enables building rich, multiplayer experiences inside Discord as Activities. Activities are web applications hosted in iframes that run within Discord clients on desktop, web, or mobile.

## Development Commands

### Building and Testing
- `npm run build` - Build the SDK using Rollup (outputs both CJS and ESM to `output/` directory)
- `npm run dev` - Build in watch mode for development
- `npm test` - Run Jest tests
- `npm test:dev` - Run Jest tests in watch mode

### Code Quality
- `npm run lint` - Run ESLint on `./src`
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run lint:ts` - Run TypeScript compiler for type checking

### Other Commands
- `npm run sync` - Sync RPC schema using `zx ./scripts/syncRPCSchema.mjs`

## Architecture

### Core Structure
- **`src/Discord.ts`** - Main SDK class implementing `IDiscordSDK` interface, handles RPC communication with Discord client via postMessage
- **`src/index.ts`** - Main entry point exporting all public APIs
- **`src/commands/`** - Individual command implementations (authenticate, authorize, setActivity, etc.)
- **`src/schema/`** - Zod schemas for type validation and RPC message parsing
- **`src/utils/`** - Utility functions including BigFlag operations, URL patching, and price handling
- **`src/mock.ts`** - Mock SDK implementation for testing

### Key Components
- **RPC Communication**: Uses postMessage API to communicate between iframe and Discord client
- **Command System**: Type-safe command pattern with Zod validation
- **Event System**: EventEmitter3-based event handling for Discord events
- **Platform Support**: Cross-platform support (desktop, web, mobile) with platform-specific behaviors

### Generated Code
- **`src/generated/`** - Auto-generated schema files from Discord's RPC definitions
- Schemas are synced using the `npm run sync` command

### Build System
- Uses Rollup for bundling with dual CJS/ESM output
- TypeScript compilation with declaration files
- Output directory: `output/` (flattened from `src/`)

### Testing
- Jest with jsdom environment
- Tests located in `**/__tests__/**/*.test.(ts|js)`
- TypeScript configuration for tests in `tsconfig.json`

## Key Development Notes

- All commands must implement proper Zod schemas for validation
- Platform-specific behavior handled in `getPlatformBehaviors` command
- URL remapping handled via `patchUrlMappings` utility for Discord's content filtering
- Mock SDK available for testing environments where real Discord client unavailable
- Schema synchronization required when Discord RPC definitions change