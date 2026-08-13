import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ShieldAlert, Plus, Search, CheckCircle, AlertTriangle } from 'lucide-react';
import Modal from '@/Components/Modal';

export default function ViolationsIndex({ violations, students }: any) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const { data, setData, post, put, processing, reset, errors } = useForm({
        student_id: '',
        violation_name: '',
        category: 'Ringan',
        points: '',
        description: '',
        violation_date: new Date().toLocaleDateString('en-CA'),
    });

    const submit = (e: any) => {
        e.preventDefault();
        if (editingId) {
            put(route('pelanggaran.update', editingId), {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    reset();
                },
            });
        } else {
            post(route('pelanggaran.store'), {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    reset();
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
            violation_date: v.violation_date.split('T')[0],
        });
        setStudentSearch(`${v.student.name} (${v.student.nis})`);
        setIsCreateModalOpen(true);
    };

    const [confirmingResolve, setConfirmingResolve] = useState<number | null>(null);
    const [confirmingDelete, setConfirmingDelete] = useState<number | null>(null);

    const executeResolve = () => {
        if (confirmingResolve) {
            router.post(route('pelanggaran.resolve', confirmingResolve));
            setConfirmingResolve(null);
        }
    };

    const executeDelete = () => {
        if (confirmingDelete) {
            router.delete(route('pelanggaran.destroy', confirmingDelete));
            setConfirmingDelete(null);
        }
    };

    const filteredViolations = violations.data.filter((v: any) => 
        v.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.violation_name.toLowerCase().includes(searchTerm.toLowerCase())
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
            header={<h2 className="text-xl font-bold leading-tight text-gray-800">Pelanggaran & Poin Santri</h2>}
        >
            <Head title="Pelanggaran Santri" />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Data Pelanggaran</h3>
                            <p className="text-sm text-gray-500">Kelola catatan pelanggaran dan poin kedisiplinan santri</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input 
                                type="text"
                                placeholder="Cari data pelanggaran..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full sm:w-64"
                            />
                        </div>
                        <button 
                            onClick={() => {
                                setEditingId(null);
                                reset();
                                setIsCreateModalOpen(true);
                                setStudentSearch('');
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium whitespace-nowrap"
                        >
                            <Plus className="w-5 h-5" />
                            Catat Pelanggaran
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                                <th className="px-6 py-4 font-medium w-1/4">Santri</th>
                                <th className="px-6 py-4 font-medium w-1/3">Pelanggaran</th>
                                <th className="px-6 py-4 font-medium whitespace-nowrap">Kategori</th>
                                <th className="px-6 py-4 font-medium whitespace-nowrap">Poin</th>
                                <th className="px-6 py-4 font-medium whitespace-nowrap">Tanggal</th>
                                <th className="px-6 py-4 font-medium whitespace-nowrap">Status</th>
                                <th className="px-6 py-4 font-medium text-right whitespace-nowrap">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredViolations.map((v: any) => (
                                <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900 break-words">{v.student.name}</div>
                                        <div className="text-sm text-gray-500">NIS: {v.student.nis}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-900 break-words">{v.violation_name}</div>
                                        {v.description && <div className="text-sm text-gray-500 break-words mt-1">{v.description}</div>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap
                                            ${v.category === 'Ringan' ? 'bg-yellow-100 text-yellow-800' : 
                                              v.category === 'Sedang' ? 'bg-orange-100 text-orange-800' : 
                                              'bg-red-100 text-red-800'}`}
                                        >
                                            {v.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-red-600">-{v.points}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                        {new Date(v.violation_date).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {v.is_resolved ? (
                                            <span className="inline-flex items-center gap-1 text-sm text-green-600 font-medium">
                                                <CheckCircle className="w-4 h-4" /> Santri sudah dihukum
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-sm text-amber-600 font-medium">
                                                <AlertTriangle className="w-4 h-4" /> Santri belum diberikan hukuman
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex flex-col items-end gap-2">
                                            {!v.is_resolved && (
                                                <button 
                                                    onClick={() => setConfirmingResolve(v.id)}
                                                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                                                >
                                                    Selesaikan
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => handleEdit(v)}
                                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => setConfirmingDelete(v.id)}
                                                className="text-sm text-red-600 hover:text-red-700 font-medium"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredViolations.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        Tidak ada data pelanggaran ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Tambah Pelanggaran */}
            <Modal show={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-6">
                        {editingId ? 'Edit Data Pelanggaran' : 'Catat Pelanggaran Baru'}
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                            <input 
                                type="date"
                                value={data.violation_date}
                                onChange={e => setData('violation_date', e.target.value)}
                                className="w-full rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500 bg-gray-50"
                                required
                            />
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
            <Modal show={confirmingResolve !== null} onClose={() => setConfirmingResolve(null)} maxWidth="sm">
                <div className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Selesaikan Pelanggaran</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Apakah Anda yakin ingin menandai pelanggaran ini sebagai sudah dihukum/diselesaikan?
                    </p>
                    <div className="flex justify-end gap-3">
                        <button 
                            onClick={() => setConfirmingResolve(null)}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Batal
                        </button>
                        <button 
                            onClick={executeResolve}
                            className="px-4 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                        >
                            Ya, Selesaikan
                        </button>
                    </div>
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
        </AuthenticatedLayout>
    );
}
