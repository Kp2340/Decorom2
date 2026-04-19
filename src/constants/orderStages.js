/**
 * Master list of all possible order stages.
 * Online orders use a subset, Offline orders use the full list.
 */
export const ALL_STAGES = [
  // Start (Online)
  { 
      key: "PAYMENT_DONE", 
      label: "Full Payment", 
      icon: "💳", 
      description: "Full payment received. Priority processing initiated." 
  },
  // Start (Offline)
  { 
      key: "PAYMENT_DONE_500", 
      label: "Advance Paid", 
      icon: "✅", 
      description: "Design advance of ₹500 received." 
  },
  // Shared
  { 
      key: "DESIGN_MAKING", 
      label: "Designing", 
      icon: "✏️", 
      description: "Our design team is crafting your custom artwork." 
  },
  { 
      key: "DESIGN_CONFIRMED", 
      label: "Design Approved", 
      icon: "👍", 
      description: "Artwork finalized and approved by you." 
  },
  // Offline Only track
  { 
      key: "QUOTATION_SENT", 
      label: "Price Quoted", 
      icon: "📄", 
      description: "Custom quotation sent based on your requirements." 
  },
  { 
      key: "PAYMENT_50_PERCENT", 
      label: "50% Paid", 
      icon: "💰", 
      description: "Initial 50% payment received. Order moving to production." 
  },
  // Shared / Production
  { 
      key: "IN_MANUFACTURING", 
      label: "Production", 
      icon: "🔨", 
      description: "Your nameplate is currently being manufactured." 
  },
  // Offline Only
  { 
      key: "VIDEO_SENT", 
      label: "Video Sent", 
      icon: "🎥", 
      description: "We've sent you a video of the finished product." 
  },
  { 
      key: "PAYMENT_COMPLETED", 
      label: "Payment Done", 
      icon: "🏦", 
      description: "Balance payment received in full." 
  },
  // Final stages
  { 
      key: "MANUFACTURED", 
      label: "Ready", 
      icon: "📦", 
      description: "Quality check complete. Ready for shipping." 
  },
  { 
      key: "DISPATCHED", 
      label: "Dispatched", 
      icon: "🚚", 
      description: "Order hand-over to our courier partner." 
  },
  { 
      key: "SHIPPED", 
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
    if (type === 'OFFLINE') {
        // Offline track includes the granular quote/video steps
        return ALL_STAGES.filter(s => s.key !== 'PAYMENT_DONE'); 
    }
    // Online track is simpler/faster
    const onlineKeys = [
        'PAYMENT_DONE', 
        'DESIGN_MAKING', 
        'DESIGN_CONFIRMED', 
        'IN_MANUFACTURING', 
        'MANUFACTURED', 
        'DISPATCHED', 
        'SHIPPED'
    ];
    return ALL_STAGES.filter(s => onlineKeys.includes(s.key));
};
