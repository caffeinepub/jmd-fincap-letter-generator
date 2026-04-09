import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CalendarDays,
  CreditCard,
  Download,
  Eye,
  FileText,
  Hash,
  History,
  IndianRupee,
  Link2,
  Loader2,
  LogOut,
  Printer,
  Trash2,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { type LetterRecord, LetterType } from "./backend";
import LetterPreview from "./components/LetterPreview";
import LoginPage from "./components/LoginPage";
import {
  useCreateLetter,
  useDeleteLetter,
  useGetAllLetters,
} from "./hooks/useQueries";
import {
  formatDisplayDate,
  formatIndianNumber,
  getLetterTypeLabel,
} from "./utils/letterTemplates";
import type { LetterData } from "./utils/letterTemplates";

// CHANGE 2: Fixed logo path
const LOGO_PATH =
  "/assets/jmd_fincap_logo-removebg-preview-019d58bd-7f9a-73da-8a9d-5536a76c7a36.png";

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// CHANGE 4: Added paymentReceipt to letter types
const LETTER_TYPES: { type: LetterType; label: string; icon: string }[] = [
  { type: LetterType.noc, label: "Generate NOC", icon: "\u2713" },
  {
    type: LetterType.closerLetter,
    label: "Generate Closure Letter",
    icon: "\uD83D\uDD12",
  },
  {
    type: LetterType.paymentReceived,
    label: "Generate Reminder Letter",
    icon: "\u26A0",
  },
  {
    type: LetterType.paymentReceipt,
    label: "Generate Payment Receipt",
    icon: "\uD83D\uDCB3",
  },
];

export default function App() {
  // CHANGE 1: Admin login state
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => sessionStorage.getItem("jmd_admin_logged_in") === "true",
  );

  const [customerName, setCustomerName] = useState("");
  const [loanAccountNumber, setLoanAccountNumber] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [date, setDate] = useState(todayStr);
  const [previewData, setPreviewData] = useState<LetterData | null>(null);
  const [pendingType, setPendingType] = useState<LetterType | null>(null);

  // CHANGE 4: Payment receipt extra fields
  const [utrNumber, setUtrNumber] = useState("");
  const [paymentMode, setPaymentMode] = useState("PhonePe");

  const { data: letters, isLoading: lettersLoading } = useGetAllLetters();
  const createMutation = useCreateLetter();
  const deleteMutation = useDeleteLetter();

  // CHANGE 1: If not logged in, show login page
  if (!isLoggedIn) {
    return (
      <LoginPage
        onLogin={() => {
          setIsLoggedIn(true);
          sessionStorage.setItem("jmd_admin_logged_in", "true");
        }}
      />
    );
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("jmd_admin_logged_in");
  };

  const handleGenerate = async (lt: LetterType) => {
    if (!customerName.trim()) {
      toast.error("Please enter customer name");
      return;
    }
    if (!loanAccountNumber.trim()) {
      toast.error("Please enter loan account number");
      return;
    }
    if (!loanAmount.trim()) {
      toast.error("Please enter loan amount");
      return;
    }
    if (!date) {
      toast.error("Please select a date");
      return;
    }

    const newData: LetterData = {
      customerName: customerName.trim(),
      loanAccountNumber: loanAccountNumber.trim(),
      loanAmount: loanAmount.trim(),
      date,
      letterType: lt,
      utrNumber:
        lt === LetterType.paymentReceipt ? utrNumber.trim() : undefined,
      paymentMode: lt === LetterType.paymentReceipt ? paymentMode : undefined,
    };

    setPendingType(lt);
    setPreviewData(newData);

    toast.success(
      `${getLetterTypeLabel(lt)} generated! Use Print/PDF to download.`,
    );
    setPendingType(null);

    // Save to backend (non-blocking — letter works even if backend is offline)
    try {
      await createMutation.mutateAsync({
        customerName: customerName.trim(),
        loanAccountNumber: loanAccountNumber.trim(),
        loanAmount: loanAmount.trim(),
        date,
        letterType: lt,
      });
    } catch (_e) {
      // Backend save failed silently — letter preview is already shown
    }
  };

  const handleViewLetter = (record: LetterRecord) => {
    setCustomerName(record.customerName);
    setLoanAccountNumber(record.loanAccountNumber || "");
    setLoanAmount(record.loanAmount);
    setDate(record.date);
    setPreviewData({
      customerName: record.customerName,
      loanAccountNumber: record.loanAccountNumber || "",
      loanAmount: record.loanAmount,
      date: record.date,
      letterType: record.letterType,
    });
    document
      .getElementById("dashboard-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Letter deleted.");
    } catch (e) {
      toast.error(
        `Delete failed: ${e instanceof Error ? e.message : String(e)}`,
      );
    }
  };

  const handlePrint = () => {
    if (!previewData) {
      toast.error("Generate a letter first.");
      return;
    }
    window.print();
  };

  const handleDownload = () => {
    if (!previewData) {
      toast.error("Generate a letter first.");
      return;
    }
    toast.info("Use Print \u2192 Save as PDF to download.");
    window.print();
  };

  return (
    <TooltipProvider>
      <div
        className="flex flex-col min-h-screen"
        style={{ background: "#F2F4F7" }}
      >
        <Toaster richColors position="top-right" />

        {/* NAVBAR */}
        <header
          className="no-print fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6"
          style={{
            background: "linear-gradient(135deg, #0B1F3A 0%, #0E2A4A 100%)",
            boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
          }}
          data-ocid="app.panel"
        >
          {/* Logo + Brand */}
          <div className="flex items-center gap-3">
            <img
              src={LOGO_PATH}
              alt="JMD Fincap"
              className="h-10 w-auto object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 800,
                  color: "#E8B84B",
                  letterSpacing: "0.04em",
                  lineHeight: 1,
                }}
              >
                JMD FINCAP PVT. LTD.
              </div>
              <div
                style={{
                  fontSize: "9.5px",
                  color: "rgba(255,255,255,0.5)",
                  letterSpacing: "0.06em",
                }}
              >
                REGISTERED NBFC | RBI REG. NO.: N-07.02264
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav
            className="hidden lg:flex items-center gap-1"
            data-ocid="nav.panel"
          >
            {/* CHANGE 3: Dashboard button with scroll */}
            <button
              type="button"
              className="px-4 py-1.5 text-sm font-medium rounded transition-colors"
              style={{ color: "rgba(255,255,255,0.65)" }}
              onClick={() =>
                document
                  .getElementById("dashboard-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              data-ocid="nav.dashboard.link"
            >
              Dashboard
            </button>
            <button
              type="button"
              className="px-4 py-1.5 text-sm font-medium rounded transition-colors"
              style={{
                color: "#E8B84B",
                borderBottom: "2px solid #C08A1A",
                background: "rgba(192,138,26,0.1)",
              }}
              data-ocid="nav.generate_documents.link"
            >
              Generate Documents
            </button>
            {/* CHANGE 3: History button with scroll */}
            <button
              type="button"
              className="px-4 py-1.5 text-sm font-medium rounded transition-colors"
              style={{ color: "rgba(255,255,255,0.65)" }}
              onClick={() =>
                document
                  .getElementById("history-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              data-ocid="nav.history.link"
            >
              History
            </button>
          </nav>

          {/* Right side: CIN + Logout */}
          <div className="flex items-center gap-4">
            <div
              style={{
                fontSize: "9.5px",
                color: "rgba(255,255,255,0.5)",
                textAlign: "right",
              }}
            >
              <div>CIN: U65929MP2022PTC059300</div>
              <div>
                &#128222; 8889956204 &nbsp;|&nbsp; &#9993; info@jmdfincap.com
              </div>
            </div>

            {/* CHANGE 1: Logout button */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all hover:bg-red-700 active:scale-95"
              style={{
                background: "#C0392B",
                color: "white",
                border: "1px solid rgba(255,255,255,0.2)",
                letterSpacing: "0.03em",
              }}
              data-ocid="nav.logout.button"
            >
              <LogOut className="w-3 h-3" />
              Logout
            </button>
          </div>
        </header>

        {/* HERO BAND */}
        <div
          className="no-print"
          style={{
            background:
              "linear-gradient(135deg, #0B1F3A 0%, #153A63 45%, #6A4A1E 100%)",
            paddingTop: "64px",
          }}
        >
          <div style={{ padding: "28px 32px 24px" }}>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <h1
                style={{
                  fontSize: "clamp(22px, 4vw, 38px)",
                  fontWeight: 800,
                  color: "#FFFFFF",
                  letterSpacing: "0.02em",
                  marginBottom: "6px",
                }}
              >
                NBFC Letter Generation Portal
              </h1>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px" }}>
                Generate professional NOC, Closure &amp; Reminder letters
                &mdash; instantly.
              </p>
            </motion.div>
          </div>
          <div
            style={{
              height: "3px",
              background:
                "linear-gradient(90deg, #153A63, #C08A1A 40%, #E8B84B 60%, #B07A16)",
            }}
          />
        </div>

        {/* MAIN CONTENT */}
        {/* CHANGE 3: Added id="dashboard-section" */}
        <main
          className="no-print flex-1 px-4 md:px-8 py-8"
          id="dashboard-section"
        >
          <div className="max-w-screen-xl mx-auto">
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
              {/* LEFT: Form panel (~40%) */}
              <motion.div
                className="xl:col-span-2"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div
                  className="rounded-xl overflow-hidden"
                  style={{
                    boxShadow: "0 4px 24px rgba(11,31,58,0.22)",
                    background:
                      "linear-gradient(160deg, #0B1F3A 0%, #0E2A4A 100%)",
                  }}
                >
                  {/* Panel header */}
                  <div
                    className="px-6 py-4 flex items-center gap-2"
                    style={{ borderBottom: "1px solid rgba(192,138,26,0.3)" }}
                  >
                    <FileText
                      className="w-4 h-4"
                      style={{ color: "#E8B84B" }}
                    />
                    <span
                      style={{
                        color: "#FFFFFF",
                        fontWeight: 700,
                        fontSize: "15px",
                      }}
                    >
                      Letter Details
                    </span>
                  </div>

                  {/* Form */}
                  <div className="px-6 py-6 space-y-5">
                    {/* Customer Name */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="customerName"
                        style={{
                          color: "rgba(255,255,255,0.85)",
                          fontSize: "12px",
                          fontWeight: 500,
                        }}
                      >
                        Customer Name{" "}
                        <span style={{ color: "#E8B84B" }}>*</span>
                      </Label>
                      <div className="relative">
                        <User
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                          style={{ color: "#C08A1A" }}
                        />
                        <Input
                          id="customerName"
                          placeholder="e.g. Rajesh Kumar"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="pl-9 border-white/20 placeholder:text-white/40 focus:ring-0"
                          style={{
                            background: "rgba(255,255,255,0.1)",
                            color: "white",
                            borderColor: "rgba(255,255,255,0.2)",
                          }}
                          data-ocid="form.customer_name.input"
                        />
                      </div>
                    </div>

                    {/* Loan Account Number */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="loanAccountNumber"
                        style={{
                          color: "rgba(255,255,255,0.85)",
                          fontSize: "12px",
                          fontWeight: 500,
                        }}
                      >
                        Loan Account Number{" "}
                        <span style={{ color: "#E8B84B" }}>*</span>
                      </Label>
                      <div className="relative">
                        <Link2
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                          style={{ color: "#C08A1A" }}
                        />
                        <Input
                          id="loanAccountNumber"
                          placeholder="e.g. JMD/2024/001234"
                          value={loanAccountNumber}
                          onChange={(e) => setLoanAccountNumber(e.target.value)}
                          className="pl-9 border-white/20 placeholder:text-white/40 focus:ring-0"
                          style={{
                            background: "rgba(255,255,255,0.1)",
                            color: "white",
                            borderColor: "rgba(255,255,255,0.2)",
                          }}
                          data-ocid="form.loan_account_number.input"
                        />
                      </div>
                    </div>

                    {/* Loan Amount */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="loanAmount"
                        style={{
                          color: "rgba(255,255,255,0.85)",
                          fontSize: "12px",
                          fontWeight: 500,
                        }}
                      >
                        Loan Amount (&#8377;){" "}
                        <span style={{ color: "#E8B84B" }}>*</span>
                      </Label>
                      <div className="relative">
                        <IndianRupee
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                          style={{ color: "#C08A1A" }}
                        />
                        <Input
                          id="loanAmount"
                          type="number"
                          placeholder="e.g. 100000"
                          value={loanAmount}
                          onChange={(e) => setLoanAmount(e.target.value)}
                          className="pl-9 border-white/20 placeholder:text-white/40 focus:ring-0"
                          style={{
                            background: "rgba(255,255,255,0.1)",
                            color: "white",
                            borderColor: "rgba(255,255,255,0.2)",
                          }}
                          data-ocid="form.loan_amount.input"
                        />
                      </div>
                      {loanAmount && (
                        <p
                          style={{
                            color: "rgba(232,184,75,0.85)",
                            fontSize: "11px",
                          }}
                        >
                          &#8377; {formatIndianNumber(loanAmount)}/-
                        </p>
                      )}
                    </div>

                    {/* Date */}
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="letterDate"
                        style={{
                          color: "rgba(255,255,255,0.85)",
                          fontSize: "12px",
                          fontWeight: 500,
                        }}
                      >
                        Date / Due Date{" "}
                        <span style={{ color: "#E8B84B" }}>*</span>
                      </Label>
                      <div className="relative">
                        <CalendarDays
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                          style={{ color: "#C08A1A" }}
                        />
                        <Input
                          id="letterDate"
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="pl-9 border-white/20 focus:ring-0"
                          style={{
                            background: "rgba(255,255,255,0.1)",
                            color: "white",
                            borderColor: "rgba(255,255,255,0.2)",
                            colorScheme: "dark",
                          }}
                          data-ocid="form.date.input"
                        />
                      </div>
                    </div>

                    {/* CHANGE 4: Payment Receipt Details section */}
                    <div
                      style={{
                        border: "1px solid rgba(230,138,0,0.25)",
                        borderRadius: "8px",
                        padding: "12px 14px",
                        background: "rgba(230,138,0,0.05)",
                      }}
                    >
                      <div
                        className="flex items-center gap-2 mb-3"
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "rgba(232,184,75,0.85)",
                          letterSpacing: "0.06em",
                        }}
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        PAYMENT RECEIPT DETAILS
                        <span
                          style={{
                            fontWeight: 400,
                            color: "rgba(255,255,255,0.35)",
                            fontSize: "10px",
                          }}
                        >
                          (optional)
                        </span>
                      </div>

                      {/* UTR Number */}
                      <div className="space-y-1.5 mb-3">
                        <Label
                          htmlFor="utrNumber"
                          style={{
                            color: "rgba(255,255,255,0.7)",
                            fontSize: "11px",
                            fontWeight: 500,
                          }}
                        >
                          UTR / Reference No.
                        </Label>
                        <div className="relative">
                          <Hash
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
                            style={{ color: "#C08A1A" }}
                          />
                          <Input
                            id="utrNumber"
                            placeholder="e.g. 426123456789"
                            value={utrNumber}
                            onChange={(e) => setUtrNumber(e.target.value)}
                            className="pl-9 h-8 text-xs border-white/15 placeholder:text-white/30 focus:ring-0"
                            style={{
                              background: "rgba(255,255,255,0.07)",
                              color: "white",
                              borderColor: "rgba(255,255,255,0.15)",
                            }}
                            data-ocid="form.utr_number.input"
                          />
                        </div>
                      </div>

                      {/* Payment Mode */}
                      <div className="space-y-1.5">
                        <Label
                          htmlFor="paymentMode"
                          style={{
                            color: "rgba(255,255,255,0.7)",
                            fontSize: "11px",
                            fontWeight: 500,
                          }}
                        >
                          Payment Mode
                        </Label>
                        <Select
                          value={paymentMode}
                          onValueChange={setPaymentMode}
                        >
                          <SelectTrigger
                            id="paymentMode"
                            className="h-8 text-xs border-white/15"
                            style={{
                              background: "rgba(255,255,255,0.07)",
                              color: "white",
                              borderColor: "rgba(255,255,255,0.15)",
                            }}
                            data-ocid="form.payment_mode.select"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PhonePe">PhonePe</SelectItem>
                            <SelectItem value="Cash">Cash</SelectItem>
                            <SelectItem value="Bank Transfer">
                              Bank Transfer
                            </SelectItem>
                            <SelectItem value="NEFT">NEFT</SelectItem>
                            <SelectItem value="RTGS">RTGS</SelectItem>
                            <SelectItem value="IMPS">IMPS</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Divider */}
                    <div
                      style={{
                        height: "1px",
                        background:
                          "linear-gradient(90deg, transparent, rgba(192,138,26,0.45), transparent)",
                      }}
                    />

                    {/* CTA Buttons */}
                    <div className="space-y-3">
                      {LETTER_TYPES.map((lt) => (
                        <button
                          key={lt.type}
                          type="button"
                          onClick={() => handleGenerate(lt.type)}
                          disabled={
                            createMutation.isPending && pendingType === lt.type
                          }
                          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold transition-all active:scale-[0.98] disabled:opacity-60"
                          style={{
                            background:
                              lt.type === LetterType.paymentReceipt
                                ? "linear-gradient(135deg, #1a6b3a 0%, #28a860 50%, #146030 100%)"
                                : "linear-gradient(135deg, #C08A1A 0%, #E8B84B 50%, #B07A16 100%)",
                            color:
                              lt.type === LetterType.paymentReceipt
                                ? "white"
                                : "#0B1F3A",
                            fontSize: "14px",
                            fontWeight: 700,
                            boxShadow:
                              lt.type === LetterType.paymentReceipt
                                ? "0 4px 16px rgba(26,107,58,0.35)"
                                : "0 4px 16px rgba(192,138,26,0.35)",
                            letterSpacing: "0.02em",
                          }}
                          data-ocid={`form.${lt.type}.primary_button`}
                        >
                          {createMutation.isPending &&
                          pendingType === lt.type ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <span>{lt.icon}</span>
                          )}
                          {lt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* RIGHT: Preview panel (~60%) */}
              <motion.div
                className="xl:col-span-3"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div
                  className="rounded-xl overflow-hidden"
                  style={{
                    boxShadow: "0 4px 24px rgba(11,31,58,0.12)",
                    background: "#FFFFFF",
                  }}
                >
                  {/* Preview header */}
                  <div
                    className="px-6 py-4 flex items-center justify-between"
                    style={{
                      background:
                        "linear-gradient(135deg, #0B1F3A 0%, #153A63 100%)",
                      borderBottom: "2px solid #C08A1A",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" style={{ color: "#E8B84B" }} />
                      <span
                        style={{
                          color: "#FFFFFF",
                          fontWeight: 700,
                          fontSize: "15px",
                        }}
                      >
                        Generated Letter Preview
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleDownload}
                        size="sm"
                        variant="outline"
                        className="text-xs h-7"
                        style={{
                          borderColor: "#E8B84B",
                          color: "#E8B84B",
                          background: "transparent",
                        }}
                        data-ocid="preview.download.button"
                      >
                        <Download className="w-3 h-3 mr-1" /> PDF
                      </Button>
                      <Button
                        onClick={handlePrint}
                        size="sm"
                        className="text-xs h-7 font-bold"
                        style={{
                          background:
                            "linear-gradient(135deg, #C08A1A, #E8B84B)",
                          color: "#0B1F3A",
                        }}
                        data-ocid="preview.print.button"
                      >
                        <Printer className="w-3 h-3 mr-1" /> Print
                      </Button>
                    </div>
                  </div>

                  {/* Preview area */}
                  <div
                    className="p-5 overflow-auto"
                    style={{ background: "#F2F4F7", minHeight: "500px" }}
                    data-ocid="preview.panel"
                  >
                    <LetterPreview data={previewData} />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* CHANGE 3: Added id="history-section" */}
            {/* CHANGE 8: Added Loan A/c No. column */}
            <motion.div
              className="mt-8"
              id="history-section"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  background: "#FFFFFF",
                }}
              >
                {/* History header */}
                <div
                  className="px-6 py-4 flex items-center justify-between"
                  style={{ borderBottom: "1px solid #E5E7EB" }}
                >
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4" style={{ color: "#C08A1A" }} />
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "15px",
                        color: "#0B1F3A",
                      }}
                    >
                      Recent Document History
                    </span>
                  </div>
                  {letters && (
                    <Badge
                      variant="secondary"
                      className="text-xs"
                      style={{
                        background: "#F5E6C0",
                        color: "#B07A16",
                        fontWeight: 600,
                      }}
                    >
                      {letters.length} record{letters.length !== 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>

                {lettersLoading ? (
                  <div
                    className="p-6 space-y-3"
                    data-ocid="history.loading_state"
                  >
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-10 w-full" />
                    ))}
                  </div>
                ) : !letters || letters.length === 0 ? (
                  <div
                    className="flex flex-col items-center justify-center py-16"
                    style={{ color: "#9CA3AF" }}
                    data-ocid="history.empty_state"
                  >
                    <History className="w-12 h-12 mb-3 opacity-20" />
                    <p className="text-sm font-medium">
                      No documents generated yet
                    </p>
                    <p className="text-xs mt-1">
                      Generated letters will appear here
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table data-ocid="history.table">
                      <TableHeader>
                        <TableRow style={{ background: "#F9FAFB" }}>
                          <TableHead
                            className="pl-6 text-xs font-semibold uppercase tracking-wide"
                            style={{ color: "#6B7280" }}
                          >
                            #
                          </TableHead>
                          <TableHead
                            className="text-xs font-semibold uppercase tracking-wide"
                            style={{ color: "#6B7280" }}
                          >
                            Date
                          </TableHead>
                          <TableHead
                            className="text-xs font-semibold uppercase tracking-wide"
                            style={{ color: "#6B7280" }}
                          >
                            Customer Name
                          </TableHead>
                          {/* CHANGE 8: Loan A/c No. column */}
                          <TableHead
                            className="text-xs font-semibold uppercase tracking-wide"
                            style={{ color: "#6B7280" }}
                          >
                            Loan A/c No.
                          </TableHead>
                          <TableHead
                            className="text-xs font-semibold uppercase tracking-wide"
                            style={{ color: "#6B7280" }}
                          >
                            Letter Type
                          </TableHead>
                          <TableHead
                            className="text-xs font-semibold uppercase tracking-wide"
                            style={{ color: "#6B7280" }}
                          >
                            Loan Amount
                          </TableHead>
                          <TableHead
                            className="text-xs font-semibold uppercase tracking-wide text-right pr-6"
                            style={{ color: "#6B7280" }}
                          >
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {letters.map((record, idx) => (
                          <TableRow
                            key={String(record.id)}
                            className="hover:bg-blue-50/40 transition-colors"
                            data-ocid={`history.item.${idx + 1}`}
                          >
                            <TableCell
                              className="pl-6 text-xs"
                              style={{ color: "#9CA3AF" }}
                            >
                              {idx + 1}
                            </TableCell>
                            <TableCell
                              className="text-sm"
                              style={{ color: "#374151" }}
                            >
                              {formatDisplayDate(record.date)}
                            </TableCell>
                            <TableCell
                              className="text-sm font-semibold"
                              style={{ color: "#111827" }}
                            >
                              {record.customerName}
                            </TableCell>
                            {/* CHANGE 8: Loan A/c No. cell */}
                            <TableCell
                              style={{
                                color: "#374151",
                                fontSize: "12px",
                                fontFamily: "monospace",
                              }}
                            >
                              {record.loanAccountNumber || "\u2014"}
                            </TableCell>
                            <TableCell>
                              <span
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                                style={
                                  record.letterType === LetterType.noc
                                    ? {
                                        background: "#DBEAFE",
                                        color: "#1D4ED8",
                                      }
                                    : record.letterType ===
                                        LetterType.closerLetter
                                      ? {
                                          background: "#D1FAE5",
                                          color: "#065F46",
                                        }
                                      : record.letterType ===
                                          LetterType.paymentReceipt
                                        ? {
                                            background: "#D1FAE5",
                                            color: "#065F46",
                                          }
                                        : {
                                            background: "#FEF3C7",
                                            color: "#92400E",
                                          }
                                }
                              >
                                {getLetterTypeLabel(record.letterType)}
                              </span>
                            </TableCell>
                            <TableCell
                              className="text-sm"
                              style={{ color: "#374151" }}
                            >
                              &#8377; {formatIndianNumber(record.loanAmount)}/-
                            </TableCell>
                            <TableCell className="text-right pr-6">
                              <div className="flex items-center justify-end gap-2">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      onClick={() => handleViewLetter(record)}
                                      className="h-7 w-7"
                                      style={{ color: "#153A63" }}
                                      data-ocid={`history.view.button.${idx + 1}`}
                                    >
                                      <Eye className="h-3.5 w-3.5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="text-xs">
                                    View Letter
                                  </TooltipContent>
                                </Tooltip>

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      size="icon"
                                      variant="ghost"
                                      className="h-7 w-7 text-red-400 hover:bg-red-50 hover:text-red-600"
                                      data-ocid={`history.delete.open_modal_button.${idx + 1}`}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent data-ocid="history.delete.dialog">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Delete this letter?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will permanently delete the{" "}
                                        {getLetterTypeLabel(record.letterType)}{" "}
                                        letter for{" "}
                                        <strong>{record.customerName}</strong>.
                                        This cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel data-ocid="history.delete.cancel_button">
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDelete(record.id)}
                                        className="bg-red-600 hover:bg-red-700 text-white"
                                        data-ocid="history.delete.confirm_button"
                                      >
                                        {deleteMutation.isPending ? (
                                          <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                          "Delete"
                                        )}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Footer */}
            <footer
              className="mt-8 text-center pb-4"
              style={{ fontSize: "11px", color: "#9CA3AF" }}
            >
              &copy; {new Date().getFullYear()}. Built with &#10084; using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#C08A1A" }}
              >
                caffeine.ai
              </a>
            </footer>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
