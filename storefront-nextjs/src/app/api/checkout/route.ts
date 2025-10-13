import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { formData, cartItems, contactId } = await request.json();

  try {
    // 1. Insert into orders table
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        contact_id: contactId, // Can be null for anonymous users
        total_amount: formData.totalPrice,
        shipping_address: formData.address,
        status: "pending", // Initial status
      })
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 },
      );
    }

    // 2. Insert into order_items table
    const orderItemsToInsert = cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      variant_id: item.id, // variant ID
      quantity: item.quantity,
      price_at_purchase: item.price,
    }));

    const { error: orderItemsError } = await supabase
      .from("order_items")
      .insert(orderItemsToInsert);

    if (orderItemsError) {
      console.error("Error creating order items:", orderItemsError);
      return NextResponse.json(
        { error: "Failed to create order items" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Order placed successfully",
      orderId: order.id,
    });
  } catch (error: any) {
    console.error("Server error during checkout:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
