"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Tambahkan ini buat pindah halaman

export default function RegisterPage() {
  const router = useRouter(); // Inisialisasi router
  const [formData, setFormData] = useState({
    fullName: "",
    primaryEmail: "",
    otherEmail: "",
    institutionEmail: "",
    contactNumber: "",
    otherContactNumber: "",
    password: "", // TAMBAHAN: State untuk password
    institutionName: "",
    institutionType: "university",
    institutionAddress: "",
    annualFee: 458000,
    coffeeContribution: "0",
    paymentMethod: "BNI virtual account",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // MAPPING DATA: Ubah camelCase dari FE jadi snake_case buat BE
    const payload = {
      full_name: formData.fullName,
      email_primary: formData.primaryEmail,
      email_other: formData.otherEmail,
      email_institution: formData.institutionEmail,
      phone_primary: formData.contactNumber,
      phone_other: formData.otherContactNumber,
      password: formData.password,
      institution_name: formData.institutionName,
      institution_type: formData.institutionType,
      address: formData.institutionAddress,
      payment_method: formData.paymentMethod,
      coffee_contribution:
        parseInt(formData.coffeeContribution.replace("k", "000")) || 0,
    };

    try {
      // Gunakan localhost:3000 langsung kalau ENV belum di-setup temenmu
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Registrasi berhasil! Beralih ke halaman pembayaran...");
        // Pindah otomatis ke halaman payment
        router.push("/register/payment");
      } else {
        alert(`Gagal: ${result.message || "Cek kembali data kamu"}`);
      }
    } catch (error) {
      console.error("Gagal registrasi:", error);
      alert("Gagal menyambung ke server Backend!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg my-10">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">
        Form Registrasi Jurnal RJI
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Account Information */}
        <div className="border-b pb-4">
          <h2 className="text-lg font-semibold mb-4">1. Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="fullName"
              onChange={handleChange}
              placeholder="Full Name"
              className="border p-2 rounded"
              required
              minLength={3}
            />
            <input
              name="primaryEmail"
              onChange={handleChange}
              placeholder="Alamat Email Utama"
              className="border p-2 rounded"
              required
              type="email"
            />
            <input
              name="otherEmail"
              onChange={handleChange}
              placeholder="Alamat Email Lain (Opsional)"
              className="border p-2 rounded"
              type="email"
            />
            <input
              name="institutionEmail"
              onChange={handleChange}
              placeholder="Alamat Email Institusi"
              className="border p-2 rounded"
              required
              type="email"
            />

            {/* Ditambah validasi minLength 13 untuk nomor HP */}
            <input
              name="contactNumber"
              onChange={handleChange}
              placeholder="Nomor Kontak Utama (Min 13 Digit)"
              className="border p-2 rounded"
              required
              minLength={13}
              maxLength={15}
            />
            <input
              name="otherContactNumber"
              onChange={handleChange}
              placeholder="Nomor Kontak Lain (Opsional)"
              className="border p-2 rounded"
            />

            {/* TAMBAHAN: Input Password */}
            <input
              name="password"
              onChange={handleChange}
              placeholder="Password Akun"
              className="border p-2 rounded"
              required
              type="password"
            />
          </div>
        </div>

        {/* 2. Institution Information */}
        <div className="border-b pb-4">
          <h2 className="text-lg font-semibold mb-4">
            2. Institution Information
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <input
              name="institutionName"
              onChange={handleChange}
              placeholder="Nama Institusi (Nama Panjang)"
              className="border p-2 rounded"
              required
            />
            <select
              name="institutionType"
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="university">University</option>
              <option value="society">Society</option>
              <option value="government agency">Government Agency</option>
              <option value="publisher (education)">
                Publisher (Education)
              </option>
              <option value="foundation">Foundation</option>
            </select>
            <textarea
              name="institutionAddress"
              onChange={handleChange}
              placeholder="Alamat Lengkap Institusi"
              className="border p-2 rounded"
              rows={3}
              required
            />
          </div>
        </div>

        {/* 3. Annual Fee & Contribution */}
        <div className="bg-gray-50 p-4 rounded">
          <h2 className="text-lg font-semibold mb-4">
            3. Annual Fee & Payment
          </h2>
          <div className="space-y-4">
            <label className="block">
              Annual Fee (IDR):
              <input
                value="458,000"
                disabled
                className="ml-2 border-none bg-transparent font-bold text-black"
              />
            </label>
            <div>
              <p className="mb-2">
                A little contribution for a cup of coffee (IDR):
              </p>
              <div className="flex flex-wrap gap-4">
                {["0", "2k", "5k", "20k", "50k", "100k"].map((val) => (
                  <label
                    key={val}
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="coffeeContribution"
                      value={val}
                      onChange={handleChange}
                      checked={formData.coffeeContribution === val}
                    />
                    {val}
                  </label>
                ))}
              </div>
            </div>
            <select
              name="paymentMethod"
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="paypal">Paypal</option>
              <option value="BRI virtual account">BRI Virtual Account</option>
              <option value="BNI virtual account">BNI Virtual Account</option>
              <option value="bank mandiri virtual account">
                Bank Mandiri Virtual Account
              </option>
              <option value="bank permata virtual account">
                Bank Permata Virtual Account
              </option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" required className="cursor-pointer" />
          <span>I have read the agreement and accept it</span>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 transition-colors"
        >
          REGISTER & GENERATE INVOICE
        </button>
      </form>
    </div>
  );
}

/*
'use client';

import { useState } from 'react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    primaryEmail: '',
    otherEmail: '', // Opsional
    institutionEmail: '',
    contactNumber: '',
    otherContactNumber: '', // Opsional
    institutionName: '', // Nama Panjang
    institutionType: 'university',
    institutionAddress: '',
    annualFee: 458000, // Default
    coffeeContribution: '0',
    paymentMethod: 'BNI virtual account'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Registrasi berhasil! Silakan cek email kamu.');
      }
    } catch (error) {
      console.error('Gagal registrasi:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg my-10">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Form Registrasi Jurnal RJI</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Account Information */ /*}
        <div className="border-b pb-4">
          <h2 className="text-lg font-semibold mb-4">1. Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="fullName" onChange={handleChange} placeholder="Full Name" className="border p-2 rounded" required />
            <input name="primaryEmail" onChange={handleChange} placeholder="Alamat Email Utama" className="border p-2 rounded" required type="email" />
            <input name="otherEmail" onChange={handleChange} placeholder="Alamat Email Lain (Opsional)" className="border p-2 rounded" type="email" />
            <input name="institutionEmail" onChange={handleChange} placeholder="Alamat Email Institusi" className="border p-2 rounded" required type="email" />
            <input name="contactNumber" onChange={handleChange} placeholder="Nomor Kontak Utama" className="border p-2 rounded" required />
            <input name="otherContactNumber" onChange={handleChange} placeholder="Nomor Kontak Lain (Opsional)" className="border p-2 rounded" />
          </div>
        </div>

        {/* 2. Institution Information */ /*}
        <div className="border-b pb-4">
          <h2 className="text-lg font-semibold mb-4">2. Institution Information</h2>
          <div className="grid grid-cols-1 gap-4">
            <input name="institutionName" onChange={handleChange} placeholder="Nama Institusi (Nama Panjang)" className="border p-2 rounded" required />
            <select name="institutionType" onChange={handleChange} className="border p-2 rounded">
              <option value="university">University</option>
              <option value="society">Society</option>
              <option value="government agency">Government Agency</option>
              <option value="publisher (education)">Publisher (Education)</option>
              <option value="foundation">Foundation</option>
            </select>
            <textarea name="institutionAddress" onChange={handleChange} placeholder="Alamat Lengkap Institusi" className="border p-2 rounded" rows={3} required />
          </div>
        </div>

        {/* 3. Annual Fee & Contribution */ /*}
        <div className="bg-gray-50 p-4 rounded">
          <h2 className="text-lg font-semibold mb-4">3. Annual Fee & Payment</h2>
          <div className="space-y-4">
            <label className="block">
              Annual Fee (IDR): 
              <input value="458,000" disabled className="ml-2 border-none bg-transparent font-bold" />
            </label>
            <div>
              <p className="mb-2">A little contribution for a cup of coffee (IDR):</p>
              <div className="flex gap-2">
                {['0', '2k', '5k', '20k', '50k', '100k'].map((val) => (
                  <label key={val} className="flex items-center gap-1">
                    <input type="radio" name="coffeeContribution" value={val} onChange={handleChange} checked={formData.coffeeContribution === val} />
                    {val}
                  </label>
                ))}
              </div>
            </div>
            <select name="paymentMethod" onChange={handleChange} className="border p-2 rounded w-full">
              <option value="paypal">Paypal</option>
              <option value="BRI virtual account">BRI Virtual Account</option>
              <option value="BNI virtual account">BNI Virtual Account</option>
              <option value="bank mandiri virtual account">Bank Mandiri Virtual Account</option>
              <option value="bank permata virtual account">Bank Permata Virtual Account</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" required />
          <span>I have read agreement and accept it</span>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700">
          REGISTER & GENERATE INVOICE
        </button>
      </form>
    </div>
  );
}*/
