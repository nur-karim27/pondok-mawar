import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Landmark, ArrowLeft, Trash2, Plus } from 'lucide-react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

interface Canteen {
    id: number;
    name: string;
    type: 'putra' | 'putri';
}

export default function KantinSettings({ auth, canteens }: PageProps<{ canteens: Canteen[] }>) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        type: 'putra' as 'putra' | 'putri',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('kantin.settings.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Link href={route('kantin.index')} className="text-gray-500 hover:text-gray-700">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Pengaturan Kantin</h2>
                </div>
            }
        >
            <Head title="Pengaturan Kantin - Bendahara" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Add New Canteen Form */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Plus className="w-5 h-5 text-gray-500" />
                            Tambah Kantin Baru
                        </h3>
                        <form onSubmit={submit} className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                            <div className="flex-1 w-full">
                                <InputLabel htmlFor="name" value="Nama Kantin" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Contoh: Kantin Putra 1"
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>
                            <div className="w-full md:w-64">
                                <InputLabel htmlFor="type" value="Tipe/Asrama" />
                                <select
                                    id="type"
                                    className="mt-1 block w-full border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-md shadow-sm"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value as 'putra' | 'putri')}
                                    required
                                >
                                    <option value="putra">Putra</option>
                                    <option value="putri">Putri</option>
                                </select>
                                <InputError message={errors.type} className="mt-2" />
                            </div>
                            <PrimaryButton disabled={processing} className="w-full md:w-auto h-10 mt-1">
                                Tambah
                            </PrimaryButton>
                        </form>
                    </div>

                    {/* List of Canteens */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-xl border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                                <Landmark className="w-5 h-5 text-gray-500" />
                                Daftar Kantin Terdaftar
                            </h3>
                            
                            <div className="overflow-x-auto rounded-lg border border-gray-100">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Kantin</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipe</th>
                                            <th className="px-6 py-4 text-center rounded-tr-lg">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {canteens.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                                    Belum ada kantin terdaftar.
                                                </td>
                                            </tr>
                                        ) : (
                                            canteens.map((canteen) => (
                                                <tr key={canteen.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                                                    <td className="px-6 py-4 font-medium text-gray-900">
                                                        {canteen.name}
                                                    </td>
                                                    <td className="px-6 py-4 capitalize">
                                                        {canteen.type}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <Link 
                                                            href={route('kantin.settings.destroy', canteen.id)}
                                                            method="delete"
                                                            as="button"
                                                            className="inline-flex items-center gap-1 text-red-600 hover:text-red-900 px-3 py-1.5 rounded hover:bg-red-50 transition-colors font-medium text-xs"
                                                            preserveScroll
                                                            onBefore={() => confirm(`Apakah Anda yakin ingin menghapus kantin ${canteen.name}?`)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Hapus
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
