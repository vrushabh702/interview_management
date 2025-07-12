"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import Chart from "chart.js/auto";
// import "tailwindcss/tailwind.css";

const Home = () => {
  const [companies, setCompanies] = useState([]);
  const [cityFilter, setCityFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);

  useEffect(() => {
    // Fetch data from API
    fetch("http://localhost:3000/api/companies")
      .then((res) => res.json())
      .then((data) => {
        setCompanies(data);
        // Extract unique cities and states
        const uniqueCities = [
          ...new Set(
            data.map((company) => {
              const parts = company.location.split(", ");
              return parts[parts.length - 3] || "Unknown";
            })
          ),
        ];
        const uniqueStates = [
          ...new Set(
            data.map((company) => {
              const parts = company.location.split(", ");
              return parts[parts.length - 2] || "Unknown";
            })
          ),
        ];
        setCities(uniqueCities);
        setStates(uniqueStates);
      });
  }, []);

  useEffect(() => {
    // Initialize charts
    if (companies.length === 0) return;

    // Filter data based on user selections
    const filteredCompanies = companies.filter((company) => {
      const city =
        company.location.split(", ")[company.location.split(", ").length - 3] ||
        "Unknown";
      const state =
        company.location.split(", ")[company.location.split(", ").length - 2] ||
        "Unknown";
      const statusMatch = statusFilter
        ? (statusFilter === "Applied" && company.is_applied) ||
          (statusFilter === "Favorite" && company.is_favorite) ||
          (statusFilter === "Approached" && company.is_approached) ||
          (statusFilter === "Pending" && company.is_pending) ||
          (statusFilter === "Interview" && company.in_interview_process) ||
          (statusFilter === "Rejected" && company.is_rejected) ||
          (statusFilter === "Offer" && company.has_offer)
        : true;
      return (
        (!cityFilter || city === cityFilter) &&
        (!stateFilter || state === stateFilter) &&
        statusMatch
      );
    });

    // Companies per city (Bar Chart)
    const citiesData = cities.map((city) => ({
      city,
      count: filteredCompanies.filter(
        (c) =>
          (c.location.split(", ")[c.location.split(", ").length - 3] ||
            "Unknown") === city
      ).length,
    }));

    // Generate one random color per city
    const cityBarColors = citiesData.map(
      () =>
        //     getRandomColor()
        `hsl(${Math.random() * 360}, 70%, 65%)`
    );

    const cityChartCanvas = document
      .getElementById("cityChart")
      .getContext("2d");
    new Chart(cityChartCanvas, {
      type: "bar",
      data: {
        labels: citiesData.map((d) => d.city),
        datasets: [
          {
            label: "Companies per City",
            data: citiesData.map((d) => d.count),
            // backgroundColor: "rgba(75, 192, 192, 0.6)",
            backgroundColor: cityBarColors,
          },
        ],
      },
      options: { scales: { y: { beginAtZero: true } } },
    });

    // Status distribution (Pie Chart)
    const statusCounts = {
      Applied: filteredCompanies.filter((c) => c.is_applied).length,
      Favorite: filteredCompanies.filter((c) => c.is_favorite).length,
      Approached: filteredCompanies.filter((c) => c.is_approached).length,
      Pending: filteredCompanies.filter((c) => c.is_pending).length,
      Interview: filteredCompanies.filter((c) => c.in_interview_process).length,
      Rejected: filteredCompanies.filter((c) => c.is_rejected).length,
      Offer: filteredCompanies.filter((c) => c.has_offer).length,
    };
    const statusChartCanvas = document
      .getElementById("statusChart")
      .getContext("2d");
    new Chart(statusChartCanvas, {
      type: "pie",
      data: {
        labels: Object.keys(statusCounts),
        datasets: [
          {
            data: Object.values(statusCounts),
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
              "#FF9F40",
              "#C9CBCF",
            ],
          },
        ],
      },
    });

    // Services distribution (Doughnut Chart)
    const services = filteredCompanies.flatMap((c) =>
      c.services.split(", ").map((s) => s.trim())
    );
    const serviceCounts = {};
    services.forEach((service) => {
      serviceCounts[service] = (serviceCounts[service] || 0) + 1;
    });
    const serviceChartCanvas = document
      .getElementById("serviceChart")
      .getContext("2d");
    new Chart(serviceChartCanvas, {
      type: "doughnut",
      data: {
        labels: Object.keys(serviceCounts),
        datasets: [
          {
            data: Object.values(serviceCounts),
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
              "#FF9F40",
              "#C9CBCF",
            ],
          },
        ],
      },
    });

    // Average Google Maps rating by city (Bar Chart)
    const ratingData = cities.map((city) => {
      const cityCompanies = filteredCompanies.filter(
        (c) =>
          (c.location.split(", ")[c.location.split(", ").length - 3] ||
            "Unknown") === city
      );
      const avgRating = cityCompanies.length
        ? cityCompanies.reduce(
            (sum, c) => sum + parseFloat(c.google_maps_rating || 0),
            0
          ) / cityCompanies.length
        : 0;

      return { city, avgRating };
    });

    // Generate one random color per city
    const barColors = ratingData.map(
      () =>
        //     getRandomColor()
        `hsl(${Math.random() * 360}, 70%, 65%)`
    );

    const ratingChartCanvas = document
      .getElementById("ratingChart")
      .getContext("2d");
    new Chart(ratingChartCanvas, {
      type: "bar",
      data: {
        labels: ratingData.map((d) => d.city),
        datasets: [
          {
            label: "Average Google Maps Rating",
            data: ratingData.map((d) => d.avgRating),
            backgroundColor: barColors, // <— array, not single value
            // borderColor: barColors.map(
            //   (
            //     c // fully opaque borders (optional)
            //   ) => c.replace(/0\.6\)$/, "1)")
            // ),
            borderColor: barColors,
            borderWidth: 1,
          },
        ],
      },
      options: { scales: { y: { beginAtZero: true, max: 5 } } },
    });
  }, [companies, cityFilter, stateFilter, statusFilter]);

  function getRandomColor(alpha = 0.6) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  return (
    <div className="container mx-auto p-4">
      <Head>
        <title>Company Dashboard</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      </Head>
      <h1 className="text-3xl font-bold mb-4">Company Dashboard</h1>

      {/* Filters */}
      <div className="mb-4 flex space-x-4">
        <select
          className="border p-2 rounded"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
        >
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <select
          className="border p-2 rounded"
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
        >
          <option value="">All States</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        <select
          className="border p-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Applied">Applied</option>
          <option value="Favorite">Favorite</option>
          <option value="Approached">Approached</option>
          <option value="Pending">Pending</option>
          <option value="Interview">Interview</option>
          <option value="Rejected">Rejected</option>
          <option value="Offer">Offer</option>
        </select>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Companies per City</h2>
          <canvas id="cityChart"></canvas>
        </div>
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Status Distribution</h2>
          <canvas id="statusChart"></canvas>
        </div>
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Services Distribution</h2>
          <canvas id="serviceChart"></canvas>
        </div>
        <div className="border p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Average Rating by City</h2>
          <canvas id="ratingChart"></canvas>
        </div>
      </div>
    </div>
  );
};

export default Home;
