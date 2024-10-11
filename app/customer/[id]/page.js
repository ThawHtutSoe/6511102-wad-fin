"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CustomerDetail({ params }) {
  const APIBASE = process.env.NEXT_PUBLIC_API_URL;
  const [customer, setCustomer] = useState(null);
  const router = useRouter();

  // Fetch customer details based on the ID in the route
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`${APIBASE}/customer/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch customer data");
        }
        const data = await response.json();
        setCustomer(data);
      } catch (error) {
        console.error(error);
        alert("Error fetching customer data");
      }
    };

    fetchCustomer();
  }, [APIBASE, params.id]);

  if (!customer) {
    return <p>Loading customer details...</p>;
  }

  return (
    <main className="m-4">
      <h1 className="text-3xl font-bold">{customer.name}</h1>
      <p>
        <strong>Date of Birth:</strong>{" "}
        {new Date(customer.dateOfBirth).toLocaleDateString()}
      </p>
      <p>
        <strong>Member Number:</strong> {customer.memberNumber}
      </p>
      <p>
        <strong>Interests:</strong> {customer.interests}
      </p>

      <button
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => router.push("/customer")}
      >
        Back to Customers List
      </button>
    </main>
  );
}
