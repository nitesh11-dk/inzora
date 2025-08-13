"use client";

import { useRouter } from "next/navigation";
import UserForm from "@/components/UserForm";
import { registerUser } from "./actions";

export default function RegisterPage() {
  const router = useRouter();

  const initialData = { name: "", email: "", password: "" };

  const handleRegister = async (formData) => {
    const res = await registerUser(formData);
    if (res.success) {
      router.push("/login"); // navigate to login page
    }
    return res;
  };

  return <UserForm initialData={initialData} onSubmit={handleRegister} buttonText="Register" />;
}
