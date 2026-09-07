import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Users, BookOpen, CheckSquare, Wallet, 
    FileText, Calendar, BellRing, ArrowRight, Activity,
    TrendingUp, Clock, Star
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
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
    };

    const statCards = [
        { 
            title: 'Santri Aktif', 
            value: stats.students_count, 
            icon: Users, 
            gradient: 'from-emerald-500 to-teal-400',
            bg: 'bg-emerald-50',
            text: 'text-emerald-600',
            link: route('kesantrian.index'),
            desc: 'Total santri aktif',
        },
        { 
            title: 'Asatidz Aktif', 
            value: stats.staff_count, 
            icon: BookOpen, 
            gradient: 'from-blue-500 to-indigo-400',
            bg: 'bg-blue-50',
            text: 'text-blue-600',
            link: route('staff.index'),
            desc: 'Tenaga pengajar',
        },
        { 
            title: 'Kegiatan Hari Ini', 
            value: stats.activities_today, 
            icon: Calendar, 
            gradient: 'from-violet-500 to-purple-400',
            bg: 'bg-violet-50',
            text: 'text-violet-600',
            link: route('kegiatan.index'),
            desc: 'Agenda hari ini',
        },
        { 
            title: 'Pemasukan Bulan Ini', 
            value: formatCurrency(stats.payments_this_month), 
            icon: Wallet, 
            gradient: 'from-amber-500 to-orange-400',
            bg: 'bg-amber-50',
            text: 'text-amber-600',
            link: route('payments.index'),
            desc: 'Total pembayaran',
        },
        { 
            title: 'Perizinan Aktif', 
            value: stats.active_permissions, 
            icon: CheckSquare, 
            gradient: 'from-sky-500 to-cyan-400',
            bg: 'bg-sky-50',
            text: 'text-sky-600',
            link: route('perizinan.index'),
            desc: 'Sedang berlangsung',
        },
        { 
            title: 'Surat Pending', 
            value: stats.letters_pending, 
            icon: FileText, 
            gradient: 'from-rose-500 to-pink-400',
            bg: 'bg-rose-50',
            text: 'text-rose-600',
            link: route('letters.index'),
            desc: 'Perlu tanda tangan',
        },
    ];

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-bold leading-tight text-gray-800">Overview</h2>}
        >
            <Head title="Dashboard" />

            <div className="space-y-8">
                
                {/* Hero Welcome Card */}
                <div className="relative bg-gradient-to-br from-primary via-primary-light to-emerald-600 rounded-3xl p-8 md:p-10 overflow-hidden text-white shadow-2xl shadow-primary/30">
                    {/* Decorative circles */}
                    <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/5 rounded-full"></div>
                    <div className="absolute -right-4 bottom-0 w-40 h-40 bg-white/5 rounded-full"></div>
                    <div className="absolute left-1/3 -bottom-10 w-48 h-48 bg-black/5 rounded-full"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-semibold text-white/90">
                                <Star className="w-4 h-4 text-accent fill-accent" />
                                Sistem Administrasi Pesantren
                            </div>
                            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                                Ahlan wa Sahlan! 🌹
                            </h1>
                            <p className="text-white/80 max-w-lg text-base leading-relaxed">
                                Selamat datang di sistem informasi manajemen terpadu Pondok Pesantren Mawar. Semua aktivitas bisa dikelola dari sini.
                            </p>
                        </div>

                        {pesan_pimpinan && (
                            <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-5 w-full md:w-80 shrink-0">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 bg-accent/30 rounded-full flex items-center justify-center">
                                        <BellRing className="w-4 h-4 text-accent" />
                                    </div>
                                    <h3 className="font-bold text-white">Pesan Pimpinan</h3>
                                </div>
                                <p className="text-sm text-white/80 italic line-clamp-4 leading-relaxed">"{pesan_pimpinan.body}"</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Grid Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {statCards.map((stat, i) => (
                        <Link 
                            key={i} 
                            href={stat.link}
                            className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-5">
                                <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-200 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                            </div>
                            <div>
                                <p className="text-3xl font-extrabold text-gray-900 tracking-tight mb-1">{stat.value}</p>
                                <p className="text-sm font-semibold text-gray-700">{stat.title}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{stat.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Two Columns Section */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    
                    {/* Kegiatan Terdekat - 3 cols */}
                    <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                                <div className="p-1.5 bg-violet-100 rounded-lg">
                                    <Activity className="w-4 h-4 text-violet-600" />
                                </div>
                                Agenda Kegiatan Terdekat
                            </h3>
                            <Link href={route('kegiatan.index')} className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                                Lihat Semua <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {upcoming_activities.length > 0 ? (
                                upcoming_activities.map((activity, i) => (
                                    <div key={i} className="p-5 hover:bg-gray-50/50 transition-colors flex items-start gap-4">
                                        <div className="flex flex-col items-center justify-center bg-primary rounded-xl px-3 py-2 min-w-[52px] shadow-md shadow-primary/20">
                                            <span className="text-[10px] text-white/80 font-bold uppercase">{new Date(activity.activity_date).toLocaleDateString('id-ID', { month: 'short' })}</span>
                                            <span className="text-xl font-extrabold text-white leading-none">{new Date(activity.activity_date).getDate()}</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-900 truncate">{activity.title}</h4>
                                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {activity.location} {activity.start_time ? `• ${String(activity.start_time).substring(0,5)} WIB` : ''}
                                            </p>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg shrink-0 ${
                                            activity.status === 'terjadwal' ? 'bg-blue-100 text-blue-700' :
                                            activity.status === 'berlangsung' ? 'bg-green-100 text-green-700' :
                                            'bg-gray-100 text-gray-500'
                                        }`}>
                                            {activity.status}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center text-gray-400">
                                    <Calendar className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                                    <p className="font-medium">Tidak ada kegiatan terdekat</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pengumuman - 2 cols */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                                <div className="p-1.5 bg-rose-100 rounded-lg">
                                    <BellRing className="w-4 h-4 text-rose-500" />
                                </div>
                                Pengumuman
                            </h3>
                            <Link href={route('announcements.index')} className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                                Lihat Semua <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="p-6 space-y-5">
                            {latest_announcements.length > 0 ? (
                                latest_announcements.map((ann, i) => (
                                    <div key={i} className="flex gap-3 group">
                                        <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${i === 0 ? 'bg-primary' : i === 1 ? 'bg-accent' : 'bg-gray-300'}`}></div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 text-sm group-hover:text-primary transition-colors line-clamp-2">{ann.title}</h4>
                                            <span className="text-[10px] font-semibold text-gray-400 mt-1 block">
                                                {new Date(ann.published_at || ann.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </span>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{ann.body}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-400 py-8">
                                    <BellRing className="w-8 h-8 mx-auto mb-2 text-gray-200" />
                                    <p className="text-sm font-medium">Belum ada pengumuman</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Recent Letters */}
                {recent_letters.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2.5">
                                <div className="p-1.5 bg-amber-100 rounded-lg">
                                    <FileText className="w-4 h-4 text-amber-600" />
                                </div>
                                Surat Terbaru
                            </h3>
                            <Link href={route('letters.index')} className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                                Lihat Semua <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-50/80">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">No. Surat</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Perihal</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Tanggal</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {recent_letters.map((letter: any, i: number) => (
                                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-mono text-gray-700">{letter.letter_number || '-'}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">{letter.subject}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{new Date(letter.letter_date || letter.created_at).toLocaleDateString('id-ID')}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${
                                                    letter.status === 'perlu_paraf' ? 'bg-amber-100 text-amber-700' :
                                                    letter.status === 'selesai' ? 'bg-green-100 text-green-700' :
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {letter.status?.replace('_', ' ') || '-'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
