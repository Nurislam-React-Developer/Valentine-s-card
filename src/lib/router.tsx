import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router'
import Layout from '../components/Layout'
import Home from '../pages/Home'
import About from '../pages/About'
import Contact from '../pages/Contact'
import { ValentineCard } from '../pages/ValentineCard'
import Media from '../pages/Media'
import History from '../pages/History'
import Spotify from '../pages/Spotify'
import SpotifyCallback from '../pages/SpotifyCallback'

// Root route with Layout
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
})

// Home route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
})

// Valentine route
const valentineRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/valentine',
  component: ValentineCard,
})

const mediaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/media',
  component: Media,
})

const spotifyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/spotify',
  component: Spotify,
})

const spotifyCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/spotify/callback',
  component: SpotifyCallback,
})

const historyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/history',
  component: History,
})

// About route
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: About,
})

// Contact route
const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: Contact,
})

// Route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  valentineRoute,
  mediaRoute,
  spotifyRoute,
  spotifyCallbackRoute,
  historyRoute,
  aboutRoute,
  contactRoute,
])

// Create router
export const router = createRouter({ routeTree })

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}