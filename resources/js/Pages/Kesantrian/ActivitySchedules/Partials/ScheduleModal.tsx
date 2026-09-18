import { Clock } from 'lucide-react';
import React, { useEffect } from 'react';
import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

interface Props {
    show: boolean;
    onClose: () => void;
    schedule: any | null;
    defaultType?: string; // pre-set type when adding from category header
}

export default function ScheduleModal({ show, onClose, schedule, defaultType = 'kegiatan' }: Props) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        type: defaultType,
        name: '',
        start_time: '',
        end_time: '',
        is_active: true,
    });

    const PRAYER_STANDARDS: Record<string, { default: string, min: string, max: string }> = {
        'Subuh': { default: '04:15', min: '03:30', max: '06:00' },
        'Dhuhur': { default: '12:00', min: '11:00', max: '14:00' },
        'Ashar': { default: '15:15', min: '14:30', max: '16:30' },
        'Maghrib': { default: '17:45', min: '17:15', max: '18:30' },
        'Isya': { default: '19:00', min: '18:45', max: '20:30' }
    };

    const getPrayerStandard = () => {
        if (data.type !== 'sholat_jamaah') return null;
        const name = data.name.trim();
        const match = Object.keys(PRAYER_STANDARDS).find(k => name.toLowerCase().includes(k.toLowerCase()));
        return match ? { name: match, ...PRAYER_STANDARDS[match] } : null;
    };

    const prayerStd = getPrayerStandard();
    const isOutOfBounds = () => {
        if (!prayerStd || !data.start_time) return false;
        return data.start_time < prayerStd.min || data.start_time > prayerStd.max;
    };

    const getTimePeriodFriendly = (timeStr: string) => {
        if (!timeStr) return '';
        const h = parseInt(timeStr.split(':')[0], 10);
        if (h >= 0 && h < 4) return "🌙 Dini Hari (Malam)";
        if (h >= 4 && h < 11) return "🌅 Pagi Hari";
        if (h >= 11 && h < 15) return "☀️ Siang Hari";
        if (h >= 15 && h < 18) return "⛅ Sore Hari";
        if (h >= 18 && h <= 23) return "🌙 Malam Hari";
        return '';
    };

    useEffect(() => {
        if (schedule && show) {
            setData({
                type: schedule.type,
                name: schedule.name,
                start_time: schedule.start_time.substring(0, 5),
                end_time: schedule.end_time ? schedule.end_time.substring(0, 5) : '',
                is_active: Boolean(schedule.is_active),
            });
        } else if (show) {
            reset();
            setData('type', defaultType);
        }
    }, [schedule, show]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (schedule) {
            put(route('activity-schedules.update', schedule.id), {
                onSuccess: () => onClose(),
            });
        } else {
            post(route('activity-schedules.store'), {
                onSuccess: () => { reset(); onClose(); },
            });
        }
    };

    const isEditing = !!schedule;
    // When editing, show the type but locked if it's sholat_jamaah (can't change)
    // When adding, type is locked to whatever category was clicked (canAdd types only)
    const typeLocked = isEditing; // in edit mode, type is always locked

    const typeLabels: Record<string, string> = {
        sholat_jamaah: '🕌 Sholat Jamaah',
        kegiatan: '📅 Kegiatan',
        sekolah: '🏫 Sekolah',
        madin: '📖 Madin / Ngaji',
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                    {isEditing ? 'Edit Jadwal' : `Tambah Jadwal ${typeLabels[data.type] || ''}`}
                </h2>

                <div className="space-y-4">
                    {/* Type field - locked in edit, locked to clicked type in add */}
                    <div>
                        <InputLabel htmlFor="type" value="Jenis Kegiatan" />
                        {typeLocked ? (
                            <div className="mt-1 flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-sm text-gray-700 font-medium">
                                {typeLabels[data.type] || data.type}
                                <span className="text-xs text-gray-400 ml-auto">(tidak dapat diubah)</span>
                            </div>
                        ) : (
                            <select
                                id="type"
                                value={data.type}
                                onChange={e => setData('type', e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                disabled
                            >
                                <option value="kegiatan">📅 Kegiatan</option>
                                <option value="sekolah">🏫 Sekolah</option>
                                <option value="madin">📖 Madin / Ngaji</option>
                            </select>
                        )}
                        <InputError message={errors.type} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="name" value="Nama Jadwal *" />
                        <TextInput
                            id="name"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="mt-1 block w-full"
                            placeholder={
                                data.type === 'sholat_jamaah' ? 'cth: Subuh, Dhuhur, Ashar...' :
                                data.type === 'sekolah' ? 'cth: Sekolah Pagi, KBM...' :
                                data.type === 'madin' ? 'cth: Madin Sore, Ngaji Malam...' :
                                'cth: Pengajian Rutin, Kerja Bakti...'
                            }
                            required
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="start_time" value="Jam Mulai (24 Jam) *" />
                            <div className="relative mt-1">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <TextInput
                                    id="start_time"
                                    type="time"
                                    className="pl-9 w-full font-mono"
                                    value={data.start_time}
                                    onChange={(e) => setData('start_time', e.target.value)}
                                    required
                                    step="60"
                                />
                            </div>
                            {prayerStd ? (
                                <div className="mt-1.5 flex flex-col gap-1.5">
                                    <button 
                                        type="button" 
                                        onClick={() => setData('start_time', prayerStd.default)}
                                        className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold text-left flex items-center gap-1"
                                    >
                                        <Clock className="w-3 h-3" /> Gunakan Jam Standar {prayerStd.name} ({prayerStd.default})
                                    </button>
                                    {isOutOfBounds() && (
                                        <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1.5 rounded-md leading-tight">
                                            ⚠️ <b>Peringatan:</b> Jam yang Anda masukkan sepertinya kurang tepat. Waktu {prayerStd.name} normalnya antara <b>{prayerStd.min} - {prayerStd.max}</b>.
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p className="mt-1 text-[11px] text-gray-500">Contoh: Malam = 23:00, Pagi = 07:00</p>
                            )}

                            {data.start_time && (
                                <div className="mt-2 text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded">
                                    Dibaca sistem sebagai: {getTimePeriodFriendly(data.start_time)}
                                </div>
                            )}

                            <InputError message={errors.start_time} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="end_time" value="Jam Selesai (Opsional)" />
                            <div className="relative mt-1">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <TextInput
                                    id="end_time"
                                    type="time"
                                    className="pl-9 w-full font-mono"
                                    value={data.end_time}
                                    onChange={(e) => setData('end_time', e.target.value)}
                                    step="60"
                                />
                            </div>
                            <InputError message={errors.end_time} className="mt-2" />
                        </div>
                    </div>

                    <div className="block mt-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={e => setData('is_active', e.target.checked)}
                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700 font-medium">
                                Aktif — sistem akan kirim notifikasi otomatis saat jam mulai tiba
                            </span>
                        </label>
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={onClose} type="button">Batal</SecondaryButton>
                    <PrimaryButton disabled={processing}>
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
