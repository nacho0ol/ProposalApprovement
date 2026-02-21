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
        {/* 1. Account Information */}
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

        {/* 2. Institution Information */}
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

        {/* 3. Annual Fee & Contribution */}
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
}