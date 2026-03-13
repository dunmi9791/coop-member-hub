import { ArrowLeft, Loader2 } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/hooks/api";
import { UserContext } from "@/hooks/AuthContext";
import { toast } from "@/components/ui/use-toast";

interface Input {
    investment_type_id: string;
    amount: string;
    tenor_id: string;
    start_date: string;
    interest_option: string;
}

interface InvestmentType {
    id: number;
    name: string;
}

interface Tenor {
    id: number;
    name: string;
}

const BuyShares = () => {
    const navigate = useNavigate();
    const { credentials } = useContext(UserContext);
    const [input, setInput] = useState<Input>({
        investment_type_id: "",
        amount: "",
        tenor_id: "",
        start_date: "",
        interest_option: "",
    });
    const [investmentTypes, setInvestmentTypes] = useState<InvestmentType[]>([]);
    const [tenors, setTenors] = useState<Tenor[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);

    useEffect(() => {
        const fetchFormData = async () => {
            setFetchingData(true);
            try {
                const payload = {
                    jsonrpc: "2.0",
                    method: "call",
                    params: {},
                    id: 1,
                };

                // Fetch investment types
                const typesResp = await api.post("/api/portal/investment_types/", payload);
                if (typesResp.data.result?.investment_types) {
                    setInvestmentTypes(typesResp.data.result.investment_types);
                }

                // Fetch tenors
                const tenorsResp = await api.post("/api/portal/investment_tenors/", payload);
                if (tenorsResp.data.result?.tenors) {
                    setTenors(tenorsResp.data.result.tenors);
                }
            } catch (error) {
                console.error("Error fetching form data:", error);
            } finally {
                setFetchingData(false);
            }
        };

        fetchFormData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setInput((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!credentials?.partner_id) {
            toast({
                title: "Error",
                description: "User session not found. Please log in again.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        const payload = {
            jsonrpc: "2.0",
            method: "call",
            params: {
                member_id: Number(credentials.partner_id),
                investment_type_id: Number(input.investment_type_id),
                amount: Number(input.amount),
                tenor_id: Number(input.tenor_id),
                start_date: input.start_date,
                interest_option: input.interest_option,
            },
            id: 1,
        };

        try {
            const resp = await api.post("/api/portal/create_investment/", payload);
            const result = resp.data.result;

            if (result?.status === "success" || !resp.data.error) {
                toast({
                    title: "Success",
                    description: result?.message || "Investment created successfully",
                });
                navigate("/dashboard/investments");
            } else {
                toast({
                    title: "Error",
                    description: result?.message || "Failed to create investment",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Error creating investment:", error);
            toast({
                title: "Error",
                description: "An unexpected error occurred",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-3 border rounded-[18px] border-[#043d73] bg-[#fff]">
            <div
                className="p-3 form-header bg-[#043d73] rounded-t-[18px]"
                style={{
                    borderRadius: "15px 15px 0 0",
                }}
            >
                <div className="subtitle text-white flex gap-1 items-center">
                    <ArrowLeft onClick={() => navigate(-1)} className="cursor-pointer" /> Make investment
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="selected-items-container p-3 py-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="input-container">
                            <label htmlFor="investment_type_id">
                                Investment Type<sup className="text-red-700">*</sup>
                            </label>
                            <select
                                name="investment_type_id"
                                required
                                value={input.investment_type_id}
                                onChange={handleChange}
                                disabled={fetchingData}
                            >
                                <option value="">Select type</option>
                                {investmentTypes.map((type) => (
                                    <option value={type.id} key={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                                {investmentTypes.length === 0 && !fetchingData && (
                                    <>
                                        <option value="1">Fixed Deposit</option>
                                        <option value="2">Target Savings</option>
                                    </>
                                )}
                            </select>
                        </div>

                        <div className="input-container">
                            <label htmlFor="amount">
                                Amount<sup className="text-red-700">*</sup>
                            </label>
                            <input
                                name="amount"
                                required
                                value={input.amount}
                                onChange={handleChange}
                                type="number"
                                placeholder="Enter amount"
                            />
                        </div>

                        <div className="input-container">
                            <label htmlFor="tenor_id">
                                Tenor<sup className="text-red-700">*</sup>
                            </label>
                            <select
                                name="tenor_id"
                                required
                                value={input.tenor_id}
                                onChange={handleChange}
                                disabled={fetchingData}
                            >
                                <option value="">Select tenor</option>
                                {tenors.map((tenor) => (
                                    <option value={tenor.id} key={tenor.id}>
                                        {tenor.name}
                                    </option>
                                ))}
                                {tenors.length === 0 && !fetchingData && (
                                    <>
                                        <option value="1">3 Months</option>
                                        <option value="2">6 Months</option>
                                        <option value="3">12 Months</option>
                                    </>
                                )}
                            </select>
                        </div>

                        <div className="input-container">
                            <label htmlFor="start_date">
                                Start Date<sup className="text-red-700">*</sup>
                            </label>
                            <input
                                name="start_date"
                                required
                                value={input.start_date}
                                onChange={handleChange}
                                type="date"
                            />
                        </div>

                        <div className="input-container">
                            <label htmlFor="interest_option">
                                Interest Option<sup className="text-red-700">*</sup>
                            </label>
                            <select
                                name="interest_option"
                                required
                                value={input.interest_option}
                                onChange={handleChange}
                            >
                                <option value="">Select option</option>
                                <option value="fixed">Fixed</option>
                                <option value="flexible">Flexible</option>
                                <option value="compounding">Compounding</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 bg-[#1985B3] p-5 mt-4 rounded-b-[17px]">
                    <button 
                        type="submit" 
                        className="apply-btn flex items-center gap-2" 
                        disabled={loading}
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        Submit Investment
                    </button>
                    <button 
                        type="button" 
                        className="discard-btn" 
                        onClick={() => navigate(-1)}
                        disabled={loading}
                    >
                        Discard
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BuyShares;