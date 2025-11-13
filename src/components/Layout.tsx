import { Link, useLocation } from "react-router-dom";
import { Camera, Users, Calendar, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Camera, label: "Dashboard" },
    { path: "/students", icon: Users, label: "Students" },
    { path: "/sessions", icon: Calendar, label: "Sessions" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
              <Camera className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">FaceAttend</h1>
              <p className="text-xs text-muted-foreground">Smart Attendance System</p>
            </div>
          </div>

          <nav className="ml-auto flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 px-4">
        {children}
      </main>
    </div>
  );
}
