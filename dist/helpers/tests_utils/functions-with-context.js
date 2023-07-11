"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicantConTextTest = void 0;
class ApplicantConTextTest {
    static createApplicant(applicant, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            if (applicant.email) {
                return yield ctx.prisma.applicant.create({
                    data: applicant,
                });
            }
            else {
                return new Error("Applicant created");
            }
        });
    }
    static updateApplicant(applicant, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ctx.prisma.applicant.update({
                where: { id: applicant.id },
                data: applicant,
            });
        });
    }
    static getApplicant(applicantId, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ctx.prisma.applicant.findUnique({
                where: { id: applicantId },
            });
        });
    }
    static deleteApplicant(applicantId, ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ctx.prisma.applicant.delete({
                where: { id: applicantId },
            });
        });
    }
}
exports.ApplicantConTextTest = ApplicantConTextTest;
