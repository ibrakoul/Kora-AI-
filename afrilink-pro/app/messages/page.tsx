"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Search, Send, Smile, MoreHorizontal,
  Phone, Video, Star, CheckCheck, Check, Plus,
  ArrowLeft, Paperclip, Loader2, MessageSquare
} from "lucide-react";
import type { MessageRow } from "@/types/database";
import { fetchConversations, fetchMessages, sendMessage } from "@/lib/api/messages";
import { useAuthContext } from "@/components/providers/AuthProvider";

type ConvWithParticipant = {
  id: string;
  participant_1_id: string;
  participant_2_id: string;
  last_message_at: string | null;
  last_message_preview: string | null;
  other: {
    id: string;
    first_name: string;
    last_name: string;
    headline: string | null;
    avatar_url: string | null;
  };
  unread_count: number;
};

function timeAgo(dateStr: string | null) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Hier";
  return `${days}j`;
}

function initials(first: string, last: string) {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

export default function MessagesPage() {
  const { user } = useAuthContext();
  const [convs, setConvs] = useState<ConvWithParticipant[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [msgInput, setMsgInput] = useState("");
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const [showList, setShowList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadConversations = async () => {
    setLoadingConvs(true);
    try {
      const raw = await fetchConversations();
      const enriched = raw.map((c: Record<string, unknown>) => {
        const isP1 = c.participant_1_id === user?.id;
        const other = isP1
          ? (c.participant_2 as Record<string, unknown>)
          : (c.participant_1 as Record<string, unknown>);
        return { ...c, other, unread_count: 0 };
      });
      setConvs(enriched);
    } catch {
      setConvs([]);
    } finally {
      setLoadingConvs(false);
    }
  };

  const loadMessages = useCallback(async (convId: string) => {
    setLoadingMsgs(true);
    try {
      const data = await fetchMessages(convId);
      setMessages(data);
    } catch {
      setMessages([]);
    } finally {
      setLoadingMsgs(false);
    }
  }, []);

  useEffect(() => { if (user) loadConversations(); }, [user]);

  useEffect(() => {
    if (activeConvId) loadMessages(activeConvId);
  }, [activeConvId, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectConv = (id: string) => {
    setActiveConvId(id);
    setShowList(false);
  };

  const handleSend = async () => {
    if (!msgInput.trim() || !activeConvId || sending) return;
    setSending(true);
    try {
      const msg = await sendMessage(activeConvId, msgInput.trim());
      setMessages(prev => [...prev, msg]);
      setMsgInput("");
      setConvs(prev => prev.map(c =>
        c.id === activeConvId ? { ...c, last_message_preview: msgInput.trim(), last_message_at: new Date().toISOString() } : c
      ));
    } catch {
      // silent
    } finally {
      setSending(false);
    }
  };

  const activeConv = convs.find(c => c.id === activeConvId);

  return (
    <div className="h-screen bg-[#0A0F1C] flex overflow-hidden">
      {/* Conversations list */}
      <div className={`w-full lg:w-80 xl:w-96 border-r border-[#1f2d45] flex flex-col ${showList ? "flex" : "hidden lg:flex"}`}>
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

        <div className="flex border-b border-[#1f2d45] px-2">
          {["Tous", "Non lus"].map((tab, i) => (
            <button
              key={tab}
              className={`flex-1 py-3 text-xs font-semibold transition-all ${
                i === 0 ? "text-emerald-400 border-b-2 border-emerald-400" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar">
          {loadingConvs ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 size={24} className="text-emerald-400 animate-spin" />
            </div>
          ) : convs.length === 0 ? (
            <div className="text-center py-16 text-gray-600 px-4">
              <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">Aucun message</p>
              <p className="text-xs mt-1">Connectez-vous avec des professionnels pour démarrer une conversation</p>
            </div>
          ) : (
            convs.map((conv) => (
              <button
                key={conv.id}
                onClick={() => handleSelectConv(conv.id)}
                className={`w-full flex items-start gap-3 px-4 py-3.5 hover:bg-[#1a2236] transition-all border-b border-[#1f2d45]/50 text-left ${
                  activeConvId === conv.id ? "bg-[#1a2236] border-l-2 border-l-emerald-500" : ""
                }`}
              >
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                    {conv.other ? initials(conv.other.first_name as string, conv.other.last_name as string) : "?"}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-sm font-semibold truncate ${conv.unread_count > 0 ? "text-white" : "text-gray-300"}`}>
                      {conv.other ? `${conv.other.first_name} ${conv.other.last_name}` : "Utilisateur"}
                    </span>
                    <span className="text-xs text-gray-600 shrink-0 ml-2">
                      {timeAgo(conv.last_message_at)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 truncate mb-1">
                    {(conv.other?.headline as string) ?? ""}
                  </div>
                  <div className={`text-xs truncate ${conv.unread_count > 0 ? "text-gray-300 font-medium" : "text-gray-600"}`}>
                    {conv.last_message_preview ?? "Démarrez la conversation..."}
                  </div>
                </div>

                {conv.unread_count > 0 && (
                  <span className="w-5 h-5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                    {conv.unread_count}
                  </span>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className={`flex-1 flex flex-col ${!showList ? "flex" : "hidden lg:flex"}`}>
        {!activeConv ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
            <MessageSquare size={48} className="opacity-20 mb-4" />
            <p className="font-medium text-gray-400">Sélectionnez une conversation</p>
            <p className="text-sm mt-1">Choisissez une conversation dans la liste</p>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="flex items-center gap-4 px-5 py-4 border-b border-[#1f2d45] glass">
              <button onClick={() => setShowList(true)} className="lg:hidden p-2 text-gray-400 hover:text-white">
                <ArrowLeft size={20} />
              </button>

              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
                {initials(activeConv.other.first_name as string, activeConv.other.last_name as string)}
              </div>

              <div className="flex-1">
                <div className="font-semibold text-white">
                  {activeConv.other.first_name} {activeConv.other.last_name}
                </div>
                <div className="text-xs text-gray-500">
                  {activeConv.other.headline ?? "AfriLink Pro"}
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
              {loadingMsgs ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 size={24} className="text-emerald-400 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-10 text-gray-600">
                  <p className="text-sm">Démarrez la conversation !</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender_id === user?.id;
                  return (
                    <div key={msg.id} className={`flex gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                      {!isMe && (
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0 mt-auto">
                          {initials(activeConv.other.first_name as string, activeConv.other.last_name as string)}
                        </div>
                      )}

                      <div className={`max-w-xs lg:max-w-md ${isMe ? "items-end" : "items-start"} flex flex-col gap-1`}>
                        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          isMe
                            ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-br-sm"
                            : "bg-[#1a2236] border border-[#1f2d45] text-gray-200 rounded-bl-sm"
                        }`}>
                          {msg.content}
                        </div>
                        <div className={`flex items-center gap-1 text-xs text-gray-600 ${isMe ? "flex-row-reverse" : ""}`}>
                          <span>{new Date(msg.sent_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span>
                          {isMe && (msg.read_at
                            ? <CheckCheck size={12} className="text-emerald-400" />
                            : <Check size={12} />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="px-4 py-4 border-t border-[#1f2d45] glass">
              <div className="flex items-end gap-3">
                <button className="p-2 text-gray-500 hover:text-gray-300 transition-colors">
                  <Paperclip size={18} />
                </button>

                <div className="flex-1 relative">
                  <textarea
                    value={msgInput}
                    onChange={(e) => setMsgInput(e.target.value)}
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
                  disabled={!msgInput.trim() || sending}
                  className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 rounded-xl flex items-center justify-center text-white transition-all shadow-lg hover:shadow-emerald-500/30 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                  {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
