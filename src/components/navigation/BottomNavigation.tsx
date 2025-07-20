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
      <div className="flex items-center justify-center gap-6 w-full">
        {navigationItems.map(({ href, icon: Icon, label }) => {
          const isActive = location.pathname === href;
          
          return (
            <NavLink
              key={href}
              to={href}
              className={cn(
                "flex flex-col items-center gap-2 py-0 px-2 rounded-xl transition-all duration-300 group touch-manipulation flex-1",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "p-3 rounded-full transition-all duration-300 liquid-button min-h-[44px] min-w-[44px] flex items-center justify-center",
                isActive 
                  ? "bg-primary/20 text-primary shadow-xl scale-110" 
                  : "md:hover:bg-muted/50 md:hover:shadow-lg md:hover:scale-105 active:scale-95"
              )}>
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-semibold transition-all duration-300">
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};