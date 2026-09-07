import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import { useState, useCallback, useRef, useEffect } from 'react';
import { 
    Search, Plus, Edit, Trash2, Download, Users,
    CheckCircle2, XCircle
} from 'lucide-react';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import AsatidzFormModal from './Partials/AsatidzFormModal';

interface Staff {
    id: number;
    name: string;
    nip: string;
    gender: 'putra' | 'putri';
    role: string;
    division: string;
    phone: string;
    email?: string;
    address?: string;
    join_date?: string;
    is_active: boolean;
}

interface PaginationData {
    data: Staff[];
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
    links: { url: string | null; label: string; active: boolean }[];
}

export default function AsatidzIndex({ auth, staff, filters }: PageProps<{ staff: PaginationData, filters: any }>) {
    const [search, setSearch] = useState(filters?.search || '');
    const [gender, setGender] = useState(filters?.gender || 'all');
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [staffToDelete, setStaffToDelete] = useState<Staff | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    
    const debouncedSearch = useCallback((query: string, genderFilter: string) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            router.get(route('staff.index'), { search: query, gender: genderFilter }, { preserveState: true, preserveScroll: true, replace: true });
        }, 500);
    }, []);

    useEffect(() => {
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearch(query);
        debouncedSearch(query, gender);
    };

    const handleGenderChange = (selectedGender: string) => {
        setGender(selectedGender);
        router.get(route('staff.index'), { search, gender: selectedGender }, { preserveState: true });
    };

    const handleExport = () => { window.location.href = route('staff.export', { search, gender }); };

    const openCreate = () => { setEditingStaff(null); setShowFormModal(true); };
    const openEdit   = (s: Staff) => { setEditingStaff(s); setShowFormModal(true); };

    const handleDelete = () => {
        if (!staffToDelete) return;
        router.delete(route('staff.destroy', staffToDelete.id), {
            onSuccess: () => setStaffToDelete(null),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                            <Users className="w-6 h-6 text-primary" />
                            Data Asatidz & Staff
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Kelola data tenaga pendidik dan kependidikan pesantren.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleExport}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:text-primary transition-colors shadow-sm"
                        >
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                        <button 
                            onClick={openCreate}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary/90 shadow-md shadow-primary/30 transition-all"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Data
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Data Asatidz & Staff" />

            <div className="space-y-6">
                {/* Stats Summary */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
                        <p className="text-3xl font-extrabold text-primary">{staff.total}</p>
                        <p className="text-sm font-medium text-gray-500 mt-1">Total Staff</p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
                        <p className="text-3xl font-extrabold text-emerald-600">{staff.data.filter(s => s.is_active).length}</p>
                        <p className="text-sm font-medium text-gray-500 mt-1">Aktif</p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
                        <p className="text-3xl font-extrabold text-rose-500">{staff.data.filter(s => !s.is_active).length}</p>
                        <p className="text-sm font-medium text-gray-500 mt-1">Non-aktif</p>
                    </div>
                </div>

                {/* Filters & Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl self-start sm:self-auto">
                            {[
                                { label: 'Semua', val: 'all' },
                                { label: 'Putra', val: 'putra' },
                                { label: 'Putri', val: 'putri' },
                            ].map(opt => (
                                <button 
                                    key={opt.val}
                                    onClick={() => handleGenderChange(opt.val)}
                                    className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${gender === opt.val ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                        
                        <div className="relative w-full sm:w-72">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari nama, NIP, jabatan..."
                                value={search}
                                onChange={handleSearchChange}
                                className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white transition-all"
                            />
                        </div>
                    </div>
                    
                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Profil</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Jabatan / Divisi</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Kontak</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-50">
                                {staff.data.length > 0 ? (
                                    staff.data.map((person) => (
                                        <tr key={person.id} className="hover:bg-gray-50/70 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-extrabold text-lg border-2 border-white shadow-sm shrink-0">
                                                        {person.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-gray-900">{person.name}</div>
                                                        <div className="text-xs text-gray-400 font-mono mt-0.5">NIP. {person.nip || '-'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900">{person.role}</div>
                                                <div className="text-xs text-gray-500 mt-0.5">{person.division}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-700">{person.phone || '-'}</div>
                                                <div className="text-xs text-gray-400 capitalize mt-0.5">{person.gender === 'putra' ? 'Laki-laki' : 'Perempuan'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {person.is_active ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-700">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                        Aktif
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-100 text-rose-700">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                                                        Non-aktif
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button 
                                                        onClick={() => openEdit(person)}
                                                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => setStaffToDelete(person)}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center text-gray-400">
                                                <Users className="w-12 h-12 text-gray-200 mb-3" />
                                                <p className="font-bold text-gray-700">Tidak ada data ditemukan</p>
                                                <p className="text-sm mt-1">Coba sesuaikan kata kunci pencarian atau filter.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination */}
                    {staff.data.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                                Menampilkan <span className="font-bold text-gray-900">{staff.from || 0}</span> - <span className="font-bold text-gray-900">{staff.to || 0}</span> dari <span className="font-bold text-gray-900">{staff.total}</span> data
                            </div>
                            <div className="flex gap-1">
                                {staff.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        className={`px-3 py-1.5 text-sm font-bold rounded-lg transition-all ${
                                            link.active 
                                                ? 'bg-primary text-white shadow-md shadow-primary/30' 
                                                : link.url 
                                                    ? 'text-gray-600 bg-white border border-gray-200 hover:bg-gray-50' 
                                                    : 'text-gray-300 bg-gray-50 border border-gray-100 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Form Modal */}
            <AsatidzFormModal
                show={showFormModal}
                onClose={() => setShowFormModal(false)}
                asatidz={editingStaff}
            />

            {/* Delete Confirmation Modal */}
            <Modal show={staffToDelete !== null} onClose={() => setStaffToDelete(null)} maxWidth="md">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trash2 className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Hapus Data Asatidz?</h2>
                    <p className="text-gray-500 mb-6">
                        Apakah Anda yakin ingin menghapus <b>{staffToDelete?.name}</b>? Data yang dihapus tidak dapat dikembalikan.
                    </p>
                    <div className="flex justify-center gap-3">
                        <SecondaryButton onClick={() => setStaffToDelete(null)}>Batal</SecondaryButton>
                        <DangerButton onClick={handleDelete}>Ya, Hapus</DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
