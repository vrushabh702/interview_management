"use client";
import { useState, useEffect } from "react";

export default function CompanyTable() {
  const [companies, setCompanies] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [newCompany, setNewCompany] = useState({
    name: "",
    location: "",
    google_maps_rating: "",
    number_of_reviews: "",
    services: "",
  });

  const statusColors = {
    not_applied: "not-applied",
    is_applied: "applied",
    is_favorite: "favorite",
    is_approached: "approached",
    is_pending: "approached",
    in_interview_process: "interview",
    is_rejected: "rejected",
    has_offer: "offer",
  };

  const fetchCompanies = async () => {
    const url =
      filter === "all"
        ? "/api/companies"
        : filter === "favorites"
        ? "/api/favorites"
        : "/api/interviews";
    const res = await fetch(url);
    const data = await res.json();
    console.log(data);
    setCompanies(data);
  };

  useEffect(() => {
    fetchCompanies();
  }, [filter]);

  const handleAddCompany = async (e) => {
    e.preventDefault();
    await fetch("/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCompany),
    });
    setShowAddModal(false);
    setNewCompany({
      name: "",
      location: "",
      google_maps_rating: "",
      number_of_reviews: "",
      services: "",
    });
    fetchCompanies();
  };

  const handleUpdateStatus = async (companyId, status) => {
    await fetch(`/api/status/${companyId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(status),
    });
    fetchCompanies();
  };

  const handleDeleteCompany = async (companyId) => {
    await fetch(`/api/companies/${companyId}`, { method: "DELETE" });
    fetchCompanies();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <div>
          <button
            onClick={() => setFilter("all")}
            className={`mr-2 p-2 ${
              filter === "all" ? "bg-blue-500" : "bg-gray-500"
            } text-white rounded`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("favorites")}
            className={`mr-2 p-2 ${
              filter === "favorites" ? "bg-blue-500" : "bg-gray-500"
            } text-white rounded`}
          >
            Favorites
          </button>
          <button
            onClick={() => setFilter("interviews")}
            className={`p-2 ${
              filter === "interviews" ? "bg-blue-500" : "bg-gray-500"
            } text-white rounded`}
          >
            Interviews
          </button>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-500 text-white p-2 rounded"
        >
          Add Company
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-indigo-700">
            <th className="p-2">Name</th>
            <th className="p-2">Location</th>
            <th className="p-2">Rating</th>
            <th className="p-2">Reviews</th>
            <th className="p-2">Services</th>
            <th className="p-2">Statuses</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => {
            const rowDetails = {
              Name: company.name,
              Location: company.location,
              Rating: company.google_maps_rating,
              Reviews: company.number_of_reviews,
              Services: company.services,
            };

            const statuses = {
              "Not Applied":
                !company.is_applied &&
                !company.is_approached &&
                !company.in_interview_process &&
                !company.is_rejected &&
                !company.has_offer,
              Applied: !!company.is_applied,
              Favorite: !!company.is_favorite,
              Approached: !!(company.is_approached || company.is_pending),
              Interview: !!company.in_interview_process,
              Rejected: !!company.is_rejected,
              Offer: !!company.has_offer,
            };

            console.groupCollapsed(
              `📋 Row for ${company.name} (ID ${company.id})`
            );
            console.table(rowDetails); // shows the basic columns
            console.table(statuses); // shows every status flag

            Object.entries(statuses).forEach(
              ([k, v]) => console.log(`• ${k.padEnd(11)} ➜ ${v}`) // line‑by‑line prefix view
            );
            console.groupEnd();

            // Log the company and its statuses
            console.log(`Company: ${company.name} (ID: ${company.id})`);
            console.table(statuses);

            return (
              <tr key={company.id} className="border-b ">
                <td className="p-2">{company.name}</td>
                <td className="p-2">{company.location}</td>
                <td className="p-2">{company.google_maps_rating}</td>
                <td className="p-2">{company.number_of_reviews}</td>
                <td className="p-2">{company.services}</td>
                <td className="p-2 flex space-y-2 gap-2">
                  {Object.entries({
                    "Not Applied":
                      !company.is_applied &&
                      !company.is_approached &&
                      !company.in_interview_process &&
                      !company.is_rejected &&
                      !company.has_offer,
                    Applied: company.is_applied,
                    Favorite: company.is_favorite,
                    Approached: company.is_approached || company.is_pending,
                    Interview: company.in_interview_process,
                    Rejected: company.is_rejected,
                    Offer: company.has_offer,
                  }).map(
                    ([label, active]) =>
                      active && (
                        <span
                          key={label}
                          className={`text-xs font-semibold px-2 py-1 rounded bg-${
                            statusColors[label.toLowerCase().replace(" ", "_")]
                          }`}
                        >
                          {label}
                        </span>
                      )
                  )}
                </td>
                <td className="p-2">
                  <button
                    onClick={() => setShowEditModal(company)}
                    className="bg-blue-500 text-white p-1 rounded mr-2"
                  >
                    Edit Status
                  </button>
                  <button
                    onClick={() => handleDeleteCompany(company.id)}
                    className="bg-red-500 text-white p-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {showAddModal && (
        <div className="fixed inset-0 bg-black  flex items-center justify-center">
          <div className=" p-6 rounded-lg w-1/2">
            <h2 className="text-xl mb-4">Add Company</h2>
            <form onSubmit={handleAddCompany}>
              <input
                type="text"
                placeholder="Name"
                value={newCompany.name}
                onChange={(e) =>
                  setNewCompany({ ...newCompany, name: e.target.value })
                }
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="text"
                placeholder="Location"
                value={newCompany.location}
                onChange={(e) =>
                  setNewCompany({ ...newCompany, location: e.target.value })
                }
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="number"
                step="0.1"
                placeholder="Google Maps Rating"
                value={newCompany.google_maps_rating}
                onChange={(e) =>
                  setNewCompany({
                    ...newCompany,
                    google_maps_rating: e.target.value,
                  })
                }
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="number"
                placeholder="Number of Reviews"
                value={newCompany.number_of_reviews}
                onChange={(e) =>
                  setNewCompany({
                    ...newCompany,
                    number_of_reviews: e.target.value,
                  })
                }
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="text"
                placeholder="Services"
                value={newCompany.services}
                onChange={(e) =>
                  setNewCompany({ ...newCompany, services: e.target.value })
                }
                className="w-full p-2 mb-2 border rounded"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-gray-500 text-white p-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white p-2 rounded"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-1/2">
            <h2 className="text-xl mb-4">
              Edit Status for {showEditModal.name}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateStatus(showEditModal.id, showEditModal);
                setShowEditModal(null);
              }}
            >
              {Object.keys(statusColors)
                .slice(1)
                .map((status) => (
                  <label key={status} className="block mb-2">
                    <input
                      type="checkbox"
                      checked={showEditModal[status]}
                      onChange={(e) =>
                        setShowEditModal({
                          ...showEditModal,
                          [status]: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    {status.replace("_", " ").toUpperCase()}
                  </label>
                ))}
              <textarea
                placeholder="Notes"
                value={showEditModal.notes || ""}
                onChange={(e) =>
                  setShowEditModal({ ...showEditModal, notes: e.target.value })
                }
                className="w-full p-2 mb-2 border rounded"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowEditModal(null)}
                  className="bg-gray-500 text-white p-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
