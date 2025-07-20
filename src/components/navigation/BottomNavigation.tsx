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
      {/* Liquid glass reflection effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-white/5 backdrop-blur-sm pointer-events-none" />
      
      <div className="flex items-center justify-center gap-4 md:gap-6 w-full max-w-xs mx-auto relative z-10">
        {navigationItems.map(({ href, icon: Icon, label }) => {
          const isActive = location.pathname === href;
          
          return (
            <NavLink
              key={href}
              to={href}
              className={cn(
                "flex flex-col items-center gap-1 md:gap-2 py-2 px-1 md:px-2 rounded-xl transition-all duration-300 group touch-manipulation flex-1",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "p-3 md:p-4 rounded-full transition-all duration-300 liquid-button min-h-[48px] min-w-[48px] md:min-h-[52px] md:min-w-[52px] flex items-center justify-center relative overflow-hidden",
                isActive 
                  ? "bg-primary/20 text-primary shadow-2xl scale-110 ring-2 ring-primary/30" 
                  : "md:hover:bg-muted/50 md:hover:shadow-xl md:hover:scale-105 active:scale-95"
              )}>
                {/* Liquid glass background effect */}
                <div className={cn(
                  "absolute inset-0 rounded-full transition-all duration-300",
                  isActive 
                    ? "bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-xl" 
                    : "bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg"
                )} />
                
                {/* Reflection effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-50" />
                
                {/* Icon with better positioning */}
                <Icon className={cn(
                  "h-5 w-5 md:h-6 md:w-6 relative z-10 transition-all duration-300",
                  isActive && "drop-shadow-lg"
                )} />
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-pulse" />
                )}
              </div>
              
              {/* Label with better spacing */}
              <span className="text-xs font-semibold transition-all duration-300 relative z-10">
                {label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};