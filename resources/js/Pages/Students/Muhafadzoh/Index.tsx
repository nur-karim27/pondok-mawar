import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Plus, Edit, Trash2, BookOpen, Calendar, Search, FileDown, ChevronRight, Users, User, Download } from 'lucide-react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import { format } from 'date-fns';

export default function MuhafadzohIndex({ auth, studentsPaginated, students, rooms, filters, currentGender }: any) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedStudentForHistory, setSelectedStudentForHistory] = useState<any>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [studentSearch, setStudentSearch] = useState('');
    const [showStudentDropdown, setShowStudentDropdown] = useState(false);
    
    // Dropdown for Type & Grade
    const [typeSearch, setTypeSearch] = useState('');
    const [showTypeDropdown, setShowTypeDropdown] = useState(false);
    const [gradeSearch, setGradeSearch] = useState('');
    const [showGradeDropdown, setShowGradeDropdown] = useState(false);

    const presetTypes = ['Hafalan Baru', 'Murojaah', 'Ziyadah', 'Ujian'];
    const presetGrades = ['Mumtaz', 'Jayyid Jiddan', 'Jayyid', 'Maqbul', 'Rasib'];

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        student_id: '',
        date: format(new Date(), "yyyy-MM-dd"),
        type: '',
        tester_name: '',
        memorization_name: '',
        target: '',
        grade: '',
        notes: '',
    });

    const [search, setSearch] = useState(filters?.search || '');
    const [roomId, setRoomId] = useState(filters?.room_id || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(route('muhafadzoh.index'), { search, room_id: roomId, gender: currentGender }, { preserveState: true });
    };

    const handleGenderTab = (gender: string) => {
        router.get(route('muhafadzoh.index'), { gender, search, room_id: roomId }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const handleExport = () => {
        const url = new URL(route('muhafadzoh.export-rekap'), window.location.origin);
        if (currentGender !== 'semua') url.searchParams.append('gender', currentGender);
        window.location.href = url.toString();
    };

    const openModal = (muhafadzoh?: any, preselectedStudent?: any) => {
        clearErrors();
        if (muhafadzoh) {
            setEditingId(muhafadzoh.id);
            setData({
                student_id: muhafadzoh.student_id,
                date: format(new Date(), "yyyy-MM-dd"), // user requested today's date for edit too
                type: muhafadzoh.type || '',
                tester_name: muhafadzoh.tester_name || '',
                memorization_name: muhafadzoh.memorization_name || '',
                target: muhafadzoh.target || '',
                grade: muhafadzoh.grade || '',
                notes: muhafadzoh.notes || '',
            });
            setTypeSearch(muhafadzoh.type || '');
            setGradeSearch(muhafadzoh.grade || '');
            const std = students?.find((s: any) => s.id === muhafadzoh.student_id);
            if (std) {
                setStudentSearch(`${std.name} (${std.nis})`);
            }
        } else {
            setEditingId(null);
            setTypeSearch('');
            setGradeSearch('');
            
            setData({
                student_id: preselectedStudent ? preselectedStudent.id : '',
                date: format(new Date(), "yyyy-MM-dd"), // default to today
                type: '',
                tester_name: '',
                memorization_name: '',
                target: '',
                grade: '',
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
            setTypeSearch('');
            setGradeSearch('');
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
            put(route('muhafadzoh.update', editingId), {
                onSuccess: () => {
                    closeModal();
                    if (selectedStudentForHistory) {
                        router.reload({ only: ['studentsPaginated'] });
                    }
                },
            });
        } else {
            post(route('muhafadzoh.store'), {
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
            destroy(route('muhafadzoh.destroy', editingId), {
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
    
    const filteredTypesForDropdown = presetTypes.filter(t => 
        t.toLowerCase().includes(typeSearch.toLowerCase())
    );

    const filteredGradesForDropdown = presetGrades.filter(c => 
        c.toLowerCase().includes(gradeSearch.toLowerCase())
    );

    const selectType = (type: string) => {
        setData('type', type);
        setTypeSearch(type);
        setShowTypeDropdown(false);
    };

    const selectGrade = (grade: string) => {
        setData('grade', grade);
        setGradeSearch(grade);
        setShowGradeDropdown(false);
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-2xl font-extrabold leading-tight text-gray-900 tracking-tight">Evaluasi Muhafadzoh</h2>}>
            <Head title="Evaluasi Muhafadzoh" />

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
                                    <BookOpen className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Data Evaluasi Muhafadzoh</h3>
                                    <p className="text-sm text-gray-500">Kelola riwayat hafalan dan setoran santri</p>
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
                                        <th className="px-6 py-4 font-bold text-gray-900 text-center">Total Evaluasi</th>
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
                                                    student.muhafadzohs_count > 0 
                                                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                                                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                                                }`}>
                                                    {student.muhafadzohs_count} Evaluasi
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
                                                    <BookOpen className="w-12 h-12 text-gray-300" />
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
                                            onClick={() => link.url && router.get(link.url, { search }, { preserveState: true })}
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
                                <p className="text-sm text-gray-500 mt-1">NIS: {selectedStudentForHistory?.nis} • Total: {selectedStudentForHistory?.muhafadzohs_count} Evaluasi</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {selectedStudentForHistory && (
                                <a
                                    href={route('muhafadzoh.export', selectedStudentForHistory.id)}
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
                    {selectedStudentForHistory?.muhafadzohs?.length > 0 ? (
                        <div className="space-y-4">
                            {selectedStudentForHistory.muhafadzohs.map((muhafadzoh: any) => {
                                const dateObj = new Date(muhafadzoh.date);
                                const formattedDate = !isNaN(dateObj.getTime()) ? dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : muhafadzoh.date;
                                
                                return (
                                    <div key={muhafadzoh.id} className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                                        <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600">
                                                    <BookOpen className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-lg">{muhafadzoh.memorization_name}</h4>
                                                    <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                        <Calendar className="w-3.5 h-3.5" /> {formattedDate}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 w-full sm:w-auto">
                                                <button 
                                                    onClick={() => openModal(muhafadzoh, selectedStudentForHistory)}
                                                    className="flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg transition-colors"
                                                >
                                                    <Edit className="w-3.5 h-3.5" /> Edit
                                                </button>
                                                <button 
                                                    onClick={() => openDeleteModal(muhafadzoh.id)}
                                                    className="flex-1 sm:flex-none inline-flex justify-center items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" /> Hapus
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Penguji</p>
                                                <p className="text-sm font-medium text-gray-900">{muhafadzoh.tester_name || '-'}</p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Kategori</p>
                                                <p className="text-sm font-medium text-gray-900">{muhafadzoh.type}</p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Target</p>
                                                <p className="text-sm font-medium text-gray-900">{muhafadzoh.target}</p>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Nilai</p>
                                                <p className="text-sm font-bold text-primary">{muhafadzoh.grade}</p>
                                            </div>
                                        </div>

                                        {muhafadzoh.notes && (
                                            <div className="mt-4 border-t pt-3">
                                                <p className="text-sm text-gray-600 italic">
                                                    " {muhafadzoh.notes} "
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-lg font-bold text-gray-900 mb-1">Belum Ada Evaluasi</h3>
                            <p className="text-sm text-gray-500 mb-4">Santri ini belum memiliki riwayat evaluasi muhafadzoh.</p>
                            <button
                                onClick={() => openModal(null, selectedStudentForHistory)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
                            >
                                <Plus className="w-4 h-4" /> Tambah Evaluasi
                            </button>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Form Modal (Create/Edit) */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="xl">
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b bg-gray-50">
                        <h2 className="text-xl font-bold text-gray-900">
                            {editingId ? 'Edit Evaluasi Muhafadzoh' : 'Tambah Evaluasi Muhafadzoh'}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Isi formulir di bawah ini dengan detail evaluasi.</p>
                    </div>

                    <div className="p-6 space-y-5">
                        <div className="relative">
                            <InputLabel htmlFor="student_search" value="Cari Nama Santri" />
                            <input
                                id="student_search"
                                type="text"
                                value={studentSearch}
                                onChange={e => {
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <InputLabel htmlFor="type" value="Kategori" />
                                <input 
                                    type="text"
                                    value={typeSearch}
                                    onChange={e => {
                                        setTypeSearch(e.target.value);
                                        setData('type', e.target.value);
                                        setShowTypeDropdown(true);
                                    }}
                                    onFocus={() => setShowTypeDropdown(true)}
                                    onBlur={() => {
                                        setTimeout(() => setShowTypeDropdown(false), 200);
                                    }}
                                    className="mt-1 block w-full rounded-xl border-gray-300 focus:border-primary focus:ring-primary shadow-sm"
                                    placeholder="Ketik atau pilih kategori..."
                                    required
                                />
                                {showTypeDropdown && filteredTypesForDropdown.length > 0 && (
                                    <ul className="absolute z-50 bottom-full mb-1 max-h-48 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border-l-[6px] border-l-primary">
                                        {filteredTypesForDropdown.map((t: string) => (
                                            <li 
                                                key={t} 
                                                className="relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-green-50 text-gray-900 cursor-pointer transition-colors"
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    selectType(t);
                                                }}
                                            >
                                                <span className="font-medium block truncate">{t}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <InputError message={errors.type} className="mt-2" />
                            </div>
                            
                            <div>
                                <InputLabel htmlFor="memorization_name" value="Nama Hafalan / Kitab" />
                                <TextInput
                                    id="memorization_name"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.memorization_name}
                                    onChange={e => setData('memorization_name', e.target.value)}
                                    placeholder="Contoh: Juz 30 / Alfiyah"
                                    required
                                />
                                <InputError message={errors.memorization_name} className="mt-2" />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="tester_name" value="Nama Penguji / Musyrif" />
                                <TextInput
                                    id="tester_name"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.tester_name}
                                    onChange={e => setData('tester_name', e.target.value)}
                                    placeholder="Contoh: Ust. Ahmad"
                                />
                                <InputError message={errors.tester_name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="target" value="Capaian / Target" />
                                <TextInput
                                    id="target"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.target}
                                    onChange={e => setData('target', e.target.value)}
                                    placeholder="Contoh: Surah An-Naba' / Bait 1-50"
                                    required
                                />
                                <InputError message={errors.target} className="mt-2" />
                            </div>
                            
                            <div className="relative">
                                <InputLabel htmlFor="grade" value="Nilai" />
                                <input 
                                    type="text"
                                    value={gradeSearch}
                                    onChange={e => {
                                        setGradeSearch(e.target.value);
                                        setData('grade', e.target.value);
                                        setShowGradeDropdown(true);
                                    }}
                                    onFocus={() => setShowGradeDropdown(true)}
                                    onBlur={() => {
                                        setTimeout(() => setShowGradeDropdown(false), 200);
                                    }}
                                    className="mt-1 block w-full rounded-xl border-gray-300 focus:border-primary focus:ring-primary shadow-sm"
                                    placeholder="Ketik atau pilih nilai..."
                                    required
                                />
                                {showGradeDropdown && filteredGradesForDropdown.length > 0 && (
                                    <ul className="absolute z-50 bottom-full mb-1 max-h-48 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm border-l-[6px] border-l-primary">
                                        {filteredGradesForDropdown.map((c: string) => (
                                            <li 
                                                key={c} 
                                                className="relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-green-50 text-gray-900 cursor-pointer transition-colors"
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    selectGrade(c);
                                                }}
                                            >
                                                <span className="font-medium block truncate">{c}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <InputError message={errors.grade} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="date" value="Tanggal Evaluasi" />
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
                            <InputLabel htmlFor="notes" value="Catatan (Opsional)" />
                            <textarea
                                id="notes"
                                className="mt-1 block w-full border-gray-300 focus:border-primary focus:ring-primary rounded-xl shadow-sm"
                                rows={3}
                                value={data.notes}
                                onChange={e => setData('notes', e.target.value)}
                                placeholder="Tambahkan catatan jika dirasa perlu..."
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
                        Apakah Anda yakin ingin menghapus data Evaluasi ini? Data yang dihapus tidak dapat dikembalikan.
                    </p>
                    <div className="mt-6 flex justify-center gap-3">
                        <SecondaryButton onClick={closeDeleteModal}>Batal</SecondaryButton>
                        <DangerButton onClick={handleDelete} disabled={processing}>
                            Ya, Hapus
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
