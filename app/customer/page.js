"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

// Modal Component
function Modal({ isOpen, onClose, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2 className="text-xl mb-4">Error</h2>
        <p>{message}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function CustomerManagement() {
  const APIBASE = process.env.NEXT_PUBLIC_API_URL;
  const { register, handleSubmit, reset, setValue } = useForm();
  const [customers, setCustomers] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // For form error
  const [showModal, setShowModal] = useState(false); // For modal visibility

  const fetchCustomers = async () => {
    const data = await fetch(`${APIBASE}/customer`);
    const c = await data.json();
    setCustomers(c);
  };

  // Close modal handler
  const closeModal = () => {
    setShowModal(false);
    setErrorMessage("");
  };

  // Enter edit mode and pre-fill the form with existing customer data
  const startEdit = (customer) => async () => {
    setEditMode(true);

    const formattedDate = new Date(customer.dateOfBirth).toISOString().split("T")[0];
    reset({
      ...customer,
      dateOfBirth: formattedDate,
    });
  };

  const createOrUpdateCustomer = async (data) => {
    setErrorMessage(""); // Reset error message
  
    const method = editMode ? "PUT" : "POST";
    try {
      const response = await fetch(`${APIBASE}/customer`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
  
      let responseData;
      try {
        responseData = await response.json();
      } catch (err) {
        throw new Error("The ID was already taken");
      }
  
      if (!response.ok) {
        throw new Error(responseData.error || "Failed to save customer.");
      }
  
      if (editMode) {
        alert("Customer updated successfully");
        setEditMode(false);
      } else {
        alert("Customer added successfully");
      }
  
      // Reset the form after a successful add/update
      reset({
        name: "",
        dateOfBirth: "",
        memberNumber: "",
        interests: "",
      });

      fetchCustomers();
    } catch (error) {
      // If error occurs, set the modal message and show the modal
      setErrorMessage(error.message);
      setShowModal(true); // Open modal
    }
  };

  const deleteById = (id) => async () => {
    if (!confirm("Are you sure?")) return;

    await fetch(`${APIBASE}/customer/${id}`, {
      method: "DELETE",
    });
    alert("Customer deleted successfully");
    fetchCustomers();
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <main>
      {/* Modal for error messages */}
      <Modal isOpen={showModal} onClose={closeModal} message={errorMessage} />

      <div className="flex flex-row gap-4">
        <div className="flex-1 w-64 ">
          <form onSubmit={handleSubmit(createOrUpdateCustomer)}>
            <div className="grid grid-cols-2 gap-4 w-fit m-4">
              {errorMessage && (  // Show error message in form (optional, since modal will handle it)
                <div className="col-span-2 text-red-600">
                  {errorMessage}
                </div>
              )}

              <div>Name:</div>
              <div>
                <input
                  name="name"
                  type="text"
                  {...register("name", { required: true })}
                  className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div>Date of Birth:</div>
              <div>
                <input
                  name="dateOfBirth"
                  type="date"
                  {...register("dateOfBirth", { required: true })}
                  className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div>Member Number:</div>
              <div>
                <input
                  name="memberNumber"
                  type="number"
                  {...register("memberNumber", { required: true })}
                  className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
              <div>Interests:</div>
              <div>
                <input
                  name="interests"
                  type="text"
                  {...register("interests", { required: true })}
                  className="border border-gray-600 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>

              <div className="col-span-2 text-right">
                {editMode ? (
                  <input
                    type="submit"
                    value="Update"
                    className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  />
                ) : (
                  <input
                    type="submit"
                    value="Add"
                    className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                  />
                )}
                {editMode && (
                  <button
                    onClick={() => {
                      reset({
                        name: "",
                        dateOfBirth: "",
                        memberNumber: "",
                        interests: "",
                      });
                      setEditMode(false);
                    }}
                    className="ml-2 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="border m-4 bg-slate-300 flex-1 w-64">
          <h1 className="text-2xl">Customers ({customers.length})</h1>
          <ul className="list-disc ml-8">
            {customers.map((customer) => (
              <li key={customer._id}>
                <button className="border border-black p-1/2" onClick={startEdit(customer)}>
                  📝
                </button>{" "}
                <button className="border border-black p-1/2" onClick={deleteById(customer._id)}>
                  ❌
                </button>{" "}
                <Link href={`/customer/${customer._id}`} className="font-bold">
                  {customer.name}
                </Link>{" "}
                - {customer.interests}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
