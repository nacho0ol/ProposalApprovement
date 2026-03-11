"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminOverviewPage() {
  const router = useRouter();

  // State untuk nyimpen data dari Backend
  const [data, setData] = useState({
    proceedings: [],
    submitted: [],
    drafts: [],
  });
  const [loading, setLoading] = useState(true);

  // Fungsi buat narik data pas halaman pertama kali dibuka
  useEffect(() => {
    fetchOverviewData();
  }, []);

  const fetchOverviewData = async () => {
    try {
      const res = await fetch("http://localhost:3000/admin/overview");
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (error) {
      console.error("Gagal narik data dari backend:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      // Nanti bisa ditembak ke API logout BE kalau udah siap tokennya
      alert("Berhasil Logout!");
      router.push("/login");
    }
  };

  if (loading)
    return <div className="p-10 text-center font-bold">Loading data...</div>;

  return (
    <div className="min-h-screen bg-white font-serif text-gray-800">
      {/* NAVBAR */}
      <nav className="flex justify-end gap-10 p-5 bg-gray-50 border-b border-gray-200 text-sm font-sans">
        <Link
          href="/admin"
          className="text-gray-700 hover:text-black hover:underline cursor-pointer"
        >
          Overview
        </Link>
        <Link
          href="/admin/proposal"
          className="text-gray-700 hover:text-black hover:underline cursor-pointer"
        >
          Proceedings proposal
        </Link>
        <button
          onClick={handleLogout}
          className="text-gray-700 hover:text-black hover:underline cursor-pointer"
        >
          Logout
        </button>
      </nav>

      <main className="max-w-6xl mx-auto p-10 font-sans">
        <h1 className="text-4xl text-[#b0413e] mb-6 font-serif">
          Proceedings organiser environment
        </h1>

        {/* Tombol New Proposal (Ngarah ke form panjang nanti) */}
        <Link
          href="/admin/proposal"
          className="text-sm text-gray-600 hover:text-black hover:underline mb-10 inline-block"
        >
          + New proceedings proposal
        </Link>

        {/* ================= SECTION 1: PROCEEDINGS ================= */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#b0413e] mb-1 font-serif">
            Proceedings
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            List of proceedings and status
          </p>
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="py-2 font-bold w-1/4">Code</th>
                <th className="py-2 font-bold w-2/4">Name</th>
                <th className="py-2 font-bold w-1/8">Status</th>
                <th className="py-2 font-bold w-1/8">Delivery date</th>
              </tr>
            </thead>
            <tbody>
              {data.proceedings.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-4 text-center text-gray-400 border-b"
                  >
                    No approved proceedings yet.
                  </td>
                </tr>
              ) : (
                data.proceedings.map((item: any) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-3">{item.acronym || "-"}</td>
                    <td className="py-3">{item.event_name}</td>
                    <td className="py-3">{item.status}</td>
                    <td className="py-3">
                      {item.delivery_date
                        ? new Date(item.delivery_date).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        {/* ================= SECTION 2: PROPOSALS ================= */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#b0413e] mb-1 font-serif">
            Proposals
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            List of submitted proposals
          </p>
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="py-2 font-bold w-1/2">Event name</th>
                <th className="py-2 font-bold w-1/4">Organizer</th>
                <th className="py-2 font-bold w-1/4">Creation date</th>
              </tr>
            </thead>
            <tbody>
              {data.submitted.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="py-4 text-center text-gray-400 border-b"
                  >
                    No submitted proposals.
                  </td>
                </tr>
              ) : (
                data.submitted.map((item: any) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-3">{item.event_name}</td>
                    <td className="py-3">{item.organizer_name}</td>
                    <td className="py-3">
                      {new Date(item.created_at).toLocaleString("sv-SE")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        {/* ================= SECTION 3: DRAFT PROPOSALS ================= */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#b0413e] mb-1 font-serif">
            Draft Proposals
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            List of drafted proposals
          </p>
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="py-2 font-bold w-1/2">Event name</th>
                <th className="py-2 font-bold w-1/4">Organizer</th>
                <th className="py-2 font-bold w-1/4">Creation date</th>
                <th className="py-2 font-bold"></th>
              </tr>
            </thead>
            <tbody>
              {data.drafts.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-4 text-center text-gray-400 border-b"
                  >
                    No drafts available.
                  </td>
                </tr>
              ) : (
                data.drafts.map((item: any) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3">{item.event_name}</td>
                    <td className="py-3">{item.organizer_name}</td>
                    <td className="py-3">
                      {new Date(item.created_at).toLocaleString("sv-SE")}
                    </td>
                    <td className="py-3 text-right">
                      {/* Kalau diklik, ngirim ID draft ke halaman proposal buat di-edit */}
                      <Link
                        href={`/admin/proposal?id=${item.id}`}
                        className="text-gray-500 hover:text-black hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
