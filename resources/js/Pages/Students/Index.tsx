import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PageProps, Student, Room, Guardian } from '@/types';
import { Plus, Search, Edit2, Trash2, Users, Filter, Download } from 'lucide-react';
import Pagination from '@/Components/Pagination';
import StudentFormModal from './Partials/StudentFormModal';
import AcademicHistoryModal from './Partials/AcademicHistoryModal';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';

interface StudentsProps extends PageProps {
    students: {
        data: Student[];
        links: any[];
        total: number;
    };
    filters: { search?: string, status?: string, gender?: string };
    dormitories: any[];
    rooms: any[];
    guardians: Guardian[];
}

export default function Index({ auth, students, filters, dormitories, rooms, guardians }: StudentsProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [genderFilter, setGenderFilter] = useState(filters.gender || 'semua');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [studentForHistory, setStudentForHistory] = useState<Student | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('kesantrian.index'), { search, status: statusFilter, gender: genderFilter }, { preserveState: true });
    };

    const handleGenderFilter = (selectedGender: string) => {
        setGenderFilter(selectedGender);
        router.get(route('kesantrian.index'), { search, status: statusFilter, gender: selectedGender }, { preserveState: true });
    };

    const exportData = () => {
        window.location.href = route('kesantrian.export', { search, status: statusFilter, gender: genderFilter });
    };

    const openCreateModal = () => {
        setEditingStudent(null);
        setIsFormModalOpen(true);
    };

    const openEditModal = (student: Student) => {
        setEditingStudent(student);
        setIsFormModalOpen(true);
    };

    const confirmDelete = (student: Student) => {
        setStudentToDelete(student);
    };

    const deleteStudent = () => {
        if (studentToDelete) {
            router.delete(route('kesantrian.destroy', studentToDelete.id), {
                preserveState: true,
                onSuccess: () => setStudentToDelete(null),
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-bold text-xl text-gray-800 leading-tight">Manajemen Kesantrian</h2>}
        >
            <Head title="Kesantrian" />

            <div>
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-primary to-emerald-500 rounded-2xl p-6 mb-6 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8"></div>
                    <div className="absolute right-16 bottom-0 w-20 h-20 bg-black/10 rounded-full translate-y-6"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
                                <Users className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-extrabold">Daftar Santri</h1>
                                <p className="text-white/80 text-sm mt-0.5">Total <span className="font-bold text-white">{students.total}</span> santri terdaftar dalam sistem</p>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0">
                            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Filter className="h-4 w-4 text-white/60" />
                                    </div>
                                    <select
                                        className="pl-9 pr-4 py-2.5 bg-white/20 border border-white/30 text-white rounded-xl text-sm font-medium placeholder-white/60 focus:outline-none focus:bg-white/30 focus:ring-2 focus:ring-white/50 backdrop-blur-sm w-full sm:w-44 [&>option]:text-gray-900 [&>option]:bg-white"
                                        value={statusFilter}
                                        onChange={(e) => {
                                            setStatusFilter(e.target.value);
                                            router.get(route('kesantrian.index'), { search, status: e.target.value, gender: genderFilter }, { preserveState: true });
                                        }}
                                    >
                                        <option value="">Semua Status</option>
                                        <option value="aktif">Masih Aktif</option>
                                        <option value="lulus">Sudah Lulus</option>
                                        <option value="pindah">Pindah / Boyong</option>
                                    </select>
                                </div>
                                <div className="relative flex-1 sm:w-48 lg:w-64">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-white/60" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2.5 bg-white/20 border border-white/30 text-white rounded-xl text-sm placeholder-white/60 focus:outline-none focus:bg-white/30 focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                                        placeholder="Cari NIS, Nama..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </div>
                            </form>

                            <div className="flex bg-white/20 p-1 rounded-xl border border-white/30 backdrop-blur-sm self-stretch lg:self-auto shrink-0">
                                <button 
                                    onClick={() => handleGenderFilter('semua')}
                                    className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${genderFilter === 'semua' ? 'bg-white text-gray-900 shadow-sm' : 'text-white hover:bg-white/10'}`}
                                >
                                    Semua
                                </button>
                                <button 
                                    onClick={() => handleGenderFilter('putra')}
                                    className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${genderFilter === 'putra' ? 'bg-white text-gray-900 shadow-sm' : 'text-white hover:bg-white/10'}`}
                                >
                                    Putra
                                </button>
                                <button 
                                    onClick={() => handleGenderFilter('putri')}
                                    className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${genderFilter === 'putri' ? 'bg-white text-gray-900 shadow-sm' : 'text-white hover:bg-white/10'}`}
                                >
                                    Putri
                                </button>
                            </div>

                            <button 
                                onClick={exportData}
                                className="inline-flex items-center justify-center px-4 py-2.5 bg-white/20 border border-white/30 text-white font-medium rounded-xl hover:bg-white/30 transition-all shrink-0 text-sm backdrop-blur-sm"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </button>

                            <button
                                onClick={openCreateModal}
                                className="inline-flex items-center justify-center px-5 py-2.5 bg-accent text-primary font-bold rounded-xl hover:bg-accent/90 shadow-lg shadow-black/20 transition-all shrink-0 text-sm"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah
                            </button>
                        </div>
                    </div>
                </div>

                    {/* Table Container */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            NIS / NISN
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Nama Santri
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Kamar & Wali
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {students.data.map((student) => (
                                        <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900">{student.nis}</div>
                                                <div className="text-sm text-gray-500">{student.nisn || '-'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 shrink-0">
                                                        {student.photo ? (
                                                            <img src={`/storage/${student.photo}`} alt={student.name} className="h-10 w-10 rounded-full object-cover" />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-primary font-bold">
                                                                {student.name.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                                            <span className="capitalize">{student.gender}</span>
                                                            <span>•</span>
                                                            <span>Masuk: {new Date(student.enrollment_date).getFullYear()}</span>
                                                            <span>•</span>
                                                            <span>Keluar: {student.graduation_year || '-'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{student.room?.name || <span className="text-red-400">Belum diatur</span>}</div>
                                                <div className="text-sm text-gray-500">{student.guardian?.name || '-'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium capitalize
                                                    ${student.status === 'aktif' ? 'bg-green-100 text-green-800' : 
                                                      student.status === 'izin' ? 'bg-yellow-100 text-yellow-800' :
                                                      student.status === 'lulus' ? 'bg-blue-100 text-blue-800' :
                                                      'bg-red-100 text-red-800'
                                                    }
                                                `}>
                                                    {student.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setStudentForHistory(student);
                                                            setIsHistoryModalOpen(true);
                                                        }}
                                                        className="text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 p-2 rounded-lg transition-colors"
                                                        title="Tambah Riwayat Kenaikan Kelas"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                                                    </button>
                                                    <button
                                                        onClick={() => openEditModal(student)}
                                                        className="text-gray-400 hover:text-primary bg-gray-50 hover:bg-primary/10 p-2 rounded-lg transition-colors"
                                                        title="Edit Santri"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => confirmDelete(student)}
                                                        className="text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                        title="Hapus Santri"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {students.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center">
                                                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                                <h3 className="text-lg font-medium text-gray-900 mb-1">Belum ada data</h3>
                                                <p className="text-gray-500">Tidak ada santri yang ditemukan.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination */}
                        <div className="px-6 py-4 border-t border-gray-100">
                            <Pagination links={students.links} />
                        </div>
                    </div>
            </div>

            {/* Form Modal */}
            <StudentFormModal
                show={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                student={editingStudent}
                dormitories={dormitories}
                rooms={rooms}
                guardians={guardians}
            />

            <AcademicHistoryModal
                show={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                student={studentForHistory}
            />

            {/* Delete Confirmation Modal */}
            <Modal show={studentToDelete !== null} onClose={() => setStudentToDelete(null)} maxWidth="md">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trash2 className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Hapus Data Santri?</h2>
                    <p className="text-gray-500 mb-6">
                        Apakah Anda yakin ingin menghapus <b>{studentToDelete?.name}</b>? Data yang dihapus mungkin tidak dapat dikembalikan.
                    </p>
                    <div className="flex justify-center gap-3">
                        <SecondaryButton onClick={() => setStudentToDelete(null)}>
                            Batal
                        </SecondaryButton>
                        <DangerButton onClick={deleteStudent}>
                            Ya, Hapus Data
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
