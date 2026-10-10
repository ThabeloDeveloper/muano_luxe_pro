import { mediaDefaults } from "../functions/site-media.js";
export const colors = { Ivory: "#e7e0d2", Onyx: "#191a18", Olive: "#62694c" };

const variant = (color, image) => ({ color, hex: colors[color], image, sizes: { XS: 4, S: 8, M: 12, L: 8, XL: 4 } });

const piece = (id, name, category, price, image, color, description, generated = false) => ({

  id, name, category, audience: "Unisex", price, image, active: true, sample: true,

  tag: generated ? "STUDIO CONCEPT" : "THE LEGACY EDIT",

  description, material: "Collection preview. Fabric composition, sizing and care instructions will be confirmed before sale.",

  variants: [variant(color, image)],

});

export const initialProducts = [

  piece("vision-tee", "The Vision Tee", "Graphic tees", 69000, "/images/IMG-20260927-WA0026.jpg", "Onyx", "An oversized black tee with a restrained chest monogram and a bold aviation graphic across the back. Built from vision. Crafted for legacy."),

  piece("column-tee", "The Column Tee", "Graphic tees", 69000, "/images/IMG-20260927-WA0028.jpg", "Ivory", "An ivory graphic tee with Muano Luxe lettering at the front and an intricate classical column on the reverse. Real luxury whispers."),

  piece("runway-tee", "The Runway Tee", "Graphic tees", 69000, "/images/IMG-20260927-WA0029.jpg", "Onyx", "A black oversized silhouette with a subtle chest monogram and a runway disappearing into the distance on the back."),

  piece("olive-legacy-tee", "The Olive Legacy Tee", "Graphic tees", 69000, "/images/olive-legacy-tee.png", "Olive", "An olive interpretation of the Legacy collection, pairing a small chest monogram with architectural artwork. AI-generated design concept; final details subject to review.", true),

  piece("runway-hoodie", "The Runway Hoodie", "Hoodies", 119000, "/images/runway-hoodie.png", "Onyx", "A relaxed black hoodie carrying the collection’s aviation-inspired artwork. AI-generated design concept; final details subject to review.", true),

];

export const defaultSettings = {
  ...mediaDefaults,

  storyTitle: "Built from vision.\nCrafted for legacy.",

  storyText:

    "A mark of ambition. A print with a story. Oversized silhouettes that bring aviation, architecture and everyday expression together.",

  storyTextSecondary:

    "MuanoLuxe brings graphic streetwear to everyday dressing — contemporary essentials with a quiet point of view.",

  storyImage: "/images/IMG-20260927-WA0031.jpg",

  newsletterTitle: "A little closer to the exceptional.",

  newsletterDescription:

    "New collections, quiet inspiration, and first access. A considered note from us.",

  announcement: "THE LEGACY EDIT — BUILT FROM VISION.",

  heroTitle: "Built from vision.\nWorn with purpose.",

  heroDescription:

    "Graphic streetwear. Oversized silhouettes.\nA new expression of MuanoLuxe.",

  heroImage: "/images/legacy-campaign.png",

  shippingFee: 9500,

  freeShippingThreshold: 200000,

  supportEmail: "muanoluxe@gmail.com",

  instagramUrl: "",

  returnsPolicy:

    "Contact our team before returning an item. Return eligibility and timeframes will be confirmed before your order is accepted.",

  shippingPolicy:

    "Delivery availability, timing, and charges are confirmed before payment. The delivery estimate shown at checkout is subject to your address.",

  privacyPolicy:

    "We use your account and delivery details to manage orders. Newsletter subscriptions are optional. Contact the store to request access to or deletion of your information.",

  terms:

    "Orders are subject to stock and delivery availability. Payments are processed securely by Paystack. Unpaid stock reservations expire after 30 minutes. Product imagery is illustrative until replaced with verified product photography.",

  published: false,

};

