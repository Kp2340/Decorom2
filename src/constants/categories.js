export const slugify = (text) => 
  text ? text.toLowerCase().replace(/\s+/g, '-') : '';

export const CATEGORIES = [
  { 
    name: "Stainless Steel", 
    id: "4",
    images: [
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1581557991964-125469da3b8a?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?auto=format&fit=crop&q=80&w=300"
    ]
  },
  { 
    name: "Mild Steel", 
    id: "5",
    images: [
      "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=300"
    ]
  },
  { 
    name: "ACP", 
    id: "2",
    images: [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1581557991964-125469da3b8a?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?auto=format&fit=crop&q=80&w=300"
    ]
  },
  { 
    name: "Acrylic", 
    id: "1",
    images: [
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?auto=format&fit=crop&q=80&w=300"
    ]
  },
  { 
    name: "Wooden", 
    id: "3",
    images: [
      "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=300",
      "https://images.unsplash.com/photo-1581557991964-125469da3b8a?auto=format&fit=crop&q=80&w=300"
    ]
  }
];
