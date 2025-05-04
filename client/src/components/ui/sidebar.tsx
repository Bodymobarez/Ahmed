import * as React from "react";
import { cn } from "@/lib/utils";

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col w-64 bg-sidebar h-screen overflow-hidden text-sidebar-foreground",
      className
    )}
    {...props}
  />
));
Sidebar.displayName = "Sidebar";

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-center h-16 border-b border-sidebar-border/30",
      className
    )}
    {...props}
  />
));
SidebarHeader.displayName = "SidebarHeader";

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("h-0 flex-1 flex flex-col overflow-y-auto", className)}
    {...props}
  />
));
SidebarContent.displayName = "SidebarContent";

const SidebarNav = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    className={cn("flex-1 px-2 py-4 space-y-1", className)}
    {...props}
  />
));
SidebarNav.displayName = "SidebarNav";

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex-shrink-0 flex border-t border-sidebar-border/30 p-4", className)}
    {...props}
  />
));
SidebarFooter.displayName = "SidebarFooter";

const SidebarLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { active?: boolean }
>(({ className, active, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(
      "flex items-center px-4 py-3 text-sm font-medium rounded-md",
      {
        "bg-sidebar-primary text-sidebar-primary-foreground": active,
        "text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground":
          !active,
      },
      className
    )}
    {...props}
  />
));
SidebarLink.displayName = "SidebarLink";

export {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarNav,
  SidebarFooter,
  SidebarLink,
};
