import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Settings, Phone, Save, Plus, Trash2, Search, Megaphone, Edit, Eye } from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Pagination from '@/Components/Pagination';
import AnnouncementFormModal from './Partials/AnnouncementFormModal';

export default function AnnouncementsIndex({ auth, isSuperAdmin, notifUsers, announcements, filters, errors }: any) {
    // -----------------------------------------
    // Pengumuman CRUD State
    // -----------------------------------------
    const [search, setSearch] = useState(filters?.search || '');
    const [showFormModal, setShowFormModal] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('announcements.index'), { search, category: filters.category }, { preserveState: true });
    };

    const openEditModal = (item: any) => {
        setSelectedAnnouncement(item);
        setShowFormModal(true);
    };

    const openCreateModal = () => {
        setSelectedAnnouncement(null);
        setShowFormModal(true);
    };

    const handleDelete = (item: any) => {
        if (confirm(`Apakah Anda yakin ingin menghapus pengumuman "${item.title}"?`)) {
            router.delete(route('announcements.destroy', item.id));
        }
    };

    // -----------------------------------------
    // Settings WhatsApp Notification
    // -----------------------------------------
    const initialUsers = Array.isArray(notifUsers) ? notifUsers.map((u: any) => ({
        ...u,
        phones: u.phone ? String(u.phone).split(',').map((p: string) => p.trim()).filter((p: string) => p) : ['']
    })) : [];

    const [users, setUsers] = useState(initialUsers);
    const [processingSettings, setProcessingSettings] = useState(false);

    const handlePhoneChange = (userIndex: number, phoneIndex: number, value: string) => {
        const newUsers = [...users];
        newUsers[userIndex].phones[phoneIndex] = value;
        setUsers(newUsers);
    };

    const addPhone = (userIndex: number) => {
        const newUsers = [...users];
        newUsers[userIndex].phones.push('');
        setUsers(newUsers);
    };

    const removePhone = (userIndex: number, phoneIndex: number) => {
        const newUsers = [...users];
        newUsers[userIndex].phones.splice(phoneIndex, 1);
        if (newUsers[userIndex].phones.length === 0) {
            newUsers[userIndex].phones.push('');
        }
        setUsers(newUsers);
    };

    const submitSettings = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessingSettings(true);
        
        const payload = users.map((u: any) => ({
            id: u.id,
            phone: Array.isArray(u.phones) ? u.phones.filter((p: string) => p.trim() !== '').join(',') : ''
        }));

        router.post(route('announcements.updatePhones'), { users: payload }, {
            onSuccess: () => alert('Nomor WhatsApp notifikasi berhasil diperbarui'),
            onFinish: () => setProcessingSettings(false),
            preserveScroll: true
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Pengumuman & Pengaturan</h2>}
        >
            <Head title="Pengumuman" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                    
                    {/* Daftar Pengumuman */}
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 border border-white/50 border-l-[6px] border-l-primary overflow-hidden transition-all">
                        <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-br from-primary/5 to-transparent">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white shadow-sm border border-gray-100/80 text-primary rounded-xl">
                                        <Megaphone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Papan Pengumuman</h3>
                                        <p className="text-sm text-gray-500 font-medium">Kelola informasi publik pesantren</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-1.5 bg-white/60 p-1.5 rounded-2xl w-max border border-gray-200/60 shadow-sm backdrop-blur-md">
                                    {['Informasi', 'Akademik', 'Tentang Kami'].map((cat) => (
                                        <button 
                                            key={cat}
                                            onClick={() => router.get(route('announcements.index'), { search, category: cat }, { preserveState: true })}
                                            className={`px-5 py-2 text-sm font-bold rounded-xl transition-all duration-300 capitalize ${filters.category === cat ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105' : 'text-gray-500 hover:text-primary hover:bg-white/80'}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                                <form onSubmit={handleSearch} className="relative w-full sm:w-64 flex">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="w-full pl-11 pr-4 py-3 bg-white/70 border-0 ring-1 ring-gray-200 rounded-2xl focus:ring-2 focus:ring-primary shadow-sm text-sm font-medium transition-all"
                                        placeholder="Cari pengumuman..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </form>

                                <div className="w-full sm:w-auto flex gap-2">
                                    <button onClick={openCreateModal} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-primary/30 transition-all shadow-md shadow-primary/20 text-sm whitespace-nowrap">
                                        <Plus className="w-5 h-5" />
                                        Buat Pengumuman
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* List Pengumuman Grid */}
                        <div className="p-8 bg-gray-50/30">
                            {announcements && announcements.data.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {announcements.data.map((item: any) => (
                                        <div key={item.id} className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group relative">
                                            {item.cover_image ? (
                                                <div className="h-52 overflow-hidden relative bg-gray-100">
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    <img src={`/storage/${item.cover_image}`} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                                    {item.video_path && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-20 group-hover:bg-black/40 transition-colors">
                                                            <div className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                                                                <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"></path></svg>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : item.video_path ? (
                                                <div className="h-52 overflow-hidden relative bg-gray-900 flex items-center justify-center">
                                                    <video src={`/storage/${item.video_path}`} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700" />
                                                    <div className="absolute inset-0 flex items-center justify-center z-20">
                                                        <div className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                                                            <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"></path></svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="h-52 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-b border-gray-100 group-hover:bg-primary/5 transition-colors">
                                                    <Megaphone className="w-16 h-16 text-gray-300 group-hover:text-primary/30 transition-colors duration-500 group-hover:scale-110" />
                                                </div>
                                            )}
                                            
                                            <div className="p-6 flex flex-col flex-1 relative z-30">
                                                <div className="flex justify-between items-start mb-3 gap-2">
                                                    <h4 className="font-extrabold text-gray-900 text-lg leading-tight flex-1 group-hover:text-primary transition-colors">{item.title}</h4>
                                                    {item.is_pinned && <span className="bg-gradient-to-r from-amber-200 to-amber-300 text-amber-900 text-[10px] px-2.5 py-1 rounded-lg font-black shadow-sm uppercase tracking-wider shrink-0 mt-0.5">PIN</span>}
                                                </div>
                                                <p className="text-sm text-gray-500 mb-6 line-clamp-3 leading-relaxed font-medium">{item.body}</p>
                                                <div className="mt-auto flex justify-between items-center bg-gray-50/80 px-4 py-3 rounded-2xl border border-gray-100/50">
                                                    <span className="text-xs font-bold text-gray-400">{new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                    <div className="flex gap-2">
                                                        <button onClick={() => openEditModal(item)} className="p-2 text-blue-600 bg-white shadow-sm border border-gray-100 hover:bg-blue-50 rounded-xl transition-colors" title="Edit"><Edit className="w-4 h-4" /></button>
                                                        <button onClick={() => handleDelete(item)} className="p-2 text-red-600 bg-white shadow-sm border border-gray-100 hover:bg-red-50 rounded-xl transition-colors" title="Hapus"><Trash2 className="w-4 h-4" /></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white/60 backdrop-blur-md rounded-3xl border border-gray-100/80 shadow-sm flex flex-col items-center">
                                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center mb-4 border-[6px] border-white shadow-sm">
                                        <Megaphone className="w-10 h-10 text-gray-300" />
                                    </div>
                                    <p className="text-gray-500 font-bold text-lg">Tidak ada pengumuman di kategori ini.</p>
                                    <p className="text-gray-400 text-sm mt-1">Ganti kategori atau buat pengumuman baru.</p>
                                </div>
                            )}

                            {announcements && announcements.links && (
                                <div className="mt-8">
                                    <Pagination links={announcements.links} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Settings Section - Only for Super Admin */}
                    {isSuperAdmin && (
                        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 border border-white/50 border-l-[6px] border-l-primary overflow-hidden">
                            <div className="p-8 border-b border-gray-100 bg-gradient-to-br from-gray-50/50 to-white">
                                <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-3 tracking-tight">
                                    <div className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100">
                                        <Settings className="w-6 h-6 text-primary" />
                                    </div>
                                    Pengaturan Notifikasi WhatsApp
                                </h3>
                                <p className="text-sm text-gray-500 mt-2 font-medium">
                                    Atur nomor WhatsApp pengurus yang akan menerima notifikasi otomatis dari sistem (contoh: notifikasi absensi santri).
                                </p>
                            </div>
                            
                            <form onSubmit={submitSettings} className="p-8">
                                <div className="space-y-6">
                                    {Array.isArray(users) && users.map((user: any, userIndex: number) => (
                                        <div key={user.id} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start p-6 border border-gray-100 rounded-3xl hover:border-primary/30 transition-all bg-white/60 shadow-sm border-l-[6px] border-l-primary overflow-hidden hover:shadow-md">
                                            <div className="md:pt-2">
                                                <p className="font-extrabold text-gray-900 text-xl tracking-tight">{user.name}</p>
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-100 text-blue-800 mt-3 shadow-sm border border-blue-200/50">
                                                    {user.role}
                                                </span>
                                            </div>
                                            <div className="col-span-2 space-y-4">
                                                <div className="flex justify-between items-center mb-3">
                                                    <label className="block text-sm font-bold text-gray-700">Daftar Nomor WhatsApp</label>
                                                    <button type="button" onClick={() => addPhone(userIndex)} className="text-xs flex items-center gap-1.5 text-primary hover:text-primary-dark font-bold bg-primary/10 hover:bg-primary/20 px-3 py-2 rounded-xl transition-colors">
                                                        <Plus className="w-4 h-4" /> Tambah Nomor
                                                    </button>
                                                </div>
                                                
                                                {Array.isArray(user.phones) && user.phones.map((phone: string, phoneIndex: number) => (
                                                    <div key={phoneIndex} className="flex gap-3 items-center">
                                                        <div className="relative flex-1">
                                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                                <Phone className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                            <input
                                                                type="text"
                                                                value={phone}
                                                                onChange={(e) => handlePhoneChange(userIndex, phoneIndex, e.target.value)}
                                                                className="pl-12 py-3 block w-full rounded-2xl border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-primary sm:text-sm transition-shadow font-medium bg-white"
                                                                placeholder="Contoh: 081234567890"
                                                            />
                                                        </div>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => removePhone(userIndex, phoneIndex)}
                                                            className="p-3 text-red-500 hover:text-white hover:bg-red-500 bg-red-50 rounded-2xl transition-all shadow-sm"
                                                            title="Hapus Nomor"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                ))}
                                                {errors && errors[`users.${userIndex}.phone`] && (
                                                    <p className="mt-2 text-sm font-semibold text-red-600">{errors[`users.${userIndex}.phone`]}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-10 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={processingSettings}
                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-light text-white px-10 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-primary/30 disabled:opacity-50 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5"
                                    >
                                        <Save className="w-5 h-5" />
                                        Simpan Pengaturan
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                </div>
            </div>

            <AnnouncementFormModal 
                show={showFormModal} 
                onClose={() => setShowFormModal(false)} 
                announcement={selectedAnnouncement} 
                currentCategory={filters.category}
            />
        </AuthenticatedLayout>
    );
}
