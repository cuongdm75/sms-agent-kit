/**
 * PA SMS Online — React Native Screen Template
 * ===============================================
 * Copy this pattern when creating a new mobile screen.
 *
 * CRITICAL RULES:
 * 1. Use useApi() hook — NOT raw fetch()
 * 2. Pass cacheKey for GET requests (offline support)
 * 3. Use useIsFocused() to refetch on screen focus
 * 4. Add RefreshControl to ScrollView
 * 5. Use StyleSheet.create() — NOT inline styles
 * 6. Use useLanguage() for ALL displayed text
 * 7. Handle loading, error, and empty states
 */
import React, { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, ScrollView,
    StyleSheet, ActivityIndicator, RefreshControl
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { useApi } from '../hooks/useApi';
import { useLanguage } from '../context/LanguageContext';

// ── Types ───────────────────────────────────────────────────────
interface ModuleItem {
    id: string;
    title: string;
    status: string;
    created_at?: string;
}

// ── Helpers ─────────────────────────────────────────────────────
function formatDate(v: string | null | undefined): string {
    if (!v) return '—';
    try {
        return new Date(v).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    } catch { return '—'; }
}

const getStatusInfo = (status: string): { label: string; color: string } => {
    switch (status?.toLowerCase()) {
        case 'draft': return { label: 'Nháp', color: '#6B7280' };
        case 'pending_approval': return { label: 'Chờ duyệt', color: '#F59E0B' };
        case 'approved': return { label: 'Đã duyệt', color: '#3B82F6' };
        case 'completed': return { label: 'Hoàn thành', color: '#10B981' };
        default: return { label: status || '—', color: '#6B7280' };
    }
};

// ── Screen Component ────────────────────────────────────────────
export default function ModuleListScreen() {
    const navigation = useNavigation<any>();
    const { t } = useLanguage();
    const isFocused = useIsFocused();
    const api = useApi();

    const [items, setItems] = useState<ModuleItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');

    // ── Data Fetching ───────────────────────────────────────────
    const fetchItems = async (showLoading = true) => {
        if (showLoading) setLoading(true);
        setError('');
        try {
            const data = await api.get<ModuleItem[]>('/module/items', {
                cacheKey: 'module_items',    // ← REQUIRED for offline support
            });
            setItems(Array.isArray(data) ? data : []);
        } catch (err: any) {
            setError(err.message || t('common.error'));
            setItems([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchItems(false);
    };

    // Refetch when screen comes into focus
    useEffect(() => {
        if (isFocused) fetchItems();
    }, [isFocused]);

    // ── Render ──────────────────────────────────────────────────
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
                    <Text style={{ fontSize: 22 }}>←</Text>
                </TouchableOpacity>
                <Text style={styles.header}>{t('nav.module_name')}</Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('ModuleCreate')}
                    style={{ padding: 4 }}>
                    <Text style={{ fontSize: 20, color: '#3B82F6' }}>＋</Text>
                </TouchableOpacity>
            </View>

            {/* Loading State */}
            {loading && (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#2563EB" />
                    <Text style={styles.loadingText}>{t('common.loading')}</Text>
                </View>
            )}

            {/* Error State */}
            {!loading && error && (
                <View style={styles.center}>
                    <Text style={styles.errorText}>❌ {error}</Text>
                    <TouchableOpacity onPress={() => fetchItems()} style={styles.retryBtn}>
                        <Text style={styles.retryText}>{t('common.retry')}</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Empty State */}
            {!loading && !error && items.length === 0 && (
                <View style={styles.center}>
                    <Text style={styles.emptyText}>📋 {t('common.no_data')}</Text>
                </View>
            )}

            {/* List */}
            {!loading && !error && items.length > 0 && (
                <ScrollView style={{ flex: 1 }} refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                    {items.map((item) => {
                        const statusInfo = getStatusInfo(item.status);
                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.card}
                                onPress={() => navigation.navigate('ModuleDetail', { id: item.id })}
                            >
                                <View style={styles.cardHeader}>
                                    <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '20' }]}>
                                        <Text style={[styles.statusText, { color: statusInfo.color }]}>
                                            {statusInfo.label}
                                        </Text>
                                    </View>
                                    <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
                                </View>
                                <Text style={styles.nameText}>{item.title}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            )}

            {/* FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('ModuleCreate')}
                activeOpacity={0.85}>
                <Text style={styles.fabText}>➕ {t('common.create')}</Text>
            </TouchableOpacity>
        </View>
    );
}

// ── Styles ──────────────────────────────────────────────────────
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9fafb' },
    headerRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', paddingHorizontal: 20, paddingTop: 48, paddingBottom: 16,
        backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#E5E7EB',
    },
    header: { fontSize: 18, fontWeight: 'bold', flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    loadingText: { marginTop: 12, color: '#6B7280' },
    errorText: { color: '#EF4444', textAlign: 'center', marginBottom: 12 },
    retryBtn: { backgroundColor: '#3B82F6', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
    retryText: { color: 'white', fontWeight: '700' },
    emptyText: { color: '#9CA3AF', fontSize: 15 },
    card: {
        backgroundColor: 'white', padding: 16, borderRadius: 12, marginHorizontal: 16,
        marginTop: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
        borderWidth: 1, borderColor: '#F3F4F6',
    },
    cardHeader: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 8,
    },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    statusText: { fontSize: 12, fontWeight: '600' },
    dateText: { fontSize: 13, color: '#9CA3AF' },
    nameText: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
    fab: {
        position: 'absolute', bottom: 24, right: 20,
        backgroundColor: '#2563EB', borderRadius: 14,
        paddingHorizontal: 18, paddingVertical: 12,
        elevation: 6, shadowColor: '#1E3A8A', shadowOpacity: 0.3, shadowRadius: 8,
    },
    fabText: { color: 'white', fontSize: 14, fontWeight: '700' },
});
