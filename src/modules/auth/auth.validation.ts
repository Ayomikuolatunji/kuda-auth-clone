import { body, ValidationChain } from 'express-validator';

export class ValidationRules {
    public static login: ValidationChain[] = [
        body('email')
            .isEmail()
            .withMessage('Email is required and must be a valid email address'),
        body('password')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long'),
    ];
    public static signup: ValidationChain[] = [
        body('email')
            .isEmail()
            .withMessage('Email is required and must be a valid email address'),
        body('password')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long'),
        body('currency')
            .notEmpty()
            .withMessage('Currency is required')
            .custom((value: string) => {
                const allowedCurrencies = ['NGN_NAIRA', 'GBP_ACCOUNT', 'UGX_ACCOUNT', 'GHS_ACCOUNT'];
                if (!allowedCurrencies.includes(value)) {
                    throw new Error('Invalid currency');
                }
                return true;
            }),
    ];
    public static resendOtp: ValidationChain[] = [
        body('email')
            .isEmail()
            .withMessage('Email is required and must be a valid email address'),
    ];
    public static createProfile: ValidationChain[] = [
        body('firstName')
            .notEmpty()
            .withMessage('First name is required'),
        body('lastName')
            .notEmpty()
            .withMessage('Last name is required'),
        body('email')
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Invalid email address'),
        body('dateOfBirth')
            .notEmpty()
            .isDate()
            .withMessage('dateOfBirth is required'),
        body('gender')
            .notEmpty()
            .withMessage('gender is required'),
        body('phoneNumber')
            .notEmpty()
            .withMessage('phoneNumber is required')    
    ];
    public static verifyEmail: ValidationChain[] = [
        body('email')
            .notEmpty()
            .isEmail()
            .withMessage('Email is required and must be a valid email address'),
        body('otp')
            .notEmpty()
            .withMessage("Otp is required")
    ];
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