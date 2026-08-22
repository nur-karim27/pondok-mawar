import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Plus, Edit, Trash2, Award } from 'lucide-react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function PrestasiIndex({ auth, achievements, students }: any) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPrestasi, setSelectedPrestasi] = useState<any>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        student_id: '',
        title: '',
        description: '',
        date: '',
        level: 'Lokal',
        category: 'Akademik',
    });

    const openCreateModal = () => {
        reset();
        clearErrors();
        setIsCreateModalOpen(true);
    };

    const openEditModal = (prestasi: any) => {
        setSelectedPrestasi(prestasi);
        setData({
            student_id: prestasi.student_id,
            title: prestasi.title,
            description: prestasi.description || '',
            date: prestasi.date,
            level: prestasi.level,
            category: prestasi.category,
        });
        clearErrors();
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (prestasi: any) => {
        setSelectedPrestasi(prestasi);
        setIsDeleteModalOpen(true);
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('prestasi.store'), {
            onSuccess: () => setIsCreateModalOpen(false),
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('prestasi.update', selectedPrestasi.id), {
            onSuccess: () => setIsEditModalOpen(false),
        });
    };

    const handleDelete = (e: React.FormEvent) => {
        e.preventDefault();
        destroy(route('prestasi.destroy', selectedPrestasi.id), {
            onSuccess: () => setIsDeleteModalOpen(false),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Kelola Prestasi Santri</h2>}
        >
            <Head title="Kelola Prestasi" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Daftar Prestasi</h3>
                            <PrimaryButton onClick={openCreateModal} className="flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Tambah Prestasi
                            </PrimaryButton>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-4 py-3">Santri</th>
                                        <th className="px-4 py-3">Prestasi</th>
                                        <th className="px-4 py-3">Tingkat & Kategori</th>
                                        <th className="px-4 py-3">Tanggal</th>
                                        <th className="px-4 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {achievements.data.map((ach: any) => (
                                        <tr key={ach.id} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-900">{ach.student?.name}</td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-gray-900">{ach.title}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                {ach.level} • {ach.category}
                                            </td>
                                            <td className="px-4 py-3">{ach.date}</td>
                                            <td className="px-4 py-3 text-right">
                                                <button onClick={() => openEditModal(ach)} className="text-blue-600 hover:text-blue-900 mr-3">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => openDeleteModal(ach)} className="text-red-600 hover:text-red-900">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {achievements.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                                Belum ada data prestasi.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)}>
                <form onSubmit={handleCreate} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Tambah Prestasi Santri</h2>
                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="student_id" value="Santri" />
                            <select
                                id="student_id"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                value={data.student_id}
                                onChange={e => setData('student_id', e.target.value)}
                            >
                                <option value="">Pilih Santri...</option>
                                {students.map((s: any) => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.nis})</option>
                                ))}
                            </select>
                            <InputError message={errors.student_id} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="title" value="Nama Prestasi" />
                            <TextInput
                                id="title"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                placeholder="Contoh: Juara 1 Lomba Pidato"
                            />
                            <InputError message={errors.title} className="mt-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="level" value="Tingkat" />
                                <select
                                    id="level"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    value={data.level}
                                    onChange={e => setData('level', e.target.value)}
                                >
                                    <option value="Lokal">Lokal (Internal)</option>
                                    <option value="Kabupaten">Kabupaten/Kota</option>
                                    <option value="Provinsi">Provinsi</option>
                                    <option value="Nasional">Nasional</option>
                                    <option value="Internasional">Internasional</option>
                                </select>
                                <InputError message={errors.level} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="category" value="Kategori" />
                                <select
                                    id="category"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    value={data.category}
                                    onChange={e => setData('category', e.target.value)}
                                >
                                    <option value="Akademik">Akademik</option>
                                    <option value="Non-Akademik">Non-Akademik</option>
                                </select>
                                <InputError message={errors.category} className="mt-2" />
                            </div>
                        </div>
                        <div>
                            <InputLabel htmlFor="date" value="Tanggal Perolehan" />
                            <TextInput
                                id="date"
                                type="date"
                                className="mt-1 block w-full"
                                value={data.date}
                                onChange={e => setData('date', e.target.value)}
                            />
                            <InputError message={errors.date} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="description" value="Keterangan (Opsional)" />
                            <textarea
                                id="description"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                rows={3}
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                            ></textarea>
                            <InputError message={errors.description} className="mt-2" />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setIsCreateModalOpen(false)}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processing}>Simpan Prestasi</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                <form onSubmit={handleEdit} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Edit Prestasi</h2>
                    {/* Sama seperti Create Modal Fields */}
                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="edit_student_id" value="Santri" />
                            <select
                                id="edit_student_id"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                value={data.student_id}
                                onChange={e => setData('student_id', e.target.value)}
                            >
                                <option value="">Pilih Santri...</option>
                                {students.map((s: any) => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.nis})</option>
                                ))}
                            </select>
                            <InputError message={errors.student_id} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="edit_title" value="Nama Prestasi" />
                            <TextInput
                                id="edit_title"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                            />
                            <InputError message={errors.title} className="mt-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="edit_level" value="Tingkat" />
                                <select
                                    id="edit_level"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    value={data.level}
                                    onChange={e => setData('level', e.target.value)}
                                >
                                    <option value="Lokal">Lokal (Internal)</option>
                                    <option value="Kabupaten">Kabupaten/Kota</option>
                                    <option value="Provinsi">Provinsi</option>
                                    <option value="Nasional">Nasional</option>
                                    <option value="Internasional">Internasional</option>
                                </select>
                            </div>
                            <div>
                                <InputLabel htmlFor="edit_category" value="Kategori" />
                                <select
                                    id="edit_category"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    value={data.category}
                                    onChange={e => setData('category', e.target.value)}
                                >
                                    <option value="Akademik">Akademik</option>
                                    <option value="Non-Akademik">Non-Akademik</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <InputLabel htmlFor="edit_date" value="Tanggal Perolehan" />
                            <TextInput
                                id="edit_date"
                                type="date"
                                className="mt-1 block w-full"
                                value={data.date}
                                onChange={e => setData('date', e.target.value)}
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="edit_description" value="Keterangan (Opsional)" />
                            <textarea
                                id="edit_description"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                rows={3}
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setIsEditModalOpen(false)}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processing}>Update Prestasi</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Delete Modal */}
            <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                <form onSubmit={handleDelete} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900">Hapus Prestasi</h2>
                    <p className="mt-2 text-gray-600">
                        Apakah Anda yakin ingin menghapus data prestasi <strong>{selectedPrestasi?.title}</strong>? 
                        Data yang dihapus tidak dapat dikembalikan.
                    </p>
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setIsDeleteModalOpen(false)}>Batal</SecondaryButton>
                        <DangerButton disabled={processing}>Hapus Prestasi</DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
