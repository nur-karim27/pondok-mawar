import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Plus, Edit, Trash2, Activity, Calendar, Search, FileDown, ChevronRight, Users, User, Download, Stethoscope } from 'lucide-react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import { format } from 'date-fns';

export default function KesehatanIndex({ auth, studentsPaginated, students, rooms, filters, currentGender }: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedStudentForHistory, setSelectedStudentForHistory] = useState<any>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [studentSearch, setStudentSearch] = useState('');
    const [showStudentDropdown, setShowStudentDropdown] = useState(false);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        student_id: '',
        date: format(new Date(), "yyyy-MM-dd"),
        complaint: '',
        diagnosis: '',
        treatment: '',
        notes: '',
    });

    const [search, setSearch] = useState(filters?.search || '');
    const [roomId, setRoomId] = useState(filters?.room_id || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('kesehatan.index'), { search, room_id: roomId, gender: currentGender }, { preserveState: true });
    };

    const handleGenderTab = (gender: string) => {
        router.get(route('kesehatan.index'), { gender, search, room_id: roomId }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleExport = () => {
        const url = new URL(route('kesehatan.export-rekap'), window.location.origin);
        if (currentGender !== 'semua') url.searchParams.append('gender', currentGender);
        window.location.href = url.toString();
    };

    const openModal = (kesehatan?: any, preselectedStudent?: any) => {
        clearErrors();
        if (kesehatan) {
            setEditingId(kesehatan.id);
            setData({
                student_id: kesehatan.student_id,
                date: format(new Date(), "yyyy-MM-dd"), // default to today for edit
                complaint: kesehatan.complaint || '',
                diagnosis: kesehatan.diagnosis || '',
                treatment: kesehatan.treatment || '',
                notes: kesehatan.notes || '',
            });
            const std = students?.find((s: any) => s.id === kesehatan.student_id);
            if (std) {
                setStudentSearch(`${std.name} (${std.nis})`);
            }
        } else {
            setEditingId(null);
            setData({
                student_id: preselectedStudent ? preselectedStudent.id : '',
                date: format(new Date(), "yyyy-MM-dd"), // default to today for create
                complaint: '',
                diagnosis: '',
                treatment: '',
                notes: '',
            });
            
            if (preselectedStudent) {
                setStudentSearch(`${preselectedStudent.name} (${preselectedStudent.nis})`);
            } else {
                setStudentSearch('');
            }
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setEditingId(null);
            reset();
            setStudentSearch('');
        }, 200);
    };

    const openDeleteModal = (id: number) => {
        setEditingId(id);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setTimeout(() => setEditingId(null), 200);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            put(route('kesehatan.update', editingId), {
                onSuccess: () => {
                    closeModal();
                    if (selectedStudentForHistory) {
                        router.reload({ only: ['studentsPaginated'] });
                    }
                },
            });
        } else {
            post(route('kesehatan.store'), {
                onSuccess: () => {
                    closeModal();
                    if (selectedStudentForHistory) {
                        router.reload({ only: ['studentsPaginated'] });
                    }
                },
            });
        }
    };

    const handleDelete = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            destroy(route('kesehatan.destroy', editingId), {
                onSuccess: () => {
                    closeDeleteModal();
                    if (selectedStudentForHistory) {
                        router.reload({ only: ['studentsPaginated'] });
                    }
                },
            });
        }
    };

    const filteredStudentsForDropdown = students?.filter((s: any) => 
        s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
        s.nis.includes(studentSearch)
    ) || [];

    const selectStudent = (student: any) => {
        setData('student_id', student.id);
        setStudentSearch(`${student.name} (${student.nis})`);
        setShowStudentDropdown(false);
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-2xl font-extrabold leading-tight text-gray-900 tracking-tight">Kesehatan Santri</h2>}>
            <Head title="Kesehatan Santri" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Filter & Export Bar */}
                    <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                        {/* Gender Tabs */}
                        <div className="bg-gray-100/80 p-1.5 rounded-xl flex gap-1 w-full md:w-auto overflow-x-auto shadow-inner">
                            {[
                                { id: 'semua', label: 'Semua', icon: Users },
                                { id: 'putra', label: 'Putra', icon: User },
                                { id: 'putri', label: 'Putri', icon: User },
                            ].map(tab => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleGenderTab(tab.id)}
                                        className={`flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                                            currentGender === tab.id 
                                            ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-black/5' 
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <button 
                                onClick={handleExport}
                                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all font-semibold shadow-sm hover:shadow text-sm whitespace-nowrap"
                            >
                                <Download className="w-4 h-4" />
                                Export Excel
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                                    <Stethoscope className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Data Kesehatan Santri</h3>
                                    <p className="text-sm text-gray-500">Kelola catatan dan riwayat kesehatan santri</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                                <select 
                                    value={roomId} 
                                    onChange={(e) => setRoomId(e.target.value)}
                                    className="rounded-lg border-gray-200 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-gray-700 text-sm py-2 px-3 w-full sm:w-auto"
                                >
                                    <option value="">Semua Asrama</option>
                                    {rooms?.map((room: any) => (
                                        <option key={room.id} value={room.id}>{room.name}</option>
                                    ))}
                                </select>
                                <form onSubmit={handleSearch} className="relative w-full sm:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input 
                                        type="text"
                                        placeholder="Cari santri..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full"
                                    />
                                </form>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 font-bold text-gray-900">Nama Santri</th>
                                        <th className="px-6 py-4 font-bold text-gray-900 text-center">Total Riwayat</th>
                                        <th className="px-6 py-4 font-bold text-gray-900 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentsPaginated?.data?.map((student: any) => (
                                        <tr key={student.id} className="border-b border-gray-50 hover:bg-emerald-50/30 transition-all duration-200 group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    {student.photo ? (
                                                        <img src={`/storage/${student.photo}`} alt={student.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary/20 shadow-sm" />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary font-bold text-lg border-2 border-primary/20 shadow-sm">
                                                            {student.name.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="font-bold text-gray-900 text-base group-hover:text-primary transition-colors">{student.name}</div>
                                                        <div className="text-xs text-gray-500 mt-0.5">NIS: {student.nis} • {student.room?.name || 'Belum ada kamar'}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold ${
                                                    student.health_records_count > 0 
                                                        ? 'bg-red-100 text-red-700 border border-red-200' 
                                                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                                                }`}>
                                                    {student.health_records_count} Catatan
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => setSelectedStudentForHistory(student)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-all shadow-sm"
                                                    >
                                                        Lihat Riwayat <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedStudentForHistory(student);
                                                            openModal(null, student);
                                                        }}
                                                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-all"
                                                    >
                                                        <Plus className="w-4 h-4" /> Tambah
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!studentsPaginated?.data || studentsPaginated.data.length === 0) && (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                                                <div className="flex flex-col items-center justify-center gap-3">
                                                    <Stethoscope className="w-12 h-12 text-gray-300" />
                                                    <p>Tidak ada data santri ditemukan.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination */}
                        {studentsPaginated?.links?.length > 3 && (
                            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-center">
                                <div className="flex gap-1">
                                    {studentsPaginated.links.map((link: any, index: number) => (
                                        <button
                                            key={index}
                                            onClick={() => link.url && router.get(link.url, { search, gender: currentGender, room_id: roomId }, { preserveState: true })}
                                            disabled={!link.url}
                                            className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                                link.active 
                                                    ? 'bg-primary text-white font-bold' 
                                                    : link.url 
                                                        ? 'bg-white text-gray-700 border hover:bg-gray-50' 
                                                        : 'bg-transparent text-gray-400 cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* History Modal */}
            <Modal show={!!selectedStudentForHistory} onClose={() => setSelectedStudentForHistory(null)} maxWidth="2xl">
                <div className="bg-gray-50 p-6 border-b">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            {selectedStudentForHistory?.photo ? (
                                <img src={`/storage/${selectedStudentForHistory.photo}`} alt={selectedStudentForHistory.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary/20 shadow-md" />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl shadow-md">
                                    {selectedStudentForHistory?.name?.charAt(0)}
                                </div>
                            )}
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{selectedStudentForHistory?.name}</h2>
                                <p className="text-sm text-gray-500 mt-1">NIS: {selectedStudentForHistory?.nis} • Total: {selectedStudentForHistory?.health_records_count} Catatan</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {selectedStudentForHistory && (
                                <a
                                    href={route('kesehatan.export', selectedStudentForHistory.id)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
                                >
                                    <FileDown className="w-4 h-4" /> Export Excel
                                </a>
                            )}
                            <button onClick={() => setSelectedStudentForHistory(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {selectedStudentForHistory?.health_records?.length > 0 ? (
                        <div className="space-y-4">
                            {selectedStudentForHistory.health_records.map((rekam: any) => {
                                const dateObj = new Date(rekam.date);
                                const formattedDate = !isNaN(dateObj.getTime()) ? dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : rekam.date;
                                
                                return (
                                    <div key={rekam.id} className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                                        <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-red-100 p-2.5 rounded-xl text-red-600">
                                                    <Activity className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-lg">{rekam.complaint}</h4>
                                                    <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                        <Calendar className="w-3.5 h-3.5" /> {formattedDate}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 w-full sm:w-auto">
                                                <button 
                                                    onClick={() => openModal(rekam, selectedStudentForHistory)}
                                                    className="flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg transition-colors"
                                                >
                                                    <Edit className="w-3.5 h-3.5" /> Edit
                                                </button>
                                                <button 
                                                    onClick={() => openDeleteModal(rekam.id)}
                                                    className="flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" /> Hapus
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4 grid grid-cols-2 gap-4">
                                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Diagnosa</p>
                                                <p className="text-sm font-medium text-gray-900">{rekam.diagnosis || '-'}</p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Tindakan / Obat</p>
                                                <p className="text-sm font-medium text-gray-900">{rekam.treatment || '-'}</p>
                                            </div>
                                        </div>
                                        
                                        {rekam.notes && (
                                            <div className="mt-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Catatan Tambahan</p>
                                                <p className="text-sm text-gray-700">{rekam.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-12 flex flex-col items-center justify-center text-gray-500">
                            <div className="bg-gray-100 p-4 rounded-full mb-4">
                                <Stethoscope className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="font-medium text-gray-900">Belum ada riwayat kesehatan</p>
                            <p className="text-sm">Santri ini belum memiliki catatan medis.</p>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Create / Edit Modal */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <form onSubmit={handleSubmit}>
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                            {editingId ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">
                            {editingId ? 'Edit Catatan Kesehatan' : 'Tambah Catatan Kesehatan'}
                        </h2>
                    </div>
                    
                    <div className="p-6 space-y-5">
                        <div className="relative">
                            <InputLabel htmlFor="student_id" value="Santri" />
                            <input 
                                type="text"
                                value={studentSearch}
                                onChange={(e) => {
                                    setStudentSearch(e.target.value);
                                    setShowStudentDropdown(true);
                                    if (data.student_id) setData('student_id', '');
                                }}
                                onFocus={() => setShowStudentDropdown(true)}
                                onBlur={() => {
                                    setTimeout(() => setShowStudentDropdown(false), 200);
                                }}
                                className={`mt-1 block w-full rounded-xl shadow-sm ${errors.student_id ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary focus:ring-primary'}`}
                                placeholder="Ketik nama atau NIS..."
                                required
                            />
                            {showStudentDropdown && studentSearch && (
                                <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border-l-[6px] border-l-primary">
                                    {filteredStudentsForDropdown.length > 0 ? (
                                        filteredStudentsForDropdown.map((s: any) => (
                                            <li 
                                                key={s.id} 
                                                className="relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-green-50 text-gray-900 cursor-pointer transition-colors"
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    selectStudent(s);
                                                }}
                                            >
                                                <span className="font-medium block truncate">{s.name} ({s.nis})</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-500">
                                            Santri tidak ditemukan
                                        </li>
                                    )}
                                </ul>
                            )}
                            <InputError message={errors.student_id} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="complaint" value="Keluhan Santri" />
                            <TextInput
                                id="complaint"
                                type="text"
                                className="mt-1 block w-full"
                                value={data.complaint}
                                onChange={e => setData('complaint', e.target.value)}
                                placeholder="Contoh: Demam, pusing, batuk"
                                required
                            />
                            <InputError message={errors.complaint} className="mt-2" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    placeholder="Contoh: Paracetamol, Istirahat di UKS"
                                />
                                <InputError message={errors.treatment} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="date" value="Tanggal Keluhan" />
                            <TextInput
                                id="date"
                                type="date"
                                className="mt-1 block w-full"
                                value={data.date}
                                onChange={e => setData('date', e.target.value)}
                                required
                            />
                            <InputError message={errors.date} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="notes" value="Catatan Tambahan (Opsional)" />
                            <textarea
                                id="notes"
                                className="mt-1 block w-full border-gray-300 focus:border-primary focus:ring-primary rounded-xl shadow-sm"
                                rows={3}
                                value={data.notes}
                                onChange={e => setData('notes', e.target.value)}
                                placeholder="Tambahkan catatan medis jika perlu..."
                            />
                            <InputError message={errors.notes} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-xl">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processing}>Simpan</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Delete Modal */}
            <Modal show={isDeleteModalOpen} onClose={closeDeleteModal} maxWidth="sm">
                <div className="p-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4 mx-auto">
                        <Trash2 className="w-6 h-6 text-red-600" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 text-center">Konfirmasi Hapus</h2>
                    <p className="mt-2 text-sm text-gray-500 text-center">
                        Apakah Anda yakin ingin menghapus catatan medis ini? Data yang dihapus tidak dapat dikembalikan.
                    </p>
                    <div className="mt-6 flex justify-center gap-3">
                        <SecondaryButton onClick={closeDeleteModal} className="flex-1 justify-center">Batal</SecondaryButton>
                        <DangerButton onClick={handleDelete} className="flex-1 justify-center">Hapus</DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
