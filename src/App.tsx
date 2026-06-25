import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import SNotification from "./components/Notification";
import Landing from "./pages/landing/landing";
import Home from "./pages/home/home";
import Profile from "./pages/profile/profile";
import ProfileView from "./pages/profile-view/profile-view";
import Search from "./pages/search/search";
import Plans from "./pages/plans/plans";
import Subscription from "./pages/subscription/subscription";
import Notifications from "./pages/notifications/notifications";
import Announcements from "./pages/announcements/announcements";
import CreateAnnouncement from "./pages/announcements/create";
import AnnouncementDetail from "./pages/announcements/detail";
import Conversations from "./pages/messaging/conversations";
import Chat from "./pages/messaging/chat";
import ChatRequests from "./pages/messaging/requests";

import NumberRevealRequests from "./pages/number-reveal-requests/number-reveal-requests";
import BusinessList from "./pages/business/business-list";
import BusinessForm from "./pages/business/business-form";
import BusinessDetail from "./pages/business/business-detail";
import InviteNeighbors from "./pages/invite/invite";
import Events from "./pages/events/events";
import CreateEvent from "./pages/events/create";
import EventDetail from "./pages/events/detail";
import LocalFeed from "./pages/feed/feed";
import SavedSearches from "./pages/saved-searches/saved-searches";


import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import "primereact/resources/themes/lara-light-blue/theme.css";

import "./App.css";
import Login from "./pages/login/login";
import Signup from "./pages/signup/signup";
import AuthLayout from "./components/AuthLayout";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Home /> : <Landing />}
      />
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />}
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <Signup /> : <Navigate to="/" replace />}
        />
      </Route>
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/:id"
        element={
          <ProtectedRoute>
            <ProfileView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <Search />
          </ProtectedRoute>
        }
      />
      <Route
        path="/saved-searches"
        element={
          <ProtectedRoute>
            <SavedSearches />
          </ProtectedRoute>
        }
      />
      <Route
        path="/plans"
        element={
          <ProtectedRoute>
            <Plans />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subscription"
        element={
          <ProtectedRoute>
            <Subscription />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/announcements"
        element={
          <ProtectedRoute>
            <Announcements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/announcements/create"
        element={
          <ProtectedRoute>
            <CreateAnnouncement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/announcements/:id/edit"
        element={
          <ProtectedRoute>
            <CreateAnnouncement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/announcements/:id"
        element={
          <ProtectedRoute>
            <AnnouncementDetail />
          </ProtectedRoute>
        }
      />
      <Route

        path="/messaging"
        element={
          <ProtectedRoute>
            <Conversations />
          </ProtectedRoute>
        }
      />
      <Route

        path="/messaging/requests"
        element={
          <ProtectedRoute>
            <ChatRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messaging/chat/:conversationId"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/messaging/chat/:conversationId"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/number-reveal-requests"
        element={
          <ProtectedRoute>
            <NumberRevealRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/feed"
        element={
          <ProtectedRoute>
            <LocalFeed />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events"
        element={
          <ProtectedRoute>
            <Events />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/create"
        element={
          <ProtectedRoute>
            <CreateEvent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/:id/edit"
        element={
          <ProtectedRoute>
            <CreateEvent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/:id"
        element={
          <ProtectedRoute>
            <EventDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/invite"
        element={
          <ProtectedRoute>
            <InviteNeighbors />
          </ProtectedRoute>
        }
      />
      <Route
        path="/business"
        element={
          <ProtectedRoute>
            <BusinessList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/business/create"
        element={
          <ProtectedRoute>
            <BusinessForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/business/:id/edit"
        element={
          <ProtectedRoute>
            <BusinessForm />
          </ProtectedRoute>
        }
      />
      <Route path="/businesses/:id" element={<BusinessDetail />} />
      <Route
        path="/app/messaging/requests"
        element={
          <ProtectedRoute>
            <ChatRequests />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <PrimeReactProvider>
      <ThemeProvider>
        <AuthProvider>
          <SNotification />
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </PrimeReactProvider>
  );
}

export default App;
