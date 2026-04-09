import { LetterType } from "../backend";

// Format number in Indian number system: 1,00,000
export function formatIndianNumber(num: string): string {
  const cleaned = num.replace(/[^0-9.]/g, "");
  if (!cleaned) return num;
  const n = Number.parseFloat(cleaned);
  if (Number.isNaN(n)) return num;
  return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

export interface LetterData {
  customerName: string;
  loanAccountNumber: string;
  loanAmount: string;
  date: string;
  letterType: LetterType;
  utrNumber?: string;
  paymentMode?: string;
}

export interface LetterContent {
  title: string;
  subject: string;
  salutation: string;
  body: BodyParagraph[];
  closing: string;
}

export type BodyParagraph =
  | { type: "plain"; text: string }
  | { type: "warning"; text: string }
  | { type: "bold_highlight"; text: string };

export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const d = new Date(`${dateStr}T00:00:00`);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function buildLetterContent(data: LetterData): LetterContent {
  const amount = formatIndianNumber(data.loanAmount);
  const name = data.customerName.trim();
  const accNo = data.loanAccountNumber?.trim() || "N/A";
  const displayDate = formatDisplayDate(data.date);

  switch (data.letterType) {
    case LetterType.noc:
      return {
        title: "NO OBJECTION CERTIFICATE",
        subject: "",
        salutation: "TO WHOMSOEVER IT MAY CONCERN",
        body: [
          {
            type: "plain",
            text: `This is to certify that ${name}, bearing Loan Account No. ${accNo}, had availed a loan of \u20B9${amount}/- from JMD Fincap Pvt. Ltd.`,
          },
          {
            type: "plain",
            text: `We hereby confirm that the entire outstanding loan amount of \u20B9${amount}/- has been fully repaid by the borrower. There are no outstanding dues, liabilities, or claims against the above-mentioned borrower.`,
          },
          {
            type: "plain",
            text: "JMD Fincap Pvt. Ltd. has no objection to the borrower presenting this certificate for any legal, financial, or personal purpose.",
          },
          {
            type: "plain",
            text: "This certificate is issued on the specific request of the applicant and is valid as of the date mentioned above.",
          },
        ],
        closing: "Yours faithfully,",
      };

    case LetterType.closerLetter:
      return {
        title: "LOAN ACCOUNT CLOSURE LETTER",
        subject: `Closure of Loan Account No. ${accNo}`,
        salutation: `Dear ${name},`,
        body: [
          {
            type: "plain",
            text: `We are pleased to inform you that your Loan Account No. ${accNo} with JMD Fincap Pvt. Ltd. has been successfully closed as of ${displayDate}.`,
          },
          {
            type: "plain",
            text: `The total outstanding amount of \u20B9${amount}/- has been fully paid and settled. Your loan account now stands closed with nil outstanding balance.`,
          },
          {
            type: "plain",
            text: "We appreciate your timely repayments and trust in JMD Fincap Pvt. Ltd. Please retain this letter for your official records.",
          },
        ],
        closing: "Yours sincerely,",
      };

    case LetterType.paymentReceived:
      return {
        title: "LOAN PAYMENT REMINDER NOTICE",
        subject: `Outstanding Loan Payment Reminder \u2014 Account No. ${accNo}`,
        salutation: `Dear ${name},`,
        body: [
          {
            type: "plain",
            text: `This is to inform you that your total outstanding loan amount of \u20B9${amount}/- against Loan Account No. ${accNo} is due for payment.`,
          },
          {
            type: "plain",
            text: `You are requested to clear the full outstanding amount on or before ${displayDate}.`,
          },
          {
            type: "warning",
            text: "Please note that a late charge of \u20B9100 per day will be applied after the due date until full payment is received. Non-payment may also lead to legal action and adversely impact your credit record.",
          },
          {
            type: "plain",
            text: "If you have already made the payment, please disregard this notice. For queries, contact us at \uD83D\uDCDE 8889956204 or \u2709 info@jmdfincap.com.",
          },
          {
            type: "plain",
            text: "We appreciate your prompt attention to this matter.",
          },
        ],
        closing: "Regards,",
      };

    case LetterType.paymentReceipt:
      return {
        title: "PAYMENT RECEIPT CONFIRMATION",
        subject: `Payment Receipt for Loan Account No. ${accNo}`,
        salutation: `Dear ${name},`,
        body: [
          {
            type: "plain",
            text: `This is to confirm that JMD Fincap Pvt. Ltd. has received a payment of \u20B9${amount}/- from ${name} against Loan Account No. ${accNo}.`,
          },
          {
            type: "plain",
            text: `Payment Mode: ${data.paymentMode || "N/A"} | UTR/Reference No.: ${data.utrNumber || "N/A"} | Date of Receipt: ${displayDate}`,
          },
          {
            type: "plain",
            text: "This serves as an official acknowledgement of the payment received. Please retain this document for your records.",
          },
          {
            type: "plain",
            text: "For any queries, please contact us at \uD83D\uDCDE 8889956204 or \u2709 info@jmdfincap.com.",
          },
        ],
        closing: "Yours sincerely,",
      };

    default:
      return {
        title: "LETTER",
        subject: "",
        salutation: `Dear ${name},`,
        body: [],
        closing: "Regards,",
      };
  }
}

export function getLetterTypeLabel(type: LetterType | string): string {
  switch (type) {
    case LetterType.noc:
      return "NOC";
    case LetterType.closerLetter:
      return "Closure Letter";
    case LetterType.paymentReceived:
      return "Reminder Letter";
    case LetterType.paymentReceipt:
      return "Payment Receipt";
    default:
      return String(type);
  }
}
