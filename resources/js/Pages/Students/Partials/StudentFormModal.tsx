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
    rooms: Room[];
    guardians: Guardian[];
}

export default function StudentFormModal({ show, onClose, student, rooms, guardians }: Props) {
    const [activeTab, setActiveTab] = useState<'biodata' | 'akademik'>('biodata');

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        nis: '',
        nisn: '',
        name: '',
        gender: 'putra',
        place_of_birth: '',
        birth_date: '',
        address: '',
        phone: '',
        enrollment_date: new Date().toISOString().split('T')[0],
        status: 'aktif',
        room_id: '',
        guardian_id: '',
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
                status: student.status || 'aktif',
                room_id: student.room_id ? student.room_id.toString() : '',
                guardian_id: student.guardian_id ? student.guardian_id.toString() : '',
            });
        } else {
            reset();
        }
        clearErrors();
        setActiveTab('biodata');
    }, [student, show]);

    const submit = (e: FormEvent) => {
        e.preventDefault();
        
        if (student) {
            put(route('kesantrian.update', student.id), {
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
                                <InputLabel htmlFor="guardian_id" value="Wali Santri" />
                                <select
                                    id="guardian_id"
                                    className="mt-1 block w-full border-gray-300 focus:border-primary focus:ring-primary rounded-md shadow-sm"
                                    value={data.guardian_id}
                                    onChange={(e) => setData('guardian_id', e.target.value)}
                                >
                                    <option value="">-- Pilih Wali Santri --</option>
                                    {guardians.map((g) => (
                                        <option key={g.id} value={g.id}>
                                            {g.name} {g.phone ? `(${g.phone})` : ''}
                                        </option>
                                    ))}
                                </select>
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
                                    <option value="pindah">Pindah</option>
                                    <option value="nonaktif">Non-aktif</option>
                                </select>
                                <InputError message={errors.status} className="mt-2" />
                            </div>

                            <div className="col-span-2">
                                <InputLabel htmlFor="room_id" value="Kamar / Asrama" />
                                <select
                                    id="room_id"
                                    className="mt-1 block w-full border-gray-300 focus:border-primary focus:ring-primary rounded-md shadow-sm"
                                    value={data.room_id}
                                    onChange={(e) => setData('room_id', e.target.value)}
                                >
                                    <option value="">-- Pilih Kamar --</option>
                                    {rooms.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.name}
                                        </option>
                                    ))}
                                </select>
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
