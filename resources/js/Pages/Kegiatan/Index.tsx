import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { 
    Calendar, Clock, MapPin, Search, Plus, 
    MoreVertical, Pencil, Trash2, Users, Image as ImageIcon, Video
} from 'lucide-react';
import Dropdown from '@/Components/Dropdown';
import Modal from '@/Components/Modal';

export default function KegiatanIndex({ auth, activities, filters }: PageProps & { activities: any, filters: any }) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [categoryFilter, setCategoryFilter] = useState(filters.category || 'all');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<any>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        title: '',
        category: 'Alumni',
        activity_date: '',
        start_time: '',
        end_time: '',
        location: '',
        status: 'terjadwal',
        description: '',
        cover_image: null as File | null,
        video_file: null as File | null,
        gallery_images: [] as File[],
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('kegiatan.index'), {
            search: searchQuery,
            category: categoryFilter,
        }, { preserveState: true });
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setCategoryFilter(val);
        router.get(route('kegiatan.index'), {
            search: searchQuery,
            category: val,
        }, { preserveState: true });
    };

    const openCreateModal = () => {
        clearErrors();
        reset();
        setEditingId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (keg: any) => {
        clearErrors();
        setData({
            title: keg.title,
            category: keg.category,
            activity_date: keg.activity_date,
            start_time: keg.start_time || '',
            end_time: keg.end_time || '',
            location: keg.location,
            status: keg.status,
            description: keg.description || '',
            cover_image: null,
            video_file: null,
            gallery_images: [],
        });
        setEditingId(keg.id);
        setIsModalOpen(true);
    };

    const confirmDelete = (keg: any) => {
        setItemToDelete(keg);
        setShowDeleteConfirm(true);
    };

    const handleDelete = () => {
        if (!itemToDelete) return;
        router.delete(route('kegiatan.destroy', itemToDelete.id), {
            onSuccess: () => setShowDeleteConfirm(false)
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingId) {
            router.post(route('kegiatan.update', editingId), {
                _method: 'put',
                ...data,
            }, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        } else {
            post(route('kegiatan.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                }
            });
        }
    };

    const getStatusColor = (status: string) => {
        switch(status) {
            case 'terjadwal': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'berlangsung': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'selesai': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'dibatalkan': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Kegiatan Alumni & IKSAMA" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Header & Actions */}
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 border border-white/50 p-8 flex flex-col sm:flex-row justify-between gap-6 items-start sm:items-center bg-gradient-to-br from-indigo-50/50 to-white/50">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-indigo-100 text-indigo-600 rounded-2xl shadow-sm border border-indigo-200/50">
                                <Users className="w-8 h-8" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Kegiatan Alumni / IKSAMA</h2>
                                <p className="text-sm text-gray-500 mt-1">Kelola event dan dokumentasi kegiatan</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                            <form onSubmit={handleSearch} className="relative w-full sm:w-64">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari kegiatan..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-2.5 bg-white border-0 ring-1 ring-gray-200 rounded-xl focus:ring-2 focus:ring-primary text-sm shadow-sm font-medium transition-all"
                                />
                            </form>
                            
                            <select
                                value={categoryFilter}
                                onChange={handleCategoryChange}
                                className="w-full sm:w-auto bg-white border-0 ring-1 ring-gray-200 rounded-xl focus:ring-2 focus:ring-primary text-sm shadow-sm py-2.5 pl-4 pr-10 font-medium transition-all"
                            >
                                <option value="all">Semua Kategori</option>
                                <option value="Alumni">Alumni</option>
                                <option value="IKSAMA">IKSAMA</option>
                                <option value="Kajian">Kajian</option>
                                <option value="Silaturahmi">Silaturahmi</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>

                            <button
                                onClick={openCreateModal}
                                className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary-light hover:shadow-lg hover:shadow-primary/40 text-white px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-md shadow-primary/30 whitespace-nowrap"
                            >
                                <Plus className="w-5 h-5" />
                                <span>Tambah Kegiatan</span>
                            </button>
                        </div>
                    </div>

                    {/* Grid Kegiatan */}
                    {activities.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {activities.data.map((keg: any) => (
                                <div key={keg.id} className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-lg shadow-gray-200/50 border border-white/50 overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 relative group flex flex-col h-full">
                                    <div className="relative h-56 bg-gray-100 overflow-hidden shrink-0">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none"></div>
                                        {keg.cover_image ? (
                                            <img src={`/storage/${keg.cover_image}`} alt={keg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 group-hover:scale-105 transition-transform duration-500">
                                                <Users className="w-16 h-16 text-primary/30" />
                                            </div>
                                        )}
                                        
                                        {/* Status Badge */}
                                        <div className="absolute top-4 left-4 z-20">
                                            <span className={`px-3 py-1.5 text-xs font-bold rounded-xl border backdrop-blur-md ${getStatusColor(keg.status).replace('bg-', 'bg-').replace('100', '100/90')} shadow-sm`}>
                                                {keg.status.charAt(0).toUpperCase() + keg.status.slice(1)}
                                            </span>
                                        </div>

                                        {/* Dropdown Menu */}
                                        <div className="absolute top-3 right-3 z-20">
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <button className="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-xl shadow-sm transition-colors backdrop-blur-md">
                                                        <MoreVertical className="w-5 h-5" />
                                                    </button>
                                                </Dropdown.Trigger>
                                                <Dropdown.Content width="48" align="right">
                                                    <button onClick={() => openEditModal(keg)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 font-medium">
                                                        <Pencil className="w-4 h-4" /> Edit
                                                    </button>
                                                    <button onClick={() => confirmDelete(keg)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium">
                                                        <Trash2 className="w-4 h-4" /> Hapus
                                                    </button>
                                                </Dropdown.Content>
                                            </Dropdown>
                                        </div>
                                        
                                        {/* Media Indicators */}
                                        <div className="absolute bottom-4 right-4 flex gap-2 z-20">
                                            {keg.gallery_images && JSON.parse(keg.gallery_images).length > 0 && (
                                                <div className="bg-black/60 backdrop-blur-md text-white px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-white/20 shadow-sm">
                                                    <ImageIcon className="w-3.5 h-3.5" /> {JSON.parse(keg.gallery_images).length}
                                                </div>
                                            )}
                                            {keg.video_path && (
                                                <div className="bg-black/60 backdrop-blur-md text-white px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-white/20 shadow-sm">
                                                    <Video className="w-3.5 h-3.5" /> 1
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="p-6 flex flex-col flex-1 relative">
                                        <div className="absolute top-0 right-6 -translate-y-1/2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 z-30">
                                            <div className="bg-gray-50 text-primary px-3 py-1 rounded-xl text-xs font-extrabold uppercase tracking-widest border border-gray-100/80">
                                                {keg.category}
                                            </div>
                                        </div>

                                        <h3 className="font-extrabold text-gray-900 text-xl mb-4 line-clamp-2 leading-tight group-hover:text-primary transition-colors tracking-tight mt-2">
                                            {keg.title}
                                        </h3>
                                        
                                        <div className="space-y-3 mt-auto text-sm font-medium text-gray-500 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                                            <div className="flex items-center gap-3">
                                                <div className="p-1.5 bg-white rounded-lg shadow-sm text-gray-400">
                                                    <Calendar className="w-4 h-4" />
                                                </div>
                                                <span className="text-gray-700">
                                                    {new Date(keg.activity_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                                </span>
                                            </div>
                                            {(keg.start_time || keg.end_time) && (
                                                <div className="flex items-center gap-3">
                                                    <div className="p-1.5 bg-white rounded-lg shadow-sm text-gray-400">
                                                        <Clock className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-gray-700">
                                                        {keg.start_time ? keg.start_time.substring(0,5) : ''} 
                                                        {keg.start_time && keg.end_time ? ' - ' : ''} 
                                                        {keg.end_time ? keg.end_time.substring(0,5) : ''} WIB
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-start gap-3">
                                                <div className="p-1.5 bg-white rounded-lg shadow-sm text-gray-400 shrink-0">
                                                    <MapPin className="w-4 h-4" />
                                                </div>
                                                <span className="line-clamp-2 leading-snug text-gray-700 mt-1">{keg.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100/80 p-16 flex flex-col items-center justify-center">
                            <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 border-[6px] border-white shadow-sm rounded-full flex items-center justify-center mb-6">
                                <Users className="w-10 h-10 text-primary" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Belum ada Kegiatan</h3>
                            <p className="text-gray-500 mt-2 text-center max-w-md text-lg">Silakan tambahkan kegiatan alumni atau IKSAMA untuk menampilkannya di sini.</p>
                            <button
                                onClick={openCreateModal}
                                className="mt-8 bg-gradient-to-r from-primary to-primary-light hover:shadow-lg hover:shadow-primary/40 text-white px-8 py-3 rounded-2xl font-bold transition-all shadow-md shadow-primary/30"
                            >
                                Tambah Kegiatan Pertama
                            </button>
                        </div>
                    )}

                </div>
            </div>

            {/* Form Modal */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">
                        {editingId ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-sm font-medium text-gray-700">Judul Kegiatan</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                className="w-full border-gray-300 rounded-xl focus:border-primary focus:ring-primary shadow-sm"
                                placeholder="Contoh: Silaturahmi Akbar IKSAMA 2026"
                                required
                            />
                            {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Kategori</label>
                            <select
                                value={data.category}
                                onChange={e => setData('category', e.target.value)}
                                className="w-full border-gray-300 rounded-xl focus:border-primary focus:ring-primary shadow-sm"
                            >
                                <option value="Alumni">Alumni</option>
                                <option value="IKSAMA">IKSAMA</option>
                                <option value="Kajian">Kajian</option>
                                <option value="Silaturahmi">Silaturahmi</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                            {errors.category && <p className="text-sm text-red-600">{errors.category}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Status</label>
                            <select
                                value={data.status}
                                onChange={e => setData('status', e.target.value)}
                                className="w-full border-gray-300 rounded-xl focus:border-primary focus:ring-primary shadow-sm"
                            >
                                <option value="draft">Draft</option>
                                <option value="terjadwal">Terjadwal</option>
                                <option value="berlangsung">Berlangsung</option>
                                <option value="selesai">Selesai</option>
                                <option value="dibatalkan">Dibatalkan</option>
                            </select>
                            {errors.status && <p className="text-sm text-red-600">{errors.status}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Tanggal Kegiatan</label>
                            <input
                                type="date"
                                value={data.activity_date}
                                onChange={e => setData('activity_date', e.target.value)}
                                className="w-full border-gray-300 rounded-xl focus:border-primary focus:ring-primary shadow-sm"
                                required
                            />
                            {errors.activity_date && <p className="text-sm text-red-600">{errors.activity_date}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-gray-700">Jam Kegiatan</label>
                            <div className="flex gap-2">
                                <input
                                    type="time"
                                    value={data.start_time}
                                    onChange={e => setData('start_time', e.target.value)}
                                    className="w-full border-gray-300 rounded-xl focus:border-primary focus:ring-primary shadow-sm"
                                />
                                <span className="flex items-center text-gray-500">-</span>
                                <input
                                    type="time"
                                    value={data.end_time}
                                    onChange={e => setData('end_time', e.target.value)}
                                    className="w-full border-gray-300 rounded-xl focus:border-primary focus:ring-primary shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-1">
                            <label className="text-sm font-medium text-gray-700">Lokasi</label>
                            <input
                                type="text"
                                value={data.location}
                                onChange={e => setData('location', e.target.value)}
                                className="w-full border-gray-300 rounded-xl focus:border-primary focus:ring-primary shadow-sm"
                                placeholder="Detail lokasi..."
                                required
                            />
                            {errors.location && <p className="text-sm text-red-600">{errors.location}</p>}
                        </div>

                        <div className="md:col-span-2 space-y-1">
                            <label className="text-sm font-medium text-gray-700">Deskripsi Ringkas</label>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                rows={3}
                                className="w-full border-gray-300 rounded-xl focus:border-primary focus:ring-primary shadow-sm"
                                placeholder="Catatan atau informasi tambahan kegiatan..."
                            />
                        </div>

                        {/* Folder Uploads */}
                        <div className="md:col-span-2 p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
                            <h4 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-primary" /> Folder Foto & Video Dokumentasi
                            </h4>
                            <p className="text-xs text-gray-500">File dokumentasi ini akan ditampilkan pada halaman Dashboard Guest (Sebelum Login).</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-700">Poster / Cover Utama</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={e => setData('cover_image', e.target.files?.[0] || null)}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                    />
                                    {errors.cover_image && <p className="text-sm text-red-600">{errors.cover_image}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-700">Upload Video Pendek (Opsional)</label>
                                    <input
                                        type="file"
                                        accept="video/*"
                                        onChange={e => setData('video_file', e.target.files?.[0] || null)}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-accent/20 file:text-accent-dark hover:file:bg-accent/30"
                                    />
                                    {errors.video_file && <p className="text-sm text-red-600">{errors.video_file}</p>}
                                </div>

                                <div className="md:col-span-2 space-y-1 mt-2 border-t pt-4">
                                    <label className="text-xs font-medium text-gray-700">Folder Galeri Foto (Bisa pilih lebih dari satu foto)</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={e => setData('gallery_images', Array.from(e.target.files || []))}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300"
                                    />
                                    {errors.gallery_images && <p className="text-sm text-red-600">{errors.gallery_images}</p>}
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-xl font-semibold shadow-sm disabled:opacity-50 transition-colors flex items-center gap-2"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Kegiatan'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation */}
            <Modal show={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} maxWidth="md">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trash2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Hapus Kegiatan?</h3>
                    <p className="text-gray-500 mb-6">
                        Anda yakin ingin menghapus kegiatan <span className="font-semibold">"{itemToDelete?.title}"</span>? Data dokumentasi juga akan dihapus.
                    </p>
                    <div className="flex gap-3 w-full">
                        <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
                        >
                            Ya, Hapus
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
