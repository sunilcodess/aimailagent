import { Button } from "@/components/ui/button";

import {
  Mail,
  Clock,
  Crown,
  LogOut,
  Plus,
  Sparkles,
  PanelLeft,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const userEmail = localStorage.getItem("user_email") || "";
const userName = userEmail ? userEmail.split("@")[0] : "Guest";

export function Appsidebar() {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<any>(null);
 
  useEffect(() => {
    fetch(
      `http://localhost/leavecraft/backend/get-history.php?email=${localStorage.getItem(
        "user_email"
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setHistory(data.history);
        }
      });
  }, []);

  useEffect(() => {
    fetch(
      `http://localhost/leavecraft/backend/get-history.php?email=${userEmail}`
    )
      .then((res) => res.json())

      .then((data) => setHistory(data))

      .catch((err) => console.log(err));
  }, []);

  return (
    <div
      className={`h-screen shrink-0 flex flex-col border-r border-slate-dark:border-white/10 transition-all duration-300 ${
        collapsed ? "w-[60px]" : "w-[280]"
      } bg-white dark:bg-slate-950`}
    >
      {" "}
      {/* HEADER */}
      <div className="p-4">
        {/* TOGGLE BUTTON */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-black dark:text-white hover:bg-black/10 dark:hover:bg-white/10 p-2 rounded-lg transition"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
        </div>

        {/* LOGO */}
        <div
          className={`flex items-center transition-all duration-300 ${
            collapsed ? "justify-center" : "justify-start gap-3 px-2"
          }`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-purple-800 text-white shadow-lg shadow-purple-500/20">
            <Sparkles className="size-5" />
          </div>

          {!collapsed && (
            <span className="font-bold text-xl tracking-tight text-black dark:text-white">
              Aimailagent
            </span>
          )}
        </div>
      </div>
      {/* CONTENT */}
      <SidebarContent>
        <SidebarGroup>
          {/* NEW EMAIL BUTTON */}
          <div className="px-2 py-4">
            <Button
              className="w-full bg-gradient-to-r from-purple-500 text-white font-bold h-12 hover:scale-105 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/40 active:scale-95 transition-all duration-300"
              onClick={() => navigate("/")}
            >
              <div
                className={`w-full flex items-center ${
                  collapsed ? "justify-center" : "justify-start gap-2"
                }`}
              >
                <Plus className="h-4 w-4 shrink-0" />

                {!collapsed && <span>New Email</span>}
              </div>
            </Button>
          </div>

          {/* MENU TITLE */}
          {!collapsed && (
            <SidebarGroupLabel className="text-slate-500 px-4">
              Menu
            </SidebarGroupLabel>
          )}

          {/* MENU ITEMS */}
          <SidebarGroupContent className="px-2">
            <SidebarMenu>
              {/* DASHBOARD */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate("/")}
                  className="rounded-lg py-3 text-sm cursor-pointer transition-all duration-300 hover:bg-purple-500/10 hover:text-purple-600"
                >
                  <div
                    className={`w-full flex items-center ${
                      collapsed ? "justify-center" : "justify-start gap-3 px-3"
                    }`}
                  >
                    <Mail className="size-5 shrink-0" />

                    {!collapsed && <span>Dashboard</span>}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {/* History*/}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate("/history")}
                  className="rounded-lg py-3 text-sm cursor-pointer transition-all duration-300 hover:bg-purple-500/10 hover:text-purple-600"
                >
                  <div
                    className={`w-full flex items-center ${
                      collapsed ? "justify-center" : "justify-start gap-3 px-3"
                    }`}
                  >
                    <Clock className="size-5 shrink-0" />

                    {!collapsed && <span>History</span>}
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter
        className={`border-t border-slate-200 dark:border-white/5 relative
        ${collapsed ? "p-0 flex justify-center" : "p-4"}`}
      >
        {/* USER BUTTON */}
        <div
          className={`w-full flex ${
            collapsed ? "justify-center" : "justify-start"
          }`}
        >
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className={`rounded-xl p-2 transition-all duration-300
      hover:bg-purple-500/10 dark:hover:bg-purple-500/10
      hover:shadow-md hover:shadow-purple-500/10
      ${
        collapsed
          ? "flex items-center justify-center "
          : "flex items-center gap-3 w-full"
      }`}
          >
            {/* PROFILE IMAGE */}
            {localStorage.getItem("user_picture") ? (
              <img
                src={localStorage.getItem("user_picture") || ""}
                alt="profile"
                className="w-10 h-10 rounded-full shrink-0 object-cover"
              />
            ) : (
              <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-purple-500 flex items-center justify-center text-white font-bold uppercase shadow-md shadow-purple-500/20">
                {userName.charAt(0)}
              </div>
            )}

            {/* USER INFO */}
            {!collapsed && (
              <div className="flex flex-col text-left overflow-hidden">
                <span className="text-sm font-semibold text-black dark:text-white truncate">
                  {userName}
                </span>

                <span className="text-xs text-slate-400 truncate">
                  {userEmail}
                </span>
              </div>
            )}
          </button>
        </div>

        {/* DROPDOWN MENU */}
        {openMenu && (
          <div className="absolute bottom-20 left-4 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-2 z-50 backdrop-blur-xl">
            {/* PROFILE */}
            <button className="w-full flex items-center gap-2 text-left px-4 py-3 rounded-xl text-black dark:text-white hover:bg-purple-500/10 transition-all duration-300">
              <User className="w-4 h-4" />
              Profile
            </button>

            {/* LOGOUT */}
            <button
              onClick={() => {
                localStorage.clear();
                navigate("/login");
              }}
              className="w-full flex items-center gap-2 text-left px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </SidebarFooter>{" "}
    </div>
  );
}
