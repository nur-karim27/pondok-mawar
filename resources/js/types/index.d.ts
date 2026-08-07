export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role: string;
    avatar?: string;
    is_active: boolean;
}

export interface Guardian {
    id: number;
    name: string;
    phone?: string;
}

export interface Room {
    id: number;
    name: string;
}

export interface Student {
    id: number;
    nis: string;
    nisn?: string;
    name: string;
    gender: 'putra' | 'putri';
    place_of_birth?: string;
    birth_date?: string;
    address?: string;
    phone?: string;
    photo?: string;
    enrollment_date: string;
    status: 'aktif' | 'izin' | 'lulus' | 'pindah' | 'nonaktif';
    room_id?: number;
    guardian_id?: number;
    guardian?: Guardian;
    room?: Room;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
    };
};
