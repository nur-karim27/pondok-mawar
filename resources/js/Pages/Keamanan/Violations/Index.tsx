import { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShieldAlert, Plus, Search, CheckCircle, AlertTriangle, Download, User, Users, Filter, Clock, X, FileText } from 'lucide-react';
import Modal from '@/Components/Modal';

export default function ViolationsIndex({ groupedStudents, students, filters }: any) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Filters for index view
    const [activeGender, setActiveGender] = useState(filters?.gender || 'semua');
    const [filterStudentId, setFilterStudentId] = useState(filters?.student_id || 'semua');
    const [filterStudentSearch, setFilterStudentSearch] = useState('');
    const [showFilterStudentDropdown, setShowFilterStudentDropdown] = useState(false);

    // Apply filters when they change
    const applyFilters = (gender: string, student_id: string) => {
        router.get(route('pelanggaran.index'), {
            gender,
            student_id
        }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleGenderTab = (gender: string) => {
        setActiveGender(gender);
        applyFilters(gender, filterStudentId);
    };

    const handleStudentFilter = (id: string) => {
        setFilterStudentId(id);
        applyFilters(activeGender, id);
    };

    const handleExport = () => {
        const url = new URL('/pelanggaran/export', window.location.origin);
        if (activeGender !== 'semua') url.searchParams.append('gender', activeGender);
        if (filterStudentId !== 'semua') url.searchParams.append('student_id', filterStudentId);
        window.location.href = url.toString();
    };

    const handleStudentExport = (studentId: number) => {
        const url = new URL('/pelanggaran/export', window.location.origin);
        url.searchParams.append('student_id', String(studentId));
        window.location.href = url.toString();
    };

    // Timezone adjusted current datetime for default value
    const nowLocal = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        student_id: '',
        violation_name: '',
        category: 'Ringan',
        points: '',
        description: '',
        violation_date: nowLocal,
    });

    const submit = (e: any) => {
        e.preventDefault();
        // convert datetime-local 'YYYY-MM-DDTHH:MM' back to 'YYYY-MM-DD HH:MM:SS' for backend if needed
        // Laravel handles 'YYYY-MM-DDTHH:MM' perfectly fine as datetime.
        if (editingId) {
            put(route('pelanggaran.update', editingId), {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    reset();
                    setData('violation_date', nowLocal);
                },
            });
        } else {
            post(route('pelanggaran.store'), {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    reset();
                    setData('violation_date', nowLocal);
                },
            });
        }
    };

    const handleEdit = (v: any) => {
        setEditingId(v.id);
        setData({
            student_id: v.student_id,
            violation_name: v.violation_name,
            category: v.category,
            points: v.points,
            description: v.description || '',
            violation_date: v.violation_date.replace(' ', 'T').slice(0, 16),
        });
        setStudentSearch(`${v.student.name} (${v.student.nis})`);
        setIsCreateModalOpen(true);
    };

    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [detailStudentId, setDetailStudentId] = useState<number | null>(null);
    const [detailData, setDetailData] = useState<any>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    const openStudentDetail = async (student_id: number) => {
        setDetailStudentId(student_id);
        setDetailModalOpen(true);
        setIsLoadingDetail(true);
        try {
            const res = await window.axios.get(route('pelanggaran.santri', student_id));
            setDetailData(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingDetail(false);
        }
    };

    const isOverdue = (dateString: string) => {
        const vDate = new Date(dateString);
        const today = new Date();
        const diffTime = today.getTime() - vDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays > 7;
    };

    const [confirmingResolve, setConfirmingResolve] = useState<number | null>(null);
    const [confirmingDelete, setConfirmingDelete] = useState<number | null>(null);

    const { data: resolveData, setData: setResolveData, post: postResolve, processing: resolving, reset: resetResolve, errors: resolveErrors } = useForm({
        punishment: ''
    });

    const executeResolve = (e: any) => {
        e.preventDefault();
        if (confirmingResolve) {
            postResolve(route('pelanggaran.resolve', confirmingResolve), {
                onSuccess: () => {
                    setConfirmingResolve(null);
                    resetResolve();
                    if (detailStudentId) {
                        openStudentDetail(detailStudentId);
                    }
                    router.reload({ only: ['groupedStudents'] });
                }
            });
        }
    };

    const [resolveAllOpen, setResolveAllOpen] = useState(false);
    const { data: resolveAllData, setData: setResolveAllData, post: postResolveAll, processing: resolvingAll, reset: resetResolveAll, errors: resolveAllErrors } = useForm({
        student_id: '',
        punishment: ''
    });

    const executeResolveAll = (e: any) => {
        e.preventDefault();
        postResolveAll(route('pelanggaran.resolveAll'), {
            onSuccess: () => {
                setResolveAllOpen(false);
                resetResolveAll();
                if (detailStudentId) {
                    openStudentDetail(detailStudentId);
                }
                router.reload({ only: ['groupedStudents'] });
            }
        });
    };

    const executeDelete = () => {
        if (confirmingDelete) {
            router.delete(route('pelanggaran.destroy', confirmingDelete), {
                onSuccess: () => {
                    setConfirmingDelete(null);
                    if (detailStudentId) {
                        openStudentDetail(detailStudentId);
                    }
                    router.reload({ only: ['groupedStudents'] });
                }
            });
        }
    };

    const filteredGroupedStudents = groupedStudents.data.filter((s: any) => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.nis.includes(searchTerm)
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

    // Find current filtered student name
    const currentFilteredStudent = students.find((s: any) => s.id == filterStudentId);

    // Pagination items
    const { links } = groupedStudents;

    // Selected student object for the Modal
    const modalSelectedStudent = students.find((s: any) => s.id == data.student_id);

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-bold leading-tight text-gray-800">Pelanggaran & Poin Santri</h2>}
        >
            <Head title="Pelanggaran Santri" />

            {/* Filter & Export Bar */}
            <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                {/* Gender Tabs */}
                <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 flex gap-1 w-full md:w-auto">
                    {[
                        { id: 'semua', label: 'Semua Santri', icon: Users },
                        { id: 'putra', label: 'Santri Putra', icon: User },
                        { id: 'putri', label: 'Santri Putri', icon: User },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => handleGenderTab(tab.id)}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                                activeGender === tab.id 
                                ? 'bg-red-50 text-red-700 shadow-sm' 
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Specific Student Filter Dropdown */}
                    <div className="relative w-full md:w-64">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input 
                            type="text"
                            placeholder="Filter satu santri..."
                            value={filterStudentId !== 'semua' ? (currentFilteredStudent ? `${currentFilteredStudent.name}` : filterStudentSearch) : filterStudentSearch}
                            onChange={e => {
                                setFilterStudentSearch(e.target.value);
                                if (filterStudentId !== 'semua') handleStudentFilter('semua');
                                setShowFilterStudentDropdown(true);
                            }}
                            onFocus={() => setShowFilterStudentDropdown(true)}
                            onBlur={() => setTimeout(() => setShowFilterStudentDropdown(false), 200)}
                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full text-sm"
                        />
                        {filterStudentId !== 'semua' && (
                            <button onClick={() => handleStudentFilter('semua')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                &times;
                            </button>
                        )}
                        {showFilterStudentDropdown && filterStudentSearch.length > 0 && (
                            <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-xl bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5">
                                {students.filter((s: any) => s.name.toLowerCase().includes(filterStudentSearch.toLowerCase()) || s.nis.includes(filterStudentSearch)).map((s: any) => (
                                    <li 
                                        key={s.id} 
                                        className="cursor-pointer select-none py-2 px-4 hover:bg-red-50 text-gray-900"
                                        onMouseDown={(e) => { e.preventDefault(); handleStudentFilter(s.id); setFilterStudentSearch(''); }}
                                    >
                                        <div className="font-medium truncate">{s.name}</div>
                                        <div className="text-xs text-gray-500">{s.nis}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <button 
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm font-medium shadow-sm whitespace-nowrap"
                    >
                        <Download className="w-4 h-4" />
                        Export Excel
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Catatan Pelanggaran</h3>
                            <p className="text-sm text-gray-500">Kelola dan pantau poin kedisiplinan santri</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input 
                                type="text"
                                placeholder="Cari pelanggaran..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full sm:w-64 text-sm"
                            />
                        </div>
                        <button 
                            onClick={() => {
                                setEditingId(null);
                                reset();
                                setIsCreateModalOpen(true);
                                setStudentSearch('');
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-medium shadow-sm whitespace-nowrap"
                        >
                            <Plus className="w-5 h-5" />
                            Catat Pelanggaran
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                                <th className="px-6 py-4 font-semibold">Santri</th>
                                <th className="px-6 py-4 font-semibold">Total Poin</th>
                                <th className="px-6 py-4 font-semibold">Pelanggaran Belum Selesai</th>
                                <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredGroupedStudents.map((s: any) => (
                                <tr key={s.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {s.photo ? (
                                                <img src={`/storage/${s.photo}`} alt={s.name} className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-100" />
                                            ) : (
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-sm
                                                    ${s.gender === 'putra' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}
                                                >
                                                    {s.name.substring(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-semibold text-gray-900">{s.name}</div>
                                                <div className="text-xs text-gray-500">NIS: {s.nis}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-black text-red-600 text-base bg-red-50 px-3 py-1 rounded-lg">
                                            {s.total_points || 0} Poin
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {s.unresolved_count > 0 ? (
                                            <span className="inline-flex items-center gap-1.5 text-sm text-orange-700 font-bold bg-orange-50 px-3 py-1 rounded-lg">
                                                <AlertTriangle className="w-4 h-4" /> {s.unresolved_count} Pelanggaran
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 text-sm text-green-700 font-bold bg-green-50 px-3 py-1 rounded-lg">
                                                <CheckCircle className="w-4 h-4" /> Semua Selesai
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openStudentDetail(s.id)} className="px-4 py-2 text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg font-bold transition-colors border border-blue-200">
                                                Detail Riwayat
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredGroupedStudents.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <ShieldAlert className="w-12 h-12 mb-3 text-gray-300" />
                                            <p className="text-gray-500 font-medium">Tidak ada data pelanggaran ditemukan.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                {links && links.length > 3 && (
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Menampilkan <span className="font-medium text-gray-900">{groupedStudents.from || 0}</span> sampai <span className="font-medium text-gray-900">{groupedStudents.to || 0}</span> dari <span className="font-medium text-gray-900">{groupedStudents.total || 0}</span> data
                        </div>
                        <div className="flex items-center gap-1">
                            {links.map((link: any, i: number) => (
                                <button
                                    key={i}
                                    onClick={() => link.url && router.get(link.url, { gender: activeGender, student_id: filterStudentId }, { preserveScroll: true, preserveState: true })}
                                    disabled={!link.url}
                                    className={`px-3 py-1 text-sm rounded-lg border ${
                                        link.active 
                                            ? 'bg-red-50 border-red-200 text-red-600 font-medium' 
                                            : 'border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Modal Tambah/Edit Pelanggaran (Tunggal) */}
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="md">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-medium text-gray-900">
                            {editingId ? 'Edit Data Pelanggaran' : 'Catat Pelanggaran Baru'}
                        </h2>
                    </div>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Santri</label>
                            
                            {modalSelectedStudent ? (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl mb-2">
                                    {modalSelectedStudent.photo ? (
                                        <img src={`/storage/${modalSelectedStudent.photo}`} alt={modalSelectedStudent.name} className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0
                                            ${modalSelectedStudent.gender === 'putra' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}
                                        >
                                            {modalSelectedStudent.name.substring(0, 2).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900">{modalSelectedStudent.name}</div>
                                        <div className="text-xs text-gray-500">{modalSelectedStudent.nis} • {modalSelectedStudent.gender === 'putra' ? 'Putra' : 'Putri'}</div>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => { setData('student_id', ''); setStudentSearch(''); }}
                                        className="text-xs text-red-600 hover:bg-red-50 px-2 py-1 rounded"
                                    >
                                        Ganti
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <input 
                                        type="text"
                                        value={studentSearch}
                                        onChange={e => {
                                            setStudentSearch(e.target.value);
                                            setShowStudentDropdown(true);
                                        }}
                                        onFocus={() => setShowStudentDropdown(true)}
                                        onBlur={() => {
                                            // Delay hiding dropdown so click events on list items can fire first
                                            setTimeout(() => setShowStudentDropdown(false), 200);
                                        }}
                                        className="w-full rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
                                        placeholder="Ketik nama atau NIS santri..."
                                        required={!data.student_id}
                                    />
                                    {showStudentDropdown && filteredStudentsForDropdown.length > 0 && (
                                        <ul className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                            {filteredStudentsForDropdown.map((s: any) => (
                                                <li 
                                                    key={s.id} 
                                                    className="relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-red-50 text-gray-900 cursor-pointer"
                                                    onMouseDown={(e) => {
                                                        e.preventDefault(); // Prevent input onBlur from firing immediately
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
                                </>
                            )}
                            {errors.student_id && <p className="text-sm text-red-600 mt-1">{errors.student_id}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bentuk Pelanggaran</label>
                            <input 
                                type="text"
                                value={data.violation_name}
                                onChange={e => setData('violation_name', e.target.value)}
                                className="w-full rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
                                placeholder="Cth: Terlambat sholat jamaah"
                                required
                            />
                            {errors.violation_name && <p className="text-sm text-red-600 mt-1">{errors.violation_name}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                <select 
                                    value={data.category}
                                    onChange={e => setData('category', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
                                >
                                    <option value="Ringan">Ringan</option>
                                    <option value="Sedang">Sedang</option>
                                    <option value="Berat">Berat</option>
                                    <option value="Sangat Berat">Sangat Berat</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Poin</label>
                                <input 
                                    type="number"
                                    value={data.points}
                                    onChange={e => setData('points', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
                                    min="1"
                                    required
                                />
                                {errors.points && <p className="text-sm text-red-600 mt-1">{errors.points}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal & Waktu</label>
                            <div className="flex gap-2">
                                <input 
                                    type="datetime-local"
                                    value={data.violation_date}
                                    onChange={e => setData('violation_date', e.target.value)}
                                    className="w-full rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500 bg-gray-50"
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => setData('violation_date', nowLocal)}
                                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg whitespace-nowrap font-medium transition-colors border border-gray-200"
                                >
                                    Waktu Saat Ini
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan / Kronologi <span className="text-gray-400 font-normal">(Opsional)</span></label>
                            <textarea 
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className="w-full rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
                                rows={3}
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
                                className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {editingId ? 'Simpan Perubahan' : 'Simpan Pelanggaran'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Modal Konfirmasi Selesai */}
            <Modal show={confirmingResolve !== null} onClose={() => setConfirmingResolve(null)} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Selesaikan Pelanggaran</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Masukkan bentuk penyelesaian atau kegiatan yang dilakukan santri untuk menghapus pelanggaran ini.
                    </p>
                    <form onSubmit={executeResolve}>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bentuk Penyelesaian / Kegiatan</label>
                            <textarea 
                                value={resolveData.punishment}
                                onChange={e => setResolveData('punishment', e.target.value)}
                                className="w-full rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                                rows={3}
                                placeholder="Cth: Menghafal Surat Yasin 1x, Menyapu Halaman, dll..."
                                required
                            ></textarea>
                            {resolveErrors.punishment && <p className="text-sm text-red-600 mt-1">{resolveErrors.punishment}</p>}
                        </div>
                        <div className="flex justify-end gap-3">
                            <button 
                                type="button"
                                onClick={() => setConfirmingResolve(null)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                            >
                                Batal
                            </button>
                            <button 
                                type="submit"
                                disabled={resolving}
                                className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors font-medium disabled:opacity-50"
                            >
                                Simpan Penyelesaian
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Modal Detail Santri */}
            <Modal show={detailModalOpen} onClose={() => setDetailModalOpen(false)} maxWidth="2xl">
                <div className="p-6 max-h-[85vh] flex flex-col">
                    {isLoadingDetail ? (
                        <div className="py-20 flex justify-center items-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600"></div>
                        </div>
                    ) : detailData && (
                        <>
                            {/* Header */}
                            <div className="flex items-start justify-between pb-6 border-b border-gray-100 shrink-0">
                                <div className="flex items-center gap-4">
                                    {detailData.student.photo ? (
                                        <img src={`/storage/${detailData.student.photo}`} alt={detailData.student.name} className="w-16 h-16 rounded-full object-cover shadow-sm border border-gray-100" />
                                    ) : (
                                        <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl shrink-0 shadow-sm
                                            ${detailData.student.gender === 'putra' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}
                                        >
                                            {detailData.student.name.substring(0, 2).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 leading-tight">{detailData.student.name}</h2>
                                        <div className="text-sm text-gray-500 mt-1">{detailData.student.nis} • {detailData.student.gender === 'putra' ? 'Putra' : 'Putri'}</div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <button onClick={() => setDetailModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                    <button 
                                        onClick={() => handleStudentExport(detailData.student.id)}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-semibold border border-green-200 transition-colors"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        Export Excel
                                    </button>
                                </div>
                            </div>

                            {/* Summary Cards */}
                            <div className="grid grid-cols-2 gap-4 py-4 shrink-0">
                                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                                    <div className="text-sm font-medium text-red-800 mb-1">Total Poin Pelanggaran</div>
                                    <div className="text-3xl font-black text-red-600">{detailData.total_points}</div>
                                </div>
                                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                                    <div className="text-sm font-medium text-orange-800 mb-1">Belum Diselesaikan</div>
                                    <div className="text-3xl font-black text-orange-600">
                                        {detailData.violations.filter((v: any) => !v.is_resolved).length}
                                    </div>
                                </div>
                            </div>

                            {/* Resolve All Button */}
                            {detailData.violations.some((v: any) => !v.is_resolved) && (
                                <div className="pb-4 shrink-0">
                                    <button
                                        onClick={() => {
                                            setResolveAllData('student_id', String(detailData.student.id));
                                            setResolveAllData('punishment', '');
                                            setResolveAllOpen(true);
                                        }}
                                        className="w-full py-2.5 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl shadow-sm hover:shadow-md transition-all text-sm flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Selesaikan Semua Pelanggaran Sekaligus
                                    </button>
                                </div>
                            )}

                            {/* Violations List */}
                            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                                <h3 className="font-bold text-gray-800 mb-3 sticky top-0 bg-white py-2 z-10">Daftar Riwayat Pelanggaran</h3>
                                {detailData.violations.length === 0 ? (
                                    <div className="text-center py-10 text-gray-400">
                                        <ShieldAlert className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                        <p>Santri ini belum memiliki riwayat pelanggaran.</p>
                                    </div>
                                ) : (
                                    detailData.violations.map((v: any) => {
                                        const overdue = !v.is_resolved && isOverdue(v.violation_date);
                                        return (
                                            <div key={v.id} className={`p-4 rounded-xl border ${v.is_resolved ? 'bg-gray-50 border-gray-100 opacity-75' : overdue ? 'bg-red-50/30 border-red-200' : 'bg-white border-gray-200 shadow-sm'}`}>
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                                                                ${v.category === 'Ringan' ? 'bg-yellow-100 text-yellow-800' : 
                                                                  v.category === 'Sedang' ? 'bg-orange-100 text-orange-800' : 
                                                                  'bg-red-100 text-red-800'}`}
                                                            >
                                                                {v.category}
                                                            </span>
                                                            <span className="font-black text-red-600 text-xs bg-red-100 px-2 py-0.5 rounded">-{v.points} Poin</span>
                                                            {overdue && (
                                                                <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded animate-pulse">
                                                                    <Clock className="w-3 h-3" /> Melewati Batas Waktu 7 Hari
                                                                </span>
                                                            )}
                                                        </div>
                                                        <h4 className="font-bold text-gray-900 text-base">{v.violation_name}</h4>
                                                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                                                            <Clock className="w-3.5 h-3.5" />
                                                            {new Date(v.violation_date).toLocaleString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })} WIB
                                                        </div>
                                                    </div>
                                                    
                                                    {v.is_resolved ? (
                                                        <div className="flex flex-col items-end gap-2">
                                                            <span className="inline-flex items-center gap-1.5 text-xs text-green-700 bg-green-100 px-2.5 py-1 rounded-lg font-bold">
                                                                <CheckCircle className="w-4 h-4" /> Selesai
                                                            </span>
                                                            <button 
                                                                onClick={() => setConfirmingDelete(v.id)}
                                                                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-lg shadow-sm border border-red-200 transition-colors"
                                                            >
                                                                Hapus
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-end gap-2">
                                                            <span className="inline-flex items-center gap-1.5 text-xs text-orange-700 bg-orange-100 px-2.5 py-1 rounded-lg font-bold">
                                                                <AlertTriangle className="w-4 h-4" /> Belum
                                                            </span>
                                                            <div className="flex gap-2">
                                                                <button 
                                                                    onClick={() => setConfirmingResolve(v.id)}
                                                                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
                                                                >
                                                                    Selesaikan
                                                                </button>
                                                                <button 
                                                                    onClick={() => setConfirmingDelete(v.id)}
                                                                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-lg shadow-sm border border-red-200 transition-colors"
                                                                >
                                                                    Hapus
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {v.description && (
                                                    <div className="text-sm text-gray-600 bg-gray-50 p-2.5 rounded-lg mb-2">
                                                        <span className="font-semibold block mb-0.5 text-xs text-gray-400">Kronologi:</span>
                                                        {v.description}
                                                    </div>
                                                )}

                                                {v.is_resolved && v.punishment && (
                                                    <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-green-800 bg-green-50 p-3 rounded-lg flex gap-2">
                                                        <CheckCircle className="w-5 h-5 shrink-0 text-green-600" />
                                                        <div>
                                                            <span className="font-bold block text-green-900 mb-0.5">Diselesaikan dengan Kegiatan:</span>
                                                            {v.punishment}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </>
                    )}
                </div>
            </Modal>

            {/* Modal Konfirmasi Hapus */}
            <Modal show={confirmingDelete !== null} onClose={() => setConfirmingDelete(null)} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-red-600 mb-4">Hapus Pelanggaran</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Data pelanggaran yang dihapus tidak dapat dikembalikan. Lanjutkan menghapus?
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

            {/* Modal Selesaikan Semua */}
            <Modal show={resolveAllOpen} onClose={() => setResolveAllOpen(false)} maxWidth="md">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 bg-green-100 rounded-xl text-green-700">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Selesaikan Semua Pelanggaran</h2>
                            <p className="text-sm text-gray-500">Semua pelanggaran yang belum selesai akan ditandai selesai.</p>
                        </div>
                    </div>
                    <form onSubmit={executeResolveAll}>
                        <input type="hidden" value={resolveAllData.student_id} />
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Bentuk Hukuman / Kegiatan Penyelesaian
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <textarea
                                value={resolveAllData.punishment}
                                onChange={e => setResolveAllData('punishment', e.target.value)}
                                className="w-full rounded-xl border-gray-300 focus:border-green-500 focus:ring-green-500"
                                rows={4}
                                placeholder="Cth: Menghapal Surat Yasin 3x, Kerja Bakti Masjid selama 3 hari, dll (Hukuman paling berat)..."
                                required
                            ></textarea>
                            {resolveAllErrors.punishment && <p className="text-sm text-red-600 mt-1">{resolveAllErrors.punishment}</p>}
                            <p className="text-xs text-gray-400 mt-2">💡 Tuliskan hukuman terberat yang mencakup semua pelanggaran yang ada.</p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setResolveAllOpen(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={resolvingAll}
                                className="px-5 py-2 text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg transition-all font-bold shadow-sm disabled:opacity-50"
                            >
                                Selesaikan Semua
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
