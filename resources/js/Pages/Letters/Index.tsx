import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Pagination from '@/Components/Pagination';
import { Plus, Search, Edit, Trash2, Download, FileText, CheckCircle, Clock, Archive, Calendar } from 'lucide-react';
import LetterFormModal from './Partials/LetterFormModal';

interface Letter {
    id: number;
    code: string;
    type: string;
    subject: string;
    sender: string | null;
    recipient: string | null;
    letter_date: string;
    received_date: string | null;
    body: string | null;
    attachment: string | null;
    status: string;
    created_by: number;
    approved_by: number | null;
    created_by_user?: { name: string };
    approved_by_user?: { name: string };
}

interface PaginationData {
    data: Letter[];
    current_page: number;
    last_page: number;
    total: number;
    links: any[];
}

export default function LettersIndex({ auth, letters, filters }: PageProps<{ letters: PaginationData, filters: any }>) {
    const [search, setSearch] = useState(filters?.search || '');
    
    // Form Modal State
    const [showFormModal, setShowFormModal] = useState(false);
    const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('letters.index'), { search, type: filters.type }, { preserveState: true });
    };

    const openEditModal = (letter: Letter) => {
        setSelectedLetter(letter);
        setShowFormModal(true);
    };

    const openCreateModal = () => {
        setSelectedLetter(null);
        setShowFormModal(true);
    };

    const handleDelete = (letter: Letter) => {
        if (confirm(`Apakah Anda yakin ingin menghapus data surat ${letter.code}?`)) {
            router.delete(route('letters.destroy', letter.id));
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'masuk':
            case 'selesai':
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3" /> {status}</span>;
            case 'draft':
            case 'perlu_paraf':
            case 'diproses':
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"><Clock className="w-3 h-3" /> {status.replace('_', ' ')}</span>;
            case 'diarsipkan':
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><Archive className="w-3 h-3" /> {status}</span>;
            default:
                return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Surat & Berkas</h2>}
        >
            <Head title="Surat & Berkas" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-gray-200/50 border border-white/50 overflow-hidden mb-6">
                        {/* Header Action & Search */}
                        <div className="p-8 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gradient-to-br from-primary/5 to-transparent">
                            
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-5">
                                    <div className="p-4 bg-white/90 shadow-lg shadow-primary/10 text-primary rounded-2xl border border-white/50">
                                        <FileText className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Arsip Surat & Dokumen</h3>
                                        <p className="text-sm font-medium text-gray-500 mt-1">Kelola data persuratan dan dokumen pesantren.</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 bg-white/60 p-1.5 rounded-2xl w-max border border-gray-100 shadow-inner">
                                    {['masuk', 'keluar', 'keputusan', 'keterangan'].map((type) => (
                                        <button 
                                            key={type}
                                            onClick={() => router.get(route('letters.index'), { search, type }, { preserveState: true })}
                                            className={`px-5 py-2 text-sm font-bold rounded-xl transition-all duration-300 capitalize ${filters.type === type ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-md shadow-primary/30 transform scale-105' : 'text-gray-500 hover:text-primary hover:bg-white'}`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto mt-4 lg:mt-0">
                                <form onSubmit={handleSearch} className="relative w-full sm:w-72 flex group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                                    </div>
                                    <TextInput
                                        type="text"
                                        className="pl-11 w-full text-sm py-3 border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-primary rounded-2xl bg-white/80 backdrop-blur-md shadow-sm font-medium transition-all"
                                        placeholder="Cari nomor/perihal..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </form>

                                <div className="w-full sm:w-auto flex gap-3">
                                    <a 
                                        href={route('letters.export', { type: filters.type })}
                                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 border border-blue-100 rounded-2xl hover:bg-blue-50 hover:border-blue-200 transition-all font-bold whitespace-nowrap text-sm shadow-sm hover:shadow-md"
                                    >
                                        <Download className="w-5 h-5" />
                                        Export
                                    </a>
                                    <PrimaryButton onClick={openCreateModal} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm whitespace-nowrap font-bold shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all">
                                        <Plus className="w-5 h-5" />
                                        Tambah Data
                                    </PrimaryButton>
                                </div>
                            </div>
                        </div>

                        {/* Data Table / List */}
                        <div className="overflow-x-auto bg-white/40">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50/80">
                                    <tr>
                                        <th scope="col" className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Identitas Surat</th>
                                        <th scope="col" className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Pengirim & Penerima</th>
                                        <th scope="col" className="px-8 py-5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th scope="col" className="px-8 py-5 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white/50 divide-y divide-gray-50">
                                    {letters.data.length > 0 ? (
                                        letters.data.map((letter) => (
                                            <tr key={letter.id} className="hover:bg-white transition-colors group">
                                                <td className="px-8 py-5">
                                                    <div className="text-sm font-extrabold text-primary group-hover:text-primary-dark transition-colors mb-1">{letter.code}</div>
                                                    <div className="text-sm font-bold text-gray-900">{letter.subject}</div>
                                                    <div className="text-xs font-medium text-gray-500 mt-2 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Tgl Surat: {new Date(letter.letter_date).toLocaleDateString('id-ID')}</div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="text-sm font-medium text-gray-900 flex flex-col gap-2">
                                                        <span className="flex items-start gap-2">
                                                            <span className="text-gray-400 text-xs mt-0.5 w-12 shrink-0 font-bold uppercase tracking-wider">Dari:</span> 
                                                            <span className="font-bold">{letter.sender || '-'}</span>
                                                        </span>
                                                        <span className="flex items-start gap-2">
                                                            <span className="text-gray-400 text-xs mt-0.5 w-12 shrink-0 font-bold uppercase tracking-wider">Kpd:</span> 
                                                            <span className="font-bold">{letter.recipient || '-'}</span>
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 whitespace-nowrap">
                                                    {getStatusBadge(letter.status)}
                                                </td>
                                                <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                                                        {letter.attachment && (
                                                            <a 
                                                                href={`/storage/${letter.attachment}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-emerald-600 hover:text-emerald-700 bg-white border border-emerald-100 p-2.5 rounded-xl hover:bg-emerald-50 shadow-sm transition-all"
                                                                title="Download Lampiran"
                                                            >
                                                                <FileText className="w-4 h-4" />
                                                            </a>
                                                        )}
                                                        <button 
                                                            onClick={() => openEditModal(letter)}
                                                            className="text-blue-600 hover:text-blue-700 bg-white border border-blue-100 p-2.5 rounded-xl hover:bg-blue-50 shadow-sm transition-all"
                                                            title="Edit Data"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(letter)}
                                                            className="text-red-600 hover:text-red-700 bg-white border border-red-100 p-2.5 rounded-xl hover:bg-red-50 shadow-sm transition-all"
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
                                            <td colSpan={4} className="px-8 py-16 text-center">
                                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                                    <FileText className="w-10 h-10 text-gray-300" />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada data</h3>
                                                <p className="text-gray-500 font-medium">Tidak ada data surat/berkas untuk kategori ini.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/50">
                            <Pagination links={letters.links} />
                        </div>
                    </div>
                </div>
            </div>

            <LetterFormModal 
                show={showFormModal} 
                onClose={() => setShowFormModal(false)} 
                letter={selectedLetter} 
                currentType={filters.type}
            />

        </AuthenticatedLayout>
    );
}
