import { FormEvent, useEffect, useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useForm } from '@inertiajs/react';
import { Student, Room, Guardian } from '@/types';

interface Props {
    show: boolean;
    onClose: () => void;
    student?: Student | null;
    dormitories: any[];
    rooms: any[];
    guardians: Guardian[];
}

export default function StudentFormModal({ show, onClose, student, dormitories, rooms, guardians }: Props) {
    const [activeTab, setActiveTab] = useState<'biodata' | 'akademik'>('biodata');
    const [guardianSearch, setGuardianSearch] = useState('');
    const [showGuardianDropdown, setShowGuardianDropdown] = useState(false);
    
    // Autocomplete states for Asrama & Kamar
    const [selectedDormitoryId, setSelectedDormitoryId] = useState<string>('');
    const [dormitorySearch, setDormitorySearch] = useState('');
    const [showDormitoryDropdown, setShowDormitoryDropdown] = useState(false);
    
    const [roomSearch, setRoomSearch] = useState('');
    const [showRoomDropdown, setShowRoomDropdown] = useState(false);

    // Autocomplete states for Akademik & Non-Akademik
    const [schoolLevelSearch, setSchoolLevelSearch] = useState('');
    const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
    
    const [quranLevelSearch, setQuranLevelSearch] = useState('');
    const [showQuranDropdown, setShowQuranDropdown] = useState(false);

    const SCHOOL_LEVELS = ['SD', 'MI', 'SMP', 'MTs', 'SMA', 'SMK', 'MA', 'Kuliah'];
    const QURAN_LEVELS = ['Jilid 1', 'Jilid 2', 'Jilid 3', 'Jilid 4', 'Jilid 5', 'Jilid 6', 'Al-Quran', 'Kelas 1 Diniyah', 'Kelas 2 Diniyah', 'Kelas 3 Diniyah'];

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        nis: '',
        nisn: '',
        name: '',
        gender: 'putra',
        place_of_birth: '',
        birth_date: '',
        address: '',
        phone: '',
        enrollment_date: new Date().toISOString().split('T')[0],
        graduation_year: '',
        school_level: '',
        quran_level: '',
        status: 'aktif',
        room_id: '',
        guardian_id: '',
        history: '',
        photo: null as File | null,
    });

    useEffect(() => {
        if (student) {
            setData({
                nis: student.nis || '',
                nisn: student.nisn || '',
                name: student.name || '',
                gender: student.gender || 'putra',
                place_of_birth: student.place_of_birth || '',
                birth_date: student.birth_date || '',
                address: student.address || '',
                phone: student.phone || '',
                enrollment_date: student.enrollment_date || new Date().toISOString().split('T')[0],
                graduation_year: student.graduation_year || '',
                school_level: student.school_level || '',
                quran_level: student.quran_level || '',
                status: student.status || 'aktif',
                room_id: student.room_id ? student.room_id.toString() : '',
                guardian_id: student.guardian_id ? student.guardian_id.toString() : '',
                history: student.history || '',
                photo: null,
            });
            
            // Guardian
            const g = guardians.find(g => g.id.toString() === student.guardian_id?.toString());
            setGuardianSearch(g ? g.name : '');
            
            // Room & Dormitory
            if (student.room_id) {
                const room = rooms.find(r => r.id.toString() === student.room_id?.toString());
                if (room) {
                    setRoomSearch(room.name);
                    setSelectedDormitoryId(room.dormitory_id.toString());
                    const dorm = dormitories.find(d => d.id.toString() === room.dormitory_id.toString());
                    if (dorm) setDormitorySearch(dorm.name);
                }
            } else {
                setRoomSearch('');
                setDormitorySearch('');
                setSelectedDormitoryId('');
            }

            // Levels
            setSchoolLevelSearch(student.school_level || '');
            setQuranLevelSearch(student.quran_level || '');

        } else {
            reset();
            setGuardianSearch('');
            setDormitorySearch('');
            setRoomSearch('');
            setSelectedDormitoryId('');
            setSchoolLevelSearch('');
            setQuranLevelSearch('');
        }
        clearErrors();
        setActiveTab('biodata');
        setShowGuardianDropdown(false);
        setShowDormitoryDropdown(false);
        setShowRoomDropdown(false);
        setShowSchoolDropdown(false);
        setShowQuranDropdown(false);
    }, [student, show]);

    const filteredGuardians = guardians.filter(g => 
        g.name.toLowerCase().includes(guardianSearch.toLowerCase())
    );
    const filteredDormitories = dormitories.filter(d => 
        d.name.toLowerCase().includes(dormitorySearch.toLowerCase())
    );
    const availableRooms = rooms.filter(r => selectedDormitoryId === '' || r.dormitory_id.toString() === selectedDormitoryId);
    const filteredRooms = availableRooms.filter(r => 
        r.name.toLowerCase().includes(roomSearch.toLowerCase())
    );
    const filteredSchools = SCHOOL_LEVELS.filter(s => 
        s.toLowerCase().includes(schoolLevelSearch.toLowerCase())
    );
    const filteredQuran = QURAN_LEVELS.filter(q => 
        q.toLowerCase().includes(quranLevelSearch.toLowerCase())
    );

    const submit = (e: FormEvent) => {
        e.preventDefault();
        
        if (student) {
            // Use POST with _method=PUT for file uploads in Laravel
            post(route('kesantrian.update', student.id) + '?_method=PUT', {
                onSuccess: () => onClose(),
            });
        } else {
            post(route('kesantrian.store'), {
                onSuccess: () => onClose(),
            });
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {student ? 'Edit Data Santri' : 'Tambah Santri Baru'}
                </h2>

                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        className={`px-4 py-2 font-medium text-sm ${activeTab === 'biodata' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('biodata')}
                    >
                        Biodata & Wali
                    </button>
                    <button
                        className={`px-4 py-2 font-medium text-sm ${activeTab === 'akademik' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('akademik')}
                    >
                        Asrama & Akademik
                    </button>
                </div>

                <form onSubmit={submit}>
                    {activeTab === 'biodata' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <InputLabel htmlFor="photo" value="Foto Santri" />
                                <input
                                    id="photo"
                                    type="file"
                                    accept="image/*"
                                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                    onChange={(e) => setData('photo', e.target.files ? e.target.files[0] : null)}
                                />
                                {student?.photo && !data.photo && (
                                    <div className="mt-2">
                                        <img src={`/storage/${student.photo}`} alt="Foto Santri" className="w-20 h-20 object-cover rounded-md" />
                                    </div>
                                )}
                                <InputError message={errors.photo} className="mt-2" />
                            </div>

                            <div className="col-span-2">
                                <InputLabel htmlFor="name" value="Nama Lengkap *" />
                                <TextInput
                                    id="name"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="gender" value="Jenis Kelamin *" />
                                <select
                                    id="gender"
                                    className="mt-1 block w-full border-gray-300 focus:border-primary focus:ring-primary rounded-md shadow-sm"
                                    value={data.gender}
                                    onChange={(e) => setData('gender', e.target.value)}
                                    required
                                >
                                    <option value="putra">Putra</option>
                                    <option value="putri">Putri</option>
                                </select>
                                <InputError message={errors.gender} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="phone" value="No. Telepon" />
                                <TextInput
                                    id="phone"
                                    className="mt-1 block w-full"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                />
                                <InputError message={errors.phone} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="place_of_birth" value="Tempat Lahir" />
                                <TextInput
                                    id="place_of_birth"
                                    className="mt-1 block w-full"
                                    value={data.place_of_birth}
                                    onChange={(e) => setData('place_of_birth', e.target.value)}
                                />
                                <InputError message={errors.place_of_birth} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="birth_date" value="Tanggal Lahir" />
                                <TextInput
                                    id="birth_date"
                                    type="date"
                                    className="mt-1 block w-full"
                                    value={data.birth_date}
                                    onChange={(e) => setData('birth_date', e.target.value)}
                                />
                                <InputError message={errors.birth_date} className="mt-2" />
                            </div>

                            <div className="col-span-2">
                                <InputLabel htmlFor="address" value="Alamat Lengkap" />
                                <textarea
                                    id="address"
                                    className="mt-1 block w-full border-gray-300 focus:border-primary focus:ring-primary rounded-md shadow-sm"
                                    rows={3}
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                ></textarea>
                                <InputError message={errors.address} className="mt-2" />
                            </div>

                            <div className="col-span-2">
                                <InputLabel htmlFor="history" value="Riwayat Perjalanan Santri (Opsional)" />
                                <textarea
                                    id="history"
                                    placeholder="Contoh: Santri ini dulunya sekolah di SD Muhammadiyah 1 dan melanjutkan ke sini..."
                                    className="mt-1 block w-full border-gray-300 focus:border-primary focus:ring-primary rounded-md shadow-sm"
                                    rows={3}
                                    value={data.history}
                                    onChange={(e) => setData('history', e.target.value)}
                                ></textarea>
                                <InputError message={errors.history} className="mt-2" />
                            </div>

                            <div className="col-span-2 relative">
                                <InputLabel htmlFor="guardian_id" value="Wali Santri" />
                                <TextInput
                                    id="guardian_search"
                                    className="mt-1 block w-full"
                                    placeholder="Ketik nama wali santri untuk mencari..."
                                    value={guardianSearch}
                                    onChange={(e) => {
                                        setGuardianSearch(e.target.value);
                                        setShowGuardianDropdown(true);
                                        if (e.target.value === '') {
                                            setData('guardian_id', '');
                                        }
                                    }}
                                    onFocus={() => setShowGuardianDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowGuardianDropdown(false), 200)}
                                    autoComplete="off"
                                />
                                {showGuardianDropdown && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                        {filteredGuardians.length > 0 ? filteredGuardians.map(g => (
                                            <div
                                                key={g.id}
                                                className="px-4 py-2 hover:bg-primary/10 cursor-pointer text-sm font-medium text-gray-700"
                                                onClick={() => {
                                                    setData('guardian_id', g.id.toString());
                                                    setGuardianSearch(g.name);
                                                    setShowGuardianDropdown(false);
                                                }}
                                            >
                                                {g.name}
                                            </div>
                                        )) : (
                                            <div className="px-4 py-2 text-sm text-gray-500">Nama wali santri tidak ditemukan.</div>
                                        )}
                                    </div>
                                )}
                                <InputError message={errors.guardian_id} className="mt-2" />
                            </div>
                        </div>
                    )}

                    {activeTab === 'akademik' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="nis" value="Nomor Induk Santri (NIS) *" />
                                <TextInput
                                    id="nis"
                                    className="mt-1 block w-full"
                                    value={data.nis}
                                    onChange={(e) => setData('nis', e.target.value)}
                                    required
                                />
                                <InputError message={errors.nis} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="nisn" value="NISN" />
                                <TextInput
                                    id="nisn"
                                    className="mt-1 block w-full"
                                    value={data.nisn}
                                    onChange={(e) => setData('nisn', e.target.value)}
                                />
                                <InputError message={errors.nisn} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="enrollment_date" value="Tanggal Masuk *" />
                                <TextInput
                                    id="enrollment_date"
                                    type="date"
                                    className="mt-1 block w-full"
                                    value={data.enrollment_date}
                                    onChange={(e) => setData('enrollment_date', e.target.value)}
                                    required
                                />
                                <InputError message={errors.enrollment_date} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="graduation_year" value="Tahun Keluar (Lulus/Boyong)" />
                                <TextInput
                                    id="graduation_year"
                                    type="text"
                                    placeholder="Contoh: 2026"
                                    className="mt-1 block w-full"
                                    value={data.graduation_year}
                                    onChange={(e) => setData('graduation_year', e.target.value)}
                                />
                                <InputError message={errors.graduation_year} className="mt-2" />
                                <p className="text-xs text-gray-500 mt-1">Kosongkan jika santri masih aktif.</p>
                            </div>

                            <div>
                                <InputLabel htmlFor="status" value="Status Santri *" />
                                <select
                                    id="status"
                                    className="mt-1 block w-full border-gray-300 focus:border-primary focus:ring-primary rounded-md shadow-sm"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    required
                                >
                                    <option value="aktif">Aktif</option>
                                    <option value="izin">Izin</option>
                                    <option value="lulus">Lulus</option>
                                    <option value="pindah">Pindah / Boyong</option>
                                </select>
                                <InputError message={errors.status} className="mt-2" />
                            </div>

                            <div className="relative">
                                <InputLabel htmlFor="school_level" value="Tingkat Akademik (Sekolah)" />
                                <TextInput
                                    id="school_level"
                                    className="mt-1 block w-full"
                                    placeholder="Contoh: SMP, SMA, Kuliah..."
                                    value={schoolLevelSearch}
                                    onChange={(e) => {
                                        setSchoolLevelSearch(e.target.value);
                                        setData('school_level', e.target.value);
                                        setShowSchoolDropdown(true);
                                    }}
                                    onFocus={() => setShowSchoolDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowSchoolDropdown(false), 200)}
                                    autoComplete="off"
                                />
                                {showSchoolDropdown && filteredSchools.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                        {filteredSchools.map(s => (
                                            <div
                                                key={s}
                                                className="px-4 py-2 hover:bg-primary/10 cursor-pointer text-sm font-medium text-gray-700"
                                                onClick={() => {
                                                    setData('school_level', s);
                                                    setSchoolLevelSearch(s);
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
                                <InputLabel htmlFor="quran_level" value="Tingkat Non-Akademik (Ngaji)" />
                                <TextInput
                                    id="quran_level"
                                    className="mt-1 block w-full"
                                    placeholder="Contoh: Jilid 1, Al-Quran..."
                                    value={quranLevelSearch}
                                    onChange={(e) => {
                                        setQuranLevelSearch(e.target.value);
                                        setData('quran_level', e.target.value);
                                        setShowQuranDropdown(true);
                                    }}
                                    onFocus={() => setShowQuranDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowQuranDropdown(false), 200)}
                                    autoComplete="off"
                                />
                                {showQuranDropdown && filteredQuran.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                        {filteredQuran.map(q => (
                                            <div
                                                key={q}
                                                className="px-4 py-2 hover:bg-primary/10 cursor-pointer text-sm font-medium text-gray-700"
                                                onClick={() => {
                                                    setData('quran_level', q);
                                                    setQuranLevelSearch(q);
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

                            <div className="relative">
                                <InputLabel htmlFor="dormitory_search" value="Pilih Asrama" />
                                <TextInput
                                    id="dormitory_search"
                                    className="mt-1 block w-full"
                                    placeholder="Ketik nama asrama..."
                                    value={dormitorySearch}
                                    onChange={(e) => {
                                        setDormitorySearch(e.target.value);
                                        setShowDormitoryDropdown(true);
                                        if (e.target.value === '') {
                                            setSelectedDormitoryId('');
                                            setData('room_id', '');
                                            setRoomSearch('');
                                        }
                                    }}
                                    onFocus={() => setShowDormitoryDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowDormitoryDropdown(false), 200)}
                                    autoComplete="off"
                                />
                                {showDormitoryDropdown && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                        {filteredDormitories.length > 0 ? filteredDormitories.map(d => (
                                            <div
                                                key={d.id}
                                                className="px-4 py-2 hover:bg-primary/10 cursor-pointer text-sm font-medium text-gray-700"
                                                onClick={() => {
                                                    setSelectedDormitoryId(d.id.toString());
                                                    setDormitorySearch(d.name);
                                                    setData('room_id', '');
                                                    setRoomSearch('');
                                                    setShowDormitoryDropdown(false);
                                                }}
                                            >
                                                {d.name}
                                            </div>
                                        )) : (
                                            <div className="px-4 py-2 text-sm text-gray-500">Asrama tidak ditemukan.</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="relative">
                                <InputLabel htmlFor="room_search" value="Pilih Kamar" />
                                <TextInput
                                    id="room_search"
                                    className="mt-1 block w-full"
                                    placeholder={selectedDormitoryId ? "Ketik nama kamar..." : "Pilih asrama terlebih dahulu"}
                                    value={roomSearch}
                                    disabled={!selectedDormitoryId}
                                    onChange={(e) => {
                                        setRoomSearch(e.target.value);
                                        setShowRoomDropdown(true);
                                        if (e.target.value === '') {
                                            setData('room_id', '');
                                        }
                                    }}
                                    onFocus={() => setShowRoomDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowRoomDropdown(false), 200)}
                                    autoComplete="off"
                                />
                                {showRoomDropdown && selectedDormitoryId && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                                        {filteredRooms.length > 0 ? filteredRooms.map(r => (
                                            <div
                                                key={r.id}
                                                className="px-4 py-2 hover:bg-primary/10 cursor-pointer text-sm font-medium text-gray-700"
                                                onClick={() => {
                                                    setData('room_id', r.id.toString());
                                                    setRoomSearch(r.name);
                                                    setShowRoomDropdown(false);
                                                }}
                                            >
                                                {r.name}
                                            </div>
                                        )) : (
                                            <div className="px-4 py-2 text-sm text-gray-500">Kamar tidak ditemukan di asrama ini.</div>
                                        )}
                                    </div>
                                )}
                                <InputError message={errors.room_id} className="mt-2" />
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100">
                        <SecondaryButton onClick={onClose} disabled={processing}>
                            Batal
                        </SecondaryButton>
                        <PrimaryButton className="bg-primary hover:bg-primary-light" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Data'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
