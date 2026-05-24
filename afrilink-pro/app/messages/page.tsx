"use client";

import { useState } from "react";
import {
  Search, Send, Paperclip, Smile, MoreHorizontal,
  Phone, Video, Star, CheckCheck, Check, Plus,
  ArrowLeft, Mic, Image, File
} from "lucide-react";

const conversations = [
  {
    id: 1,
    user: { name: "Fatou Ndiaye", role: "DG AfriTech", avatar: "FN", color: "emerald", online: true },
    lastMessage: "Parfait ! On se retrouve demain à 10h pour le pitch alors.",
    time: "il y a 2min",
    unread: 2,
    starred: false,
  },
  {
    id: 2,
    user: { name: "Kwame Mensah", role: "Engineering Manager @ Google", avatar: "KM", color: "blue", online: true },
    lastMessage: "Merci pour le partage de ton profil. Tu es exactement le profil qu'on cherche.",
    time: "il y a 45min",
    unread: 0,
    starred: true,
  },
  {
    id: 3,
    user: { name: "Mariama Konaté", role: "HR Manager @ MTN", avatar: "MK", color: "orange", online: false },
    lastMessage: "Votre candidature pour le poste de Senior Developer a bien été retenue.",
    time: "il y a 2h",
    unread: 1,
    starred: false,
  },
  {
    id: 4,
    user: { name: "Chidi Okeke", role: "CEO @ FinPay Africa", avatar: "CO", color: "purple", online: false },
    lastMessage: "On recherche des co-fondateurs tech pour notre prochain projet...",
    time: "Hier",
    unread: 0,
    starred: false,
  },
  {
    id: 5,
    user: { name: "Aminata Diallo", role: "Senior Dev @ AfriTech", avatar: "AD", color: "emerald", online: true },
    lastMessage: "As-tu regardé la documentation du nouveau projet ?",
    time: "Hier",
    unread: 0,
    starred: false,
  },
  {
    id: 6,
    user: { name: "Moussa Traoré", role: "CTO @ WavePay", avatar: "MT", color: "blue", online: false },
    lastMessage: "Super collaboration sur le projet ! À très bientôt.",
    time: "Mer",
    unread: 0,
    starred: false,
  },
];

const messages = [
  { id: 1, from: "them", text: "Bonjour ! J'ai vu votre profil sur AfriLink Pro et je suis vraiment impressionné par votre parcours.", time: "10:00", read: true },
  { id: 2, from: "me", text: "Merci beaucoup ! Votre message me fait vraiment plaisir.", time: "10:05", read: true },
  { id: 3, from: "them", text: "Nous recrutons actuellement un Senior Developer pour notre équipe Dakar. Votre stack React + Node.js est exactement ce dont on a besoin.", time: "10:07", read: true },
  { id: 4, from: "them", text: "Est-ce que vous seriez disponible pour un appel cette semaine ?", time: "10:07", read: true },
  { id: 5, from: "me", text: "Absolument ! Je suis très intéressé. Je suis disponible demain ou après-demain en après-midi.", time: "10:12", read: true },
  { id: 6, from: "them", text: "Parfait ! On se retrouve demain à 10h pour le pitch alors.", time: "10:15", read: true },
  { id: 7, from: "them", text: "Je vous enverrai le lien Zoom ce soir. Préparez-vous à présenter vos projets récents.", time: "10:15", read: false },
];

const avatarBg: Record<string, string> = {
  emerald: "bg-emerald-500/20 text-emerald-400",
  blue: "bg-blue-500/20 text-blue-400",
  orange: "bg-orange-500/20 text-orange-400",
  purple: "bg-purple-500/20 text-purple-400",
};

export default function MessagesPage() {
  const [activeConv, setActiveConv] = useState(conversations[0]);
  const [message, setMessage] = useState("");
  const [showConvList, setShowConvList] = useState(true);

  const handleSend = () => {
    if (message.trim()) setMessage("");
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] flex">
      {/* Conversations list */}
      <div className={`w-full lg:w-80 xl:w-96 border-r border-[#1f2d45] flex flex-col ${showConvList ? "flex" : "hidden lg:flex"}`}>
        {/* Header */}
        <div className="px-4 py-4 border-b border-[#1f2d45]">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold text-white">Messages</h1>
            <button className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 hover:bg-emerald-500/20 transition-all">
              <Plus size={16} />
            </button>
          </div>
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input placeholder="Rechercher..." className="input-premium pl-10 py-2 text-sm" />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex border-b border-[#1f2d45] px-2">
          {["Tous", "Non lus", "Favoris"].map((tab, i) => (
            <button
              key={tab}
              className={`flex-1 py-3 text-xs font-semibold transition-all ${
                i === 0
                  ? "text-emerald-400 border-b-2 border-emerald-400"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => { setActiveConv(conv); setShowConvList(false); }}
              className={`w-full flex items-start gap-3 px-4 py-3.5 hover:bg-[#1a2236] transition-all border-b border-[#1f2d45]/50 text-left ${
                activeConv.id === conv.id ? "bg-[#1a2236] border-l-2 border-l-emerald-500" : ""
              }`}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm ${avatarBg[conv.user.color]}`}>
                  {conv.user.avatar}
                </div>
                {conv.user.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0d1626]" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`text-sm font-semibold truncate ${conv.unread > 0 ? "text-white" : "text-gray-300"}`}>
                    {conv.user.name}
                  </span>
                  <span className="text-xs text-gray-600 shrink-0 ml-2">{conv.time}</span>
                </div>
                <div className="text-xs text-gray-500 truncate mb-1">{conv.user.role}</div>
                <div className={`text-xs truncate ${conv.unread > 0 ? "text-gray-300 font-medium" : "text-gray-600"}`}>
                  {conv.lastMessage}
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                {conv.unread > 0 && (
                  <span className="w-5 h-5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {conv.unread}
                  </span>
                )}
                {conv.starred && <Star size={12} className="text-yellow-400" fill="currentColor" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className={`flex-1 flex flex-col ${!showConvList ? "flex" : "hidden lg:flex"}`}>
        {/* Chat header */}
        <div className="flex items-center gap-4 px-5 py-4 border-b border-[#1f2d45] glass">
          <button
            onClick={() => setShowConvList(true)}
            className="lg:hidden p-2 text-gray-400 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${avatarBg[activeConv.user.color]}`}>
              {activeConv.user.avatar}
            </div>
            {activeConv.user.online && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0d1626]" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">{activeConv.user.name}</span>
              <span className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">✓</span>
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {activeConv.user.online ? (
                <span className="text-emerald-400">● En ligne</span>
              ) : "Hors ligne"} · {activeConv.user.role}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              <Phone size={18} />
            </button>
            <button className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              <Video size={18} />
            </button>
            <button className="p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-4 space-y-4">
          {/* Date separator */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#1f2d45]" />
            <span className="text-xs text-gray-600">Aujourd&apos;hui</span>
            <div className="flex-1 h-px bg-[#1f2d45]" />
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.from === "me" ? "flex-row-reverse" : "flex-row"}`}
            >
              {msg.from === "them" && (
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-auto ${avatarBg[activeConv.user.color]}`}>
                  {activeConv.user.avatar}
                </div>
              )}

              <div className={`max-w-xs lg:max-w-md ${msg.from === "me" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.from === "me"
                      ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-br-sm"
                      : "bg-[#1a2236] border border-[#1f2d45] text-gray-200 rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
                <div className={`flex items-center gap-1 text-xs text-gray-600 ${msg.from === "me" ? "flex-row-reverse" : ""}`}>
                  <span>{msg.time}</span>
                  {msg.from === "me" && (
                    msg.read
                      ? <CheckCheck size={12} className="text-emerald-400" />
                      : <Check size={12} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="px-4 py-4 border-t border-[#1f2d45] glass">
          <div className="flex items-end gap-3">
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-500 hover:text-gray-300 transition-colors">
                <Paperclip size={18} />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-300 transition-colors">
                <Image size={18} />
              </button>
            </div>

            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Écrire un message..."
                rows={1}
                className="input-premium resize-none py-3 pr-10 text-sm leading-relaxed"
                style={{ minHeight: "44px", maxHeight: "120px" }}
              />
              <button className="absolute right-3 bottom-3 text-gray-500 hover:text-gray-300 transition-colors">
                <Smile size={18} />
              </button>
            </div>

            <button
              onClick={handleSend}
              disabled={!message.trim()}
              className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 rounded-xl flex items-center justify-center text-white transition-all shadow-lg hover:shadow-emerald-500/30 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
