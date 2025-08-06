import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Groups from "./pages/Groups";
import Events from "./pages/Events";
import Credits from "./pages/Credits";
import Verify from "./pages/Verify";
import Withdraw from "./pages/Withdraw";
import Boost from "./pages/Boost";
import CreatePost from "./pages/CreatePost";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import { UserProvider } from "./contexts/UserContext";
import RequireCompleteProfile from "./components/RequireCompleteProfile";
import { CreditProvider } from "./contexts/CreditContext";
import { GroupProvider } from "./contexts/GroupContext";
import { EventProvider } from "./contexts/EventContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* Wrap the entire app in context providers so that state is available throughout */}
      <UserProvider>
        <CreditProvider>
          <GroupProvider>
            <EventProvider>
              <BrowserRouter>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <RequireCompleteProfile>
                        <Index />
                      </RequireCompleteProfile>
                    }
                  />
                  {/* Custom routes for new pages */}
                  <Route
                    path="/groups"
                    element={
                      <RequireCompleteProfile>
                        <Groups />
                      </RequireCompleteProfile>
                    }
                  />
                  <Route
                    path="/events"
                    element={
                      <RequireCompleteProfile>
                        <Events />
                      </RequireCompleteProfile>
                    }
                  />
                  <Route
                    path="/credits"
                    element={
                      <RequireCompleteProfile>
                        <Credits />
                      </RequireCompleteProfile>
                    }
                  />
                  <Route
                    path="/verify"
                    element={
                      <RequireCompleteProfile>
                        <Verify />
                      </RequireCompleteProfile>
                    }
                  />
                  <Route
                    path="/create"
                    element={
                      <RequireCompleteProfile>
                        <CreatePost />
                      </RequireCompleteProfile>
                    }
                  />
                  <Route
                    path="/withdraw"
                    element={
                      <RequireCompleteProfile>
                        <Withdraw />
                      </RequireCompleteProfile>
                    }
                  />
                  <Route
                    path="/boost"
                    element={
                      <RequireCompleteProfile>
                        <Boost />
                      </RequireCompleteProfile>
                    }
                  />
                  <Route
                    path="/messages"
                    element={
                      <RequireCompleteProfile>
                        <Messages />
                      </RequireCompleteProfile>
                    }
                  />
                  <Route
                    path="/notifications"
                    element={
                      <RequireCompleteProfile>
                        <Notifications />
                      </RequireCompleteProfile>
                    }
                  />
                  {/* settings can be accessed without completion to allow uploading photos */}
                  <Route path="/settings" element={<Settings />} />
                  <Route
                    path="/profile"
                    element={
                      <RequireCompleteProfile>
                        <Profile />
                      </RequireCompleteProfile>
                    }
                  />
                  {/* Authentication routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  {/* CATCH-ALL ROUTE MUST REMAIN LAST */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </EventProvider>
          </GroupProvider>
        </CreditProvider>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
