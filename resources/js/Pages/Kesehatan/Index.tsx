import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Plus, Edit, Trash2, Activity } from 'lucide-react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

export default function KesehatanIndex({ auth, records, students }: any) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        student_id: '',
        date: '',
        complaint: '',
        diagnosis: '',
        treatment: '',
        notes: '',
    });

    const openCreateModal = () => {
        reset();
        clearErrors();
        setIsCreateModalOpen(true);
    };

    const openEditModal = (record: any) => {
        setSelectedRecord(record);
        setData({
            student_id: record.student_id,
            date: record.date,
            complaint: record.complaint,
            diagnosis: record.diagnosis || '',
            treatment: record.treatment || '',
            notes: record.notes || '',
        });
        clearErrors();
        setIsEditModalOpen(true);
    };

    const openDeleteModal = (record: any) => {
        setSelectedRecord(record);
        setIsDeleteModalOpen(true);
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('kesehatan.store'), {
            onSuccess: () => setIsCreateModalOpen(false),
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('kesehatan.update', selectedRecord.id), {
            onSuccess: () => setIsEditModalOpen(false),
        });
    };

    const handleDelete = (e: React.FormEvent) => {
        e.preventDefault();
        destroy(route('kesehatan.destroy', selectedRecord.id), {
            onSuccess: () => setIsDeleteModalOpen(false),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Kelola Riwayat Kesehatan</h2>}
        >
            <Head title="Riwayat Kesehatan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Daftar Riwayat Kesehatan</h3>
                            <PrimaryButton onClick={openCreateModal} className="flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Tambah Catatan
                            </PrimaryButton>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-4 py-3">Tanggal</th>
                                        <th className="px-4 py-3">Santri</th>
                                        <th className="px-4 py-3">Keluhan & Diagnosa</th>
                                        <th className="px-4 py-3">Tindakan/Obat</th>
                                        <th className="px-4 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {records.data.map((record: any) => (
                                        <tr key={record.id} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-3 whitespace-nowrap">{record.date}</td>
                                            <td className="px-4 py-3 font-medium text-gray-900">{record.student?.name}</td>
                                            <td className="px-4 py-3">
                                                <div className="font-medium text-red-600">{record.complaint}</div>
                                                {record.diagnosis && <div className="text-gray-500 text-xs mt-1">Diag: {record.diagnosis}</div>}
                                            </td>
                                            <td className="px-4 py-3">{record.treatment || '-'}</td>
                                            <td className="px-4 py-3 text-right">
                                                <button onClick={() => openEditModal(record)} className="text-blue-600 hover:text-blue-900 mr-3">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => openDeleteModal(record)} className="text-red-600 hover:text-red-900">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {records.data.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                                Belum ada data riwayat kesehatan.
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
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Tambah Catatan Kesehatan</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
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
                                <InputLabel htmlFor="date" value="Tanggal Keluhan" />
                                <TextInput
                                    id="date"
                                    type="date"
                                    className="mt-1 block w-full"
                                    value={data.date}
                                    onChange={e => setData('date', e.target.value)}
                                />
                                <InputError message={errors.date} className="mt-2" />
                            </div>
                        </div>
                        <div>
                            <InputLabel htmlFor="complaint" value="Keluhan Santri" />
                            <TextInput
                                id="complaint"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.complaint}
                                onChange={e => setData('complaint', e.target.value)}
                                placeholder="Contoh: Demam tinggi, pusing"
                            />
                            <InputError message={errors.complaint} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="diagnosis" value="Diagnosa (Opsional)" />
                            <TextInput
                                id="diagnosis"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.diagnosis}
                                onChange={e => setData('diagnosis', e.target.value)}
                                placeholder="Contoh: Gejala Tipes"
                            />
                            <InputError message={errors.diagnosis} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="treatment" value="Tindakan / Obat (Opsional)" />
                            <TextInput
                                id="treatment"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.treatment}
                                onChange={e => setData('treatment', e.target.value)}
                                placeholder="Contoh: Paracetamol, istirahat di UKS"
                            />
                            <InputError message={errors.treatment} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="notes" value="Catatan Tambahan (Opsional)" />
                            <textarea
                                id="notes"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                rows={2}
                                value={data.notes}
                                onChange={e => setData('notes', e.target.value)}
                            ></textarea>
                            <InputError message={errors.notes} className="mt-2" />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setIsCreateModalOpen(false)}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processing}>Simpan Catatan</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                <form onSubmit={handleEdit} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Edit Catatan Kesehatan</h2>
                    {/* Sama seperti Create Modal Fields */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
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
                            </div>
                            <div>
                                <InputLabel htmlFor="edit_date" value="Tanggal Keluhan" />
                                <TextInput
                                    id="edit_date"
                                    type="date"
                                    className="mt-1 block w-full"
                                    value={data.date}
                                    onChange={e => setData('date', e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <InputLabel htmlFor="edit_complaint" value="Keluhan Santri" />
                            <TextInput
                                id="edit_complaint"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.complaint}
                                onChange={e => setData('complaint', e.target.value)}
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="edit_diagnosis" value="Diagnosa (Opsional)" />
                            <TextInput
                                id="edit_diagnosis"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.diagnosis}
                                onChange={e => setData('diagnosis', e.target.value)}
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="edit_treatment" value="Tindakan / Obat (Opsional)" />
                            <TextInput
                                id="edit_treatment"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.treatment}
                                onChange={e => setData('treatment', e.target.value)}
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="edit_notes" value="Catatan Tambahan (Opsional)" />
                            <textarea
                                id="edit_notes"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                                rows={2}
                                value={data.notes}
                                onChange={e => setData('notes', e.target.value)}
                            ></textarea>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setIsEditModalOpen(false)}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processing}>Update Catatan</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Delete Modal */}
            <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                <form onSubmit={handleDelete} className="p-6">
                    <h2 className="text-lg font-bold text-gray-900">Hapus Catatan</h2>
                    <p className="mt-2 text-gray-600">
                        Apakah Anda yakin ingin menghapus data keluhan kesehatan <strong>{selectedRecord?.complaint}</strong>? 
                    </p>
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setIsDeleteModalOpen(false)}>Batal</SecondaryButton>
                        <DangerButton disabled={processing}>Hapus Catatan</DangerButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
