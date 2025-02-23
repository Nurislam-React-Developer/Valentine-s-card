# Valentine's Card Interactive Web Application

A beautiful and interactive Valentine's card web application built with React and Vite. The application features an animated interface with floating hearts, particle effects, and personalized messages.

## Features

- Interactive Valentine's card with beautiful animations
- Particle effects using tsParticles
- Personalized message input
- Responsive design with modern UI/UX
- Smooth transitions and heart animations

## Tech Stack

- React 19
- Vite 6
- tsParticles for animations
- Modern CSS with animations
- ESLint for code quality

## Prerequisites

- Node.js (Latest LTS version recommended)
- pnpm or yarn package manager

## Getting Started

1. Clone the repository
2. Install dependencies using either:

```bash
# Using pnpm
pnpm install

# Using yarn
yarn install
```

## Available Commands

### Start Development Server

You can start the development server using either pnpm or yarn:

```bash
# Using pnpm
pnpm start

# Using yarn
yarn start
```

This will start the development server on `http://localhost:5173` with hot module replacement (HMR) enabled.

### Build for Production

```bash
# Using pnpm
pnpm build

# Using yarn
yarn build
```

### Preview Production Build

```bash
# Using pnpm
pnpm preview

# Using yarn
yarn preview
```

## Development Tools

- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) - Uses [SWC](https://swc.rs/) for Fast Refresh
- ESLint configuration for React
- Hot Module Replacement (HMR)
- TypeScript support

## Project Structure

```
src/
  ├── components/     # React components
  ├── assets/         # Static assets
  ├── audio/          # Audio files
  ├── store/          # State management
  └── api/            # API integrations
```

## License

MIT