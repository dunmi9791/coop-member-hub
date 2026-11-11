import { useEffect, useState } from "react";
import { Paperclip, X } from "lucide-react";
import api from "@/hooks/api";
import { toast } from "@/components/ui/use-toast";

/**
 * "How are you paying?" fields shared by the new-investment form and the top-up dialog:
 * bank payment / deposit (reference, date, slip photos or PDFs) or withdrawal from savings.
 */

export type FundingSource = "payment" | "savings";

interface SavingsAccount {
    id: number;
    name?: string;
    account_number?: string;
    product?: { name?: string };
    balance: number;
}

interface FundingProof {
    name: string;
    mimetype: string;
    data: string; // data: URL (base64)
}

const MAX_PROOFS = 5;
const MAX_PROOF_MB = 10;
const ACCEPTED_PROOFS = "image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf";
const RESIZABLE = ["image/jpeg", "image/png", "image/webp"];

const readAsDataUrl = (file: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });

// Phone photos of deposit slips are often 4-8 MB; shrink them before upload.
const toProof = async (file: File): Promise<FundingProof> => {
    if (RESIZABLE.includes(file.type) && file.size > 500 * 1024) {
        try {
            const bitmap = await createImageBitmap(file);
            const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
            const canvas = document.createElement("canvas");
            canvas.width = Math.round(bitmap.width * scale);
            canvas.height = Math.round(bitmap.height * scale);
            canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
            const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.8));
            if (blob) {
                const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
                return { name, mimetype: "image/jpeg", data: await readAsDataUrl(blob) };
            }
        } catch {
            // fall through and send the original file
        }
    }
    return { name: file.name, mimetype: file.type || "application/octet-stream", data: await readAsDataUrl(file) };
};

export const formatNaira = (value: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(value || 0);

export const useFunding = () => {
    const [source, setSource] = useState<FundingSource>("payment");
    const [reference, setReference] = useState("");
    const [date, setDate] = useState("");
    const [note, setNote] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [accounts, setAccounts] = useState<SavingsAccount[]>([]);
    const [accountId, setAccountId] = useState("");
    const [loadingAccounts, setLoadingAccounts] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const resp = await api.post("/api/portal/savings_overview", {
                    jsonrpc: "2.0", method: "call", params: {}, id: 1,
                });
                const list = resp.data?.result?.accounts;
                if (Array.isArray(list)) {
                    setAccounts(list);
                    if (list.length > 0) setAccountId(String(list[0].id));
                }
            } catch (err) {
                console.error("Error fetching savings accounts:", err);
            } finally {
                setLoadingAccounts(false);
            }
        };
        load();
    }, []);

    const account = accounts.find((a) => String(a.id) === accountId);

    /** Error message for the member, or null when the funding details are complete. */
    const validate = (amount: number): string | null => {
        if (source === "payment" && !reference.trim() && files.length === 0) {
            return "Enter the payment reference or attach the deposit slip / transfer receipt.";
        }
        if (source === "savings") {
            if (!account) return "Choose the savings account to pay from.";
            if (amount > account.balance) {
                return `${account.product?.name || "This account"} has ${formatNaira(account.balance)}, which is less than ${formatNaira(amount)}.`;
            }
        }
        return null;
    };

    /** Fields to merge into the API params (reads and shrinks the attached files). */
    const toPayload = async () => {
        const base = { funding_source: source, funding_note: note || undefined };
        if (source === "savings") return { ...base, savings_account_id: Number(accountId) };
        return {
            ...base,
            funding_reference: reference.trim() || undefined,
            funding_date: date || undefined,
            funding_proofs: await Promise.all(files.map(toProof)),
        };
    };

    return {
        source, setSource, reference, setReference, date, setDate, note, setNote,
        files, setFiles, accounts, accountId, setAccountId, account, loadingAccounts,
        validate, toPayload,
    };
};

export type Funding = ReturnType<typeof useFunding>;

interface FundingFieldsProps {
    funding: Funding;
    amount: number;
    /** e.g. "this investment", "this top-up" */
    purpose?: string;
    compact?: boolean;
}

const FundingFields = ({ funding, amount, purpose = "this investment", compact = false }: FundingFieldsProps) => {
    const f = funding;
    const short = f.source === "savings" && !!f.account && amount > f.account.balance;
    const grid = compact ? "grid grid-cols-1 gap-3" : "grid grid-cols-1 md:grid-cols-2 gap-4";

    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const picked = Array.from(e.target.files || []);
        e.target.value = "";
        // Photos (JPG/PNG/WEBP) are shrunk before upload; anything else must already be small enough
        const tooBig = picked.find((file) => file.size > MAX_PROOF_MB * 1024 * 1024 && !RESIZABLE.includes(file.type));
        if (tooBig) {
            toast({ title: "File too large", description: `${tooBig.name} is over ${MAX_PROOF_MB} MB.`, variant: "destructive" });
            return;
        }
        if (f.files.length + picked.length > MAX_PROOFS) {
            toast({ title: "Too many files", description: `You can attach up to ${MAX_PROOFS} files.` });
        }
        f.setFiles((prev) => [...prev, ...picked].slice(0, MAX_PROOFS));
    };

    return (
        <div>
            <div className="font-semibold text-[#043d73] mb-1">How are you paying for {purpose}?</div>
            <p className="text-sm text-muted-foreground mb-3">
                It is applied once the cooperative verifies the money.
            </p>
            <div className="flex flex-wrap gap-3 mb-4" role="radiogroup">
                {([
                    ["payment", "Bank payment / deposit"],
                    ["savings", "Withdraw from my savings"],
                ] as [FundingSource, string][]).map(([value, label]) => (
                    <label
                        key={value}
                        className={`flex items-center gap-2 border rounded-lg px-4 py-2 cursor-pointer ${
                            f.source === value ? "border-[#043d73] bg-[#043d73]/5" : "border-gray-300"
                        }`}
                    >
                        <input
                            type="radio"
                            name="funding_source"
                            value={value}
                            checked={f.source === value}
                            onChange={() => f.setSource(value)}
                        />
                        {label}
                    </label>
                ))}
            </div>

            {f.source === "payment" ? (
                <div className={grid}>
                    <div className="input-container">
                        <label htmlFor="funding_reference">Payment / deposit reference</label>
                        <input
                            id="funding_reference"
                            value={f.reference}
                            onChange={(e) => f.setReference(e.target.value)}
                            placeholder="e.g. transfer ref or teller number"
                            maxLength={120}
                        />
                    </div>
                    <div className="input-container">
                        <label htmlFor="funding_date">Payment date</label>
                        <input id="funding_date" type="date" value={f.date} onChange={(e) => f.setDate(e.target.value)} />
                    </div>
                    <div className={`input-container ${compact ? "" : "md:col-span-2"}`}>
                        <label htmlFor="funding_proofs">
                            Deposit slip or transfer receipt (photo or PDF, up to {MAX_PROOFS})
                        </label>
                        <input
                            id="funding_proofs"
                            type="file"
                            accept={ACCEPTED_PROOFS}
                            multiple
                            onChange={handleFiles}
                            disabled={f.files.length >= MAX_PROOFS}
                        />
                        {f.files.length > 0 && (
                            <ul className="mt-2 space-y-1 text-sm">
                                {f.files.map((file, i) => (
                                    <li key={`${file.name}-${i}`} className="flex items-center gap-2">
                                        <Paperclip className="h-4 w-4" />
                                        <span className="truncate">{file.name}</span>
                                        <button
                                            type="button"
                                            aria-label={`Remove ${file.name}`}
                                            onClick={() => f.setFiles((prev) => prev.filter((_, j) => j !== i))}
                                        >
                                            <X className="h-4 w-4 text-red-700" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">Give the reference, attach the slip, or both.</p>
                    </div>
                </div>
            ) : (
                <div className={grid}>
                    <div className="input-container">
                        <label htmlFor="savings_account_id">
                            Savings account<sup className="text-red-700">*</sup>
                        </label>
                        <select
                            id="savings_account_id"
                            value={f.accountId}
                            onChange={(e) => f.setAccountId(e.target.value)}
                            disabled={f.loadingAccounts}
                        >
                            {f.accounts.length === 0 && <option value="">No savings account found</option>}
                            {f.accounts.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {[a.product?.name, a.account_number].filter(Boolean).join(" · ") || `Account ${a.id}`}
                                    {" — " + formatNaira(a.balance)}
                                </option>
                            ))}
                        </select>
                        {short && (
                            <p className="text-xs text-red-700 mt-1">This account's balance is less than the amount.</p>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground md:self-end">
                        A withdrawal request for the amount will be raised on this account for the cooperative to approve.
                    </p>
                </div>
            )}

            <div className="input-container mt-4">
                <label htmlFor="funding_note">Note (optional)</label>
                <textarea
                    id="funding_note"
                    value={f.note}
                    onChange={(e) => f.setNote(e.target.value)}
                    rows={2}
                    maxLength={500}
                />
            </div>
        </div>
    );
};

export default FundingFields;
