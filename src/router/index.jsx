import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "@/components/organisms/Layout";

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
    <div className="text-center space-y-4">
      <svg className="animate-spin h-12 w-12 text-primary-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  </div>
);

// Lazy load components
const HomePage = lazy(() => import("@/components/pages/HomePage"));
const CommunitiesPage = lazy(() => import("@/components/pages/CommunitiesPage"));
const CommunityDetailPage = lazy(() => import("@/components/pages/CommunityDetailPage"));
const PostDetailPage = lazy(() => import("@/components/pages/PostDetailPage"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

const mainRoutes = [
  {
    path: "",
    index: true,
    element: <Suspense fallback={<LoadingFallback />}><HomePage /></Suspense>
  },
  {
    path: "communities",
    element: <Suspense fallback={<LoadingFallback />}><CommunitiesPage /></Suspense>
  },
  {
path: "communities/:id",
    element: <Suspense fallback={<LoadingFallback />}><CommunityDetailPage /></Suspense>
  },
  {
    path: "post/:id",
    element: <Suspense fallback={<LoadingFallback />}><PostDetailPage /></Suspense>
  },
  {
    path: "*",
    element: <Suspense fallback={<LoadingFallback />}><NotFound /></Suspense>
  }
];

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [...mainRoutes]
  }
];

export const router = createBrowserRouter(routes);