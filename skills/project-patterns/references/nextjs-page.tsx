/**
 * PA SMS Online — Next.js Page Template
 * =======================================
 * Copy this pattern when creating a new page.
 *
 * CRITICAL RULES:
 * 1. Start with "use client";
 * 2. Use fetchClient from @/lib/api-client — NOT raw fetch()
 * 3. Use useLanguage() for ALL displayed text
 * 4. Use useAuth() for user info and role checks
 * 5. Status badges: Record<string, { bg, text, label }>
 */
"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { fetchClient } from '@/lib/api-client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileText, Clock, CheckCircle2, Archive } from 'lucide-react';
import DeleteButton from "@/components/DeleteButton";

// ── Status Configuration ────────────────────────────────────────
const STATUS_TABS = [
    { key: '', label: 'Tất cả', icon: FileText },
    { key: 'draft', label: 'Nháp', icon: FileText },
    { key: 'pending_approval', label: 'Chờ duyệt', icon: Clock },
    { key: 'completed', label: 'Hoàn thành', icon: CheckCircle2 },
    { key: 'archived', label: 'Lưu trữ', icon: Archive },
];

const STATUS_BADGE: Record<string, { bg: string; text: string; label: string }> = {
    draft: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Nháp' },
    pending_approval: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Chờ duyệt' },
    approved: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Đã duyệt' },
    completed: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Hoàn thành' },
    archived: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Đã lưu trữ' },
};

// ── Page Component ──────────────────────────────────────────────
export default function ModulePage() {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('');

    const fetchItems = async () => {
        try {
            const url = activeTab ? `/module/items?status=${activeTab}` : '/module/items';
            const data = await fetchClient(url);
            setItems(data);
        } catch (error) {
            console.error("Failed to fetch items", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchItems();
    }, [activeTab]);

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-800">{t("nav.module_name")}</h1>
                <Link href="/module/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium text-sm">
                    + {t("common.create")}
                </Link>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
                {STATUS_TABS.map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                            activeTab === tab.key
                                ? 'bg-white text-slate-800 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                        }`}>
                        <tab.icon size={14} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className="text-center py-12 text-slate-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3" />
                    {t("common.loading")}
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-12 text-slate-400">{t("common.no_data")}</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="text-left p-4 text-xs font-bold text-slate-500 uppercase">
                                    {t("common.title")}
                                </th>
                                <th className="text-left p-4 text-xs font-bold text-slate-500 uppercase">
                                    {t("common.status")}
                                </th>
                                <th className="text-left p-4 text-xs font-bold text-slate-500 uppercase">
                                    {t("common.date")}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {items.map((item: any) => {
                                const badge = STATUS_BADGE[item.status] || STATUS_BADGE.draft;
                                return (
                                    <tr key={item.id}
                                        className="hover:bg-slate-50 transition cursor-pointer"
                                        onClick={() => window.location.href = `/module/${item.id}`}>
                                        <td className="p-4">
                                            <div className="font-medium text-slate-800">{item.title}</div>
                                            <DeleteButton
                                                id={item.id}
                                                endpoint="/module/items"
                                                userRole={user?.role}
                                                onDeleted={fetchItems}
                                            />
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${badge.bg} ${badge.text}`}>
                                                {badge.label}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-slate-500">
                                            {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
