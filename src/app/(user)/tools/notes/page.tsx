/* =====================================================
   الملاحظات - Notes App
   مثل تطبيق Notes من Apple
===================================================== */

"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Plus, Search, Pin, Trash2, Folder } from "lucide-react";

interface Note {
    id: string;
    title: string;
    content: string;
    is_pinned: boolean;
    color: string;
    updated_at: string;
}

const mockNotes: Note[] = [
    { id: "1", title: "أفكار للمشروع", content: "1. تصميم الواجهة\n2. قاعدة البيانات\n3. API", is_pinned: true, color: "#FFE066", updated_at: "2024-12-09" },
    { id: "2", title: "قائمة المهام", content: "- مذاكرة\n- تمارين\n- قراءة", is_pinned: false, color: "#ffffff", updated_at: "2024-12-08" },
    { id: "3", title: "ملاحظات الاجتماع", content: "تم الاتفاق على الجدول الزمني للمشروع", is_pinned: false, color: "#C3FAE8", updated_at: "2024-12-07" },
];

const colors = ["#ffffff", "#FFE066", "#C3FAE8", "#D0BFFF", "#FFC9C9", "#A5D8FF"];

export default function NotesPage() {
    const [notes, setNotes] = useState(mockNotes);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    // تصفية الملاحظات
    const filteredNotes = notes.filter(note =>
        note.title.includes(searchTerm) || note.content.includes(searchTerm)
    );

    // المثبتة أولاً ثم حسب التاريخ
    const sortedNotes = [...filteredNotes].sort((a, b) => {
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

    // إضافة ملاحظة جديدة
    const addNote = () => {
        const newNote: Note = {
            id: Date.now().toString(),
            title: "ملاحظة جديدة",
            content: "",
            is_pinned: false,
            color: "#ffffff",
            updated_at: new Date().toISOString().split("T")[0]
        };
        setNotes([newNote, ...notes]);
        setSelectedNote(newNote);
        setIsEditing(true);
    };

    // حفظ الملاحظة
    const saveNote = () => {
        if (selectedNote) {
            setNotes(notes.map(n => n.id === selectedNote.id ? selectedNote : n));
            setIsEditing(false);
        }
    };

    // حذف ملاحظة
    const deleteNote = (id: string) => {
        setNotes(notes.filter(n => n.id !== id));
        if (selectedNote?.id === id) {
            setSelectedNote(null);
        }
    };

    // تبديل التثبيت
    const togglePin = (id: string) => {
        setNotes(notes.map(n => n.id === id ? { ...n, is_pinned: !n.is_pinned } : n));
    };

    // تغيير اللون
    const changeColor = (color: string) => {
        if (selectedNote) {
            setSelectedNote({ ...selectedNote, color });
            setNotes(notes.map(n => n.id === selectedNote.id ? { ...n, color } : n));
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* الهيدر */}
            <header className="flex items-center justify-between p-4">
                <Link href="/tools" className="p-2 rounded-full glass">
                    <ArrowRight size={24} />
                </Link>
                <h1 className="text-xl font-bold">الملاحظات</h1>
                <button onClick={addNote} className="p-2 rounded-full bg-brand-gradient text-white">
                    <Plus size={24} />
                </button>
            </header>

            {/* البحث */}
            <div className="px-4 mb-4">
                <div className="relative">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        className="input-glass pr-12"
                        placeholder="بحث في الملاحظات..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* قائمة الملاحظات */}
            <div className="flex-1 px-4 overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                    {sortedNotes.map(note => (
                        <div
                            key={note.id}
                            onClick={() => {
                                setSelectedNote(note);
                                setIsEditing(false);
                            }}
                            className="p-4 rounded-xl cursor-pointer hover:scale-[1.02] transition-transform relative"
                            style={{ backgroundColor: note.color }}
                        >
                            {note.is_pinned && (
                                <Pin size={14} className="absolute top-2 left-2 text-gray-500" />
                            )}
                            <h3 className="font-bold mb-1 line-clamp-1">{note.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-3">{note.content}</p>
                            <p className="text-xs text-gray-400 mt-2">{note.updated_at}</p>
                        </div>
                    ))}
                </div>

                {sortedNotes.length === 0 && (
                    <div className="text-center py-12">
                        <Folder size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">لا توجد ملاحظات</p>
                    </div>
                )}
            </div>

            {/* Modal عرض/تعديل الملاحظة */}
            {selectedNote && (
                <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setSelectedNote(null)}>
                    <div
                        className="absolute inset-4 md:inset-12 rounded-2xl overflow-hidden flex flex-col"
                        style={{ backgroundColor: selectedNote.color }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* شريط الأدوات */}
                        <div className="flex items-center justify-between p-4 border-b border-black/10">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => togglePin(selectedNote.id)}
                                    className={`p-2 rounded-lg ${selectedNote.is_pinned ? "bg-yellow-200" : "hover:bg-black/10"}`}
                                >
                                    <Pin size={20} />
                                </button>
                                <button
                                    onClick={() => deleteNote(selectedNote.id)}
                                    className="p-2 rounded-lg hover:bg-red-100 text-red-500"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                            <div className="flex gap-1">
                                {colors.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => changeColor(color)}
                                        className={`w-6 h-6 rounded-full border-2 ${selectedNote.color === color ? "border-black" : "border-transparent"}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                            {isEditing ? (
                                <button onClick={saveNote} className="btn-gradient text-sm">حفظ</button>
                            ) : (
                                <button onClick={() => setIsEditing(true)} className="btn-glass text-sm">تعديل</button>
                            )}
                        </div>

                        {/* المحتوى */}
                        <div className="flex-1 p-4 overflow-y-auto">
                            {isEditing ? (
                                <>
                                    <input
                                        type="text"
                                        value={selectedNote.title}
                                        onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })}
                                        className="w-full text-2xl font-bold bg-transparent border-none outline-none mb-4"
                                        placeholder="العنوان"
                                    />
                                    <textarea
                                        value={selectedNote.content}
                                        onChange={(e) => setSelectedNote({ ...selectedNote, content: e.target.value })}
                                        className="w-full h-full bg-transparent border-none outline-none resize-none"
                                        placeholder="اكتب ملاحظتك هنا..."
                                    />
                                </>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold mb-4">{selectedNote.title}</h2>
                                    <p className="whitespace-pre-wrap">{selectedNote.content}</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
