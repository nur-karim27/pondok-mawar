import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { PageProps, Student, Room, Guardian } from '@/types';
import { Plus, Search, Edit2, Trash2, Users } from 'lucide-react';
import Pagination from '@/Components/Pagination';
import StudentFormModal from './Partials/StudentFormModal';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';

interface StudentsProps extends PageProps {
    students: {
        data: Student[];
        links: any[];
        total: number;
    };
    filters: { search?: string };
    rooms: Room[];
    guardians: Guardian[];
}

export default function Index({ auth, students, filters, rooms, guardians }: StudentsProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('kesantrian.index'), { search }, { preserveState: true });
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Data Kesantrian</h2>}
        >
            <Head title="Kesantrian" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header Actions */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary text-accent rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Daftar Santri</h1>
                                <p className="text-sm text-gray-500">Total {students.total} santri terdaftar dalam sistem.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <form onSubmit={handleSearch} className="relative flex-1 md:w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition duration-150 ease-in-out"
                                    placeholder="Cari NIS atau Nama..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </form>
                            <button
                                onClick={openCreateModal}
                                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-md shadow-primary/20 transition-all shrink-0"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah Santri
                            </button>
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
                                                        <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-primary font-bold">
                                                            {student.name.charAt(0)}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                        <div className="text-sm text-gray-500 capitalize">{student.gender}</div>
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
            </div>

            {/* Form Modal */}
            <StudentFormModal
                show={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                student={editingStudent}
                rooms={rooms}
                guardians={guardians}
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
