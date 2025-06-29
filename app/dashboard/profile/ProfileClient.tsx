/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useAuth } from '@/app/contexts/AuthContext'
import moment from 'moment'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { z } from 'zod'

// Define Zod schema for user profile

type Setting = {
    id?: string | number;
    values: string;
};

type Profile = {
    username: string;
    email: string;
    phone: string;
    lastName: string;
    country: string;
    city: string;
    region: string;
    role: string;
    currency: string;
    verified: boolean;
    datetime: string;
    symbol: string;
    subscriptions: any[];
    Settings: Setting[];
};

const initialProfile: Profile = {
    username: '',
    email: '',
    phone: '',
    lastName: '',
    country: '',
    city: '',
    region: '',
    role: '',
    currency: '',
    verified: false,
    datetime: '',
    symbol: '',
    subscriptions: [],
    Settings: []
}

const initialNotifications = [
    { label: 'New predictions', description: 'Get notified when new predictions are available', checked: true },
    { label: 'Results', description: 'Get notified about your prediction results', checked: true },
    { label: 'Subscription', description: 'Receive billing and subscription updates', checked: false },
]

export default function ProfileClient({ id }: { id: string }) {
    const [profile, setProfile] = useState(initialProfile)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [notifications, setNotifications] = useState(initialNotifications)
    const [loading, setLoading] = useState(false)
    const [selectedSubIdx, setSelectedSubIdx] = useState(0);
    const [showSubs, setShowSubs] = useState(false);
    const { user } = useAuth()

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true)
            try {
                const res = await fetch(`/api/user/${id}/?include=` + JSON.stringify({ subscriptions: true, Settings: true }));
                if (!res.ok) throw new Error("Failed to fetch users");
                const result = await res.json();

                const data = { ...result[0] }
                data.location = JSON.parse(data.location)
                setSelectedSubIdx(data.Settings.length > 0 ? JSON.parse(data.Settings[0].values).subscriptionIndex : 0)
                console.log("data: ", data)
                setProfile({
                    ...data,
                    country: data.location.country,
                    city: data.location.city,
                    region: data.location.region,
                    currency: data.location.currencyname,
                    symbol: data.location.currencysymbol,
                    subscriptions: data.subscriptions,
                    Settings: data.Settings
                })
            } catch (error: any) {
                console.log(error.message)
                setProfile(initialProfile)
            } finally {
                setLoading(false)
            }
        }
        fetchUsers()
    }, [])

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setProfile(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleNotificationChange = (idx: number) => {
        setNotifications(notifications.map((n, i) => i === idx ? { ...n, checked: !n.checked } : n))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        // Simulate API call
        setTimeout(() => {
            setLoading(false)
            toast.success('Profile updated!')
        }, 1200)
    }

    function SubscriptionCard({ sub, onSelect }: { sub: any, onSelect?: () => void }) {
        if (!sub) return null;
        return (
            <div
                className={`border rounded-xl p-5 shadow transition-all duration-200 bg-gradient-to-br from-blue-50 to-white ${onSelect ? 'cursor-pointer hover:shadow-lg hover:border-blue-400' : ''}`}
                onClick={onSelect}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-700 uppercase tracking-wide">
                                {sub.plan || 'Unknown Plan'}
                            </span>
                            {sub.status && (
                                <span className={`inline-block px-2 py-1 text-xs rounded font-medium ${sub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                    {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                                </span>
                            )}
                        </div>
                        <div className="mt-2 flex flex-col gap-1 text-sm text-gray-600">
                            {sub.startedAt && (
                                <span>
                                    <span className="font-medium text-gray-500">Start:</span>{' '}
                                    {moment(sub.startedAt).format('LLL')}
                                </span>
                            )}
                            {sub.expiresAt && (
                                <span>
                                    <span className="font-medium text-gray-500">End:</span>{' '}
                                    {moment(sub.expiresAt).format('LLL')}
                                </span>
                            )}
                        </div>
                    </div>
                    {onSelect && (
                        <button
                            type="button"
                            className="ml-4 px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                        >
                            Select
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Profile Information */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">Profile Information</h2>
                        <p className="text-sm text-gray-600 mt-1">Update your account information</p>
                    </div>
                    <div className="p-6">
                        <form className="space-y-6" method='GET' onSubmit={handleSubmit} autoComplete='off'>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        autoComplete="user-name"
                                        className="w-full rounded-lg px-4 py-2 border outline-0 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter your username"
                                        value={profile.username}
                                        onChange={handleProfileChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">User Status</label>
                                    <input
                                        type="text"
                                        name="role"
                                        disabled
                                        readOnly
                                        className="w-full rounded-lg px-4 py-2 border outline-0 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                        value={profile.role}
                                        onChange={handleProfileChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input
                                        type="text"
                                        name="email"
                                        autoComplete="eimail-address"
                                        className="w-full rounded-lg px-4 py-2 border outline-0 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                        value={profile.email}
                                        onChange={handleProfileChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="w-full rounded-lg px-4 py-2 border outline-0 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                        value={profile.phone}
                                        onChange={handleProfileChange}
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        disabled
                                        readOnly
                                        className="w-full rounded-lg px-4 py-2 border outline-0 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                        value={`${profile.country}  (${profile.city} - ${profile.region})`}
                                        onChange={handleProfileChange}
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                                    <input
                                        type="text"
                                        name="country"
                                        disabled
                                        readOnly
                                        className="w-full rounded-lg px-4 py-2 border outline-0 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                        value={`${profile.currency} (${profile.symbol})`}
                                        onChange={handleProfileChange}
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        autoComplete="new-password"
                                        className="w-full rounded-lg px-4 py-2 border outline-0 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="Enter new password"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        autoComplete='off'
                                        className="w-full rounded-lg px-4 py-2 border outline-0 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Subscription Information */}
            <div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">Subscription</h2>
                        <p className="text-sm text-gray-600 mt-1">Your current plan</p>
                    </div>
                    <div className="p-6">
                        {profile.subscriptions && profile.subscriptions.length > 0 ? (
                            <div className="space-y-4">
                                {/* Show the first subscription */}
                                <SubscriptionCard sub={profile.subscriptions[selectedSubIdx ?? 0]} />

                                {/* Toggle button if more than one subscription */}
                                {profile.subscriptions.length > 1 && (
                                    <div className="pt-2">
                                        <button
                                            type="button"
                                            className="w-full px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                            onClick={() => setShowSubs(!showSubs)}    >
                                            {showSubs ? 'Hide Other Subscriptions' : `Show ${profile.subscriptions.length - 1} More Subscription${profile.subscriptions.length > 2 ? 's' : ''}`}
                                        </button>
                                    </div>
                                )}

                                {/* List other subscriptions if toggled */}
                                {showSubs && (
                                    <div className="pt-4 space-y-4">
                                        {profile.subscriptions.map((sub: any, idx: number) =>
                                            idx !== selectedSubIdx ? (
                                                <div key={sub.id || idx}>
                                                    <SubscriptionCard sub={sub} onSelect={async () => {
                                                        setSelectedSubIdx(idx)
                                                        setShowSubs(false)
                                                        profile.Settings.length > 0
                                                            ?
                                                            await fetch(`/api/settings/${profile.Settings[0].id!}`, {
                                                                method: 'PUT',
                                                                headers: {
                                                                    'Content-Type': 'application/json',
                                                                },
                                                                body: JSON.stringify({
                                                                    userId: user?.id,
                                                                    values: JSON.stringify({ subscriptionIndex: idx })
                                                                })
                                                            }).then(() => toast.success(`Selected subscription: ${sub.plan}`))
                                                            :
                                                            await fetch(`/api/settings`, {
                                                                method: 'POST',
                                                                headers: {
                                                                    'Content-Type': 'application/json',
                                                                },
                                                                body: JSON.stringify({
                                                                    userId: user?.id,
                                                                    values: JSON.stringify({ subscriptionIndex: idx })

                                                                })
                                                            }).then(() => {
                                                                toast.success(`Selected subscription: ${sub.plan}`)
                                                            })
                                                    }} />
                                                </div>
                                            ) : null
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500">No subscriptions found.</div>
                        )}
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
                        <p className="text-sm text-gray-600 mt-1">Manage your notification preferences</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {notifications.map((item, i) => (
                                <div key={i} className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            checked={item.checked}
                                            onChange={() => handleNotificationChange(i)}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                    </div>
                                    <div className="ml-3">
                                        <label className="text-sm font-medium text-gray-700">{item.label}</label>
                                        <p className="text-xs text-gray-500">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
