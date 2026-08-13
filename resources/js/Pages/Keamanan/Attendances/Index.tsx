import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { CalendarDays, Plus, Search, Filter, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';
import Modal from '@/Components/Modal';

export default function AttendancesIndex({ attendances, students, filters }: any) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [confirmingDelete, setConfirmingDelete] = useState<number | null>(null);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        student_id: '',
        date: filters.date,
        time: new Date().toTimeString().split(' ')[0].slice(0, 5),
        type: filters.type === 'all' ? 'sekolah' : filters.type,
        status: 'hadir',
        notes: '',
    });

    const submit = (e: any) => {
        e.preventDefault();
        if (editingId) {
            put(route('attendances.update', editingId), {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    reset();
                },
            });
        } else {
            post(route('attendances.store'), {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleEdit = (a: any) => {
        setEditingId(a.id);
        setData({
            student_id: a.student_id,
            date: a.date,
            time: a.time ? a.time.slice(0, 5) : new Date().toTimeString().split(' ')[0].slice(0, 5),
            type: a.type,
            status: a.status,
            notes: a.notes || '',
        });
        setStudentSearch(`${a.student.name} (${a.student.nis})`);
        setIsCreateModalOpen(true);
    };

    const executeDelete = () => {
        if (confirmingDelete) {
            router.delete(route('attendances.destroy', confirmingDelete), {
                preserveScroll: true,
                onSuccess: () => setConfirmingDelete(null),
            });
        }
    };

    const applyFilters = (date: string, type: string) => {
        router.get(route('attendances.index'), { date, type }, { preserveState: true });
    };

    const filteredAttendances = attendances.data.filter((a: any) => 
        a.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.student.nis.toLowerCase().includes(searchTerm.toLowerCase())
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
            header={<h2 className="text-xl font-bold leading-tight text-gray-800">Absensi Santri</h2>}
        >
            <Head title="Absensi Santri" />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="p-6 border-b border-gray-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                            <CalendarDays className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Data Kehadiran</h3>
                            <p className="text-sm text-gray-500">Kelola absensi Sekolah, Madin (Ngaji), dan Asrama</p>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
                            <Filter className="w-4 h-4 text-gray-400 ml-1" />
                            <div className="flex items-center">
                                <button 
                                    onClick={() => applyFilters('', filters.type)}
                                    className={`text-xs px-2 py-1 rounded-l-md border-r border-gray-200 ${!filters.date ? 'bg-emerald-100 text-emerald-700 font-medium' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
                                >
                                    Semua
                                </button>
                                <input 
                                    type="date"
                                    value={filters.date || ''}
                                    onChange={e => applyFilters(e.target.value, filters.type)}
                                    className="border-none bg-transparent focus:ring-0 text-sm py-1 rounded-r-md"
                                />
                            </div>
                            <div className="w-px h-6 bg-gray-300"></div>
                            <select 
                                value={filters.type}
                                onChange={e => applyFilters(filters.date, e.target.value)}
                                className="border-none bg-transparent focus:ring-0 text-sm py-1"
                            >
                                <option value="all">Semua Jenis</option>
                                <option value="sekolah">Sekolah</option>
                                <option value="ngaji">Madin / Ngaji</option>
                                <option value="kegiatan">Kegiatan</option>
                                <option value="asrama">Asrama</option>
                            </select>
                        </div>

                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input 
                                type="text"
                                placeholder="Cari santri..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full sm:w-48"
                            />
                        </div>
                        <button 
                            onClick={() => {
                                setEditingId(null);
                                reset();
                                setData('date', filters.date || new Date().toLocaleDateString('en-CA')); // Keep selected date or use today
                                setData('time', new Date().toTimeString().split(' ')[0].slice(0, 5));
                                setData('type', filters.type === 'all' ? 'sekolah' : filters.type); // Keep selected type
                                setIsCreateModalOpen(true);
                                setStudentSearch('');
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium whitespace-nowrap"
                        >
                            <Plus className="w-5 h-5" />
                            Input Absensi
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                                <th className="px-6 py-4 font-medium w-1/4">Santri</th>
                                <th className="px-6 py-4 font-medium whitespace-nowrap">Tanggal & Jenis</th>
                                <th className="px-6 py-4 font-medium">Status Kehadiran</th>
                                <th className="px-6 py-4 font-medium">Keterangan</th>
                                <th className="px-6 py-4 font-medium text-right whitespace-nowrap">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredAttendances.map((a: any) => (
                                <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900 break-words">{a.student.name}</div>
                                        <div className="text-sm text-gray-500">NIS: {a.student.nis}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-gray-900">{new Date(a.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                                        {a.time && <div className="text-sm text-gray-500 mt-0.5">Jam: {a.time.slice(0, 5)} WIB</div>}
                                        <span className={`inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                            ${a.type === 'sekolah' ? 'bg-blue-100 text-blue-800' : 
                                              a.type === 'ngaji' ? 'bg-purple-100 text-purple-800' : 
                                              a.type === 'asrama' ? 'bg-orange-100 text-orange-800' :
                                              'bg-teal-100 text-teal-800'}`}
                                        >
                                            {a.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {a.status === 'hadir' && (
                                            <span className="inline-flex items-center gap-1 text-sm text-emerald-600 font-medium">
                                                <CheckCircle className="w-4 h-4" /> Hadir
                                            </span>
                                        )}
                                        {a.status === 'izin' && (
                                            <span className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium">
                                                <AlertCircle className="w-4 h-4" /> Izin
                                            </span>
                                        )}
                                        {a.status === 'sakit' && (
                                            <span className="inline-flex items-center gap-1 text-sm text-yellow-600 font-medium">
                                                <AlertCircle className="w-4 h-4" /> Sakit
                                            </span>
                                        )}
                                        {a.status === 'alpa' && (
                                            <span className="inline-flex items-center gap-1 text-sm text-red-600 font-medium">
                                                <XCircle className="w-4 h-4" /> Alpa (Tanpa Keterangan)
                                            </span>
                                        )}
                                        {a.status === 'terlambat' && (
                                            <span className="inline-flex items-center gap-1 text-sm text-orange-600 font-medium">
                                                <Clock className="w-4 h-4" /> Terlambat
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-500 break-words">{a.notes || '-'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button 
                                                onClick={() => handleEdit(a)}
                                                className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => setConfirmingDelete(a.id)}
                                                className="text-sm text-red-600 hover:text-red-700 font-medium"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredAttendances.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        Belum ada data absensi ditemukan untuk tanggal/jenis ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination (if any) could be added here */}
                {attendances.links && attendances.links.length > 3 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-center gap-1">
                        {attendances.links.map((link: any, i: number) => (
                            <a 
                                key={i}
                                href={link.url}
                                className={`px-3 py-1 rounded-md text-sm ${link.active ? 'bg-emerald-600 text-white font-medium' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal Tambah/Edit Absensi */}
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">
                        {editingId ? 'Edit Data Absensi' : 'Input Absensi Baru'}
                    </h2>
                    <form onSubmit={submit} className="space-y-4">
                        {!editingId && (
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
                                    className="w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                    placeholder="Ketik nama atau NIS santri..."
                                    required={!data.student_id}
                                />
                                {showStudentDropdown && filteredStudentsForDropdown.length > 0 && (
                                    <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {filteredStudentsForDropdown.map((s: any) => (
                                            <li 
                                                key={s.id} 
                                                className="relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-emerald-50 text-gray-900 cursor-pointer"
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    selectStudent(s);
                                                }}
                                            >
                                                <div className="flex items-center">
                                                    <span className="font-medium truncate">{s.name}</span>
                                                    <span className="ml-2 truncate text-gray-500">({s.nis})</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {errors.student_id && <p className="text-sm text-red-600 mt-1">{errors.student_id}</p>}
                            </div>
                        )}

                        {editingId && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Santri</label>
                                <input type="text" value={studentSearch} disabled className="w-full rounded-lg border-gray-300 bg-gray-50 text-gray-500" />
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                                <input 
                                    type="date"
                                    value={data.date}
                                    onChange={e => setData('date', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 bg-gray-50 text-gray-600"
                                    required
                                    readOnly
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jam Absen</label>
                                <input 
                                    type="time"
                                    value={data.time}
                                    onChange={e => setData('time', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 bg-gray-50 text-gray-600"
                                    required
                                    readOnly
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Absensi</label>
                            <select 
                                value={data.type}
                                onChange={e => setData('type', e.target.value)}
                                className="w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                disabled={editingId !== null}
                            >
                                <option value="sekolah">Sekolah</option>
                                <option value="ngaji">Madin / Ngaji</option>
                                <option value="kegiatan">Kegiatan</option>
                                <option value="asrama">Asrama</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status Kehadiran</label>
                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                                {['hadir', 'izin', 'sakit', 'alpa', 'terlambat'].map((status) => (
                                    <button
                                        key={status}
                                        type="button"
                                        onClick={() => setData('status', status)}
                                        className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border ${
                                            data.status === status 
                                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                                            : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                                        }`}
                                    >
                                        <span className="text-xs font-medium capitalize">{status}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan <span className="text-gray-400 font-normal">(Opsional)</span></label>
                            <input 
                                type="text"
                                value={data.notes}
                                onChange={e => setData('notes', e.target.value)}
                                className="w-full rounded-lg border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                                placeholder="Contoh: Sakit demam, Izin acara keluarga..."
                            />
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
                                className="px-4 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {editingId ? 'Simpan Perubahan' : 'Simpan Absensi'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Modal Konfirmasi Hapus */}
            <Modal show={confirmingDelete !== null} onClose={() => setConfirmingDelete(null)} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-red-600 mb-4">Hapus Absensi</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Data absensi yang dihapus tidak dapat dikembalikan. Lanjutkan menghapus?
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
