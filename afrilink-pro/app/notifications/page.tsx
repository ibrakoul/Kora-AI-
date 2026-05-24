"use client";

import { useState } from "react";
import {
  Bell, Briefcase, UserPlus, MessageSquare, Heart, Star,
  CheckCircle, Building2, BookOpen, Award, TrendingUp,
  Settings, CheckCheck
} from "lucide-react";

type NotifType = "job" | "connection" | "message" | "like" | "mention" | "company" | "course" | "achievement";

interface Notification {
  id: number;
  type: NotifType;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  avatar?: string;
  avatarColor?: string;
  action?: string;
}

const notifications: Notification[] = [
  { id: 1, type: "job", title: "Nouvelle offre pour vous", desc: "Senior React Developer chez AfriTech Solutions — Dakar, Sénégal · 1.2M FCFA", time: "il y a 5min", read: false, action: "Voir l'offre" },
  { id: 2, type: "connection", title: "Kwame Mensah vous a envoyé une invitation", desc: "Engineering Manager @ Google Accra · 28 connexions en commun", time: "il y a 12min", read: false, avatar: "KM", avatarColor: "blue", action: "Accepter" },
  { id: 3, type: "message", title: "Nouveau message de Fatou Ndiaye", desc: "\"Parfait ! On se retrouve demain à 10h pour le pitch alors.\"", time: "il y a 2h", read: false, avatar: "FN", avatarColor: "emerald" },
  { id: 4, type: "like", title: "Votre publication a été aimée 47 fois", desc: "Votre post sur l'IA africaine a généré beaucoup d'engagement ce matin.", time: "il y a 3h", read: true, action: "Voir la publication" },
  { id: 5, type: "company", title: "AfriTech Solutions a publié une nouvelle offre", desc: "Tech Lead · Dakar, Sénégal · Correspond à votre profil à 95%", time: "il y a 5h", read: true, action: "Postuler" },
  { id: 6, type: "achievement", title: "🏆 Badge débloqué : Top Contributeur", desc: "Félicitations ! Vous êtes parmi le top 5% des contributeurs de la semaine.", time: "il y a 6h", read: true },
  { id: 7, type: "connection", title: "Aminata Diallo a accepté votre invitation", desc: "Senior Dev @ AfriTech · Vous pouvez maintenant lui envoyer un message.", time: "Hier", read: true, avatar: "AD", avatarColor: "emerald" },
  { id: 8, type: "course", title: "Nouveau cours disponible dans votre domaine", desc: "\"Architecture Microservices avec Node.js\" — Formateur certifié AWS", time: "Hier", read: true, action: "Découvrir" },
  { id: 9, type: "job", title: "48h pour postuler : Product Manager @ Wave", desc: "Cette offre expire bientôt. 89 candidats ont déjà postulé.", time: "Hier", read: true, action: "Postuler maintenant" },
  { id: 10, type: "mention", title: "Moussa Traoré vous a mentionné", desc: "\"...je recommande vivement @AmatouDiallo pour ce type de mission tech...\"", time: "Il y a 2j", read: true, avatar: "MT", avatarColor: "orange" },
];

const typeConfig: Record<NotifType, { icon: typeof Bell; color: string; bg: string }> = {
  job: { icon: Briefcase, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  connection: { icon: UserPlus, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  message: { icon: MessageSquare, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  like: { icon: Heart, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
  mention: { icon: Star, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  company: { icon: Building2, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  course: { icon: BookOpen, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
  achievement: { icon: Award, color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
};

const avatarBg: Record<string, string> = {
  emerald: "bg-emerald-500/20 text-emerald-400",
  blue: "bg-blue-500/20 text-blue-400",
  orange: "bg-orange-500/20 text-orange-400",
  purple: "bg-purple-500/20 text-purple-400",
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(notifications);
  const [filter, setFilter] = useState("all");

  const unread = notifs.filter((n) => !n.read).length;

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));

  const filtered = filter === "all" ? notifs : filter === "unread" ? notifs.filter((n) => !n.read) : notifs.filter((n) => n.type === filter);

  const filterTabs = [
    { id: "all", label: "Toutes" },
    { id: "unread", label: `Non lues (${unread})` },
    { id: "job", label: "Emplois" },
    { id: "connection", label: "Réseau" },
    { id: "message", label: "Messages" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Bell size={22} className="text-emerald-400" />
              Notifications
              {unread > 0 && (
                <span className="px-2.5 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
                  {unread}
                </span>
              )}
            </h1>
            <p className="text-gray-500 text-sm mt-1">{notifs.length} notifications · {unread} non lues</p>
          </div>
          <div className="flex items-center gap-3">
            {unread > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
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
              {label}
            </button>
          ))}
        </div>

        {/* Notifications list */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-600">
              <Bell size={40} className="mx-auto mb-3 opacity-30" />
              <p className="font-medium">Aucune notification</p>
              <p className="text-sm mt-1">Vous êtes à jour !</p>
            </div>
          ) : (
            filtered.map((notif) => {
              const { icon: Icon, color, bg } = typeConfig[notif.type];
              return (
                <div
                  key={notif.id}
                  onClick={() => markRead(notif.id)}
                  className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all group ${
                    !notif.read
                      ? "bg-[#1a2236] border-emerald-500/10 hover:border-emerald-500/20"
                      : "bg-[#111827] border-[#1f2d45] hover:border-[#2d4060]"
                  }`}
                >
                  {/* Icon or Avatar */}
                  <div className="relative shrink-0">
                    {notif.avatar ? (
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm ${avatarBg[notif.avatarColor || "emerald"]}`}>
                        {notif.avatar}
                      </div>
                    ) : (
                      <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${bg}`}>
                        <Icon size={20} className={color} />
                      </div>
                    )}
                    {!notif.read && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0A0F1C]" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold mb-0.5 ${!notif.read ? "text-white" : "text-gray-300"}`}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-gray-500 leading-relaxed">{notif.desc}</p>
                      </div>
                      <span className="text-xs text-gray-600 shrink-0 whitespace-nowrap">{notif.time}</span>
                    </div>

                    {notif.action && (
                      <button className={`mt-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                        notif.type === "connection"
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                      }`}>
                        {notif.action}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
