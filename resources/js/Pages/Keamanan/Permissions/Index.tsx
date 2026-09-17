import React, { useState, useRef, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { ShieldAlert, Plus, Search, CheckCircle, AlertTriangle, XCircle, Clock, Download, Users, User, Check, X, Printer, Edit, Trash2, ChevronDown } from 'lucide-react';
import Modal from '@/Components/Modal';

export default function PermissionsIndex({ permissions, students, filters }: any) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [confirmingStatus, setConfirmingStatus] = useState<{ id: number, status: string, title: string } | null>(null);
    const [confirmingDelete, setConfirmingDelete] = useState<number | null>(null);

    const [activeGender, setActiveGender] = useState(filters?.gender || 'semua');

    const handleGenderTab = (gender: string) => {
        setActiveGender(gender);
        router.get(route('perizinan.index'), { gender }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleExport = () => {
        const url = new URL('/perizinan/export', window.location.origin);
        if (activeGender !== 'semua') url.searchParams.append('gender', activeGender);
        window.location.href = url.toString();
    };

    const nowLocal = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000);
    const currentDateStr = nowLocal.toISOString().slice(0, 10);
    const currentTimeStr = nowLocal.toISOString().slice(11, 16);

    const { data, setData, post, put, processing, reset, errors, transform } = useForm({
        student_id: '',
        permission_type: '',
        reason: '',
        leave_date_input: currentDateStr,
        leave_time_input: currentTimeStr,
        return_date_input: '',
        return_time_input: '',
    });

    transform((data) => ({
        ...data,
        leave_date: `${data.leave_date_input} ${data.leave_time_input}:00`,
        return_date: data.return_date_input ? `${data.return_date_input} ${data.return_time_input || '00:00'}:00` : null,
    }));

    const submit = (e: any) => {
        e.preventDefault();
        if (editingId) {
            put(route('perizinan.update', editingId), {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    reset();
                },
            });
        } else {
            post(route('perizinan.store'), {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleEdit = (p: any) => {
        setEditingId(p.id);
        const leaveDt = new Date(p.leave_date);
        const returnDt = p.return_date ? new Date(p.return_date) : null;

        setData({
            student_id: p.student_id,
            permission_type: p.permission_type,
            reason: p.reason,
            leave_date_input: leaveDt.toLocaleDateString('en-CA'),
            leave_time_input: leaveDt.toTimeString().split(' ')[0].slice(0, 5),
            return_date_input: returnDt ? returnDt.toLocaleDateString('en-CA') : '',
            return_time_input: returnDt ? returnDt.toTimeString().split(' ')[0].slice(0, 5) : '',
        });
        setStudentSearch(`${p.student.name} (${p.student.nis})`);
        setIsCreateModalOpen(true);
    };

    const executeUpdateStatus = () => {
        if (confirmingStatus) {
            router.put(route('perizinan.status', confirmingStatus.id), { status: confirmingStatus.status });
            setConfirmingStatus(null);
        }
    };

    const executeDelete = () => {
        if (confirmingDelete) {
            router.delete(route('perizinan.destroy', confirmingDelete));
            setConfirmingDelete(null);
        }
    };

    const filteredPermissions = permissions.data.filter((p: any) => 
        p.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.permission_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [studentSearch, setStudentSearch] = useState('');
    const [showStudentDropdown, setShowStudentDropdown] = useState(false);

    // Filter students for the autocomplete
    const filteredStudentsForDropdown = students.filter((s: any) => 
        s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
        s.nis.includes(studentSearch)
    );

    const selectStudent = (student: any) => {
        setData('student_id', student.id);
        setStudentSearch(`${student.name} (${student.nis})`);
        setShowStudentDropdown(false);
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-bold leading-tight text-gray-800">Perizinan Santri</h2>}
        >
            <Head title="Perizinan Santri" />

            {/* Filter & Export Bar */}
            <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                {/* Gender Tabs */}
                <div className="bg-gray-100/80 p-1.5 rounded-xl flex gap-1 w-full md:w-auto overflow-x-auto shadow-inner">
                    {[
                        { id: 'semua', label: 'Semua', icon: Users },
                        { id: 'putra', label: 'Putra', icon: User },
                        { id: 'putri', label: 'Putri', icon: User },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => handleGenderTab(tab.id)}
                            className={`flex items-center justify-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                                activeGender === tab.id 
                                ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' 
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
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
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Data Perizinan</h3>
                            <p className="text-sm text-gray-500">Kelola izin Keluar Pondok, Pulang, Sekolah, dan Madin</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input 
                                type="text"
                                placeholder="Cari data izin..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                            />
                        </div>
                        <button 
                            onClick={() => {
                                setEditingId(null);
                                const current = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000);
                                reset();
                                setData(d => ({
                                    ...d,
                                    leave_date_input: current.toISOString().slice(0, 10),
                                    leave_time_input: current.toISOString().slice(11, 16)
                                }));
                                setIsCreateModalOpen(true);
                                setStudentSearch('');
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
                        >
                            <Plus className="w-5 h-5" />
                            Buat Izin
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                                <th className="px-6 py-4 font-medium w-1/4">Santri</th>
                                <th className="px-6 py-4 font-medium w-1/4">Jenis Izin</th>
                                <th className="px-6 py-4 font-medium whitespace-nowrap">Tgl Pergi - Kembali</th>
                                <th className="px-6 py-4 font-medium whitespace-nowrap">Status</th>
                                <th className="px-6 py-4 font-medium text-right whitespace-nowrap">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredPermissions.map((p: any) => (
                                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {p.student.photo ? (
                                                <img src={`/storage/${p.student.photo}`} alt={p.student.name} className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-100" />
                                            ) : (
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-sm
                                                    ${p.student.gender === 'putra' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}
                                                >
                                                    {p.student.name.substring(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-semibold text-gray-900">{p.student.name}</div>
                                                <div className="text-xs text-gray-500">NIS: {p.student.nis} • {p.student.gender === 'putra' ? 'Putra' : 'Putri'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap
                                            ${p.permission_type === 'Pulang' ? 'bg-purple-100 text-purple-800' : 
                                              p.permission_type === 'Keluar Pondok' ? 'bg-indigo-100 text-indigo-800' : 
                                              p.permission_type === 'Sekolah' ? 'bg-sky-100 text-sky-800' : 
                                              'bg-teal-100 text-teal-800'}`}
                                        >
                                            {p.permission_type}
                                        </span>
                                        <div className="text-sm text-gray-500 break-words mt-1">{p.reason}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                                            {new Date(p.leave_date).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        {p.return_date && (
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 pl-5">
                                                s/d {new Date(p.return_date).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {p.status === 'diajukan' && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                                                <Clock className="w-3.5 h-3.5" /> Menunggu Persetujuan
                                            </span>
                                        )}
                                        {p.status === 'disetujui' && (
                                            p.return_date && new Date(p.return_date) < new Date() ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100 shadow-sm animate-pulse">
                                                    <AlertTriangle className="w-3.5 h-3.5" /> Terlambat Kembali
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                    <CheckCircle className="w-3.5 h-3.5" /> Disetujui (Belum Kembali)
                                                </span>
                                            )
                                        )}
                                        {p.status === 'ditolak' && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
                                                <XCircle className="w-3.5 h-3.5" /> Ditolak
                                            </span>
                                        )}
                                        {p.status === 'selesai' && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                                                <CheckCircle className="w-3.5 h-3.5" /> Selesai
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {p.status === 'diajukan' && (
                                                <>
                                                    <button 
                                                        onClick={() => setConfirmingStatus({ id: p.id, status: 'disetujui', title: 'Setujui Izin' })}
                                                        className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                                                        title="Setujui"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => setConfirmingStatus({ id: p.id, status: 'ditolak', title: 'Tolak Izin' })}
                                                        className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                                                        title="Tolak"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                            {p.status === 'disetujui' && (
                                                <button 
                                                    onClick={() => setConfirmingStatus({ id: p.id, status: 'selesai', title: 'Tandai Selesai (Santri Kembali)' })}
                                                    className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                                    title="Tandai Santri Kembali (Selesai)"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                </button>
                                            )}
                                            <a 
                                                href={route('perizinan.print', p.id)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                                                title="Cetak Surat Izin"
                                            >
                                                <Printer className="w-4 h-4" />
                                            </a>
                                            <button 
                                                onClick={() => handleEdit(p)}
                                                className="p-2 text-gray-600 bg-gray-50 hover:bg-gray-200 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => setConfirmingDelete(p.id)}
                                                className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredPermissions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        Belum ada data perizinan ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Tambah/Edit Perizinan */}
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">
                        {editingId ? 'Edit Data Perizinan' : 'Buat Izin Baru'}
                    </h2>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cari Nama Santri</label>
                            <input 
                                type="text"
                                value={studentSearch}
                                onChange={e => {
                                    setStudentSearch(e.target.value);
                                    setShowStudentDropdown(true);
                                }}
                                onFocus={() => setShowStudentDropdown(true)}
                                onBlur={() => setTimeout(() => setShowStudentDropdown(false), 200)}
                                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Ketik nama atau NIS santri..."
                                required={!data.student_id}
                            />
                            {showStudentDropdown && filteredStudentsForDropdown.length > 0 && (
                                <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {filteredStudentsForDropdown.map((s: any) => (
                                        <li 
                                            key={s.id} 
                                            className="relative cursor-default select-none py-2 px-4 hover:bg-blue-50 text-gray-900 cursor-pointer"
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                selectStudent(s);
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                {s.photo ? (
                                                    <img src={`/storage/${s.photo}`} alt={s.name} className="w-8 h-8 rounded-full object-cover" />
                                                ) : (
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0
                                                        ${s.gender === 'putra' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}
                                                    >
                                                        {s.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <span className="font-medium text-gray-900 block">{s.name}</span>
                                                    <span className="text-xs text-gray-500 block">{s.nis}</span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {errors.student_id && <p className="text-sm text-red-600 mt-1">{errors.student_id}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Izin</label>
                            <input 
                                type="text"
                                value={data.permission_type}
                                onChange={e => setData('permission_type', e.target.value)}
                                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Misal: Keluar Pondok, Pulang, Sakit, dll."
                                required
                            />
                            {errors.permission_type && <p className="text-sm text-red-600 mt-1">{errors.permission_type}</p>}
                        </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Keluar</label>
                                    <input 
                                        type="date"
                                        value={data.leave_date_input}
                                        onChange={e => setData('leave_date_input', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
                                        required
                                    />
                                </div>
                                <div>
                                    <div className="flex justify-between items-end mb-1">
                                        <label className="block text-sm font-medium text-gray-700">Jam Keluar</label>
                                        <button 
                                            type="button"
                                            onClick={() => {
                                                const current = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000);
                                                setData(d => ({
                                                    ...d, 
                                                    leave_date_input: current.toISOString().slice(0, 10),
                                                    leave_time_input: current.toISOString().slice(11, 16)
                                                }));
                                            }}
                                            className="text-[10px] text-blue-600 hover:text-blue-800 font-medium px-2 py-0.5 bg-blue-50 rounded"
                                        >
                                            Waktu Saat Ini
                                        </button>
                                    </div>
                                    <input 
                                        type="time"
                                        value={data.leave_time_input}
                                        onChange={e => setData('leave_time_input', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
                                        required
                                    />
                                </div>
                            </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tgl Kembali <span className="text-gray-400 font-normal">(Opsional)</span></label>
                                <input 
                                    type="date"
                                    value={data.return_date_input}
                                    onChange={e => setData('return_date_input', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jam Kembali</label>
                                <input 
                                    type="time"
                                    value={data.return_time_input}
                                    onChange={e => setData('return_time_input', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan / Alasan</label>
                            <textarea 
                                value={data.reason}
                                onChange={e => setData('reason', e.target.value)}
                                className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                rows={3}
                                required
                            ></textarea>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button 
                                type="button" 
                                onClick={() => setIsCreateModalOpen(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Batal
                            </button>
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {editingId ? 'Simpan Perubahan' : 'Buat Izin'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Modal Konfirmasi Status */}
            <Modal show={confirmingStatus !== null} onClose={() => setConfirmingStatus(null)} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">{confirmingStatus?.title}</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Apakah Anda yakin ingin memperbarui status perizinan ini menjadi <strong>{confirmingStatus?.status}</strong>?
                    </p>
                    <div className="flex justify-end gap-3">
                        <button 
                            onClick={() => setConfirmingStatus(null)}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Batal
                        </button>
                        <button 
                            onClick={executeUpdateStatus}
                            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                            Ya, Lanjutkan
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal Konfirmasi Hapus */}
            <Modal show={confirmingDelete !== null} onClose={() => setConfirmingDelete(null)} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-red-600 mb-4">Hapus Izin</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Data perizinan yang dihapus tidak dapat dikembalikan. Lanjutkan menghapus?
                    </p>
                    <div className="flex justify-end gap-3">
                        <button 
                            onClick={() => setConfirmingDelete(null)}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Batal
                        </button>
                        <button 
                            onClick={executeDelete}
                            className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                        >
                            Ya, Hapus
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
