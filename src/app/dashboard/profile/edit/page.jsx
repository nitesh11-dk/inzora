"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserForm from "@/components/UserForm";
import { getProfileAction, editUserAction } from "../actions";

const EditUser = () => {
  const router = useRouter();  // initialize router
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProfileAction()
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load user profile");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>{error}</p>;

  const initialData = {
    name: user.name || "",
    email: user.email || "",
    password: "",
  };

  const handleEdit = async (formData) => {
    try {
      const res = await editUserAction(formData);
      if (res.success) {
        router.push("/dashboard/profile");  // Navigate on success
      } else {
        alert("Failed to update profile");
      }
      return res;
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
      return { success: false };
    }
  };

  return (
    <UserForm
      initialData={initialData}
      onSubmit={handleEdit}
      buttonText="Update"
    />
  );
};

export default EditUser;
