import test from "node:test";
import assert from "node:assert/strict";
import { activityFor } from "../functions/activity.js";
test("activity covers inventory, settings, unsubscribe, order changes and chat without private text", () => {
 for (const collection of ["products", "settings"]) assert.ok(activityFor(collection, {}, {name:"Tee"}));
 assert.ok(activityFor("subscribers", {email:"private@example.com"}, undefined));
 assert.ok(activityFor("orders", {status:"paid"}, {status:"shipped"}));
 for (const status of ["pending","complete","failed"]) {
  const event=activityFor("messages", status === "pending" ? undefined : {status:"pending"}, {status,userText:"PRIVATE",assistantText:"PRIVATE"});
  assert.ok(event); assert.ok(!JSON.stringify(event).includes("PRIVATE"));
 }
});
test("activity avoids duplicate existing order/payment/subscriber alerts and loops", () => {
 assert.equal(activityFor("orders", undefined, {status:"pending_payment"}),null);
 assert.equal(activityFor("orders", {status:"pending_payment"}, {status:"paid"}),null);
 assert.equal(activityFor("subscribers", undefined, {email:"private@example.com"}),null);
 assert.equal(activityFor("notifications", {}, {read:true}),null);
 assert.equal(activityFor("messages", {status:"complete"}, {status:"complete"}),null);
});
