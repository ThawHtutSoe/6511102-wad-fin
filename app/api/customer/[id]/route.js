import Customer from "@/models/Customer";

// GET a single customer by ID
export async function GET(request, { params }) {
  try {
    const id = params.id;
    const customer = await Customer.findById(id);
    if (!customer) {
      return new Response("Customer not found", { status: 404 });
    }
    return new Response(JSON.stringify(customer), { status: 200 });
  } catch (error) {
    return new Response("Error fetching customer", { status: 500 });
  }
}

// DELETE a customer by ID
export async function DELETE(request, { params }) {
  try {
    const id = params.id;
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
      return new Response("Customer not found", { status: 404 });
    }
    return new Response(JSON.stringify(customer), { status: 200 });
  } catch (error) {
    return new Response("Error deleting customer", { status: 500 });
  }
}
