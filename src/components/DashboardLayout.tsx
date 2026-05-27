import { useEffect } from "react";
import { Appsidebar } from "./appsidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <SidebarProvider>
  
      <div className="flex h-screen w-full overflow-hidden bg-background">
  
        {/* SIDEBAR */}
        <Appsidebar />
  
        {/* MAIN AREA */}
        <main className=" w-0 flex-1  overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-all duration-300">
  
          
  
          {/* PAGE CONTENT */}
          <div className="p-1 lg:p-9">
            {children}
          </div>
  
        </main>
  
      </div>
  
    </SidebarProvider>
  );}
  export default DashboardLayout;