"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserForm from "@/components/UserForm";
import { getProfileAction, editUserAction } from "../actions";
import { toast } from "react-toastify";
import LoadingState from "@/components/LodingState"; 
const EditUser = () => {
  const router = useRouter();
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
        setError("⚠️ Failed to load user profile");
        setLoading(false);
      });
  }, []);

 if (loading) return <LoadingState text="Loading profile..." />;  
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
        toast.success("✅ Profile updated successfully!", { autoClose: 2000 });
        router.push("/dashboard/profile"); // Navigate on success
      } else {
        toast.error(res.message || "❌ Failed to update profile");
      }

      return res;
    } catch (err) {
      console.error(err);
      toast.error("🚨 Something went wrong while updating profile");
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
