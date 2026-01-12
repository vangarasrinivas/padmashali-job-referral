"use client";

import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

import NavbarUsers from "@/components/NavbarUsers";
import ToastAlert from "@/components/ToastAlert";
import SignupForm from "@/components/SignupForm";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    qualification: "",
    location: "",
    careerType: "working",

    college: "",
    branch: "",
    skills: "",

    experienceYears: "",
    company: "",
    workinglocation: "",

    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // handle signup submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!form.fullName) newErrors.fullName = "Required";
    if (!form.email) newErrors.email = "Required";
    if (!form.phone) newErrors.phone = "Required";
    if (!form.password) newErrors.password = "Required";
    if (!form.confirmPassword) newErrors.confirmPassword = "Required";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);

      // create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const user = userCredential.user;

      // create user record immediately in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        qualification: form.qualification,
        location: form.location,
        careerType: form.careerType,
        college: form.college,
        branch: form.branch,
        skills: form.skills,
        experienceYears: form.experienceYears,
        company: form.company,
        workinglocation: form.workinglocation,
        password: form.password,
        role: "user",
        emailVerified: false, // important flag
        createdAt: serverTimestamp(),
      });

      // send email verification
      await sendEmailVerification(user, {
        url: `${window.location.origin}/login?verified=true`,
      });


      setEmailSent(true);
      setAlert({
        type: "success",
        message:
          "Verification email sent! Please check your inbox and spam folder.",
      });
    } catch (err) {
      setAlert({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gray-100">
      <NavbarUsers />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {alert && (
          <ToastAlert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        <SignupForm
          form={form}
          errors={errors}
          loading={loading}
          emailSent={emailSent}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </section>
  );
}
