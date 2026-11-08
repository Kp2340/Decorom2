/**
 * Master list of all possible order stages.
 * Online orders use a subset, Offline orders use the full list.
 */
export const ALL_STAGES = [
  // Start (Online)
  { 
      key: "PAYMENT_DONE", 
      tracks: ["ONLINE"],
      label: "Full Payment", 
      icon: "💳", 
      description: "Full payment received. Priority processing initiated." 
  },
  // Start (Offline)
  { 
      key: "PAYMENT_DONE_500", 
      tracks: ["OFFLINE"],
      label: "Advance Paid", 
      icon: "✅", 
      description: "Design advance of ₹500 received." 
  },
  // Shared
  { 
      key: "DESIGN_MAKING", 
      tracks: ["ONLINE", "OFFLINE"],
      label: "Designing", 
      icon: "✏️", 
      description: "Our design team is crafting your custom artwork." 
  },
  { 
      key: "DESIGN_CONFIRMED", 
      tracks: ["ONLINE", "OFFLINE"],
      label: "Design Approved", 
      icon: "👍", 
      description: "Artwork finalized and approved by you." 
  },
  // Offline Only track
  { 
      key: "QUOTATION_SENT", 
      tracks: ["OFFLINE"],
      label: "Price Quoted", 
      icon: "📄", 
      description: "Custom quotation sent based on your requirements." 
  },
  { 
      key: "PAYMENT_50_PERCENT", 
      tracks: ["OFFLINE"],
      label: "50% Paid", 
      icon: "💰", 
      description: "Initial 50% payment received. Order moving to production." 
  },
  // Shared / Production
  { 
      key: "IN_MANUFACTURING", 
      tracks: ["ONLINE", "OFFLINE"],
      label: "Production", 
      icon: "🔨", 
      description: "Your nameplate is currently being manufactured." 
  },
  // Offline Only
  { 
      key: "VIDEO_SENT", 
      tracks: ["OFFLINE"],
      label: "Video Sent", 
      icon: "🎥", 
      description: "We've sent you a video of the finished product." 
  },
  { 
      key: "PAYMENT_COMPLETED", 
      tracks: ["OFFLINE"],
      label: "Payment Done", 
      icon: "🏦", 
      description: "Balance payment received in full." 
  },
  // Final stages
  { 
      key: "MANUFACTURED", 
      tracks: ["ONLINE", "OFFLINE"],
      label: "Ready", 
      icon: "📦", 
      description: "Quality check complete. Ready for shipping." 
  },
  { 
      key: "DISPATCHED", 
      tracks: ["ONLINE", "OFFLINE"],
      label: "Dispatched", 
      icon: "🚚", 
      description: "Order hand-over to our courier partner." 
  },
  { 
      key: "SHIPPED", 
      tracks: ["ONLINE", "OFFLINE"],
      label: "Received", 
      icon: "🎉", 
      description: "Order successfully delivered. Hope it looks great!" 
  },
];

/**
 * Filter stages based on order type (ONLINE vs OFFLINE)
 * @param {string} type - 'ONLINE' or 'OFFLINE'
 * @returns {Array} - List of stages for that track
 */
export const getStagesForTrack = (type) => {
    const track = type || 'ONLINE';
    return ALL_STAGES.filter(s => s.tracks.includes(track));
};
