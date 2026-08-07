import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Users, BookOpen, CheckSquare, Wallet, 
    FileText, Calendar, BellRing, ArrowRight, Activity
} from 'lucide-react';

interface Props {
    stats: {
        students_count: number;
        staff_count: number;
        activities_today: number;
        letters_pending: number;
        active_permissions: number;
        payments_this_month: number;
    };
    upcoming_activities: any[];
    recent_letters: any[];
    latest_announcements: any[];
    pesan_pimpinan: any;
}

export default function Dashboard({ stats, upcoming_activities, recent_letters, latest_announcements, pesan_pimpinan }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
    };

    const statCards = [
        { title: 'Santri Aktif', value: stats.students_count, icon: Users, color: 'bg-emerald-50 text-emerald-600', link: '#' },
        { title: 'Asatidz Aktif', value: stats.staff_count, icon: BookOpen, color: 'bg-blue-50 text-blue-600', link: '#' },
        { title: 'Kegiatan Hari Ini', value: stats.activities_today, icon: Calendar, color: 'bg-purple-50 text-purple-600', link: '#' },
        { title: 'Pemasukan Bulan Ini', value: formatCurrency(stats.payments_this_month), icon: Wallet, color: 'bg-accent/20 text-primary', link: '#' },
        { title: 'Perizinan Aktif', value: stats.active_permissions, icon: CheckSquare, color: 'bg-amber-50 text-amber-600', link: '#' },
        { title: 'Surat Pending', value: stats.letters_pending, icon: FileText, color: 'bg-rose-50 text-rose-600', link: '#' },
    ];

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-bold leading-tight text-gray-800">Overview</h2>}
        >
            <Head title="Dashboard" />

            <div className="space-y-6">
                
                {/* Greeting & Quick Stats */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <div className="z-10 w-full md:w-2/3 space-y-4">
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Ahlan wa Sahlan, <span className="text-primary">Admin</span>!
                        </h1>
                        <p className="text-gray-500 max-w-2xl text-lg">
                            Selamat datang di sistem administrasi terpadu PondokKita. Berikut adalah ringkasan aktivitas pondok pesantren hari ini.
                        </p>
                    </div>

                    <div className="z-10 w-full md:w-1/3">
                        {pesan_pimpinan && (
                            <div className="bg-primary/5 border border-primary/10 rounded-xl p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <BellRing className="w-5 h-5 text-primary" />
                                    <h3 className="font-semibold text-primary">Pesan Pimpinan</h3>
                                </div>
                                <p className="text-sm text-gray-600 italic line-clamp-3">"{pesan_pimpinan.body}"</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Grid Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statCards.map((stat, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <Link href={stat.link} className="text-gray-300 hover:text-primary transition-colors">
                                    <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform" />
                                </Link>
                            </div>
                            <div>
                                <h3 className="text-gray-500 font-medium text-sm mb-1">{stat.title}</h3>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Two Columns Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Kegiatan Terdekat */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-primary" />
                                Agenda Kegiatan
                            </h3>
                            <Link href="#" className="text-sm font-medium text-primary hover:underline">Lihat Semua</Link>
                        </div>
                        <div className="p-2">
                            {upcoming_activities.length > 0 ? (
                                <ul className="divide-y divide-gray-50">
                                    {upcoming_activities.map((activity, i) => (
                                        <li key={i} className="p-4 hover:bg-gray-50 rounded-xl transition-colors">
                                            <div className="flex items-start gap-4">
                                                <div className="flex flex-col items-center justify-center bg-primary/5 rounded-lg px-3 py-2 min-w-16 border border-primary/10">
                                                    <span className="text-xs text-primary font-bold uppercase">{new Date(activity.activity_date).toLocaleDateString('id-ID', { month: 'short' })}</span>
                                                    <span className="text-lg font-extrabold text-primary">{new Date(activity.activity_date).getDate()}</span>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                                                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">{activity.location} • {activity.start_time.substring(0,5)} WIB</p>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-8 text-center text-gray-500">Tidak ada kegiatan terdekat.</div>
                            )}
                        </div>
                    </div>

                    {/* Pengumuman */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <BellRing className="w-5 h-5 text-primary" />
                                Pengumuman Terbaru
                            </h3>
                            <Link href="#" className="text-sm font-medium text-primary hover:underline">Lihat Semua</Link>
                        </div>
                        <div className="p-6 space-y-6">
                            {latest_announcements.length > 0 ? (
                                latest_announcements.map((ann, i) => (
                                    <div key={i} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-gray-100 last:before:bottom-auto last:before:h-full">
                                        <div className="absolute left-[-5px] top-1.5 w-3 h-3 bg-accent rounded-full border-2 border-white"></div>
                                        <h4 className="font-bold text-gray-900">{ann.title}</h4>
                                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1 mb-2 inline-block">
                                            {new Date(ann.published_at).toLocaleDateString('id-ID')}
                                        </span>
                                        <p className="text-sm text-gray-600 line-clamp-2">{ann.body}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500 py-4">Belum ada pengumuman.</div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
