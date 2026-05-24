"use client";

import { useState, useRef, useEffect } from "react";
import {
  Brain, Send, Plus, Trash2, Copy, ThumbsUp, ThumbsDown,
  Globe, Zap, MoreHorizontal, Paperclip, Mic, Sparkles,
  ChevronDown, Check, Settings
} from "lucide-react";

type Message = { id: number; role: "user" | "assistant"; content: string; time: string; lang?: string };

const suggestedPrompts = [
  "Rédige un email professionnel en français pour demander une réunion",
  "Analyse ce contrat et identifie les clauses importantes",
  "Traduis ce texte en wolof et explique les nuances culturelles",
  "Génère un rapport de vente pour le marché ouest-africain",
  "Quelles sont les meilleures pratiques pour une startup en Afrique ?",
  "Écris une proposition commerciale pour un client nigérian",
];

const models = [
  { id: "kora-pro", label: "Kora Pro", desc: "Optimal équilibre vitesse/qualité", badge: "Recommandé" },
  { id: "kora-ultra", label: "Kora Ultra", desc: "Meilleure qualité, plus lent", badge: "Meilleur" },
  { id: "kora-fast", label: "Kora Fast", desc: "Ultra-rapide, basique", badge: null },
];

const languages = ["Auto-detect", "Français", "English", "Wolof", "Hausa", "Swahili", "Arabe", "Yoruba"];

const fakeResponses = [
  "Bien sûr ! Voici une réponse professionnelle adaptée au contexte africain. Je prends en compte les spécificités culturelles et les pratiques commerciales locales pour vous fournir un contenu de qualité optimale.\n\nN'hésitez pas à me demander des ajustements ou des précisions supplémentaires.",
  "Excellente question ! Basé sur mon analyse approfondie des marchés africains, voici ce que je recommande :\n\n**Points clés à retenir :**\n1. Adapter votre approche aux réalités locales\n2. Considérer les aspects culturels et linguistiques\n3. Utiliser les canaux de communication appropriés\n\nSouhaitez-vous que j'approfondisse l'un de ces points ?",
  "Je vais analyser cela selon les standards professionnels africains et vous fournir une réponse complète et nuancée. Voici mon analyse :\n\nLe contexte ouest-africain présente des particularités importantes que je vais intégrer dans ma réponse pour vous garantir la meilleure pertinence possible.",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "assistant", content: "Bonjour ! Je suis **Kora Chat**, votre assistant IA africain. Je parle français, anglais, wolof, hausa, swahili et bien d'autres langues africaines.\n\nComment puis-je vous aider aujourd'hui ?", time: "maintenant" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("kora-pro");
  const [selectedLang, setSelectedLang] = useState("Auto-detect");
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { id: Date.now(), role: "user", content: input.trim(), time: "maintenant" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));
    const aiMsg: Message = {
      id: Date.now() + 1,
      role: "assistant",
      content: fakeResponses[Math.floor(Math.random() * fakeResponses.length)],
      time: "maintenant",
      lang: selectedLang !== "Auto-detect" ? selectedLang : "Français",
    };
    setMessages((prev) => [...prev, aiMsg]);
    setLoading(false);
  };

  const copyMsg = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return <strong key={i} className="text-white font-semibold">{line.slice(2, -2)}</strong>;
      }
      if (line.match(/^\d+\./)) {
        return <div key={i} className="ml-4 text-gray-300">{line}</div>;
      }
      return <span key={i}>{line}{"\n"}</span>;
    });
  };

  return (
    <div className="min-h-screen bg-[#070B14] flex flex-col">
      {/* Header */}
      <header className="glass border-b border-[#1E2A3D] px-5 py-3 flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
            <Brain size={16} className="text-white" />
          </div>
          <span className="font-bold text-white text-sm font-display">Kora Chat</span>
        </div>

        {/* Model selector */}
        <div className="relative">
          <button onClick={() => setShowModelMenu(!showModelMenu)} className="flex items-center gap-2 px-3 py-1.5 glass border border-[#1E2A3D] rounded-lg text-xs font-medium text-gray-300 hover:border-violet-500/40 hover:text-white transition-all">
            <Zap size={12} className="text-violet-400" />
            {models.find((m) => m.id === selectedModel)?.label}
            <ChevronDown size={12} className="text-gray-500" />
          </button>
          {showModelMenu && (
            <div className="absolute top-full left-0 mt-1 w-64 glass border border-[#1E2A3D] rounded-xl shadow-2xl z-20 overflow-hidden">
              {models.map((model) => (
                <button key={model.id} onClick={() => { setSelectedModel(model.id); setShowModelMenu(false); }} className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-violet-500/10 transition-all ${selectedModel === model.id ? "bg-violet-500/10" : ""}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{model.label}</span>
                      {model.badge && <span className="badge-ai text-[9px]">{model.badge}</span>}
                    </div>
                    <div className="text-xs text-gray-500">{model.desc}</div>
                  </div>
                  {selectedModel === model.id && <Check size={14} className="text-violet-400 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Language */}
        <select value={selectedLang} onChange={(e) => setSelectedLang(e.target.value)} className="input-kora py-1.5 text-xs w-36 hidden sm:block">
          {languages.map((l) => <option key={l}>{l}</option>)}
        </select>

        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-lg hover:bg-violet-500/20 transition-all">
            <Plus size={12} />Nouvelle conv.
          </button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-6 max-w-4xl mx-auto w-full">
        {messages.length === 1 && (
          <div className="mb-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-xl mb-4">
                <Brain size={28} className="text-white" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white mb-2">Comment puis-je vous aider ?</h2>
              <p className="text-gray-400 text-sm">Posez n&apos;importe quelle question en français, anglais, wolof, hausa...</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {suggestedPrompts.map((prompt) => (
                <button key={prompt} onClick={() => setInput(prompt)} className="text-left p-3 rounded-xl glass border border-[#1E2A3D] hover:border-violet-500/30 text-xs text-gray-400 hover:text-gray-200 transition-all flex items-start gap-2">
                  <Sparkles size={12} className="text-violet-400 mt-0.5 shrink-0" />
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-5">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shrink-0 mt-1 shadow-lg">
                  <Brain size={14} className="text-white" />
                </div>
              )}
              <div className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1.5`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-violet-600/80 to-violet-700/80 text-white rounded-br-sm"
                    : "bg-[#111827] border border-[#1E2A3D] text-gray-200 rounded-bl-sm"
                }`}>
                  {msg.lang && msg.role === "assistant" && (
                    <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-[#1E2A3D]">
                      <Globe size={11} className="text-cyan-400" />
                      <span className="text-[10px] text-cyan-400 font-semibold">{msg.lang}</span>
                    </div>
                  )}
                  {formatContent(msg.content)}
                </div>

                {msg.role === "assistant" && (
                  <div className="flex items-center gap-1">
                    <button onClick={() => copyMsg(msg.id, msg.content)} className="p-1.5 text-gray-600 hover:text-gray-400 rounded-lg hover:bg-white/5 transition-all">
                      {copied === msg.id ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                    </button>
                    <button className="p-1.5 text-gray-600 hover:text-green-400 rounded-lg hover:bg-white/5 transition-all"><ThumbsUp size={13} /></button>
                    <button className="p-1.5 text-gray-600 hover:text-red-400 rounded-lg hover:bg-white/5 transition-all"><ThumbsDown size={13} /></button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shrink-0">
                <Brain size={14} className="text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-[#111827] border border-[#1E2A3D] rounded-bl-sm flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="shrink-0 border-t border-[#1E2A3D] glass px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-3 p-3 rounded-2xl bg-[#111827] border border-[#1E2A3D] focus-within:border-violet-500/50 transition-all">
            <div className="flex gap-1">
              <button className="p-2 text-gray-500 hover:text-gray-300 transition-colors rounded-lg hover:bg-white/5"><Paperclip size={16} /></button>
              <button className="p-2 text-gray-500 hover:text-gray-300 transition-colors rounded-lg hover:bg-white/5"><Mic size={16} /></button>
            </div>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Écrivez en français, wolof, hausa, swahili..."
              rows={1}
              style={{ minHeight: "44px", maxHeight: "120px" }}
              className="flex-1 bg-transparent text-gray-200 text-sm placeholder-gray-600 outline-none resize-none leading-relaxed"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="w-9 h-9 bg-gradient-to-br from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 rounded-xl flex items-center justify-center text-white transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
            >
              <Send size={15} />
            </button>
          </div>
          <div className="flex items-center justify-between mt-2 px-1">
            <span className="text-[10px] text-gray-600">Appuyez sur Entrée pour envoyer · Shift+Entrée pour nouvelle ligne</span>
            <span className="text-[10px] text-violet-400 font-medium">{input.length} / 4000</span>
          </div>
        </div>
      </div>
    </div>
  );
}
