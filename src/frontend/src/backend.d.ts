import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface LetterRecord {
    id: bigint;
    customerName: string;
    loanAmount: string;
    date: string;
    createdAt: Time;
    letterType: LetterType;
    loanAccountNumber: string;
}
export enum LetterType {
    noc = "noc",
    paymentReceived = "paymentReceived",
    closerLetter = "closerLetter",
    paymentReceipt = "paymentReceipt"
}
export interface backendInterface {
    createLetter(customerName: string, loanAccountNumber: string, loanAmount: string, date: string, letterType: LetterType): Promise<bigint>;
    deleteLetter(id: bigint): Promise<void>;
    getAllLetters(): Promise<Array<LetterRecord>>;
    getLetter(id: bigint): Promise<LetterRecord>;
}
