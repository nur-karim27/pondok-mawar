import { Link } from '@inertiajs/react';

interface PaginationProps {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export default function Pagination({ links }: PaginationProps) {
    if (links.length <= 3) return null;

    return (
        <div className="flex flex-wrap items-center justify-center gap-1 mt-6">
            {links.map((link, key) => {
                const label = link.label.replace('&laquo;', '«').replace('&raquo;', '»');
                return link.url === null ? (
                    <div
                        key={key}
                        className="px-4 py-2 text-sm text-gray-400 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
                    >
                        {label}
                    </div>
                ) : (
                    <Link
                        key={key}
                        href={link.url}
                        className={`px-4 py-2 text-sm rounded-lg border transition-all ${
                            link.active
                                ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                                : 'text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300 bg-white'
                        }`}
                    >
                        {label}
                    </Link>
                );
            })}
        </div>
    );
}
