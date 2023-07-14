import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Profile, User as UserType } from '@prisma/client';
import dotenv from 'dotenv';
import { LoginPayload, SignUpPayload } from './types';
import { throwError } from '../../middleware/requestErrorHandler';
import { StatusCodes } from 'http-status-codes';
import sgMail from '@sendgrid/mail';
import otpGenerator from 'otp-generator';
import prisma from '../../database/database';
import { config } from '../../configurations/config';


dotenv.config();


class AuthService {
    public async signup({ currency, email, password, referralCode }: SignUpPayload) {
        try {
            const account = await prisma.$transaction(async (transaction) => {
                const user: UserType | null = await transaction.user.findUnique({ where: { email } });
                if (user) {
                    throwError('User account already exists', StatusCodes.UNPROCESSABLE_ENTITY);
                }
                const hashedPassword = bcrypt.hashSync(password, 8);
                const createAccount = await transaction.user.create({
                    data: {
                        password: hashedPassword,
                        email: email,
                        currency: currency,
                        referralCode: referralCode || '',
                        emailVerified: false,
                    },
                });
                if (!createAccount) {
                    throwError('Encounter error creating account', StatusCodes.INSUFFICIENT_STORAGE);
                }
                await this.generateOtp(email);
                return { userId: createAccount.id };
            }, { timeout: 10000 });
            return account
        } catch (error: any) {
            throwError(error.message, StatusCodes.INSUFFICIENT_STORAGE);
        }
    }
    public async login({ email, password }: LoginPayload) {
        const user: UserType | null = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            throwError('User not found', StatusCodes.NOT_FOUND);
        } else {
            const passwordIsValid = bcrypt.compareSync(password, user.password);
            if (!passwordIsValid) {
                throwError('Password is not valid', StatusCodes.BAD_REQUEST);
            }
            const token: string = jwt.sign({ id: user.id }, config.jwt.JWT_SECRET, {
                expiresIn: 86400,
            });
            return { token, id: user.id, emailVerified: user.emailVerified };
        }

    }
    private async generateOtp(email: string): Promise<void> {
        const otp = otpGenerator.generate(6, { digits: true, specialChars: false, upperCaseAlphabets: false, lowerCaseAlphabets: false });
        const updateUser = await prisma.user.update({
            where: { email },
            data: { otp },
        });
        if (updateUser) {
            throwError('Encounter error', StatusCodes.INTERNAL_SERVER_ERROR);
        }
        await this.sendOtpEmail(email, 12344);
    }
    private async sendOtpEmail(email: string, otp: number): Promise<void> {
        sgMail.setApiKey(config.sendgrid.SENDGRID_API_KEY);
        const msg = {
            to: email,
            from: config.sendgrid.SENDGRID_VERIFIED_SENDER as string,
            subject: 'OTP for Email Verification',
            text: `Your OTP for email verification is ${otp}`,
            html: `<b>Your OTP for email verification is ${otp}</b>`,
        };
        try {
            await sgMail.send(msg);
            console.log('Email sent');
        } catch (error: any) {
            console.error(error);
            if (error.response) {
                console.error(error.response.body);
            }
            throwError('Email could not be sent', StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    public async resendOtp(email: string): Promise<void> {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.emailVerified) {
            throwError('User not found', StatusCodes.NOT_FOUND);
        }
        await this.generateOtp(email);
    }
    public async verifyEmail({ email, otp }: { email: string, otp: string }): Promise<boolean> {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.otp !== otp) {
            return false;
        }
        const verifyUserEmail = await prisma.user.update({
            where: { email },
            data: { emailVerified: true, otp: null },
        });
        if (!verifyUserEmail) {
            throwError("Encountered error updating user email", StatusCodes.INTERNAL_SERVER_ERROR)
        }
        return true;
    }
    public async createProfile(userId: string, updatedProfile: Partial<Profile>) {
        try {
            const user = await prisma.user.findUnique({ where: { id: userId }, include: { userProfile: { select: { id: true } } } });
            if (!user) {
                throwError('User account not found', StatusCodes.NOT_FOUND);
            }
            const gender = updatedProfile.gender?.toUpperCase()
            const updatedProfileResult = await prisma.profile.create({
                data: {
                    user: {
                        connect: {
                            id: user?.id as string
                        }
                    },
                    firstName: updatedProfile.firstName as string,
                    lastName: updatedProfile.lastName as string,
                    gender: gender as "MALE" | "FEMALE",
                    dateOfBirth: updatedProfile.dateOfBirth as Date,
                    phoneNumber: updatedProfile.phoneNumber as string,
                    middleName: updatedProfile.middleName as string || ""
                }
            });
            if (!updatedProfileResult) {
                throwError("Operation failed", StatusCodes.INTERNAL_SERVER_ERROR)
            }
            return { userId: updatedProfileResult.id, message: "Profile created successfully" };

        } catch (error: any) {
            throwError(error.message, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export default new AuthService();
