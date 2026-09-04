const CLD = (path) =>
  `https://res.cloudinary.com/dowskut5u/image/upload/w_400,f_auto,q_auto/${path}`;

export const slugify = (text) =>
  text ? text.toLowerCase().replace(/\s+/g, "-") : "";

// All 4 images per category are unique — no cross-category duplicates.
export const CATEGORIES = [
  {
    name: "Acrylic",
    id: "1",
    images: [
      CLD("v1771703476/decorom/products/dtv6nu8f3rfanmkfzcin.png"), // Floral Round Black
      CLD("v1771698479/decorom/products/zeqwbzoc9xjumzm5ftua.png"), // Modern Acrylic Gold
      CLD("v1773569229/decorom/products/pct1r7ntizduqwjvfx5g.png"), // Round LED House
      CLD("v1771703054/decorom/products/n7fselgisyplrzpktr8z.png"), // Krishna Theme Round
    ],
  },
  {
    name: "Wooden",
    id: "3",
    images: [
      CLD("v1771698199/decorom/products/iaybtun9ujsswnendqao.png"), // Traditional Wooden Diya
      CLD("v1771698397/decorom/products/qmp4bdzdqyzckxukcdem.png"), // House Shape Wooden
      CLD("v1771702610/decorom/products/ceuhvfnfzrdktlgm4bzz.png"), // Wooden LED
      CLD("v1773567684/decorom/products/odrod8ssoufyjtmx2dw1.png"), // Sai Baba Divine (wood-toned)
    ],
  },
  {
    name: "ACP",
    id: "2",
    images: [
      CLD("v1771698680/decorom/products/sbglb4wj7j1btef67l2q.png"), // Capsule Wooden Divine
      CLD("v1771702984/decorom/products/nfnkcwbv4qtnfrhogi8f.png"), // Wooden Hanging
      CLD("v1771700070/decorom/products/t2x7shjprvdvmj6szfwh.png"), // Wooden Family
      CLD("v1771698905/decorom/products/kj9wcevrdwfqctt8d9qw.png"), // Classic Rectangular ACP
    ],
  },
  {
    name: "Mild Steel",
    id: "5",
    images: [
      CLD("v1771703274/decorom/products/ywkmpenrk0bmxpncxsvd.png"), // MS Cutwork Family (Mild Steel)
      CLD("v1771702489/decorom/products/g1dqnh0t9mafebyqgh2v.png"), // Gujarati Name Plate (Mild Steel w/ SS)
      CLD("v1773569388/decorom/products/r8lwg00jg3f8lq81scmq.png"), // Black Sticker Golden Acrylic (round, different style)
      CLD("v1773568271/decorom/products/w0se9relf8lix75u9gms.png"), // Minimal Round Metal Name Plate
    ],
  },
  {
    name: "Stainless Steel",
    id: "4",
    images: [
      CLD("v1780754823/decorom/products/dp9sjpswh5we5q0i2tlg.jpg"), // Rose Gold SS Nameplate
      CLD("v1771702737/decorom/products/yigxjh2ez1m2eouosluc.png"), // SS Office Nameplate
      CLD("v1771699368/decorom/products/axxz9weeyeyxwpt4eben.png"), // Classic Wooden (ACP+SS)
      CLD("v1773567450/decorom/products/m0ufm3tqwmijg3ja6l51.png"), // Omkar Mantra backlit
    ],
  },
  {
    name: "Resin",
    id: "6",
    images: [
      CLD("v1771703476/decorom/products/dtv6nu8f3rfanmkfzcin.png"), // Ocean Blue Resin Art
      CLD("v1771698479/decorom/products/zeqwbzoc9xjumzm5ftua.png"), // Golden Flake Resin Nameplate
      CLD("v1773569229/decorom/products/pct1r7ntizduqwjvfx5g.png"), // Floral Pressed Resin Plate
      CLD("v1771703054/decorom/products/n7fselgisyplrzpktr8z.png"), // Marble Resin Divine Custom
      CLD("v1771698199/decorom/products/iaybtun9ujsswnendqao.png"), // Agate Geode Resin Craft
    ],
  },
];

export const CATEGORY_SEO_DATA = {
  wooden: {
    title: "Custom Wooden Nameplates in Ahmedabad | From ₹999",
    description: "Shop handcrafted wooden nameplates for home entrance. Teak wood & MDF designs with weather-resistant polish. Free delivery in Ahmedabad & India.",
    keywords: "wooden name plate maker near me, custom wooden nameplate ahmedabad, teak wood door name plate, door name plate near me, wooden name plate shop near me",
    faqs: [
      { q: "Are wooden nameplates waterproof and suitable for outdoor entrance doors?", a: "Yes! Decorom wooden nameplates are treated with multi-layer exterior marine PU (polyurethane) coating and termite-resistant sealant, making them weather-resistant for outdoor covered entrances and main doors." },
      { q: "What types of wood materials are used in Decorom wooden nameplates?", a: "We craft nameplates using premium Teak wood, Mango wood, Steam Beech, and high-density moisture-resistant HDMR/MDF for crisp laser cutting and rich grain finishes." },
      { q: "What is the starting price for custom wooden nameplates?", a: "Our custom handcrafted wooden nameplates start at ₹999, which includes customized name/house number engraving, font customization, and free doorstep delivery across India." },
      { q: "Can I customize regional language fonts (e.g. Gujarati, Hindi, Marathi) and religious symbols?", a: "Absolutely! You can personalize your nameplate in English, Gujarati, Hindi, or any regional language script, along with traditional 3D symbols such as Om, Swastik, Ganesha, Kalash, or Lotus motifs." },
      { q: "How do I clean and maintain a wooden nameplate?", a: "Simply wipe it clean with a soft dry or slightly damp microfibre cloth. Avoid harsh chemicals or direct high-pressure hose washing to preserve the natural wood polish for years." },
      { q: "How is the wooden nameplate mounted on the wall or door?", a: "Every wooden nameplate comes with pre-drilled concealed wall mounting keyholes, heavy-duty studs/screws, or industrial 3M double-sided tape for easy 5-minute installation." }
    ]
  },
  acrylic: {
    title: "3D Acrylic Name Plates Online | Waterproof Door Plates",
    description: "Buy premium 3D glossy acrylic nameplates in Ahmedabad. UV-printed, 100% waterproof & durable for apartments and villas starting at ₹799.",
    keywords: "acrylic name plate maker near me, 3d acrylic name plate, outdoor acrylic nameplate ahmedabad, door name plate near me, custom acrylic door plate",
    faqs: [
      { q: "How durable are 3D acrylic nameplates for outdoor use?", a: "3D acrylic nameplates are 100% waterproof, rustproof, and UV-resistant. High-cast acrylic does not yellow or warp in sunlight, ensuring 7–10+ years of pristine outdoor durability." },
      { q: "What is the difference between flat printed acrylic and 3D embossed acrylic nameplates?", a: "Flat acrylic nameplates feature direct UV flatbed printed text, whereas 3D embossed acrylic nameplates feature laser-cut raised letters (acrylic or metallic gold/silver) glued onto a solid acrylic base for a premium tactile depth." },
      { q: "Are LED illuminated 3D acrylic nameplates available?", a: "Yes! We offer backlit and edge-lit LED acrylic nameplates with waterproof warm white, neutral white, or golden LED modules with power adaptors included." },
      { q: "What sizes are available for acrylic door nameplates?", a: "Standard sizes range from 12x6 inches (compact apartment doors) to 18x12 inches or 24x14 inches for independent houses, villas, and bungalow gates. Custom sizes are also manufactured on request." },
      { q: "How do I install a 3D acrylic nameplate?", a: "Acrylic nameplates come with pre-drilled holes and premium brass/stainless steel mirror cap screws or floating wall stand-off studs that elevate the plate 1 inch off the wall for a 3D shadow effect." }
    ]
  },
  acp: {
    title: "ACP Name Plates for Home & Villa | Weatherproof Metal",
    description: "Aluminium Composite Panel (ACP) nameplates in wooden & metallic finishes. Ultra-durable, rustproof & stylish entrance decor in Ahmedabad.",
    keywords: "acp name plate maker near me, acp sheet name plate ahmedabad, outdoor metal name plate, acp wooden nameplate",
    faqs: [
      { q: "What is an ACP nameplate and why is it recommended for outdoors?", a: "ACP (Aluminium Composite Panel) consists of two aluminium sheets bonded to a polyethylene core. It is ultra-lightweight, 100% rustproof, weatherproof, and fire-retardant, making it the most durable choice for exterior gates and exposed walls." },
      { q: "What textures and finishes are available in ACP nameplates?", a: "ACP nameplates come in natural wood grain textures (Teak, Walnut, Rosewood), brushed metallic gold/silver, matte black, marble gloss, and mirror finishes." },
      { q: "Will the ACP color fade in rain or harsh sunlight?", a: "No. Our ACP sheets feature high-performance PVDF/PE exterior coating that withstands extreme Indian weather conditions without fading, rusting, or peeling." },
      { q: "Can ACP nameplates be combined with 3D acrylic or metal lettering?", a: "Yes! A popular combination is a textured wooden ACP base panel layered with raised 3D acrylic or golden stainless steel letters for an architectural luxury finish." },
      { q: "What is the expected lifespan and warranty of an ACP nameplate?", a: "ACP nameplates have an outdoor lifespan of 10–15+ years. Decorom provides a 1-year product warranty against manufacturing defects and fading." }
    ]
  },
  "mild-steel": {
    title: "Laser Cut Mild Steel Nameplates | Modern Metal Decor",
    description: "Precision laser-cut mild steel nameplates with powder coating. Modern minimalist designs for home & office entrance in Ahmedabad.",
    keywords: "metal name plate maker near me, laser cut name plate ahmedabad, mild steel nameplate, ms metal nameplate",
    faqs: [
      { q: "What is a laser-cut Mild Steel (MS) nameplate?", a: "Mild Steel nameplates are crafted from heavy-gauge solid steel sheets precision laser-cut with intricate calligraphy, house numbers, or tree/family motifs for a modern architectural entrance." },
      { q: "Is powder-coated mild steel rust-resistant for outdoor gates?", a: "Yes! Decorom MS nameplates undergo a 7-tank anti-corrosion chemical treatment followed by industrial-grade thermal powder coating, rendering them rust-resistant and weatherproof." },
      { q: "What colors and finishes can I choose for mild steel nameplates?", a: "Our most popular finishes include Matte Black, Satin Bronze, Textured Charcoal, Antique Copper, and Off-White powder coatings." },
      { q: "Are metal nameplates heavy and difficult to install?", a: "Despite their solid feel, MS nameplates are engineered with optimal sheet thickness (1.5mm to 2.5mm) and include heavy-duty wall stand-off spacers for secure mounting on concrete, brick, or wooden gates." },
      { q: "Can I include family member names and flat numbers on MS nameplates?", a: "Yes! Precision laser cutting allows crisp reproduction of long family names, sub-texts, flat/bungalow numbers, and custom icons (Om, Swastik, tree of life)." }
    ]
  },
  "stainless-steel": {
    title: "Stainless Steel Nameplates | SS 304 Premium Name Plates",
    description: "Rust-proof SS 304 stainless steel nameplates in mirror, gold & rose gold finishes. Elegant long-lasting door nameplates in Ahmedabad.",
    keywords: "stainless steel name plate maker near me, ss 304 nameplate ahmedabad, rose gold metal name plate, ss name plate design",
    faqs: [
      { q: "What grade of stainless steel does Decorom use for nameplates?", a: "We exclusively use high-grade SS 304 stainless steel, which offers superior corrosion resistance against rain, humidity, and coastal weather without rusting or staining." },
      { q: "What finishes are available in SS 304 nameplates?", a: "Stainless steel nameplates are available in Mirror Polish, Brushed Hairline, Electroplated Titanium Gold, Rose Gold, and Matte Black PVD finishes." },
      { q: "What is the difference between etched SS and 3D cut SS nameplates?", a: "Etched SS nameplates feature chemical acid etching where letters are recessed and color-filled with enamel paint. 3D cut SS nameplates feature individual raised metal letter cutouts welded or mounted onto a base plate for deep dimension." },
      { q: "Do stainless steel nameplates require polishing over time?", a: "No periodic polishing is required! SS 304 with PVD titanium coating maintains its glossy gold or mirror finish naturally. Occasional wiping with a soft cloth removes dust." },
      { q: "Are backlit LED options available for SS 304 metal nameplates?", a: "Yes, hollow laser-cut SS nameplates can be fitted with back-lit acrylic diffusers and warm LED modules for a breathtaking glow at night." }
    ]
  },
  resin: {
    title: "Resin Art Nameplates | Custom Handcrafted Home Decor",
    description: "Handcrafted resin art nameplates with real pressed flowers, gold leafing & marble textures. Unique artistic entrance nameplates in Ahmedabad.",
    keywords: "resin name plate maker near me, resin art nameplate ahmedabad, custom resin door plate, ocean resin nameplate",
    faqs: [
      { q: "What is a Resin Art nameplate?", a: "Resin nameplates are handcrafted artistic door plates created using crystal-clear epoxy resin infused with real pressed flowers, metallic gold/copper flakes, alcohol inks, marble swirls, or geode stone textures." },
      { q: "Are resin nameplates glass-like and fragile?", a: "Resin has a high-gloss, glass-like reflection, but unlike glass, it is highly durable, shatterproof, and impact-resistant." },
      { q: "Can resin nameplates be placed outdoors on main entrance doors?", a: "Resin nameplates are ideal for apartment entrance doors, indoor foyers, and covered entrance corridors. For direct sunlight, we use UV-stabilized non-yellowing epoxy resin." },
      { q: "How long does it take to handcraft a custom resin nameplate?", a: "Because epoxy resin requires multi-layer pouring and 48–72 hours of curing time per layer, custom resin nameplates are crafted and dispatched within 5–7 working days." },
      { q: "Can I choose custom colors, flowers, or themes for my resin nameplate?", a: "Yes! You can choose color themes (e.g. Royal Blue & Gold, White & Rose Gold, Emerald Green, Botanical Floral, Ocean Waves) and custom 3D acrylic text." }
    ]
  }
};

