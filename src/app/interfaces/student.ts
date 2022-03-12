import { SafeUrl } from "@angular/platform-browser";

export interface IStudent {
    name: string;
    lastname: string;
    studentCode: string;
    photoUrl: SafeUrl;
    pidm: number;
}
