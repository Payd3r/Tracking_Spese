import { NavLink, useLocation } from "react-router-dom";
import { Home, Plus, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    href: "/",
    icon: Home,
    label: "Home"
  },
  {
    href: "/add",
    icon: Plus,
    label: "Aggiungi"
  },
  {
    href: "/settings",
    icon: Settings,
    label: "Impostazioni"
  }
];

export const BottomNavigation = () => {
  const location = useLocation();

  return (
    <nav className="floating-nav">
      <div className="flex items-center justify-center gap-8">
        {navigationItems.map(({ href, icon: Icon, label }) => {
          const isActive = location.pathname === href;
          
          return (
            <NavLink
              key={href}
              to={href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300",
                isActive 
                  ? "text-primary scale-110" 
                  : "text-muted-foreground hover:text-foreground hover:scale-105"
              )}
            >
              <div className={cn(
                "p-2 rounded-full transition-all duration-300",
                isActive 
                  ? "bg-primary/20 text-primary" 
                  : "hover:bg-muted"
              )}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};