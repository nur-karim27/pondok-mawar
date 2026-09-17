import React, { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useForm, router } from '@inertiajs/react';
import { Student } from '@/types';
import { Trash2, Edit2, Plus, Clock } from 'lucide-react';

interface Props {
    show: boolean;
    onClose: () => void;
    student: Student | null;
}

export default function AcademicHistoryModal({ show, onClose, student }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const SCHOOL_LEVELS = [
        'SD/MI Kelas 1', 'SD/MI Kelas 2', 'SD/MI Kelas 3', 'SD/MI Kelas 4', 'SD/MI Kelas 5', 'SD/MI Kelas 6',
        'SMP/MTs Kelas 7', 'SMP/MTs Kelas 8', 'SMP/MTs Kelas 9',
        'SMA/MA/SMK Kelas 10', 'SMA/MA/SMK Kelas 11', 'SMA/MA/SMK Kelas 12'
    ];
    const QURAN_LEVELS = [
        'Jilid 1', 'Jilid 2', 'Jilid 3', 'Jilid 4', 'Jilid 5', 'Jilid 6', 'Al-Quran', 
        'Diniyah Kelas 1', 'Diniyah Kelas 2', 'Diniyah Kelas 3', 'Diniyah Kelas 4', 'Diniyah Kelas 5', 'Diniyah Kelas 6'
    ];

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        student_id: '',
        academic_year: '',
        school_level: '',
        quran_level: '',
        status: 'Naik Kelas',
        notes: '',
    });

    // Autocomplete states
    const [schoolSearch, setSchoolSearch] = useState('');
    const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
    const [quranSearch, setQuranSearch] = useState('');
    const [showQuranDropdown, setShowQuranDropdown] = useState(false);

    useEffect(() => {
        if (show && student) {
            setData('student_id', student.id.toString());
            // Pre-fill next academic year if not editing
            if (!isEditing) {
                const currentYear = new Date().getFullYear();
                setData('academic_year', `${currentYear}/${currentYear + 1}`);
            }
        }
    }, [show, student, isEditing]);

    const handleEdit = (hist: any) => {
        setIsEditing(true);
        setEditingId(hist.id);
        setData({
            student_id: student?.id.toString() || '',
            academic_year: hist.academic_year || '',
            school_level: hist.school_level || '',
            quran_level: hist.quran_level || '',
            status: hist.status || 'Naik Kelas',
            notes: hist.notes || '',
        });
        setSchoolSearch(hist.school_level || '');
        setQuranSearch(hist.quran_level || '');
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus riwayat ini?')) {
            router.delete(route('academic-histories.destroy', id), {
                preserveScroll: true,
                onSuccess: () => {
                    if (isEditing && editingId === id) cancelEdit();
                }
            });
        }
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditingId(null);
        reset();
        clearErrors();
        setSchoolSearch('');
        setQuranSearch('');
        if (student) {
            const currentYear = new Date().getFullYear();
            setData('academic_year', `${currentYear}/${currentYear + 1}`);
            setData('student_id', student.id.toString());
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEditing && editingId) {
            put(route('academic-histories.update', editingId), {
                preserveScroll: true,
                onSuccess: () => cancelEdit(),
            });
        } else {
            post(route('academic-histories.store'), {
                preserveScroll: true,
                onSuccess: () => cancelEdit(),
            });
        }
    };

    if (!student) return null;

    const filteredSchools = SCHOOL_LEVELS.filter(s => s.toLowerCase().includes(schoolSearch.toLowerCase()));
    const filteredQuran = QURAN_LEVELS.filter(q => q.toLowerCase().includes(quranSearch.toLowerCase()));

    return (
        <Modal show={show} onClose={onClose} maxWidth="3xl">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Riwayat Kenaikan Kelas</h2>
                        <p className="text-sm text-gray-500 mt-1">Santri: <span className="font-semibold">{student.name}</span></p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Form Section */}
                    <div className="lg:col-span-1 bg-gray-50 p-4 rounded-xl border border-gray-100 h-fit">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            {isEditing ? <Edit2 className="w-4 h-4 text-blue-500" /> : <Plus className="w-4 h-4 text-green-500" />}
                            {isEditing ? 'Edit Riwayat' : 'Tambah Riwayat'}
                        </h3>
                        
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="academic_year" value="Tahun Ajaran *" />
                                <TextInput
                                    id="academic_year"
                                    placeholder="Contoh: 2024/2025"
                                    className="mt-1 block w-full text-sm"
                                    value={data.academic_year}
                                    onChange={(e) => setData('academic_year', e.target.value)}
                                    required
                                />
                                <InputError message={errors.academic_year} className="mt-2" />
                            </div>

                            <div className="relative">
                                <InputLabel htmlFor="school_level" value="Tingkat Akademik" />
                                <TextInput
                                    id="school_level"
                                    className="mt-1 block w-full text-sm"
                                    placeholder="Contoh: SMA/MA/SMK Kelas 11"
                                    value={schoolSearch}
                                    onChange={(e) => {
                                        setSchoolSearch(e.target.value);
                                        setData('school_level', e.target.value);
                                        setShowSchoolDropdown(true);
                                    }}
                                    onFocus={() => setShowSchoolDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowSchoolDropdown(false), 200)}
                                    autoComplete="off"
                                />
                                {showSchoolDropdown && filteredSchools.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                        {filteredSchools.map(s => (
                                            <div
                                                key={s}
                                                className="px-4 py-2 hover:bg-primary/10 cursor-pointer text-sm font-medium text-gray-700"
                                                onClick={() => {
                                                    setData('school_level', s);
                                                    setSchoolSearch(s);
                                                    setShowSchoolDropdown(false);
                                                }}
                                            >
                                                {s}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <InputError message={errors.school_level} className="mt-2" />
                            </div>

                            <div className="relative">
                                <InputLabel htmlFor="quran_level" value="Tingkat Ngaji" />
                                <TextInput
                                    id="quran_level"
                                    className="mt-1 block w-full text-sm"
                                    placeholder="Contoh: Diniyah Kelas 4"
                                    value={quranSearch}
                                    onChange={(e) => {
                                        setQuranSearch(e.target.value);
                                        setData('quran_level', e.target.value);
                                        setShowQuranDropdown(true);
                                    }}
                                    onFocus={() => setShowQuranDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowQuranDropdown(false), 200)}
                                    autoComplete="off"
                                />
                                {showQuranDropdown && filteredQuran.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                                        {filteredQuran.map(q => (
                                            <div
                                                key={q}
                                                className="px-4 py-2 hover:bg-primary/10 cursor-pointer text-sm font-medium text-gray-700"
                                                onClick={() => {
                                                    setData('quran_level', q);
                                                    setQuranSearch(q);
                                                    setShowQuranDropdown(false);
                                                }}
                                            >
                                                {q}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <InputError message={errors.quran_level} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="status" value="Status *" />
                                <select
                                    id="status"
                                    className="mt-1 block w-full border-gray-300 focus:border-primary focus:ring-primary rounded-md shadow-sm text-sm"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    required
                                >
                                    <option value="Naik Kelas">Naik Kelas</option>
                                    <option value="Tinggal Kelas">Tinggal Kelas</option>
                                    <option value="Lulus">Lulus</option>
                                </select>
                                <InputError message={errors.status} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="notes" value="Catatan (Opsional)" />
                                <textarea
                                    id="notes"
                                    rows={2}
                                    className="mt-1 block w-full border-gray-300 focus:border-primary focus:ring-primary rounded-md shadow-sm text-sm"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                ></textarea>
                                <InputError message={errors.notes} className="mt-2" />
                            </div>

                            <div className="flex gap-2 pt-2">
                                {isEditing && (
                                    <SecondaryButton onClick={cancelEdit} className="w-full justify-center text-xs" disabled={processing}>Batal</SecondaryButton>
                                )}
                                <PrimaryButton className="w-full justify-center text-xs bg-primary" disabled={processing}>
                                    {processing ? '...' : isEditing ? 'Update' : 'Simpan'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    {/* Table Section */}
                    <div className="lg:col-span-2">
                        {(!student.academic_histories || student.academic_histories.length === 0) ? (
                            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col justify-center min-h-[300px]">
                                <Clock className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                                <h3 className="text-sm font-medium text-gray-900">Belum ada riwayat</h3>
                                <p className="text-xs text-gray-500 mt-1">Tambahkan riwayat kenaikan kelas pertama.</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thn Ajaran</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tingkat</th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {student.academic_histories.map((hist: any) => (
                                            <tr key={hist.id} className={editingId === hist.id ? 'bg-blue-50' : 'hover:bg-gray-50'}>
                                                <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                                                    {hist.academic_year}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    <p className="text-xs font-semibold text-gray-800">{hist.school_level || '-'}</p>
                                                    <p className="text-xs mt-0.5">{hist.quran_level || '-'}</p>
                                                    {hist.notes && <p className="text-[10px] text-gray-400 italic mt-1 line-clamp-1">{hist.notes}</p>}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-[10px] leading-5 font-semibold rounded-full ${
                                                        hist.status === 'Naik Kelas' ? 'bg-green-100 text-green-800' : 
                                                        hist.status === 'Lulus' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {hist.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleEdit(hist)}
                                                            className="text-indigo-600 hover:text-indigo-900 p-1 bg-indigo-50 hover:bg-indigo-100 rounded transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(hist.id)}
                                                            className="text-red-600 hover:text-red-900 p-1 bg-red-50 hover:bg-red-100 rounded transition-colors"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100">
                    <SecondaryButton onClick={onClose}>
                        Tutup
                    </SecondaryButton>
                </div>
            </div>
        </Modal>
    );
}
