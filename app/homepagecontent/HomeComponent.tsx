/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
'use client'
import Link from 'next/link'
import Image from 'next/image'

import { Prediction } from '../lib/interface';
import { ChangeEvent, useEffect, useState } from 'react';
import moment from 'moment';
import { useAuth } from '../contexts/AuthContext';
import { sportTypeOptions } from '../lib/formschemas/predictionForm';
import { Check, Clock, Copy, Edit, Edit2, LoaderCircle, MoreVertical, PlusCircle, Trash, X, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useDialog } from '../components/shared/dialog';
import { addBettingCode, updateTitle } from '../actions/utils';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { Action, Column, TableComponent } from '../components/shared/TableSeater';


const HomePageComponent = ({ content }: { content: any }) => {
    const { user } = useAuth()
    const dialog = useDialog()
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [currentPage, setCurrentPage] = useState(1);


    /*     const predictionsPerPage = 20;
        const pageSize = predictions.length;
        const totalPages = Math.ceil(pageSize / predictionsPerPage);
        const startIndex = (currentPage - 1) * predictionsPerPage;
        const endIndex = startIndex + predictionsPerPage;
        const currentPredictions = predictions.slice(startIndex, endIndex); */
    const [games, setGames] = useState('soccer')
    const [updating, setUpdating] = useState<boolean>(false);
    const [currentposition, setCurrentPosition] = useState<number>(-1);
    const [loading, setLoading] = useState(false)
    const [title, setTitle] = useState<Record<string, any>[]>([])
    const [shouldShow, setShouldShow] = useState(false);
    const [bettingCode, setBettingCode] = useState<string>("")
    const [bettingPlatform, setBettingPlatform] = useState<string>("")



    const defaulttitles = [
        "Vip Predictions",
        "Bet of the day",
        "Previously Won Matches",
        "Free Hot Odds",
        "Midnight Owl",
    ]

    const customgames = ['Bet of the Day', 'Correct Score', 'Draw Games']

    const features = [
        {
            title: 'AI-Powered Analysis',
            description: 'Our advanced AI algorithms analyze millions of data points to provide highly accurate predictions.',
            icon: (
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            gradient: 'from-orange-500 to-purple-500'
        },
        {
            title: 'Real-Time Updates',
            description: 'Get instant notifications and live updates for matches, odds changes, and prediction results.',
            icon: (
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            gradient: 'from-green-500 to-teal-500'
        },
        {
            title: 'Secure Payments',
            description: 'Multiple payment options with bank-grade security. Easy subscriptions and instant access.',
            icon: (
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            gradient: 'from-orange-500 to-orange-500'
        },
        {
            title: 'Premium Insights',
            description: 'Access detailed match analysis, expert opinions, and exclusive VIP predictions.',
            icon: (
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            gradient: 'from-pink-500 to-rose-500'
        },
        {
            title: 'Multiple Payment Methods',
            description: 'Pay with credit cards, PayPal, crypto, or mobile money. Flexible subscription options.',
            icon: (
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            ),
            gradient: 'from-cyan-500 to-orange-500'
        },
        {
            title: '24/7 Support',
            description: 'Get help anytime with our dedicated customer support team and community forum.',
            icon: (
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
            ),
            gradient: 'from-violet-500 to-purple-500'
        },
    ]

    const getRandomDelay = () => {
        return Math.floor(Math.random() * (7000 - 3000 + 1)) + 3000; // Random between 3-7 seconds
    }


    useEffect(() => {
        if (content && Array.isArray(content.titles)) {
            // Sort content.titles by their customtitle's index in defaulttitles
            const sortedTitles = [...content.titles].sort(
                (a, b) =>
                    defaulttitles.indexOf(a.defaulttitle.toLowerCase()) - defaulttitles.indexOf(b.defaulttitle.toLowerCase())
            );
            setTitle(sortedTitles);
        }

        if (content?.predictions?.length > 0) {
            setPredictions(content?.predictions || []);
        }

        if (content?.betslip?.length > 0) {
            setBettingCode(content.betslip[0].bettingCode || "(Set Platform)")
            setBettingPlatform(content.betslip[0].bettingPlatform || "(Set Code)")
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content]);


    useEffect(() => {
        setTimeout(() => {
            setShouldShow(true);
        }, getRandomDelay())
    }, [])


    const updateTableTitle = async (index: number, name: string) => {
        let titlename = ""

        const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
            titlename = e.target.value
        }

        dialog.showDialog({
            title: "Update " + name,
            message: `If you really want to to update this tables tltle from ${name}, input the new table title name below`,
            type: "component",
            component: (
                <div className="my-4 w-full">
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-orange-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 mt-2 select-all "
                        autoFocus
                        onFocus={e => e.target.select()}
                        placeholder="Enter new table title"
                        onChange={handleTitleChange}
                    />
                </div>
            ),
            async onConfirm() {
                if (!titlename && titlename.length < 5 && titlename.toLowerCase() === titlename.toLowerCase()) {
                    toast.error('Your title should be longer enough or should not be the same title as before.')
                } else {

                    const updatedTitles = [...title];
                    updatedTitles[index] = { ...updatedTitles[index], defaulttitle: titlename };
                    setTitle(updatedTitles);
                    await updateTitle(title[index].id, titlename)
                    titlename = ""
                }
            },

        })
    }

    const deletePrediction = async (index: number, id: string) => {
        setCurrentPosition(index);
        dialog.showDialog({
            title: "Delete Prediction",
            message: "Are you sure you want to delete this prediction? This action cannot be undone.",
            type: "confirm",
            onConfirm: async () => {
                setUpdating(true);
                try {
                    const response = await fetch(`/api/prediction/${id}`, {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                    });
                    if (!response.ok) throw new Error("Failed to delete prediction");
                    setPredictions(predictions.filter(pred => pred.id !== id));
                    setUpdating(false);
                } catch (error) {
                    setUpdating(false);
                    console.error("Error deleting prediction:", error);
                }

            }
        })
    }

    const updateWLPrediction = async (index: number, prediction: Prediction, data: string) => {
        setCurrentPosition(index);
        const { id, ...dataWithoutId } = prediction;
        dialog.showDialog({
            title: "Update Prediction",
            message: `Are you sure you want to update this prediction to "${data}"?`,
            type: "confirm",
            onConfirm: async () => {
                setUpdating(true);
                try {
                    const response = await fetch(`/api/prediction/${id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            //...dataWithoutId,
                            result: data,
                        }),
                    });
                    if (!response.ok) throw new Error("Failed to Update prediction");
                    const newresult = await response.json();

                    const newdata = predictions.filter((pred) => pred.id !== id)
                    setPredictions([
                        ...newdata,
                        newresult
                    ])


                    setUpdating(false);
                    console.log("Prediction updated successfully:", newresult);
                    // setPredictions(result);
                } catch (error) {
                    setUpdating(false);
                    console.error("Error updating prediction:", error);
                }

            }
        })
    }

    const showBettingCode = () => {
        let bettingPlatform = ""
        let bettingCode = ""
        dialog.showDialog({
            title: "Betting Slip Code",
            message: "Enter the betting slip details below",
            type: "component",
            component: (
                <div className="mb-4 w-full gap-8">
                    <select
                        className="w-full px-4 py-2 border border-orange-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 mt-2 appearance-none"
                        onChange={(e) => {
                            bettingPlatform = e.target.value;
                        }}

                    >
                        <option className='bg-orange-50' value="">Select Betting Platform</option>
                        <option className='bg-orange-50' value="SPORTYBET">SPORTYBET</option>
                        <option className='bg-orange-50' value="1XBET">1XBET</option>
                        <option className='bg-orange-50' value="BET365">BET365</option>
                        <option className='bg-orange-50' value="BETWAY">BETWAY</option>
                        <option className='bg-orange-50' value="BETKING">BETKING</option>
                        <option className='bg-orange-50' value="BETWINNER">BETWINNER</option>
                        <option className='bg-orange-50' value="22BET">22BET</option>
                        <option className='bg-orange-50' value="NAIRABET">NAIRABET</option>
                        <option className='bg-orange-50' value="MERRYBET">MERRYBET</option>
                        <option className='bg-orange-50' value="BANGBET">BANGBET</option>
                        <option className='bg-orange-50' value="MSPORT">MSPORT</option>
                        <option className='bg-orange-50' value="MELBET">MELBET</option>
                        <option className='bg-orange-50' value="OGABET">OGABET</option>
                        <option className='bg-orange-50' value="PARIPESA">PARIPESA</option>
                        <option className='bg-orange-50' value="WAZOBET">WAZOBET</option>
                    </select>
                    <input
                        type="text"
                        className="w-full px-4 py-2 border border-orange-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 mt-2 select-all"
                        autoFocus
                        onFocus={e => e.target.select()}
                        placeholder="Enter new code for this slip"
                        onChange={(e) => {
                            bettingCode = e.target.value;

                        }}
                    />


                </div>
            ),
            onConfirm: async () => {

                if (!bettingPlatform || !bettingCode) {
                    toast.error("Please fill in all fields before saving.", {
                        id: "bettingCodeError",
                    });
                }
                else {
                    toast.loading("Saving betting code...", {
                        id: "bettingCode",
                    });
                    try {
                        await addBettingCode(content.betslip[0].id, {
                            bettingPlatform,
                            bettingCode
                        })
                        setBettingCode(bettingCode);
                        setBettingPlatform(bettingPlatform);
                        toast.dismiss()
                        toast.success("Betting code saved successfully!", {
                            id: "bettingCode",
                        });
                    } catch (error: any) {
                        toast.dismiss()
                        toast.error(`Error saving betting code: ${error.message}`, {
                            id: "bettingCodeError",
                        });

                    }

                }
            }

        });
    }


    const VIPGames = predictions.filter(prediction => prediction.result === "PENDING" && !prediction.isFree)
    const BetOfTheDayGames = predictions.filter(prediction => prediction.result === "PENDING" && prediction.isCustom && prediction.isFree)
    const WornBetOfTheDayGames = predictions.filter(prediction => prediction.result !== "PENDING" && prediction.isCustom && prediction.isFree)
    const PrevWonGames = predictions.filter(prediction => prediction.result !== "PENDING")
    const FreeGames = predictions.filter(prediction => prediction.result === "PENDING" && !prediction.isCustom && prediction.isFree)
    const MidnightOwlGames = predictions.filter(prediction => prediction.result === "PENDING").slice(0, 5)

    const VIPData = () => {
        const columns: Column<Prediction>[] = [
            {
                header: 'Date',
                accessorKey: 'publishedAt', sortable: false,
                searchable: false,
                cell: (prediction) => (
                    <>
                        {moment(prediction.publishedAt).format('LL')}
                        <br />
                        {moment(prediction.publishedAt).format('LT')}
                    </>
                ),
            },
            {
                header: 'Match',
                accessorKey: 'homeTeam', sortable: false,
                searchable: false,
                cell: (prediction) => (
                    <div>
                        <div className="text-sm font-medium text-gray-900">
                            {prediction.sportType} • {prediction.league || 'Unknown League'}
                        </div>
                        <div className="text-sm text-gray-600 w-44 truncate">
                            {prediction.homeTeam} vs {prediction.awayTeam}
                        </div>
                    </div>
                ),
            },
            {
                header: 'Prediction',
                accessorKey: 'tip',
                cell: (prediction) => prediction.tip || 'No prediction available',
            },
            {
                header: 'Odds',
                accessorKey: 'odds', sortable: false,
                searchable: false,
                cell: (prediction) => (
                    <span className="px-2 py-1 text-xs font-medium text-neutral-800 bg-neutral-100 rounded-full">
                        {prediction.odds || 'N/A'}
                    </span>
                ),
            },
            {
                header: 'Result',
                accessorKey: 'result',
                cell: (prediction, rowIndex, colIndex) => {
                   
                    if (prediction.result === "WON") {
                        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {updating && rowIndex === currentposition  ? <LoaderCircle className="animate-spin size-4" /> : "Won ✓"}
                        </span>;
                    }
                    if (prediction.result === "LOST") {
                        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {updating && rowIndex === currentposition  ? <LoaderCircle className="animate-spin size-4" /> : "Lost ✗"}
                        </span>;
                    }
                    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {updating && rowIndex === currentposition  ? <LoaderCircle className="animate-spin size-4" /> : "Pending ⏳"}
                    </span>;
                },
            },
        ];
        const actions: Action<Prediction>[] = user?.role === "ADMIN" ? [
            {
                label: 'Won',
                icon: <Check className="w-4 h-4 text-neutral-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'WON'),
            },
            {
                label: 'Lost',
                icon: <X className="w-4 h-4 text-neutral-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'LOST'),
            },
            {
                label: 'Pending',
                icon: <Clock className="w-4 h-4 text-gray-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'PENDING'),
            },
            {
                label: 'Edit',
                icon: <Edit className="w-4 h-4 text-gray-500" />,
                onClick: (prediction) => {
                    window.location.href = `/dashboard/predictions/update/?id=${prediction.id}`;
                },
            },
            {
                label: 'Delete',
                icon: <Trash className="w-4 h-4 text-red-500" />,
                onClick: (prediction, index) => deletePrediction(index, prediction.id),
                className: 'text-red-600',
            },
        ] : [];
        const slice = 10
        const header = {
            title: title[0]?.defaulttitle || defaulttitles[0],
            badge: 'Premium',
            isAdmin: user?.role === "ADMIN",
            onTitleEdit: (title: string) => updateTableTitle(0, title),

        }

        const uniqueId = Date.now().toString()
        const footer = {
            emptyMessage: 'Empty List',
            viewMoreLink: "/pricing",
            viewMoreText: content.isSubscriptionActive ? "View More VIP Matches" : !user ? "Sign in to View" : "Upgrade to VIP",
            customActions: user?.role === "ADMIN" && (
                <Link
                    href={user ? "/dashboard/predictions/create" : "/signin"}
                    className="text-sm font-medium text-gray-900 hover:text-orange-600 transition-all duration-300"
                >
                    <div className="group flex gap-1 items-center underline underline-offset-4 text-orange-500 hover:text-gray-900">
                        <PlusCircle className='text-orange-500 size-5 group-hover:text-gray-900' /> Add Data
                    </div>
                    {!user && "Sign in to View"}
                </Link>
            )
        }

        return {
            data: VIPGames,
            columns,
            actions,
            header,
            footer,
            slice,

            updating,
            uniqueId
        }
    }
    const BetOfTheDayData = () => {
        const columns: Column<Prediction>[] = [
            {
                header: 'Date',
                accessorKey: 'publishedAt', sortable: false,
                searchable: false,
                cell: (prediction) => (
                    <>
                        {moment(prediction.publishedAt).format('LL')}
                        <br />
                        {moment(prediction.publishedAt).format('LT')}
                    </>
                ),
            },
            {
                header: 'Match',
                accessorKey: 'homeTeam', sortable: false,
                searchable: false,
                cell: (prediction) => (
                    <div>
                        <div className="text-sm font-medium text-gray-900">
                            {prediction.sportType} • {prediction.league || 'Unknown League'}
                        </div>
                        <div className="text-sm text-gray-600 w-44 truncate">
                            {prediction.homeTeam} vs {prediction.awayTeam}
                        </div>
                    </div>
                ),
            },
            {
                header: 'Prediction',
                accessorKey: 'tip',
                cell: (prediction) => prediction.tip || 'No prediction available',
            },
            {
                header: 'Odds',
                accessorKey: 'odds', sortable: false,
                searchable: false,
                cell: (prediction) => (
                    <span className="px-2 py-1 text-xs font-medium text-neutral-800 bg-neutral-100 rounded-full">
                        {prediction.odds || 'N/A'}
                    </span>
                ),
            },
            {
                header: 'Result',
                accessorKey: 'result',
                cell: (prediction, rowIndex, colIndex) => {
                    if (prediction.result === "WON") {
                        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {updating && rowIndex === currentposition ? <LoaderCircle className="animate-spin size-4" /> : "Won ✓"}
                        </span>;
                    }
                    if (prediction.result === "LOST") {
                        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {updating && rowIndex === currentposition ? <LoaderCircle className="animate-spin size-4" /> : "Lost ✗"}
                        </span>;
                    }
                    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {updating && rowIndex === currentposition ? <LoaderCircle className="animate-spin size-4" /> : "Pending ⏳"}
                    </span>;
                },
            },
        ];
        const actions: Action<Prediction>[] = user?.role === "ADMIN" ? [
            {
                label: 'Won',
                icon: <Check className="w-4 h-4 text-neutral-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'WON'),
            },
            {
                label: 'Lost',
                icon: <X className="w-4 h-4 text-neutral-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'LOST'),
            },
            {
                label: 'Pending',
                icon: <Clock className="w-4 h-4 text-gray-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'PENDING'),
            },
            {
                label: 'Edit',
                icon: <Edit className="w-4 h-4 text-gray-500" />,
                onClick: (prediction) => {
                    window.location.href = `/dashboard/predictions/update/?id=${prediction.id}`;
                },
            },
            {
                label: 'Delete',
                icon: <Trash className="w-4 h-4 text-red-500" />,
                onClick: (prediction, index) => deletePrediction(index, prediction.id),
                className: 'text-red-600',
            },
        ] : [];
        const slice = 10
        const header = {
            title: title[1]?.defaulttitle || defaulttitles[1],
            //badge: 'Premium',
            isAdmin: user?.role === "ADMIN",
            onTitleEdit: (title: string) => updateTableTitle(1, title),

        }

        const uniqueId = Date.now().toString()
        const footer = {
            emptyMessage: 'Empty List',
            viewMoreLink: "/predictions/custom",
            viewMoreText: "View More",
            customActions: user?.role === "ADMIN" && (
                <Link
                    href={user ? "/dashboard/predictions/create" : "/signin"}
                    className="text-sm font-medium text-gray-900 hover:text-orange-600 transition-all duration-300"
                >
                    <div className="group flex gap-1 items-center underline underline-offset-4 text-orange-500 hover:text-gray-900">
                        <PlusCircle className='text-orange-500 size-5 group-hover:text-gray-900' /> Add Data
                    </div>
                    {!user && "Sign in to View"}
                </Link>
            )
        }

        return {
            data: BetOfTheDayGames,
            columns,
            actions,
            header,
            footer,
            slice,

            updating,
            uniqueId
        }
    }
    const WonBetOfTheDayData = () => {
        const columns: Column<Prediction>[] = [
            {
                header: 'Date',
                accessorKey: 'publishedAt', sortable: false,
                searchable: false,
                cell: (prediction) => (
                    <>
                        {moment(prediction.publishedAt).format('LL')}
                        <br />
                        {moment(prediction.publishedAt).format('LT')}
                    </>
                ),
            },
            {
                header: 'Match',
                accessorKey: 'homeTeam', sortable: false,
                searchable: false,
                cell: (prediction) => (
                    <div>
                        <div className="text-sm font-medium text-gray-900">
                            {prediction.sportType} • {prediction.league || 'Unknown League'}
                        </div>
                        <div className="text-sm text-gray-600 w-44 truncate">
                            {prediction.homeTeam} vs {prediction.awayTeam}
                        </div>
                    </div>
                ),
            },
            {
                header: 'Prediction',
                accessorKey: 'tip',
                cell: (prediction) => prediction.tip || 'No prediction available',
            },
            {
                header: 'Odds',
                accessorKey: 'odds', sortable: false,
                searchable: false,
                cell: (prediction) => (
                    <span className="px-2 py-1 text-xs font-medium text-neutral-800 bg-neutral-100 rounded-full">
                        {prediction.odds || 'N/A'}
                    </span>
                ),
            },
            {
                header: 'Result',
                accessorKey: 'result',
                cell: (prediction, rowIndex, colIndex) => {
                    if (prediction.result === "WON") {
                        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {updating && rowIndex === currentposition ? <LoaderCircle className="animate-spin size-4" /> : "Won ✓"}
                        </span>;
                    }
                    if (prediction.result === "LOST") {
                        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {updating && rowIndex === currentposition ? <LoaderCircle className="animate-spin size-4" /> : "Lost ✗"}
                        </span>;
                    }
                    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {updating && rowIndex === currentposition ? <LoaderCircle className="animate-spin size-4" /> : "Pending ⏳"}
                    </span>;
                },
            },
        ];
        const actions: Action<Prediction>[] = user?.role === "ADMIN" ? [
            {
                label: 'Won',
                icon: <Check className="w-4 h-4 text-neutral-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'WON'),
            },
            {
                label: 'Lost',
                icon: <X className="w-4 h-4 text-neutral-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'LOST'),
            },
            {
                label: 'Pending',
                icon: <Clock className="w-4 h-4 text-gray-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'PENDING'),
            },
            {
                label: 'Edit',
                icon: <Edit className="w-4 h-4 text-gray-500" />,
                onClick: (prediction) => {
                    window.location.href = `/dashboard/predictions/update/?id=${prediction.id}`;
                },
            },
            {
                label: 'Delete',
                icon: <Trash className="w-4 h-4 text-red-500" />,
                onClick: (prediction, index) => deletePrediction(index, prediction.id),
                className: 'text-red-600',
            },
        ] : [];
        const slice = 10
        const header = {
            title: "Previously Won " + title[1]?.defaulttitle || defaulttitles[1],
            //badge: 'Premium',
            //isAdmin: user?.role === "ADMIN",
            //onTitleEdit: (title: string) => updateTableTitle(2, title),

        }

        const uniqueId = Date.now().toString()
        const footer = {
            emptyMessage: 'Empty List',
            viewMoreLink: "/predictions/previousgames",
            viewMoreText: "View More",
            customActions: user?.role === "ADMIN" && (
                <Link
                    href={user ? "/dashboard/predictions/create" : "/signin"}
                    className="text-sm font-medium text-gray-900 hover:text-orange-600 transition-all duration-300"
                >
                    <div className="group flex gap-1 items-center underline underline-offset-4 text-orange-500 hover:text-gray-900">
                        <PlusCircle className='text-orange-500 size-5 group-hover:text-gray-900' /> Add Data
                    </div>
                    {!user && "Sign in to View"}
                </Link>
            )
        }

        return {
            data: WornBetOfTheDayGames,
            columns,
            actions,
            header,
            footer,
            slice,

            updating,
            uniqueId
        }
    }
    const PreviousWonData = () => {
        const columns: Column<Prediction>[] = [
            {
                header: 'Date',
                accessorKey: 'publishedAt', sortable: false,
                searchable: false,
                cell: (prediction) => (
                    <>
                        {moment(prediction.publishedAt).format('LL')}
                        <br />
                        {moment(prediction.publishedAt).format('LT')}
                    </>
                ),
            },
            {
                header: 'Match',
                accessorKey: 'homeTeam', sortable: false,
                searchable: false,
                cell: (prediction) => (
                    <div>
                        <div className="text-sm font-medium text-gray-900">
                            {prediction.sportType} • {prediction.league || 'Unknown League'}
                        </div>
                        <div className="text-sm text-gray-600 w-44 truncate">
                            {prediction.homeTeam} vs {prediction.awayTeam}
                        </div>
                    </div>
                ),
            },
            {
                header: 'Prediction',
                accessorKey: 'tip',
                cell: (prediction) => prediction.tip || 'No prediction available',
            },
            {
                header: 'Odds',
                accessorKey: 'odds', sortable: false,
                searchable: false,
                cell: (prediction) => (
                    <span className="px-2 py-1 text-xs font-medium text-neutral-800 bg-neutral-100 rounded-full">
                        {prediction.odds || 'N/A'}
                    </span>
                ),
            },
            {
                header: 'Result',
                accessorKey: 'result',
                cell: (prediction, rowIndex, colIndex) => {
                    if (prediction.result === "WON") {
                        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {updating && rowIndex === currentposition ? <LoaderCircle className="animate-spin size-4" /> : "Won ✓"}
                        </span>;
                    }
                    if (prediction.result === "LOST") {
                        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {updating && rowIndex === currentposition ? <LoaderCircle className="animate-spin size-4" /> : "Lost ✗"}
                        </span>;
                    }
                    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {updating && rowIndex === currentposition ? <LoaderCircle className="animate-spin size-4" /> : "Pending ⏳"}
                    </span>;
                },
            },
        ];
        const actions: Action<Prediction>[] = user?.role === "ADMIN" ? [
            {
                label: 'Won',
                icon: <Check className="w-4 h-4 text-neutral-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'WON'),
            },
            {
                label: 'Lost',
                icon: <X className="w-4 h-4 text-neutral-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'LOST'),
            },
            {
                label: 'Pending',
                icon: <Clock className="w-4 h-4 text-gray-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'PENDING'),
            },
            {
                label: 'Edit',
                icon: <Edit className="w-4 h-4 text-gray-500" />,
                onClick: (prediction) => {
                    window.location.href = `/dashboard/predictions/update/?id=${prediction.id}`;
                },
            },
            {
                label: 'Delete',
                icon: <Trash className="w-4 h-4 text-red-500" />,
                onClick: (prediction, index) => deletePrediction(index, prediction.id),
                className: 'text-red-600',
            },
        ] : [];
        const slice = 10
        const header = {
            title: title[2]?.defaulttitle || defaulttitles[2],
            //badge: 'Premium',
            isAdmin: user?.role === "ADMIN",
            onTitleEdit: (title: string) => updateTableTitle(2, title),

        }

        const uniqueId = Date.now().toString()
        const footer = {
            emptyMessage: 'Empty List',
            viewMoreLink: "/predictions/previousgames",
            viewMoreText: "View More",
            customActions: user?.role === "ADMIN" && (
                <Link
                    href={user ? "/dashboard/predictions/create" : "/signin"}
                    className="text-sm font-medium text-gray-900 hover:text-orange-600 transition-all duration-300"
                >
                    <div className="group flex gap-1 items-center underline underline-offset-4 text-orange-500 hover:text-gray-900">
                        <PlusCircle className='text-orange-500 size-5 group-hover:text-gray-900' /> Add Data
                    </div>
                    {!user && "Sign in to View"}
                </Link>
            )
        }

        return {
            data: PrevWonGames,
            columns,
            actions,
            header,
            footer,
            slice,

            updating,
            uniqueId
        }
    }
    const FreeGamesData = () => {
        const columns: Column<Prediction>[] = [
            {
                header: 'Date',
                accessorKey: 'publishedAt', sortable: false,
                searchable: false,
                cell: (prediction) => (
                    <>
                        {moment(prediction.publishedAt).format('LL')}
                        <br />
                        {moment(prediction.publishedAt).format('LT')}
                    </>
                ),
            },
            {
                header: 'Match',
                accessorKey: 'homeTeam', sortable: false,
                searchable: false,
                cell: (prediction) => (
                    <div>
                        <div className="text-sm font-medium text-gray-900">
                            {prediction.sportType} • {prediction.league || 'Unknown League'}
                        </div>
                        <div className="text-sm text-gray-600 w-44 truncate">
                            {prediction.homeTeam} vs {prediction.awayTeam}
                        </div>
                    </div>
                ),
            },
            {
                header: 'Prediction',
                accessorKey: 'tip',
                cell: (prediction) => prediction.tip || 'No prediction available',
            },
            {
                header: 'Odds',
                accessorKey: 'odds', sortable: false,
                searchable: false,
                cell: (prediction) => (
                    <span className="px-2 py-1 text-xs font-medium text-neutral-800 bg-neutral-100 rounded-full">
                        {prediction.odds || 'N/A'}
                    </span>
                ),
            },
            {
                header: 'Result',
                accessorKey: 'result',
                cell: (prediction, rowIndex, colIndex) => {
                    if (prediction.result === "WON") {
                        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {updating && rowIndex === currentposition ? <LoaderCircle className="animate-spin size-4" /> : "Won ✓"}
                        </span>;
                    }
                    if (prediction.result === "LOST") {
                        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {updating && rowIndex === currentposition ? <LoaderCircle className="animate-spin size-4" /> : "Lost ✗"}
                        </span>;
                    }
                    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {updating && rowIndex === currentposition ? <LoaderCircle className="animate-spin size-4" /> : "Pending ⏳"}
                    </span>;
                },
            },
        ];
        const actions: Action<Prediction>[] = user?.role === "ADMIN" ? [
            {
                label: 'Won',
                icon: <Check className="w-4 h-4 text-neutral-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'WON'),
            },
            {
                label: 'Lost',
                icon: <X className="w-4 h-4 text-neutral-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'LOST'),
            },
            {
                label: 'Pending',
                icon: <Clock className="w-4 h-4 text-gray-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'PENDING'),
            },
            {
                label: 'Edit',
                icon: <Edit className="w-4 h-4 text-gray-500" />,
                onClick: (prediction) => {
                    window.location.href = `/dashboard/predictions/update/?id=${prediction.id}`;
                },
            },
            {
                label: 'Delete',
                icon: <Trash className="w-4 h-4 text-red-500" />,
                onClick: (prediction, index) => deletePrediction(index, prediction.id),
                className: 'text-red-600',
            },
        ] : [];
        const slice = 10
        const header = {
            title: title[3]?.defaulttitle || defaulttitles[3],
            //badge: 'Premium',
            isAdmin: user?.role === "ADMIN",
            onTitleEdit: (title: string) => updateTableTitle(3, title),

        }

        const uniqueId = Date.now().toString()
        const footer = {
            emptyMessage: 'Empty List',
            viewMoreLink: "/predictions/freegames",
            viewMoreText: "View More",
            customActions: user?.role === "ADMIN" && (
                <Link
                    href={user ? "/dashboard/predictions/create" : "/signin"}
                    className="text-sm font-medium text-gray-900 hover:text-orange-600 transition-all duration-300"
                >
                    <div className="group flex gap-1 items-center underline underline-offset-4 text-orange-500 hover:text-gray-900">
                        <PlusCircle className='text-orange-500 size-5 group-hover:text-gray-900' /> Add Data
                    </div>
                    {!user && "Sign in to View"}
                </Link>
            ),
        }
        const className = "bg-orange-50 border-2 border-orange-200 rounded-lg"
        const component = <div key={Date.now()} className="relative flex items-center justify-between gap-4 px-4 py-4 bg-orange-100 text-orange-800 rounded-lg shadow-sm min-w-xs max-w-sm lg:max-w-lg mx-auto my-4 ">
            <div className="flex items-center w-2/3 mr-4">
                {user?.role === "ADMIN" && <Edit2 className="size-4 text-orange-600 hover:text-orange-800 cursor-pointer mr-2 md:mr-4"
                    onClick={showBettingCode} />}
                <p className='text-xs sm:text-sm md:text-base text-center font-medium leading-5'>BET DIRECTLY ON <span className='italic underline underline-offset-4'>{bettingPlatform}</span></p>
            </div>
            <div >&bull;</div>
            <div className="flex items-center w-1/3 gap-2">
                <p className='text-xs sm:text-sm md:text-base text-center leading-5 font-medium'>CODE: <span className='font-extrabold'>{bettingCode}</span></p>
                <Copy className="size-8 md:size-4 font-medium text-orange-600 hover:text-orange-800 transition-colors duration-300"
                    onClick={() => {
                        navigator.clipboard.writeText(bettingCode);
                        toast.success(`Code ${bettingCode} copied to clipboard!`);
                    }}
                />
            </div>
        </div>

        return {
            data: FreeGames,
            columns,
            actions,
            header,
            footer,
            slice,
            updating,
            uniqueId,
            className,
            component
        }
    }
    const MidnightOwlData = () => {
        const columns: Column<Prediction>[] = [
            {
                header: 'Date',
                accessorKey: 'publishedAt', sortable: false,
                searchable: false,
                cell: (prediction) => (
                    <>
                        {moment(prediction.publishedAt).format('LL')}
                        <br />
                        {moment(prediction.publishedAt).format('LT')}
                    </>
                ),
            },
            {
                header: 'Match',
                accessorKey: 'homeTeam', sortable: false,
                searchable: false,
                cell: (prediction) => (
                    <div>
                        <div className="text-sm font-medium text-gray-900">
                            {prediction.sportType} • {prediction.league || 'Unknown League'}
                        </div>
                        <div className="text-sm text-gray-600 w-44 truncate">
                            {prediction.homeTeam} vs {prediction.awayTeam}
                        </div>
                    </div>
                ),
            },
            {
                header: 'Prediction',
                accessorKey: 'tip',
                cell: (prediction) => prediction.tip || 'No prediction available',
            },
            {
                header: 'Odds',
                accessorKey: 'odds', sortable: false,
                searchable: false,
                cell: (prediction) => (
                    <span className="px-2 py-1 text-xs font-medium text-neutral-800 bg-neutral-100 rounded-full">
                        {prediction.odds || 'N/A'}
                    </span>
                ),
            },
            {
                header: 'Result',
                accessorKey: 'result',
                cell: (prediction, rowIndex, colIndex) => {
                    if (prediction.result === "WON") {
                        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {updating && rowIndex === currentposition ? <LoaderCircle className="animate-spin size-4" /> : "Won ✓"}
                        </span>;
                    }
                    if (prediction.result === "LOST") {
                        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            {updating && rowIndex === currentposition ? <LoaderCircle className="animate-spin size-4" /> : "Lost ✗"}
                        </span>;
                    }
                    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        {updating && rowIndex === currentposition ? <LoaderCircle className="animate-spin size-4" /> : "Pending ⏳"}
                    </span>;
                },
            },
        ];
        const actions: Action<Prediction>[] = user?.role === "ADMIN" ? [
            {
                label: 'Won',
                icon: <Check className="w-4 h-4 text-neutral-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'WON'),
            },
            {
                label: 'Lost',
                icon: <X className="w-4 h-4 text-neutral-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'LOST'),
            },
            {
                label: 'Pending',
                icon: <Clock className="w-4 h-4 text-gray-500" />,
                onClick: (prediction, index) => updateWLPrediction(index, prediction, 'PENDING'),
            },
            {
                label: 'Edit',
                icon: <Edit className="w-4 h-4 text-gray-500" />,
                onClick: (prediction) => {
                    window.location.href = `/dashboard/predictions/update/?id=${prediction.id}`;
                },
            },
            {
                label: 'Delete',
                icon: <Trash className="w-4 h-4 text-red-500" />,
                onClick: (prediction, index) => deletePrediction(index, prediction.id),
                className: 'text-red-600',
            },
        ] : [];
        const slice = 10
        const header = {
            title: title[4]?.defaulttitle || defaulttitles[4],
            //badge: 'Premium',
            isAdmin: user?.role === "ADMIN",
            onTitleEdit: (title: string) => updateTableTitle(4, title),

        }

        const uniqueId = Date.now().toString()
        const footer = {
            emptyMessage: 'Empty List',
            viewMoreLink: "/predictions/freegames",
            viewMoreText: "View More",
            customActions: user?.role === "ADMIN" && (
                <Link
                    href={user ? "/dashboard/predictions/create" : "/signin"}
                    className="text-sm font-medium text-gray-900 hover:text-orange-600 transition-all duration-300"
                >
                    <div className="group flex gap-1 items-center underline underline-offset-4 text-orange-500 hover:text-gray-900">
                        <PlusCircle className='text-orange-500 size-5 group-hover:text-gray-900' /> Add Data
                    </div>
                    {!user && "Sign in to View"}
                </Link>
            ),
        }
        const className = "bg-purple-50 border-2 border-purple-200 rounded-lg"

        return {
            data: MidnightOwlGames,
            columns,
            actions,
            header,
            footer,
            slice,
            updating,
            uniqueId,
            className
        }
    }

    const WelcomPopoup = () => {
        const [isOpen, setIsOpen] = useState(false);
        useEffect(() => {
            setIsOpen(true);

            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    setIsOpen(false);
                    setShouldShow(false);
                }
            };

            const handleClickOutside = (e: MouseEvent) => {
                if ((e.target as HTMLElement).closest('[data-popup]') === null) {
                    setIsOpen(false);
                    setShouldShow(false);
                }
            };

            document.addEventListener('keydown', handleEscape);
            document.addEventListener('mousedown', handleClickOutside);


            return () => {
                document.removeEventListener('keydown', handleEscape);
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, []);

        if (!isOpen) return null;


        return (
            <div className="fixed inset-0 flex gap-2 bg-black/60 z-50 backdrop-blur-sm p-8 items-center justify-center transition-all duration-300">
                <XCircle className='absolute text-neutral-500 hover:text-red-700 rounded-full p-2 top-10 right-10 size-10 transition-all duration-300'
                    onClick={() => setIsOpen(false)}
                />
                <div data-popup
                    className="bg-neutral-800/80 backdrop-blur-md px-6 py-12 rounded-lg shadow-lg w-full max-w-lg animate-in fade-in zoom-in duration-500"
                    style={{
                        animation: 'fadeInScale 0.5s ease-out',
                        transform: 'scale(0.9)',
                        opacity: 0,
                        animationFillMode: 'forwards'
                    }}>
                    <style jsx>{`
                    @keyframes fadeInScale {
                        from {
                            transform: scale(0.9);
                            opacity: 0;
                        }
                        to {
                            transform: scale(1);
                            opacity: 1;
                        }
                    }
                `}</style>
                    <h2 className="text-xl font-bold text-white mb-4 text-center">LET US ALL WIN TOGETHER</h2>
                    <hr className="border-neutral-600 my-4" />

                    <div className="my-4 rounded-md bg-orange-100 overflow-hidden">
                        <img
                            className='bject-cover w-full rounded-md'
                            src="/bbt.jpg" alt="" />
                    </div>
                    <hr className="border-neutral-600 my-8" />
                    <div className="flex justify-center gap-4">

                        <Link
                            href="https://t.me/bigboyzg"
                            target='_blank'
                            className="px-6 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold rounded-lg hover:from-orange-500 hover:to-orange-600 transition-colors"
                        >
                            Join Telegram Channel!
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-full">
            {/* Hero Section */}
            {shouldShow && <WelcomPopoup />}

            <section className="flex flex-col justify-center items-center relative bg-gradient-to-r from-neutral-600/40 to-neutral-800/40 text-white w-full bg-url(/stadium.webp) bg-cover bg-center"
                style={{
                    backgroundImage: 'linear-gradient(to right, #1a1818c0, #111010cb), url(/stadium.webp)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}>

                <div className="flex items-center justify-center w-full container overflow-hidden my-20 md:my-28 lg:my-20 xl:my-28 2xl:my-32">
                    <div className="flex flex-col w-full mx-4 md:mx-8 justify-center text-left gap-4 md:gap-8 xl:gap-02 mt-10">
                        <h1 className="text-2xl sm:text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl font-bold leading-relaxed md:leading-16 xl:leading-20">
                            Welcome to <br /> BigBoysTips Official Hub!
                        </h1>
                        <p className="text-xs sm:text-lg md:text-xl text-gray-300 max-w-2xl xl:max-w-4xl">
                            Join our elite community for expert predictions and data-driven insights that help turn your betting passion into consistent profits.
                        </p>

                        <div className="flex flex-col gap-4 mt-4 md:mt-8">
                            <Link
                                href="/pricing"
                                className="group relative overflow-hidden px-6 py-1.5 w-max rounded-lg bg-orange-400 text-black font-semibold text-center transform hover:scale-[1.02] transition-all duration-300"
                            >
                                <span className="text-sm md:text-lg lg:text-2xl  flex items-center justify-center gap-2">
                                    GET VIP GAMES
                                    <div className="absolute top-1 right-1">
                                        <div className="relative w-2 h-2">
                                            <div className="absolute inset-0 rounded-full bg-orange-400 animate-ping" />
                                        </div>
                                    </div>
                                </span>
                            </Link>
                            <Link
                                href="https://t.me/bigboyzg"
                                target='_blank'
                                className="group relative overflow-hidden px-6 py-1.5  w-max rounded-lg bg-gradient-to-r from-orange-400 to-orange-500 text-black font-semibold text-center transform hover:scale-[1.02] transition-all duration-300 shadow-lg"
                            >
                                <span className="text-sm md:text-lg lg:text-2xl flex items-center justify-center gap-2">
                                    <svg className="size-4 lg:size-6" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.227-.535.227l.19-2.712 4.94-4.465c.215-.19-.047-.296-.332-.106l-6.103 3.854-2.623-.816c-.57-.18-.582-.57.12-.843l10.238-3.948c.473-.174.887.104.605 1.337z" />
                                    </svg>
                                    JOIN TELEGRAM CHANNEL
                                </span>
                            </Link>

                        </div>


                    </div>
                </div>
            </section>

            {/* Recent Predictions Section */}
            <section className="py-20">
                <div className="container w-full mx-auto px-4">
                    <div className="flex flex-col space-y-12">
                        {/* Section Header */}
                        <div className="text-center">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Free Predictions
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
                                Access our winning predictions with proven success rates. Upgrade to VIP for premium insights.
                            </p>
                        </div>

                        <div className="w-full">
                            <div className="flex flex-col w-full xl:col-span-2 gap-16">

                                {/* VIP Games */}
                                {content.isSubscriptionActive &&
                                    <TableComponent
                                        uniqueId={VIPData().uniqueId}
                                        data={VIPData().data}
                                        columns={VIPData().columns}
                                        slice={VIPData().slice}
                                        actions={VIPData().actions}
                                        footer={VIPData().footer}
                                        header={VIPData().header}
                                        updating={updating}
                                        currentPosition={currentposition}
                                    />}
                                <TableComponent
                                    uniqueId={BetOfTheDayData().uniqueId}
                                    data={BetOfTheDayData().data}
                                    columns={BetOfTheDayData().columns}
                                    slice={BetOfTheDayData().slice}
                                    actions={BetOfTheDayData().actions}
                                    footer={BetOfTheDayData().footer}
                                    header={BetOfTheDayData().header}
                                    updating={updating}
                                    currentPosition={currentposition}
                                />
                                <TableComponent
                                    uniqueId={WonBetOfTheDayData().uniqueId}
                                    data={WonBetOfTheDayData().data}
                                    columns={WonBetOfTheDayData().columns}
                                    slice={WonBetOfTheDayData().slice}
                                    actions={WonBetOfTheDayData().actions}
                                    footer={WonBetOfTheDayData().footer}
                                    header={WonBetOfTheDayData().header}
                                    updating={updating}
                                    currentPosition={currentposition}
                                />
                                <TableComponent
                                    uniqueId={PreviousWonData().uniqueId}
                                    data={PreviousWonData().data}
                                    columns={PreviousWonData().columns}
                                    slice={PreviousWonData().slice}
                                    actions={PreviousWonData().actions}
                                    footer={PreviousWonData().footer}
                                    header={PreviousWonData().header}
                                    updating={updating}
                                    currentPosition={currentposition}
                                />
                                <TableComponent
                                    uniqueId={FreeGamesData().uniqueId}
                                    data={FreeGamesData().data}
                                    columns={FreeGamesData().columns}
                                    slice={FreeGamesData().slice}
                                    actions={FreeGamesData().actions}
                                    footer={FreeGamesData().footer}
                                    header={FreeGamesData().header}
                                    className={FreeGamesData().className}
                                    updating={updating}
                                    currentPosition={currentposition}
                                    component={FreeGamesData().component}
                                />

                                {new Date().getHours() >= 0 && new Date().getHours() < 5 ? (<TableComponent
                                    uniqueId={MidnightOwlData().uniqueId}
                                    data={MidnightOwlData().data}
                                    columns={MidnightOwlData().columns}
                                    slice={MidnightOwlData().slice}
                                    actions={MidnightOwlData().actions}
                                    footer={MidnightOwlData().footer}
                                    header={MidnightOwlData().header}
                                    className={MidnightOwlData().className}
                                    updating={updating}
                                    currentPosition={currentposition}

                                />) : (
                                    <div className="text-center py-12 border border-gray-200 rounded-lg bg-orange-50">
                                        <div className="w-20 h-20 mx-auto mb-6 text-gray-400">
                                            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xs sm:text-xl font-medium text-gray-900 mb-2">Predictions Unavailable</h3>
                                        <p className="text-xs sm:text-base text-gray-600">Our Midnight Oracle predictions are only available from 12 AM to 5 AM.</p>
                                        <p suppressHydrationWarning className="text-xs sm:text-sm text-orange-600 mt-2">Returns in {23 - new Date().getHours()} hours - {60 - new Date().getMinutes()} mins</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            < section className="relative py-20 overflow-hidden" >
                {/* Gradient Background */}


                <div className="container w-full mx-auto px-4 text-center relative z-10">
                    {/* Glowing Effect */}
                    <div className="relative inline-block mb-6">
                        <div className="absolute -inset-1  group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
                        <h2 className="relative text-3xl md:text-4xl font-bold text-neutral-600 mb-2">
                            Ready to Start Winning?
                        </h2>
                    </div>

                    <p className="text-base sm:text-xl text-orange-500 mb-12 max-w-2xl mx-auto">
                        Join thousands of successful bettors who are already profiting from our expert predictions.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <Link
                            href="/signup"
                            className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium tracking-wider text-gray-900 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 transition-all duration-300"
                        >
                            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-orange-600/20 rounded-full group-hover:w-64 group-hover:h-64"></span>
                            <span className="relative font-semibold">Get Started Now</span>
                        </Link>

                        <Link
                            href="/pricing"
                            className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-medium text-orange-500 rounded-lg hover:bg-raonge-500/10 transition-all duration-300 border border-white/30"
                        >
                            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-black rounded-full group-hover:w-64 group-hover:h-64"></span>
                            <span className="relative text-orange-600 font-semibold">Subscribe Now!</span>
                        </Link>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center">
                        {[
                            { label: "Subscribers", value: "10000", start: "500", suffix: "+" },
                            { label: "Success Rate", value: "98", start: "10", suffix: "%" },
                            { label: "Expert Tips", value: "50000", start: "500", suffix: "+" },
                            { label: "Avg. ROI", value: "127", start: "10", suffix: "%" }
                        ].map((stat, index) => (
                            <div key={index} className="text-center bg-orange-200/10 backdrop-blur-sm p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-orange-500/50">
                                <p suppressHydrationWarning className="text-xl md:text-3xl font-bold text-Neutral-600 mb-2">
                                    <span suppressHydrationWarning className="inline-block" data-start={stat.start} data-end={stat.value}>
                                        {stat.value}
                                    </span>
                                    {stat.suffix}
                                </p>
                                <p className="text-orange-600 text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Add this script tag to the end of your component */}
                    <script dangerouslySetInnerHTML={{
                        __html: `
                                function animateValue(element, start, end, duration) {
                                let current = start;
                                const range = end - start;
                                const increment = range / (duration / 16);
                                const timer = setInterval(() => {
                                    current += increment;
                                    if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                                    current = end;
                                    clearInterval(timer);
                                    }
                                    element.textContent = Math.round(current);
                                }, 16);
                                }

                                const observer = new IntersectionObserver((entries) => {
                                entries.forEach(entry => {
                                    if (entry.isIntersecting) {
                                    const element = entry.target;
                                    const start = parseInt(element.dataset.start);
                                    const end = parseInt(element.dataset.end);
                                    animateValue(element, start, end, 2000);
                                    observer.unobserve(element);
                                    }
                                });
                                }, { threshold: 0.5 });

                                document.querySelectorAll('[data-start]').forEach(element => {
                                observer.observe(element);
                                });
                            `
                    }} />
                </div>
            </section >


            {/* Contact Section */}
            < section className="py-8 bg-neutral-500 w-full mx-auto" >
                <div className="flex flex-col container w-full items-center justify-center mx-auto px-4 w-full gap-8">

                    <div className="flex items-center gap-4">
                        <a href="tel:+233542810847" target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center hover:bg-neutral-200 transition-colors">
                                <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            {/* <span className="text-gray-700 font-medium">Join our Telegram Channel</span> */}
                        </a>
                        <a href="mailto:senanick1333@gmail.com" target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3  bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center hover:bg-neutral-200 transition-colors">
                                <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            {/* <span className="text-gray-700 font-medium">Join our Telegram Channel</span> */}
                        </a>
                        <a href="https://t.me/bigboyzg" target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center hover:bg-neutral-200 transition-colors">
                                <svg className="w-5 h-5 text-neutral-600" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.227-.535.227l.19-2.712 4.94-4.465c.215-.19-.047-.296-.332-.106l-6.103 3.854-2.623-.816c-.57-.18-.582-.57.12-.843l10.238-3.948c.473-.174.887.104.605 1.337z" />
                                </svg>
                            </div>
                            {/* <span className="text-gray-700 font-medium">Join our Telegram Channel</span> */}
                        </a>
                        <a href="https://x.com/@SenaNick1" target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-3  bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center hover:bg-neutral-200 transition-colors">
                                <svg className="w-5 h-5 text-neutral-600" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                </svg>
                            </div>
                            {/* <span className="text-gray-700 font-medium">Join our Telegram Channel</span> */}
                        </a>

                    </div>
                    {/*  <div>
            <p className="text-gray-600 text-xs">Email</p>
          </div> */}


                </div>


            </section >

        </div >
    )
}

export default HomePageComponent

