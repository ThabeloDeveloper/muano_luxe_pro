// Only persisted business events enter the staff feed; never private message bodies.
export function activityFor(collection, before, after) {
  if (collection === "products") return { type: "product", title: !after ? "Product removed" : !before ? "Product added" : "Product or stock updated", body: String((after || before).name || "A collection item").slice(0,160) };
  if (collection === "settings") return { type: "settings", title: "Storefront settings updated", body: "Store content, images or settings have changed." };
  if (collection === "subscribers" && before && !after) return { type: "subscription", title: "Customer unsubscribed", body: "A customer left the newsletter list." };
  if (collection === "orders" && before && (!after || before.status !== after.status) && !["paid", "paid_stock_review"].includes(after?.status)) return { type: "order", title: !after ? "Order removed" : "Order status changed", body: `${before.orderNumber || "Order"}: ${after?.status || "removed"}` };
  if (collection === "messages" && after && (!before || before.status !== after.status)) return { type: "conversation", title: !before ? "New customer message" : after.status === "failed" ? "AI assistant could not reply" : "AI assistant replied", body: "Open Conversations in Studio to review the conversation." };
  return null;
}
