import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Search,
  Bell,
  MessageCircle,
  Globe,
  Menu,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import diakoLogo from "/lovable-uploads/ca0b85d9-e1c0-407d-ac37-0335101846a0.png";
import { useUser } from "@/contexts/UserContext";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  // Use the react‑router hook to programmatically navigate after sign out.
  const navigate = useNavigate();
  // Access current user information.  This allows the header to display
  // the logged‑in user's name, avatar fallback and verification badge.
  const { user } = useUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-4 h-[var(--header-height)]">
        {/* Logo and Search */}
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2">
            <img src={diakoLogo} alt="Diako" className="w-8 h-8" />
            <h1 className="text-xl font-bold text-primary hidden sm:block">Diako</h1>
          </div>
          
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Rechercher des lieux, hôtels, expériences à Madagascar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-none"
            />
          </div>
        </div>

        {/* Navigation and User Actions */}
        <div className="flex items-center gap-2">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span>Madagascar</span>
            </Button>
          </div>

          {/* Notifications */}
          <Link to="/notifications">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              {/* TODO: show unread notifications count */}
              <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 text-xs bg-destructive">
                3
              </Badge>
            </Button>
          </Link>

          {/* Messages */}
          <Link to="/messages">
            <Button variant="ghost" size="icon" className="relative">
              <MessageCircle className="w-5 h-5" />
              {/* TODO: show unread messages count */}
              <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 text-xs bg-travel-blue">
                2
              </Badge>
            </Button>
          </Link>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:flex items-center gap-1">
                  {user.name}
                  {user.verified && (
                    <Badge className="ml-1">Vérifié</Badge>
                  )}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center gap-2">
                  <User className="mr-2 h-4 w-4" />
                  <span>Mon profil</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center gap-2">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={async () => {
                  // Sign the user out then redirect them to the login page.  The
                  // navigate function comes from useNavigate() above and is
                  // scoped to this component so it will not be undefined.
                  await signOut(auth);
                  navigate("/login");
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Se déconnecter</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;