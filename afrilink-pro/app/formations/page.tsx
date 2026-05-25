"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BookOpen, Play, Clock, Users, Star, Award, ChevronRight,
  Search, Filter, Zap, TrendingUp, Lock, CheckCircle,
  Globe, Download, MonitorPlay
} from "lucide-react";

const categories = [
  { label: "Tout", icon: "🌍" },
  { label: "Tech & IA", icon: "💻" },
  { label: "Entrepreneuriat", icon: "🚀" },
  { label: "Finance", icon: "💰" },
  { label: "Marketing", icon: "📱" },
  { label: "Design", icon: "🎨" },
  { label: "Leadership", icon: "👑" },
  { label: "Langues", icon: "🗣️" },
  { label: "BTP", icon: "🏗️" },
];

import type { CourseRow } from "@/types/database";

type CourseVM = {
  id: string;
  title: string;
  instructor: string;
  instructorRole: string;
  rating: number;
  students: number;
  duration: string;
  lessons: number;
  level: string;
  price: string;
  originalPrice: string;
  category: string;
  thumbnail: string;
  color: string;
  certified: boolean;
  bestseller: boolean;
  tags: string[];
  desc: string;
  progress: number;
  enrolled: boolean;
};

const categoryIcon: Record<string, string> = {
  "Tech & IA": "💻",
  "Entrepreneurship": "🚀",
  "Finance": "💰",
  "Marketing": "📱",
  "Design": "🎨",
  "Leadership": "👑",
  "Languages": "🗣️",
  "BTP": "🏗️",
};

function apiToCourseVM(c: CourseRow): CourseVM {
  return {
    id: c.id,
    title: c.title,
    instructor: c.instructor_name,
    instructorRole: "",
    rating: Number(c.rating),
    students: c.students_enrolled,
    duration: `${c.duration_hours}h`,
    lessons: c.lesson_count,
    level: c.level === "Beginner" ? "Débutant" : c.level === "Intermediate" ? "Intermédiaire" : "Avancé",
    price: c.price === 0 ? "Gratuit" : `${c.price.toLocaleString()} ${c.currency}`,
    originalPrice: c.original_price ? `${c.original_price.toLocaleString()} ${c.currency}` : "",
    category: c.category,
    thumbnail: categoryIcon[c.category] ?? "📚",
    color: "blue",
    certified: c.is_certified,
    bestseller: c.is_bestseller,
    tags: [],
    desc: c.description,
    progress: 0,
    enrolled: false,
  };
}

const colorVariants: Record<string, string> = {
  blue: "from-blue-900/40 to-blue-950/60 border-blue-500/20",
  emerald: "from-emerald-900/40 to-emerald-950/60 border-emerald-500/20",
  orange: "from-orange-900/40 to-orange-950/60 border-orange-500/20",
  yellow: "from-yellow-900/30 to-yellow-950/50 border-yellow-500/20",
  purple: "from-purple-900/40 to-purple-950/60 border-purple-500/20",
  pink: "from-pink-900/30 to-pink-950/50 border-pink-500/20",
};

const starColor: Record<string, string> = {
  blue: "text-blue-400",
  emerald: "text-emerald-400",
  orange: "text-orange-400",
  yellow: "text-yellow-400",
  purple: "text-purple-400",
  pink: "text-pink-400",
};

export default function FormationsPage() {
  const [activeCategory, setActiveCategory] = useState("Tout");
  const [courses, setCourses] = useState<CourseVM[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ limit: "12" });
        if (activeCategory !== "Tout") {
          const cat = categories.find(c => c.label === activeCategory)?.label ?? activeCategory;
          params.set("category", cat);
        }
        const res = await fetch(`/api/courses?${params}`);
        const data = await res.json();
        setCourses((data.courses ?? []).map(apiToCourseVM));
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [activeCategory]);

  const filtered = courses;

  return (
    <div className="min-h-screen bg-[#0A0F1C]">
      {/* Hero */}
      <div className="relative py-14 px-4 border-b border-[#1f2d45] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 to-purple-950/20" />
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-5">
            <BookOpen size={12} />
            12,000+ cours · 180 formateurs experts africains
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Développez vos compétences,{" "}
            <span style={{ background: "linear-gradient(135deg, #60a5fa, #2563EB)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              accélérez votre carrière
            </span>
          </h1>
          <p className="text-gray-400 mb-6 text-lg">
            Des formations certifiantes créées par et pour les professionnels africains.
          </p>

          <div className="flex gap-3 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                placeholder="Rechercher une formation..."
                className="input-premium pl-11 py-3"
              />
            </div>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg">
              Rechercher
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            {[
              { value: "500K+", label: "Apprenants actifs" },
              { value: "12,000+", label: "Cours disponibles" },
              { value: "95%", label: "Taux de satisfaction" },
              { value: "180+", label: "Formateurs experts" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* My in-progress courses */}
        {courses.filter((c) => c.enrolled && c.progress > 0).length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-400" />
              Continuer vos formations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {courses.filter((c) => c.enrolled && c.progress > 0).map((course) => (
                <div key={course.id} className={`relative rounded-xl border bg-gradient-to-br p-5 ${colorVariants[course.color]}`}>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{course.thumbnail}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-sm truncate mb-1">{course.title}</h3>
                      <div className="text-xs text-gray-400 mb-2">{course.instructor}</div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-gray-500">{course.progress}% complété</span>
                        <span className="text-xs text-emerald-400 font-semibold">{course.duration}</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-bar-fill" style={{ width: `${course.progress}%` }} />
                      </div>
                    </div>
                    <button className="shrink-0 w-10 h-10 bg-emerald-500 hover:bg-emerald-400 rounded-full flex items-center justify-center transition-colors shadow-lg">
                      <Play size={16} className="text-white ml-0.5" fill="white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-6">
          {categories.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => setActiveCategory(label)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                activeCategory === label
                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                  : "text-gray-400 border border-[#1f2d45] hover:border-[#2d4060] hover:text-gray-300"
              }`}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">
            {activeCategory === "Tout" ? "Tous les cours" : activeCategory}
            <span className="text-gray-500 font-normal text-sm ml-2">({filtered.length})</span>
          </h2>
          <select className="input-premium py-2 text-xs w-40">
            <option>Les plus populaires</option>
            <option>Les mieux notés</option>
            <option>Les plus récents</option>
            <option>Prix croissant</option>
          </select>
        </div>

        {/* Courses grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <div key={course.id} className="card-premium overflow-hidden group cursor-pointer">
              {/* Thumbnail */}
              <div className={`relative h-44 bg-gradient-to-br flex items-center justify-center ${colorVariants[course.color]}`}>
                <span className="text-6xl">{course.thumbnail}</span>

                {/* Badges overlay */}
                <div className="absolute top-3 left-3 flex gap-2">
                  {course.bestseller && (
                    <span className="px-2 py-1 bg-yellow-500 text-black text-[10px] font-bold rounded-md">
                      BESTSELLER
                    </span>
                  )}
                  {course.certified && (
                    <span className="px-2 py-1 bg-emerald-500/90 text-white text-[10px] font-bold rounded-md flex items-center gap-1">
                      <Award size={9} /> Certifiant
                    </span>
                  )}
                </div>

                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-xl">
                    <Play size={22} className="text-gray-900 ml-1" fill="currentColor" />
                  </div>
                </div>

                {course.enrolled && (
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${course.progress}%` }} />
                    </div>
                    <div className="text-xs text-gray-300 mt-1">{course.progress}% complété</div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-white text-sm leading-snug group-hover:text-blue-400 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                </div>

                <div className="text-xs text-gray-500 mb-3">
                  par <span className="text-gray-300 font-medium">{course.instructor}</span>
                  {" · "}{course.instructorRole}
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < Math.floor(course.rating) ? "text-yellow-400" : "text-gray-700"} fill={i < Math.floor(course.rating) ? "currentColor" : "none"} />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-yellow-400">{course.rating}</span>
                  <span className="text-xs text-gray-600">({course.students.toLocaleString()})</span>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><Clock size={11} />{course.duration}</span>
                  <span className="flex items-center gap-1"><MonitorPlay size={11} />{course.lessons} leçons</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${course.level === "Débutant" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : course.level === "Intermédiaire" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"}`}>
                    {course.level}
                  </span>
                </div>

                {/* Price + CTA */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-white">{course.price}</span>
                    <span className="text-xs text-gray-600 line-through ml-2">{course.originalPrice}</span>
                  </div>
                  <button className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    course.enrolled
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-500 hover:to-blue-600 shadow-md"
                  }`}>
                    {course.enrolled ? "Continuer" : "S'inscrire"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        <div className="text-center mt-10">
          <button className="px-8 py-3 border border-[#1f2d45] text-gray-300 font-semibold rounded-xl hover:border-blue-500/30 hover:text-blue-400 transition-all">
            Voir plus de formations
          </button>
        </div>
      </div>
    </div>
  );
}
