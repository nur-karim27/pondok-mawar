import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Construction } from 'lucide-react';

export default function Placeholder({ title, description }: { title: string, description: string }) {
    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-bold leading-tight text-gray-800">{title}</h2>}>
            <Head title={title} />
            <div className="flex flex-col items-center justify-center min-h-[500px] bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <Construction className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Modul {title}</h1>
                <p className="text-gray-500 max-w-md">{description}</p>
                <p className="mt-6 text-sm text-accent bg-primary px-4 py-2 rounded-full font-medium">Dalam Tahap Pengembangan</p>
            </div>
        </AuthenticatedLayout>
    );
}
