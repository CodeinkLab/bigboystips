/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useAuth } from "@/app/contexts/AuthContext";
import { Payment, PRicingPlan } from "@/app/lib/interface";
import { User } from "@prisma/client";
import { CheckCircleIcon, X } from "lucide-react";
import moment from "moment";
import router from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Select from 'react-select'
import { start } from "repl";

const SUBSCRIPTION_PLANS = [
    { value: "MONTHLY", label: "Monthly", price: 49.99 },
    { value: "YEARLY", label: "Yearly", price: 499.99 },
    { value: "WEEKLY", label: "Weekly", price: 19.99 },
    { value: "DAILY", label: "Daily", price: 4.99 },
];


const paymentMethods = [
    {
        id: 1,
        type: 'Visa',
        last4: '4242',
        expiryDate: '12/25',
        isDefault: true,
    },
    {
        id: 2,
        type: 'Mastercard',
        last4: '8888',
        expiryDate: '08/26',
        isDefault: false,
    },
]

const pricingPlan = [
    {
        id: 'daily',
        name: 'Daily Pass',
        price: 50,
        currency: 'GHS',
        plan: 'DAILY',
        features: [
            'Daily premium predictions',
            'Expert analysis',
            '24/7 Support'
        ],
        isPopular: false,
    },
    {
        id: 'weekly',
        name: 'Weekly Pass',
        price: 300,
        currency: 'GHS',
        plan: 'WEEKLY',
        features: [
            'All daily pass features',
            'Weekly special picks',
            'Basic analysis tools'
        ],
        isPopular: false,
    },
    {
        id: 'monthly',
        name: 'Monthly Pass',
        price: 1500,
        currency: 'GHS',
        plan: 'MONTHLY',
        features: [
            'All daily pass features',
            'Historical data access',
            'Priority support'
        ],
        isPopular: true,
    },
    {
        id: 'annual',
        name: 'Annual Pass',
        price: 18250,
        currency: 'GHS',
        plan: 'YEARLY',
        features: [
            'All monthly pass features',
            'Exclusive VIP predictions',
            'Personal betting consultant'
        ],
        isPopular: false,
    }
]

const pricing = [
    { amount: 50, plan: "DAILY" },
    { amount: 300, plan: "WEEKLY" },
    { amount: 1500, plan: "MONTHLY" },
    { amount: 18250, plan: "YEARLY" },
]

export default function SubscriptionSection() {
    const { user } = useAuth()
    const [users, setUsers] = useState<User[]>([])
    const [transactions, setTransaction] = useState<Payment[]>([])
    const [pricingPlans, setPricingPlans] = useState<PRicingPlan[]>([])
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [selectedPlan, setSelectedPlan] = useState(pricing[0])
    const [autoRenew, setAutoRenew] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [editingPlanIdx, setEditingPlanIdx] = useState<number | null>(null);
    const [editPlan, setEditPlan] = useState<any>(null);


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const [userRes, paymentRes, pricingRes] = await Promise.all([
                    await fetch("/api/user"),
                    await fetch("/api/payment/?include={ \"user\":true }"),
                    await fetch("/api/pricing"),
                ]);
                if (!userRes.ok) throw new Error("Failed to fetch users");
                if (!paymentRes.ok) throw new Error("Failed to fetch payments");
                if (!pricingRes.ok) throw new Error("Failed to fetch pricing plans");
                const data = await userRes.json();
                const payments = await paymentRes.json();
                const pricings = await pricingRes.json();

                setUsers(data);
                setTransaction(payments);
                setPricingPlans(pricings);
            } catch {
                setUsers([]);
            } finally {

            }
        };
        fetchUsers();
    }, []);

    function handleUserChange(option: any) {
        setSelectedUser(option)
        console.log("Selected user:", option)
    }

    function handlePlanChange(option: any) {
        setSelectedPlan(option)
        console.log("Selected plan:", option)
    }


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        // Calculate expiresAt based on selected plan
        const expiresAt = new Date();
        switch (selectedPlan.plan) {
            case "DAILY":
                expiresAt.setDate(expiresAt.getDate() + 1);
                break;
            case "WEEKLY":
                expiresAt.setDate(expiresAt.getDate() + 7);
                break;
            case "MONTHLY":
                expiresAt.setMonth(expiresAt.getMonth() + 1);
                break;
            case "YEARLY":
                expiresAt.setFullYear(expiresAt.getFullYear() + 1);
                break;
            default:
                expiresAt.setMonth(expiresAt.getMonth() + 1);
        }

        const subdata = {
            userId: selectedUser?.id,
            plan: selectedPlan.plan,
            status: "ACTIVE",
            startedAt: new Date().toISOString(),
            expiresAt: expiresAt.toISOString(),
        }

        const paydata = {
            userId: selectedUser?.id,
            amount: selectedPlan.amount,
            reference: Date.now().toString(),
            status: "SUCCESS",
            currency: user?.location?.currencycode || "USD",
        }
        console.log("Subscription data:", subdata)
        // console.log("Payment data:", paydata)
        setIsSubmitting(true);
        try {
            const [subResponse, payResponse] = await Promise.all([
                await fetch("/api/subscription", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(subdata),
                }),
                await fetch("/api/payment", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(paydata),
                }),
            ]);
            if (!subResponse.ok || !payResponse.ok) {
                throw new Error("Failed to create subscription or payment.");
            }
            if (!subResponse.ok || !payResponse) throw new Error("Failed to create user." + subResponse.statusText || payResponse.statusText);
            toast.success("User created successfully!", {
                duration: 5000,
                position: "top-center",
                icon: <CheckCircleIcon className="text-green-600" />,
            });
            router.push("/dashboard/users");
        } catch (error: any) {
            toast.error("Failed to create user. Please try again.", {
                duration: 10000,
                position: "top-center",
                icon: <X className="text-red-600" />,
            });
        } finally {
            setIsSubmitting(false);
        }


    }

    const handleUpdateSubmit = async (e: React.FormEvent, updateid: string) => {
        e.preventDefault();
        // Save to DB
        console.log("Updating plan:", editPlan);
        try {
            const { id, ...planData } = editPlan;
            const updateres = await fetch(`/api/pricing/${updateid}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(planData),
            });
            if (!updateres.ok) {
                const { id, ...planData } = editPlan;
                const res = await fetch(`/api/pricing`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(planData),
                });
                if (!res.ok) throw new Error("Failed to Save pricing plan. " + res.statusText);

            }
            toast.success("Plan updated!");
            setEditingPlanIdx(null);

        } catch (err: any) {
            toast.error("Failed to update plan. " + err.message);
        }
    }



    return (<div className="p-6 lg:p-4">
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Payment Settings</h1>
            <p className="mt-1 text-gray-600">Manage your payment methods and view transaction history.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Payment Methods */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">Payment Methods</h2>
                            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
                                Add Pricing
                            </button>
                        </div>
                    </div>

                    <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mx-auto px-4 py-6">
                        {pricingPlans.map((plan, idx) => (
                            <div
                                key={plan.id}
                                className={`flex flex-col relative bg-white rounded-lg p-6 transform hover:scale-105 hover:shadow-2xl transition-transform duration-300 ${plan.isPopular ? 'border-2 border-orange-600' : 'border border-neutral-200 shadow-md'
                                    }`}
                            >
                                {plan.isPopular && (
                                    <div className="absolute top-0 right-0 bg-orange-600 text-white px-4 py-1 rounded-bl-lg">
                                        Popular
                                    </div>
                                )}
                                {editingPlanIdx === idx ? (
                                    // Editable Card
                                    <form
                                        onSubmit={(e) => handleUpdateSubmit(e, plan.id)}
                                        className="flex flex-col h-full"
                                    >
                                        <input
                                            className="text-xl font-bold text-gray-800 mb-4 border rounded px-2 py-1"
                                            value={editPlan.name}
                                            onChange={e => setEditPlan({ ...editPlan, name: e.target.value })}
                                            required
                                        />
                                        <input
                                            className="text-2xl font-bold text-orange-600 mb-6 border rounded px-2 py-1"
                                            type="number"
                                            value={editPlan.price}
                                            onChange={e => setEditPlan({ ...editPlan, price: Number(e.target.value) })}
                                            required
                                        />
                                        <input
                                            className="mb-4 border rounded px-2 py-1"
                                            value={editPlan.currency}
                                            onChange={e => setEditPlan({ ...editPlan, currency: e.target.value })}
                                            required
                                        />
                                        <input
                                            className="mb-4 border rounded px-2 py-1"
                                            value={editPlan.plan}
                                            onChange={e => setEditPlan({ ...editPlan, plan: e.target.value })}
                                            required
                                        />
                                        <label className="block text-sm text-red-500 mb-2">Features (one feature per line, press enter to separete them)</label>
                                        <textarea
                                            className="mb-4 border rounded px-2 py-1"
                                            value={editPlan.features.join('\n')}
                                            onChange={e => setEditPlan({ ...editPlan, features: e.target.value.split('\n') })}
                                            required
                                        />
                                        <div className="flex gap-2 mt-auto">
                                            <button
                                                type="submit"
                                                className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 transition-colors"
                                            >
                                                Save
                                            </button>
                                            <button
                                                type="button"
                                                className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition-colors"
                                                onClick={() => setEditingPlanIdx(null)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    // Normal Card
                                    <>
                                        <h2 className="text-xl font-bold text-gray-800 mb-4">{plan.name}</h2>
                                        <p className="text-2xl font-bold text-orange-600 mb-6">
                                            <span className="text-base text-neutral-500">{plan.currency}</span>
                                            {plan.price.toLocaleString()}
                                            <span className="text-lg font-normal text-gray-500">/{plan.plan}</span>
                                        </p>
                                        <ul className="space-y-4 mb-8">
                                            {plan.features.map((feature, index) => (
                                                <li key={index} className="flex items-center">
                                                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        <button
                                            className="w-full mt-auto bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700 transition-colors"
                                            onClick={() => {
                                                setEditingPlanIdx(idx);
                                                setEditPlan({ ...plan, features: [...plan.features] });
                                            }}
                                        >
                                            Edit Pricing
                                        </button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Subscription Summary */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">Create Subscription Plan</h2>
                    </div>
                    <div className="p-6">
                        {/* Subscription Form */}
                        <form className="space-y-8" onSubmit={handleSubmit}>
                            <div className="s">
                                <label htmlFor="plan" className="block text-sm font-medium text-gray-700">
                                    Select User
                                </label>
                                <Select
                                    inputId="userId"
                                    name="userId"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                    defaultValue={users[0]}
                                    placeholder="Select a user"
                                    isSearchable
                                    options={users}
                                    getOptionLabel={option => `${option.username} - ${option.email}`}
                                    getOptionValue={option => option.id}
                                    onChange={handleUserChange}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="plan" className="block text-sm font-medium text-gray-700">
                                    Select Plan
                                </label>
                                <Select
                                    inputId="plan"
                                    name="plan"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm "
                                    defaultValue={pricing[0]}
                                    placeholder="Select a plan"
                                    isSearchable
                                    options={pricing}
                                    getOptionLabel={option => `${option.plan} - ${user?.location?.currencycode} ${option.amount}`}
                                    getOptionValue={option => option.amount.toString()}
                                    onChange={handlePlanChange}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="autoRenew" className="flex items-center">
                                    <input
                                        id="autoRenew"
                                        name="autoRenew"
                                        type="checkbox"
                                        className="h-4 w-4 text-orange-600 border-gray-300 rounded accent-orange-500 "
                                        defaultChecked
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Enable Auto-Renew</span>
                                </label>
                            </div>
                            <button
                                type="submit"
                                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="lg:col-span-3">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">Transaction History</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Description
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {transactions.map((transaction) => {
                                    const expiresAt = new Date(transaction.createdAt);
                                    const plan = pricing.find((price) => price.amount === transaction.amount)?.plan// Default to MONTHLY if no subscription found
                                    switch (plan) {
                                        case "DAILY":
                                            expiresAt.setDate(expiresAt.getDate() + 1);
                                            break;
                                        case "WEEKLY":
                                            expiresAt.setDate(expiresAt.getDate() + 7);
                                            break;
                                        case "MONTHLY":
                                            expiresAt.setMonth(expiresAt.getMonth() + 1);
                                            break;
                                        case "YEARLY":
                                            expiresAt.setFullYear(expiresAt.getFullYear() + 1);
                                            break;
                                        default:
                                            expiresAt.setMonth(expiresAt.getMonth() + 1);
                                    }

                                    return (
                                        <tr key={transaction.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {moment(transaction.createdAt).format("LLL")}
                                                <br />
                                                <span className="text-xs text-gray-500">Expries:{moment(expiresAt).format("LLL")}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {pricing.find((price) => price.amount === transaction.amount)?.plan || "Unknown Plan"}
                                                <br />
                                                <span className="text-xs text-gray-400">User: {transaction.user?.username || "N/A"}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {user?.location?.currencysymbol}{transaction.amount.toLocaleString()}
                                                <br />
                                                <span className="text-xs text-gray-500">Ref: {transaction.reference}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                                                    {transaction.status}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}
