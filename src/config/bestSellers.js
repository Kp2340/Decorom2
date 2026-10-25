// Featured / Best Seller product IDs in display order.
// index 0 = #1, index 1 = #2, etc.
// To reorder: move IDs around. To add: append. To remove: delete.
// After changing, also set featured=true on the product in the admin dashboard.

export const BEST_SELLER_IDS = [
  "72cb2a6c-0fd7-44e8-8cfe-87477931aad1",
  "55c98480-8334-485b-8f99-3d51fb5b45de",
  "b622c8e3-845b-4ceb-a1d5-2884aa5423f6",
  "dc1e94b8-c41e-45e6-91c5-8504f2bd2248",
  "9f4dae97-283d-492c-a2cf-6d98370c4ed0",
  "b5e09509-df97-40a7-94fd-9ece93c2f4f0",
  "ef724b07-130c-452e-b648-3b9a43e504ec",
  "8d50019e-7329-451d-a498-eb78a9353a3d",
];

// Verified metadata and active Cloudinary assets from live production database (https://api.decorom.in/api/products)
export const BEST_SELLER_FALLBACKS = [
  {
    id: "72cb2a6c-0fd7-44e8-8cfe-87477931aad1",
    name: "Premium House Shape Wooden Name Plate",
    basePrice: 3240,
    shape: "Unique",
    material: "Wooden",
    defaultSize: "18*12",
    customizable: false,
    thumbnailUrl: "https://res.cloudinary.com/dowskut5u/image/upload/w_600,f_auto,q_auto/v1790188341/decorom/products/xpmy0t8s91jmzgn6ycvu.jpg",
  },
  {
    id: "55c98480-8334-485b-8f99-3d51fb5b45de",
    name: "Premium Floral Round Name Plate",
    basePrice: 4860,
    shape: "Circle",
    material: "Acrylic with Wooden",
    defaultSize: "18*18",
    customizable: false,
    thumbnailUrl: "https://res.cloudinary.com/dowskut5u/image/upload/w_600,f_auto,q_auto/v1790225633/decorom/products/ertjwlxn4vuqddvmeqd8.jpg",
  },
  {
    id: "b622c8e3-845b-4ceb-a1d5-2884aa5423f6",
    name: "Premium Arch Acrylic Name Plate",
    basePrice: 11520,
    shape: "Unique",
    material: "Acrylic",
    defaultSize: "48*24",
    customizable: false,
    thumbnailUrl: "https://res.cloudinary.com/dowskut5u/image/upload/w_600,f_auto,q_auto/v1790224189/decorom/products/d2avehsvpo17iiyzkllo.jpg",
  },
  {
    id: "dc1e94b8-c41e-45e6-91c5-8504f2bd2248",
    name: "Premium White Gold Rectangular Name Plate",
    basePrice: 2160,
    shape: "Rectangle",
    material: "Acrylic",
    defaultSize: "12*18",
    customizable: false,
    thumbnailUrl: "https://res.cloudinary.com/dowskut5u/image/upload/w_600,f_auto,q_auto/v1790224483/decorom/products/rrqfdxyudrdxz4pbjxfl.jpg",
  },
  {
    id: "9f4dae97-283d-492c-a2cf-6d98370c4ed0",
    name: "Premium Wooden Hanging Name Plate",
    basePrice: 5760,
    shape: "Unique",
    material: "ACP",
    defaultSize: "24*12",
    customizable: false,
    thumbnailUrl: "https://res.cloudinary.com/dowskut5u/image/upload/w_600,f_auto,q_auto/v1790224506/decorom/products/oymc4poyaabim2ftqhnl.jpg",
  },
  {
    id: "b5e09509-df97-40a7-94fd-9ece93c2f4f0",
    name: "Premium Gujarati Acrylic Name Plate",
    basePrice: 5759,
    shape: "Unique",
    material: "Mild Steel with Stainless Steel",
    defaultSize: "12*24",
    customizable: false,
    thumbnailUrl: "https://res.cloudinary.com/dowskut5u/image/upload/w_600,f_auto,q_auto/v1790225586/decorom/products/tai1vk7tqcjqy49pcjcw.jpg",
  },
  {
    id: "ef724b07-130c-452e-b648-3b9a43e504ec",
    name: "Premium Stainless Steel Office Name Plate",
    basePrice: 8638,
    shape: "Rectangle",
    material: "Stainless Steel with Vinyl",
    defaultSize: "24*18",
    customizable: false,
    thumbnailUrl: "https://res.cloudinary.com/dowskut5u/image/upload/w_600,f_auto,q_auto/v1790225719/decorom/products/ngs5xg1l59siyccuxhyh.jpg",
  },
  {
    id: "8d50019e-7329-451d-a498-eb78a9353a3d",
    name: "Premium Tree Design Oval Name Plate",
    basePrice: 3240,
    shape: "Capsule",
    material: "Acrylic",
    defaultSize: "18*12",
    customizable: false,
    thumbnailUrl: "https://res.cloudinary.com/dowskut5u/image/upload/w_600,f_auto,q_auto/v1790224554/decorom/products/xl4x0zsoektuxbw07fvy.jpg",
  },
];

