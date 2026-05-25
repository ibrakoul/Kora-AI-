"use client";

import { useState, useEffect } from "react";
import {
  Bell, Briefcase, UserPlus, MessageSquare, Heart, Star,
  Building2, BookOpen, Award, Settings, CheckCheck, Loader2
} from "lucide-react";
import type { NotificationRow } from "@/types/database";
import { fetchNotifications, markNotificationsRead } from "@/lib/api/notifications";

type NotifType = NotificationRow["type"];

const typeConfig: Record<NotifType, { icon: typeof Bell; color: string; bg: string }> = {
  job_alert:          { icon: Briefcase,    color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  connection_request: { icon: UserPlus,     color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20" },
  message:            { icon: MessageSquare,color: "text-purple-400",  bg: "bg-purple-500/10 border-purple-500/20" },
  post_like:          { icon: Heart,        color: "text-red-400",     bg: "bg-red-500/10 border-red-500/20" },
  mention:            { icon: Star,         color: "text-yellow-400",  bg: "bg-yellow-500/10 border-yellow-500/20" },
  company_job:        { icon: Building2,    color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20" },
  course:             { icon: BookOpen,     color: "text-orange-400",  bg: "bg-orange-500/10 border-orange-500/20" },
  achievement:        { icon: Award,        color: "text-yellow-400",  bg: "bg-yellow-500/10 border-yellow-500/20" },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `il y a ${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Hier";
  return `il y a ${days}j`;
}

const filterTabs = [
  { id: "all",                label: "Toutes" },
  { id: "unread",             label: "Non lues" },
  { id: "job_alert",          label: "Emplois" },
  { id: "connection_request", label: "Réseau" },
  { id: "message",            label: "Messages" },
];

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await fetchNotifications();
      setNotifs(data.notifications ?? []);
    } catch {
      setNotifs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadNotifications(); }, []);

  const handleMarkAllRead = async () => {
    await markNotificationsRead();
    setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const handleMarkRead = async (id: string) => {
    await markNotificationsRead([id]);
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const unreadCount = notifs.filter(n => !n.is_read).length;

  const filtered = filter === "all"
    ? notifs
    : filter === "unread"
    ? notifs.filter(n => !n.is_read)
    : notifs.filter(n => n.type === filter);

  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Bell size={22} className="text-emerald-400" />
              Notifications
              {unreadCount > 0 && (
                <span className="px-2.5 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {notifs.length} notifications · {unreadCount} non lues
            </p>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                <CheckCheck size={14} />
                Tout marquer lu
              </button>
            )}
            <button className="p-2 text-gray-500 hover:text-gray-300 border border-[#1f2d45] rounded-xl hover:border-[#2d4060] transition-all">
              <Settings size={16} />
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-4">
          {filterTabs.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                filter === id
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  : "text-gray-400 border border-[#1f2d45] hover:border-[#2d4060] hover:text-gray-300"
              }`}
            >
              {id === "unread" && unreadCount > 0 ? `Non lues (${unreadCount})` : label}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="text-emerald-400 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <Bell size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">Aucune notification</p>
            <p className="text-sm mt-1">Vous êtes à jour !</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((notif) => {
              const config = typeConfig[notif.type] ?? typeConfig.job_alert;
              const { icon: Icon, color, bg } = config;
              return (
                <div
                  key={notif.id}
                  onClick={() => !notif.is_read && handleMarkRead(notif.id)}
                  className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all group ${
                    !notif.is_read
                      ? "bg-[#1a2236] border-emerald-500/10 hover:border-emerald-500/20"
                      : "bg-[#111827] border-[#1f2d45] hover:border-[#2d4060]"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${bg}`}>
                      <Icon size={20} className={color} />
                    </div>
                    {!notif.is_read && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0A0F1C]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold mb-0.5 ${!notif.is_read ? "text-white" : "text-gray-300"}`}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-gray-500 leading-relaxed">{notif.description}</p>
                      </div>
                      <span className="text-xs text-gray-600 shrink-0 whitespace-nowrap">
                        {timeAgo(notif.created_at)}
                      </span>
                    </div>

                    {notif.action_text && notif.action_url && (
                      <a
                        href={notif.action_url}
                        onClick={e => e.stopPropagation()}
                        className={`inline-block mt-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                          notif.type === "connection_request"
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                        }`}
                      >
                        {notif.action_text}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
