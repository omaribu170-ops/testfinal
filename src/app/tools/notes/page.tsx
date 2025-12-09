/* =====================================================
   الملاحظات - Notes App
   مربوط بـ Supabase
===================================================== */

"use client";

import { useState, useEffect } from "react";
import { Plus, FileText, Trash2, Pin, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Note {
    id: string;
    user_id: string | null;
    title: string;
    content: string;
    color: string;
    is_pinned: boolean;
    created_at: string;
    updated_at: string;
}

const noteColors = [
    { value: "yellow", class: "bg-yellow-100" },
    { value: "green", class: "bg-green-100" },
    { value: "blue", class: "bg-blue-100" },
    { value: "pink", class: "bg-pink-100" },
    { value: "purple", class: "bg-purple-100" },
    { value: "gray", class: "bg-gray-100" }
];

export default function NotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        color: "yellow"
    });

    // جلب الملاحظات
    const fetchNotes = async () => {
        setLoading(true);
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("notes")
                .select("*")
                .order("is_pinned", { ascending: false })
                .order("updated_at", { ascending: false });

            if (!error) {
                setNotes(data as Note[] || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    // إضافة ملاحظة
    const addNote = async () => {
        if (!formData.title.trim()) {
            alert("أدخل عنوان الملاحظة");
            return;
        }

        try {
            const supabase = createClient();
            const { error } = await supabase
                .from("notes")
                .insert({
                    title: formData.title,
                    content: formData.content,
                    color: formData.color,
                    is_pinned: false
                });

            if (!error) {
                setFormData({ title: "", content: "", color: "yellow" });
                setIsEditing(false);
                fetchNotes();
            } else {
                alert("خطأ: " + error.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // تحديث ملاحظة
    const updateNote = async () => {
        if (!selectedNote) return;

        try {
            const supabase = createClient();
            const { error } = await supabase
                .from("notes")
                .update({
                    title: formData.title,
                    content: formData.content,
                    color: formData.color,
                    updated_at: new Date().toISOString()
                })
                .eq("id", selectedNote.id);

            if (!error) {
                setSelectedNote(null);
                setFormData({ title: "", content: "", color: "yellow" });
                fetchNotes();
            }
        } catch (err) {
            console.error(err);
        }
    };

    // حذف ملاحظة
    const deleteNote = async (id: string) => {
        if (!confirm("هل أنت متأكد من الحذف؟")) return;

        try {
            const supabase = createClient();
            const { error } = await supabase
                .from("notes")
                .delete()
                .eq("id", id);

            if (!error) {
                fetchNotes();
                if (selectedNote?.id === id) {
                    setSelectedNote(null);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    // تثبيت/إلغاء تثبيت
    const togglePin = async (note: Note) => {
        try {
            const supabase = createClient();
            await supabase
                .from("notes")
                .update({ is_pinned: !note.is_pinned })
                .eq("id", note.id);

            fetchNotes();
        } catch (err) {
            console.error(err);
        }
    };

    // فتح ملاحظة للتعديل
    const openNote = (note: Note) => {
        setSelectedNote(note);
        setFormData({
            title: note.title,
            content: note.content,
            color: note.color
        });
    };

    const getColorClass = (color: string) => noteColors.find(c => c.value === color)?.class || "bg-yellow-100";

    return (
        <div className="min-h-screen bg-[var(--background)] pb-24">
            {/* الهيدر */}
            <header className="glass border-b border-white/20 p-4 sticky top-0 z-10">
                <div className="max-w-lg mx-auto flex items-center gap-4">
                    <Link href="/tools" className="p-2 hover:bg-white/20 rounded-xl">
                        <ArrowRight size={24} />
                    </Link>
                    <h1 className="text-xl font-bold">الملاحظات</h1>
                </div>
            </header>

            <div className="max-w-lg mx-auto px-4 py-6">
                {/* زر إضافة */}
                {!isEditing && !selectedNote && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="w-full glass-card p-4 flex items-center gap-3 hover:bg-white/80 transition-colors mb-6"
                    >
                        <Plus size={24} className="text-gray-400" />
                        <span className="text-gray-500">ملاحظة جديدة...</span>
                    </button>
                )}

                {/* نموذج الإضافة/التعديل */}
                {(isEditing || selectedNote) && (
                    <div className={`glass-card p-4 mb-6 ${getColorClass(formData.color)}`}>
                        <input
                            type="text"
                            className="w-full bg-transparent text-lg font-bold mb-3 outline-none placeholder-gray-500"
                            placeholder="العنوان"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                        <textarea
                            className="w-full bg-transparent min-h-[150px] outline-none resize-none placeholder-gray-500"
                            placeholder="اكتب ملاحظتك هنا..."
                            value={formData.content}
                            onChange={e => setFormData({ ...formData, content: e.target.value })}
                        />

                        {/* ألوان */}
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-black/10">
                            {noteColors.map(color => (
                                <button
                                    key={color.value}
                                    onClick={() => setFormData({ ...formData, color: color.value })}
                                    className={`w-8 h-8 rounded-full ${color.class} ${formData.color === color.value ? "ring-2 ring-black" : ""}`}
                                />
                            ))}
                        </div>

                        {/* أزرار */}
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={selectedNote ? updateNote : addNote}
                                className="btn-gradient flex-1"
                            >
                                {selectedNote ? "حفظ التعديلات" : "إضافة"}
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setSelectedNote(null);
                                    setFormData({ title: "", content: "", color: "yellow" });
                                }}
                                className="btn-glass"
                            >
                                إلغاء
                            </button>
                        </div>
                    </div>
                )}

                {/* قائمة الملاحظات */}
                {loading ? (
                    <div className="text-center py-12">
                        <Loader2 className="animate-spin mx-auto" size={40} />
                    </div>
                ) : notes.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-500">لا يوجد ملاحظات</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {notes.map(note => (
                            <div
                                key={note.id}
                                className={`relative p-4 rounded-2xl cursor-pointer ${getColorClass(note.color)} hover:scale-[1.02] transition-transform`}
                                onClick={() => openNote(note)}
                            >
                                {note.is_pinned && (
                                    <Pin size={14} className="absolute top-2 left-2 text-gray-600" />
                                )}
                                <h3 className="font-bold mb-2 line-clamp-2">{note.title}</h3>
                                <p className="text-sm text-gray-600 line-clamp-3">{note.content}</p>

                                <div className="flex justify-between items-center mt-3 pt-2 border-t border-black/10">
                                    <span className="text-xs text-gray-500">
                                        {new Date(note.updated_at).toLocaleDateString("ar-EG")}
                                    </span>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={e => { e.stopPropagation(); togglePin(note); }}
                                            className={`p-1.5 rounded-lg ${note.is_pinned ? "bg-black/10" : "hover:bg-black/10"}`}
                                        >
                                            <Pin size={14} />
                                        </button>
                                        <button
                                            onClick={e => { e.stopPropagation(); deleteNote(note.id); }}
                                            className="p-1.5 rounded-lg hover:bg-red-200 text-red-500"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
