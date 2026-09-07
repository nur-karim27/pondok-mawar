import { useEffect, useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm } from '@inertiajs/react';
import { Upload, Video, Image as ImageIcon } from 'lucide-react';

interface Props {
    show: boolean;
    onClose: () => void;
    announcement?: any;
    currentCategory: string;
}

export default function AnnouncementFormModal({ show, onClose, announcement, currentCategory }: Props) {
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        _method: 'POST',
        title: '',
        category: currentCategory,
        body: '',
        audience: 'semua',
        is_pinned: false,
        cover_image: null as File | null,
        video_file: null as File | null,
    });

    const [coverPreview, setCoverPreview] = useState<string | null>(null);

    useEffect(() => {
        if (show) {
            if (announcement) {
                setData({
                    _method: 'PUT',
                    title: announcement.title,
                    category: announcement.category,
                    body: announcement.body,
                    audience: announcement.audience,
                    is_pinned: announcement.is_pinned,
                    cover_image: null,
                    video_file: null,
                });
                setCoverPreview(announcement.cover_image ? `/storage/${announcement.cover_image}` : null);
            } else {
                reset();
                setData('category', currentCategory);
                setCoverPreview(null);
            }
            clearErrors();
        }
    }, [show, announcement, currentCategory]);

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setData('cover_image', file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setCoverPreview(announcement?.cover_image ? `/storage/${announcement.cover_image}` : null);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // Use POST for both create and update (with _method: PUT for update) to handle file uploads
        if (announcement) {
            post(route('announcements.update', announcement.id), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
                forceFormData: true,
            });
        } else {
            post(route('announcements.store'), {
                onSuccess: () => {
                    onClose();
                    reset();
                },
                forceFormData: true,
            });
        }
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6 border-b pb-3">
                    {announcement ? 'Edit Pengumuman' : 'Tambah Pengumuman'}
                </h2>

                <form onSubmit={submit} className="space-y-4">
                    <div>
                        <InputLabel htmlFor="title" value="Judul Pengumuman" />
                        <TextInput
                            id="title"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            required
                        />
                        {errors.title && <div className="text-red-500 text-xs mt-1">{errors.title}</div>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="category" value="Kategori (Folder)" />
                            <select
                                id="category"
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                                required
                            >
                                <option value="Tentang Kami">Tentang Kami</option>
                                <option value="Akademik">Akademik</option>
                                <option value="Informasi">Informasi</option>
                            </select>
                            {errors.category && <div className="text-red-500 text-xs mt-1">{errors.category}</div>}
                        </div>

                        <div>
                            <InputLabel htmlFor="audience" value="Target Pembaca" />
                            <select
                                id="audience"
                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                value={data.audience}
                                onChange={(e) => setData('audience', e.target.value)}
                                required
                            >
                                <option value="semua">Semua Orang (Publik)</option>
                                <option value="santri">Santri Saja</option>
                                <option value="wali_santri">Wali Santri Saja</option>
                                <option value="pengurus">Pengurus / Guru Saja</option>
                            </select>
                            {errors.audience && <div className="text-red-500 text-xs mt-1">{errors.audience}</div>}
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="body" value="Isi Pengumuman / Deskripsi" />
                        <textarea
                            id="body"
                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                            rows={4}
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            required
                        ></textarea>
                        {errors.body && <div className="text-red-500 text-xs mt-1">{errors.body}</div>}
                    </div>

                    <div className="flex items-center gap-2 py-2">
                        <input
                            type="checkbox"
                            id="is_pinned"
                            className="rounded border-gray-300 text-primary shadow-sm focus:ring-primary"
                            checked={data.is_pinned}
                            onChange={(e) => setData('is_pinned', e.target.checked)}
                        />
                        <label htmlFor="is_pinned" className="text-sm text-gray-700 font-medium">Pin / Sematkan (Tampil paling atas)</label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                        {/* Upload Cover Image */}
                        <div>
                            <InputLabel value="Foto Cover (Opsional)" className="mb-2" />
                            <label className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-primary transition-colors bg-gray-50/50">
                                {coverPreview ? (
                                    <div className="relative">
                                        <img src={coverPreview} alt="Preview" className="h-32 w-full object-cover rounded-lg" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                                            <span className="text-white text-sm font-medium">Ganti Foto</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-6">
                                        <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <span className="text-sm text-gray-500">Klik untuk upload foto</span>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleCoverChange}
                                />
                            </label>
                            {errors.cover_image && <div className="text-red-500 text-xs mt-1">{errors.cover_image}</div>}
                        </div>

                        {/* Upload Video */}
                        <div>
                            <InputLabel value="Video Pendek (Opsional)" className="mb-2" />
                            <label className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-primary transition-colors bg-gray-50/50">
                                <div className="py-6">
                                    <Video className={`w-8 h-8 mx-auto mb-2 ${data.video_file || (announcement && announcement.video_path && !data.video_file) ? 'text-primary' : 'text-gray-400'}`} />
                                    <span className="text-sm text-gray-500">
                                        {data.video_file 
                                            ? data.video_file.name 
                                            : announcement && announcement.video_path 
                                                ? 'Video sudah terupload. Klik untuk ganti.' 
                                                : 'Klik untuk upload video'}
                                    </span>
                                    <p className="text-xs text-gray-400 mt-1">MP4, MOV up to 300MB</p>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="video/*"
                                    onChange={(e) => setData('video_file', e.target.files ? e.target.files[0] : null)}
                                />
                            </label>
                            {errors.video_file && <div className="text-red-500 text-xs mt-1">{errors.video_file}</div>}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Batal
                        </button>
                        <PrimaryButton type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Pengumuman'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
