"use client";
import { useDialog } from "@/app/components/shared/dialog";
import { useAuth } from "@/app/contexts/AuthContext";
import { User } from "@/app/lib/interface";
import { Check, Edit, MoreVertical, Trash, User as EditUser } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const PAGE_SIZE = 10;

const UsersClient = () => {
    const dialog = useDialog();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(true);
    const [currentPosition, setCurrentPosition] = useState<number>(-1);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = PAGE_SIZE;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/user");
                if (!res.ok) throw new Error("Failed to fetch users");
                const data = await res.json();

                setUsers(data);
            } catch {
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const deleteUser = async (index: number, id: string) => {
        setCurrentPosition(index);
        dialog.showDialog({
            title: "Delete user",
            message: "Are you sure you want to delete this user? This action cannot be undone.",
            type: "confirm",
            onConfirm: async () => {
                setUpdating(true);
                try {
                    const response = await fetch(`/api/user/${id}`, {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                    });
                    if (!response.ok) throw new Error("Failed to delete user");
                    setUsers(users.filter(pred => pred.id !== id));
                    setUpdating(false);
                } catch (error) {
                    setUpdating(false);
                    console.error("Error deleting user:", error);
                }

            }
        })
    }
    const updateUser = async (index: number, user: User, data: string) => {
        setCurrentPosition(index);
        const { id, ...dataWithoutId } = user;
        dialog.showDialog({
            title: "Update user",
            message: `Are you sure you want to update this user to "${data}"?`,
            type: "confirm",
            onConfirm: async () => {
                setUpdating(true);
                try {
                    const response = await fetch(`/api/user/${id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            ...dataWithoutId,
                            role: data,
                        }),
                    });
                    if (!response.ok) throw new Error("Failed to Update user");
                    const result = await response.json();

                    const updatedusers = [...users];
                    updatedusers[index] = {
                        ...updatedusers[index],
                        role: data as User['result'],
                    };
                    setUsers([
                        ...updatedusers
                    ])
                    setUpdating(false);
                    console.log("user updated successfully:", result);
                    // setusers(result);
                } catch (error) {
                    setUpdating(false);
                    console.error("Error updating user:", error);
                }

            }
        })
    }

    const totalPages = Math.ceil(users.length / pageSize);
    const paginatedusers = users.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <div className="p-6 lg:p-4 bg-white">
            <div className="sticky top-0 flex items-center bg-white border-b border-gray-200 px-4 py-3 z-10">
            
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        A list of all users in your platform including their name, role, and subscription status.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                    <Link
                        href="/dashboard/users/create"
                        type="button"
                        className="inline-flex items-center justify-center rounded-md border border-transparent bg-orange-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 sm:w-auto">
                        Add user
                    </Link>
                </div>
            </div>
            <div className="mt-8 flex flex-col">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-neutral-300 ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    {users.length > 0 && !loading &&
                                        <tr>
                                            <th scope="col" className="py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                                Name
                                            </th>
                                            <th scope="col" className="py-2 text-left text-sm font-semibold text-gray-900">
                                                Email
                                            </th>
                                            <th scope="col" className="py-2 text-left text-sm font-semibold text-gray-900">
                                                Country
                                            </th>

                                            <th scope="col" className="py-2 text-left text-sm font-semibold text-gray-900">
                                                Email Verified
                                            </th>
                                            <th scope="col" className="py-2 text-left text-sm font-semibold text-gray-900">
                                                Role
                                            </th>
                                            <th scope="col" className="py-2 text-left text-sm font-semibold text-gray-900">
                                                Subscription
                                            </th>
                                            <th scope="col" className="py-2 text-left text-sm font-semibold text-gray-900">
                                                Join Date
                                            </th>
                                            <th scope="col" className="relative py-2 pl-3 pr-4 sm:pr-6 font-semibold text-gray-900">
                                                Actions
                                            </th>
                                        </tr>}
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {loading ? (
                                        <tr className="w-full">
                                            <td colSpan={7} className="text-center py-8 text-gray-500">Loading users...</td></tr>
                                    ) : users.length === 0 ? (
                                        <tr className="w-full">
                                            <td colSpan={7} className="text-center py-8 text-gray-500">No users found.</td></tr>
                                    ) : (
                                        paginatedusers.map((user, i) => {
                                            const location = user.location ? JSON.parse(user.location) : {};
                                            return (
                                                <tr key={user.id}>
                                                    <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                        {user.username}
                                                    </td>
                                                    <td className="whitespace-nowrap py-2 text-sm text-gray-500">{user.email}</td>
                                                    <td className="whitespace-nowrap py-2 text-sm text-gray-500">
                                                        <div className="inline-flex items-center">
                                                            <Image
                                                                src={location.flag || "/default-avatar.png"}
                                                                alt={user.username}
                                                                width={24}
                                                                height={24}
                                                                className="inline-block h-6 w-6 ite rounded-full mr-2" />
                                                            {location.country} &bull; ({location.currencycode})
                                                            <br />
                                                            {location.region}
                                                        </div>


                                                    </td>
                                                    <td className="whitespace-nowrap py-2 text-sm text-gray-500">
                                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${user.emailVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                            {user.emailVerified ? 'Verified' : 'Unverified'}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap py-2 text-sm text-gray-500">
                                                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap py-2 text-sm text-gray-500"> {user.subscription || "No Subscription"}</td>
                                                    <td className="whitespace-nowrap py-2 text-sm text-gray-500">{moment(user.createdAt).format("LLL")}</td>
                                                    {users.length > 0 && !loading && <td className="flex justify-end whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">

                                                        <div className="group my-4 ">
                                                            <MoreVertical
                                                                className="text-neutral-500 cursor-pointer hover:text-neutral-600 size-5"
                                                                tabIndex={0}
                                                            />
                                                            <div className="absolute right-5  w-38 bg-white border border-gray-200 rounded shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity z-10 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto">
                                                                <button
                                                                    className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                    onClick={() => {
                                                                        // Navigate to edit page
                                                                        updateUser(i, user, user.role === 'ADMIN' ? 'USER' : 'ADMIN');
                                                                    }}
                                                                >
                                                                    <EditUser className="w-4 h-4 text-neutral-500" />
                                                                    {user.role === 'ADMIN' ? 'Make User' : 'Make Admin'}
                                                                </button>
                                                                <button
                                                                    className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                    onClick={() => {
                                                                        // Navigate to edit page
                                                                        window.location.href = `/dashboard/users/update/?id=${user.id}`;
                                                                    }}
                                                                >
                                                                    <Edit className="w-4 h-4 text-gray-500" />
                                                                    Edit User
                                                                </button>
                                                                <button
                                                                    className="w-full flex items-center gap-2 text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                                    onClick={() => deleteUser(i, user.id)}
                                                                >
                                                                    <Trash className="w-4 h-4 text-red-500" />
                                                                    Delete User
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>}
                                                </tr>
                                            )
                                        })
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            {users.length > 0 && (
                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                                    <button
                                        className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                    <span className="text-sm text-gray-600">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        className="text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsersClient;
