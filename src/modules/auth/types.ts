
export interface SignUpPayload {
    email: string;
    password: string;
    currency: "NGN_NAIRA" | "GBP_ACCOUNT" | "UGX_ACCOUNT" | "GHS_ACCOUNT",
    referralCode:string
}

export interface LoginPayload {
    password: string;
    email: string
}

export  interface ResendOtpPayload {
    email: string;
}

export interface Profile {
    firstName: string;
    middleName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    userName: string;
    phoneNumber: string;
}