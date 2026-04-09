import { LetterType } from "../backend";
import {
  buildLetterContent,
  formatDisplayDate,
  formatIndianNumber,
} from "../utils/letterTemplates";
import type { BodyParagraph, LetterData } from "../utils/letterTemplates";

const LOGO_PATH =
  "/assets/jmd_fincap_logo-removebg-preview-019d58bd-7f9a-73da-8a9d-5536a76c7a36.png";
const SIGNATURE_PATH =
  "/assets/whatsapp_image_2026-04-04_at_7.12.03_pm-019d58bd-77c3-728c-a56f-448ec6639d97.jpeg";

// JMD Brand colors
const NAVY = "#001F3F";
const GOLD = "#E68A00";
const GOLD_LIGHT = "#F0A500";
const DARK_RED = "#C0392B";

// Professional font stack — Montserrat preferred
const FONT_BODY = "'Montserrat', 'Roboto', 'Arial', sans-serif";
const FONT_LETTER = "'Montserrat', 'Roboto', 'Arial', sans-serif";

interface Props {
  data: LetterData | null;
  previewId?: string;
}

// CHANGE 6: Warning box left-aligned, no extra margin/indent
function renderBodyParagraph(para: BodyParagraph, idx: number) {
  if (para.type === "warning") {
    return (
      <p
        key={idx}
        style={{
          marginBottom: "14px",
          textAlign: "left",
          lineHeight: 1.8,
          fontSize: "12.5px",
          fontFamily: FONT_LETTER,
          fontWeight: 700,
          color: DARK_RED,
          border: `1.5px solid ${DARK_RED}`,
          borderLeft: `5px solid ${DARK_RED}`,
          background: "#fdf2f2",
          padding: "10px 14px",
          borderRadius: "0 4px 4px 0",
          marginLeft: 0,
        }}
      >
        \u26a0 {para.text}
      </p>
    );
  }
  return (
    <p
      key={idx}
      style={{
        marginBottom: "14px",
        textAlign: "justify",
        lineHeight: 1.85,
        fontSize: "12.5px",
        fontFamily: FONT_LETTER,
        fontWeight: 400,
        color: "#1a1a2e",
      }}
    >
      {para.text}
    </p>
  );
}

export default function LetterPreview({
  data,
  previewId = "letter-print-area",
}: Props) {
  if (!data || !data.customerName || !data.loanAmount || !data.date) {
    return (
      <div
        id={previewId}
        className="flex flex-col items-center justify-center min-h-96 rounded-xl"
        style={{
          background: "linear-gradient(135deg, #F8F6F0 0%, #EDE8D8 100%)",
        }}
        data-ocid="preview.empty_state"
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "72px",
              fontWeight: 900,
              fontFamily: FONT_BODY,
              letterSpacing: "0.2em",
              color: NAVY,
              opacity: 0.07,
              lineHeight: 1,
              userSelect: "none",
            }}
          >
            JMD
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 700,
              fontFamily: FONT_BODY,
              letterSpacing: "0.3em",
              color: GOLD,
              opacity: 0.07,
              userSelect: "none",
              marginTop: "-4px",
            }}
          >
            FINCAP
          </div>
        </div>
        <div
          style={{
            marginTop: "24px",
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${NAVY} 0%, #153A63 100%)`,
            opacity: 0.2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            aria-label="Document placeholder"
            role="img"
            style={{ width: "28px", height: "28px" }}
            fill="none"
            stroke="white"
            viewBox="0 0 24 24"
          >
            <title>Document</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p
          style={{
            marginTop: "16px",
            fontSize: "13px",
            fontWeight: 600,
            fontFamily: FONT_BODY,
            color: NAVY,
            opacity: 0.5,
          }}
        >
          Letter preview will appear here
        </p>
        <p
          style={{
            fontSize: "11px",
            marginTop: "4px",
            color: "#6B7280",
            fontFamily: FONT_BODY,
          }}
        >
          Fill in the form and click a Generate button
        </p>
      </div>
    );
  }

  const content = buildLetterContent(data);
  const amount = formatIndianNumber(data.loanAmount);
  const displayDate = formatDisplayDate(data.date);
  const accNo = data.loanAccountNumber?.trim() || "N/A";
  const isReminder = data.letterType === LetterType.paymentReceived;

  return (
    <div id={previewId}>
      {/* DOUBLE BORDER WRAPPER */}
      <div
        style={{
          border: `3px solid ${NAVY}`,
          padding: "3px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.10)",
        }}
      >
        <div
          className="letter-sheet bg-white w-full"
          style={{
            border: `2px solid ${GOLD}`,
            fontFamily: FONT_LETTER,
            position: "relative",
            overflow: "hidden",
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
          }}
        >
          {/* WATERMARK — logo image at 5% opacity */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: 0.05,
              pointerEvents: "none",
              zIndex: 0,
            }}
          >
            <img
              src={LOGO_PATH}
              alt=""
              style={{ width: "300px", height: "auto" }}
            />
          </div>

          {/* DECORATIVE SVG — top right */}
          <svg
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              opacity: 0.07,
              pointerEvents: "none",
              zIndex: 0,
            }}
            width="200"
            height="200"
            viewBox="0 0 200 200"
            fill="none"
          >
            <title>Decorative</title>
            <circle cx="170" cy="30" r="90" stroke={NAVY} strokeWidth="1" />
            <circle cx="170" cy="30" r="60" stroke={GOLD} strokeWidth="1" />
            <circle cx="170" cy="30" r="32" stroke={NAVY} strokeWidth="1" />
            <line
              x1="70"
              y1="0"
              x2="200"
              y2="130"
              stroke={GOLD}
              strokeWidth="1"
            />
            <line
              x1="50"
              y1="0"
              x2="200"
              y2="150"
              stroke={NAVY}
              strokeWidth="0.5"
            />
          </svg>

          {/* DECORATIVE SVG — bottom left */}
          <svg
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              opacity: 0.07,
              pointerEvents: "none",
              zIndex: 0,
            }}
            width="150"
            height="150"
            viewBox="0 0 150 150"
            fill="none"
          >
            <title>Decorative</title>
            <circle cx="-10" cy="160" r="90" stroke={NAVY} strokeWidth="1" />
            <circle cx="-10" cy="160" r="60" stroke={GOLD} strokeWidth="1" />
            <line
              x1="0"
              y1="150"
              x2="150"
              y2="10"
              stroke={GOLD}
              strokeWidth="1"
            />
          </svg>

          {/* ═══════════════════════════════════════ */}
          {/* LETTERHEAD */}
          {/* ═══════════════════════════════════════ */}
          <div
            style={{
              background: `linear-gradient(135deg, ${NAVY} 0%, #002855 60%, #003070 100%)`,
              position: "relative",
              zIndex: 1,
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            }}
          >
            <div style={{ padding: "20px 32px 16px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "16px",
                }}
              >
                {/* Logo + Company Name */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                  }}
                >
                  <img
                    src={LOGO_PATH}
                    alt="JMD Fincap Logo"
                    style={{
                      height: "56px",
                      width: "auto",
                      objectFit: "contain",
                      // filter removed: show logo in original colors on dark header
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontFamily: FONT_BODY,
                        fontSize: "19px",
                        fontWeight: 800,
                        color: GOLD_LIGHT,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                      }}
                    >
                      JMD FINCAP PVT. LTD.
                    </div>
                    <div
                      style={{
                        color: "rgba(255,255,255,0.55)",
                        fontFamily: FONT_BODY,
                        fontSize: "9.5px",
                        marginTop: "3px",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Registered Non-Banking Financial Company
                    </div>
                  </div>
                </div>

                {/* NBFC Reg details — right column */}
                <div
                  style={{
                    textAlign: "right",
                    color: "rgba(255,255,255,0.65)",
                    fontFamily: FONT_BODY,
                    fontSize: "9px",
                    lineHeight: 1.9,
                  }}
                >
                  <div
                    style={{
                      color: GOLD_LIGHT,
                      fontWeight: 700,
                      fontSize: "9.5px",
                    }}
                  >
                    Registered NBFC | RBI Reg. No.: N-07.02264
                  </div>
                  <div>CIN: U65929MP2022PTC059300</div>
                </div>
              </div>

              {/* Thin separator line */}
              <div
                style={{
                  marginTop: "12px",
                  height: "1px",
                  background:
                    "linear-gradient(90deg, transparent 0%, #C08A1A 25%, #E8B84B 50%, #C08A1A 75%, transparent 100%)",
                }}
              />

              {/* Contact row */}
              <div
                style={{
                  marginTop: "8px",
                  fontSize: "9px",
                  fontFamily: FONT_BODY,
                  color: "rgba(255,255,255,0.55)",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  justifyContent: "center",
                }}
              >
                <span>&#128222; 8889956204</span>
                <span style={{ color: GOLD, opacity: 0.5 }}>|</span>
                <span>&#9993; info@jmdfincap.com</span>
                <span style={{ color: GOLD, opacity: 0.5 }}>|</span>
                <span>&#9993; contact.jmdfincap@gmail.com</span>
                <span style={{ color: GOLD, opacity: 0.5 }}>|</span>
                <span>&#128205; JMD Fincap Pvt. Ltd., India</span>
              </div>
            </div>
          </div>

          {/* GOLD ACCENT LINE below header */}
          <div
            style={{
              height: "4px",
              background: `linear-gradient(90deg, ${NAVY} 0%, ${GOLD} 40%, ${GOLD_LIGHT} 60%, #B07A00 100%)`,
            }}
          />

          {/* ═══════════════════════════════════════ */}
          {/* LETTER BODY */}
          {/* ═══════════════════════════════════════ */}
          <div
            style={{
              padding: "24px 36px 28px",
              fontSize: "13px",
              lineHeight: "1.7",
              color: "#1a1a2e",
              fontFamily: FONT_LETTER,
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* Ref + Date row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "18px",
                fontSize: "11.5px",
                fontFamily: FONT_LETTER,
              }}
            >
              <div style={{ color: "#6B7280" }}>
                Ref. No.:{" "}
                <strong style={{ color: NAVY, fontWeight: 700 }}>
                  {accNo}
                </strong>
              </div>
              <div>
                <span style={{ color: "#6B7280" }}>Date: </span>
                <strong style={{ color: NAVY, fontWeight: 700 }}>
                  {displayDate}
                </strong>
              </div>
            </div>

            {/* "To" address block for non-NOC letters */}
            {data.letterType !== LetterType.noc && (
              <div
                style={{
                  marginBottom: "16px",
                  padding: "10px 14px",
                  background: "#F8F9FB",
                  borderLeft: `4px solid ${NAVY}`,
                }}
              >
                <div
                  style={{
                    fontWeight: 500,
                    fontSize: "11px",
                    fontFamily: FONT_LETTER,
                    color: "#6B7280",
                  }}
                >
                  To,
                </div>
                {/* Customer Name — Bold Navy */}
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: "14px",
                    fontFamily: FONT_LETTER,
                    color: NAVY,
                    letterSpacing: "0.01em",
                  }}
                >
                  {data.customerName}
                </div>
                <div
                  style={{
                    color: "#4B5563",
                    fontSize: "11px",
                    fontFamily: FONT_LETTER,
                    marginTop: "2px",
                  }}
                >
                  Loan Account No.:{/* Loan No — Bold Navy */}
                  <strong style={{ color: NAVY, fontWeight: 800 }}>
                    {" "}
                    {accNo}
                  </strong>
                </div>
              </div>
            )}

            {/* Subject line */}
            {content.subject && (
              <div
                style={{
                  marginBottom: "14px",
                  fontSize: "12px",
                  fontFamily: FONT_LETTER,
                }}
              >
                <strong style={{ color: NAVY, fontWeight: 700 }}>
                  SUBJECT: {content.subject}
                </strong>
              </div>
            )}

            {/* Letter Title — Bigger, Bold, Underlined */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "22px",
                fontSize: "17px",
                fontWeight: 900,
                fontFamily: FONT_LETTER,
                textTransform: "uppercase" as const,
                letterSpacing: "0.12em",
                textDecoration: "underline",
                textDecorationColor: GOLD,
                textDecorationThickness: "3px",
                textUnderlineOffset: "4px",
                color: NAVY,
              }}
            >
              {content.title}
            </div>

            {/* Salutation */}
            <div
              style={{
                marginBottom: "14px",
                fontWeight: 700,
                fontSize: "13px",
                fontFamily: FONT_LETTER,
              }}
            >
              {content.salutation}
            </div>

            {/* NOC: highlight customer name + loan account in body */}
            {data.letterType === LetterType.noc && (
              <p
                style={{
                  marginBottom: "14px",
                  textAlign: "justify",
                  lineHeight: 1.85,
                  fontSize: "12.5px",
                  fontFamily: FONT_LETTER,
                  fontWeight: 400,
                  color: "#1a1a2e",
                }}
              >
                This is to certify that{" "}
                <strong style={{ color: NAVY, fontWeight: 800 }}>
                  {data.customerName}
                </strong>
                , bearing Loan Account No.{" "}
                <strong style={{ color: NAVY, fontWeight: 800 }}>
                  {accNo}
                </strong>
                , had availed a loan of &#8377;{amount}/- from JMD Fincap Pvt.
                Ltd.
              </p>
            )}

            {/* Reminder: highlight customer + account in first para */}
            {isReminder && (
              <p
                style={{
                  marginBottom: "14px",
                  textAlign: "justify",
                  lineHeight: 1.85,
                  fontSize: "12.5px",
                  fontFamily: FONT_LETTER,
                  fontWeight: 400,
                  color: "#1a1a2e",
                }}
              >
                This is to inform you that your total outstanding loan amount of{" "}
                <strong style={{ color: DARK_RED, fontWeight: 800 }}>
                  &#8377;{amount}/-
                </strong>{" "}
                against Loan Account No.{" "}
                <strong style={{ color: NAVY, fontWeight: 800 }}>
                  {accNo}
                </strong>{" "}
                is due for payment.
              </p>
            )}

            {/* Body paragraphs */}
            {content.body
              .slice(
                data.letterType === LetterType.noc ||
                  data.letterType === LetterType.paymentReceived
                  ? 1
                  : 0,
              )
              .map((para, idx) => renderBodyParagraph(para, idx))}

            {/* Reminder closing */}
            {isReminder && (
              <div
                style={{
                  marginTop: "8px",
                  marginBottom: "4px",
                  fontWeight: 700,
                  fontSize: "12.5px",
                  fontFamily: FONT_LETTER,
                  color: NAVY,
                }}
              >
                JMD Fincap Team
              </div>
            )}

            {/* ═══════════════════════════════════════ */}
            {/* SIGNATURE SECTION — CHANGE 9: No personal name */}
            {/* ═══════════════════════════════════════ */}
            <div style={{ marginTop: "36px" }}>
              {content.closing && (
                <div
                  style={{
                    marginBottom: "12px",
                    fontWeight: 600,
                    fontSize: "12.5px",
                    fontFamily: FONT_LETTER,
                  }}
                >
                  {content.closing}
                </div>
              )}

              {/* Signature image */}
              <div style={{ marginBottom: "8px" }}>
                <img
                  src={SIGNATURE_PATH}
                  alt="Authorized Signature"
                  style={{
                    height: "70px",
                    width: "auto",
                    maxWidth: "220px",
                    objectFit: "contain",
                  }}
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.style.display = "none";
                    const next = el.nextElementSibling as HTMLElement | null;
                    if (next) next.style.display = "block";
                  }}
                />
                {/* Fallback */}
                <div
                  style={{
                    display: "none",
                    fontFamily: "Parisienne, cursive",
                    fontSize: "32px",
                    color: NAVY,
                    lineHeight: 1.2,
                    height: "70px",
                  }}
                >
                  JMD Fincap
                </div>
              </div>

              {/* Signatory block — NO personal name */}
              <div
                style={{
                  borderTop: `2px solid ${NAVY}`,
                  paddingTop: "10px",
                  maxWidth: "220px",
                }}
              >
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: "13px",
                    fontFamily: FONT_LETTER,
                    color: NAVY,
                    letterSpacing: "0.01em",
                  }}
                >
                  Team Head
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    fontFamily: FONT_LETTER,
                    fontWeight: 500,
                    color: "#4B5563",
                    marginTop: "1px",
                  }}
                >
                  Authorized Signatory
                </div>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: "12.5px",
                    fontFamily: FONT_LETTER,
                    color: NAVY,
                    marginTop: "3px",
                  }}
                >
                  JMD Fincap Pvt. Ltd.
                </div>
              </div>
            </div>

            {/* CHANGE 7: Verification footer - dark navy bold */}
            <div
              style={{
                marginTop: "28px",
                borderTop: "1px dashed #D1D5DB",
                paddingTop: "10px",
                fontSize: "9.5px",
                fontFamily: FONT_LETTER,
                color: NAVY,
                fontWeight: 700,
                textAlign: "center",
              }}
            >
              Computer-generated document &nbsp;|&nbsp; Loan A/c: {accNo}
              &nbsp;|&nbsp; Amount: &#8377;{amount}/- &nbsp;|&nbsp; Customer:{" "}
              <strong style={{ color: NAVY, fontWeight: 700 }}>
                {data.customerName}
              </strong>
            </div>
          </div>

          {/* ═══════════════════════════════════════ */}
          {/* FOOTER BAND */}
          {/* ═══════════════════════════════════════ */}
          {/* Thin gold line above footer */}
          <div
            style={{
              height: "2px",
              background: `linear-gradient(90deg, ${NAVY}, ${GOLD}, ${GOLD_LIGHT}, ${GOLD}, ${NAVY})`,
            }}
          />
          <div
            style={{
              background: `linear-gradient(90deg, ${NAVY} 0%, #002855 50%, ${NAVY} 100%)`,
              padding: "8px 32px",
              textAlign: "center" as const,
              fontSize: "9.5px",
              fontFamily: FONT_LETTER,
              fontWeight: 700,
              color: "rgba(255,255,255,0.85)",
              position: "relative",
              zIndex: 1,
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            }}
          >
            <span style={{ color: GOLD_LIGHT }}>JMD Fincap Pvt. Ltd.</span>{" "}
            &mdash; Registered NBFC &nbsp;|&nbsp; CIN: U65929MP2022PTC059300
          </div>
        </div>
      </div>
    </div>
  );
}
