"use client";

import { useState, useEffect } from "react";
import { getProfileAction, editUserAction } from "./actions";
import Link from "next/link";


export default function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getProfileAction().then(setUser).catch(console.error);
  }, []);

  async function handleEdit() {
    await editUserAction({ name: "New Name" });
    alert("Updated!");
  }

  async function handleDelete() {
    if (!confirm("Are you sure?")) return;
    await deleteUserAction(user._id);
    alert("Deleted!");
  }

  if (!user)  return  <div className="flex w-full items-center justify-center w-full"> <p className="text-center  text-3xl">Loading Services</p> </div>;

  return (
    <div className="flex justify-center w-full items-center h-full bg-gray-50 px-4">
    <div className="w-full max-w-sm bg-white text-gray-800 rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex flex-col items-center">
        <div className="bg-indigo-500 text-white h-16 w-16 rounded-full flex justify-center items-center text-xl font-bold uppercase">
          {user.name.slice(0, 2)}
        </div>
        <h1 className="mt-4 text-xl font-semibold">{user.name}</h1>
        <p className="text-gray-600">{user.email}</p>
      </div>

      <div className="mt-4 text-sm">
        <p className="mb-1">
          <span className="font-semibold text-gray-700">User ID:</span> {user._id}
        </p>
        <p>
          <span className="font-semibold text-gray-700">Created At:</span>{" "}
          {new Date(user.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Link href="/dashboard/profile/edit">
          <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md transition">
            Edit Profile
          </button>
        </Link>

        {/* Uncomment if needed
        <button
          onClick={() => {
            deleteUser(user._id);
          }}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          Delete Profile
        </button>
        */}
      </div>
    </div>
  </div>
  );
}
