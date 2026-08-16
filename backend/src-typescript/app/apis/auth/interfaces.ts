export interface IRegisterBody {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
}

export interface ILoginBody {
    email: string;
    password: string;
}

export interface IRefreshBody {
    refreshToken: string;
}

export interface IUpdateMeBody {
    fullName?: string;
    phone?: string | null;
}

export interface IChangePasswordBody {
    currentPassword: string;
    newPassword: string;
}
