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

    // Resume fields
    resume: "",      // Base64 content
    resumeName: "",  // File name
  });

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Resume upload handler (Base64)
  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1024 * 1024) { // 1MB limit
      setAlert({ type: "error", message: "Resume must be less than 1MB" });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        resume: reader.result,
        resumeName: file.name,
      }));
      setAlert({ type: "success", message: "Resume uploaded successfully" });
    };
    reader.readAsDataURL(file);
  };

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

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const user = userCredential.user;

      // Save user in Firestore including resume
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
        resume: form.resume || "",
        resumeName: form.resumeName || "",
        role: "user",
        emailVerified: false,
        createdAt: serverTimestamp(),
      });

      // Send email verification
      await sendEmailVerification(user, {
        url: `${window.location.origin}/login?verified=true`,
      });

      setEmailSent(true);
      setAlert({
        type: "success",
        message: "Verification email sent! Please check your inbox.",
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
          handleResumeUpload={handleResumeUpload}
          setForm={setForm} // pass resume handler
        />
      </div>
    </section>
  );
}
