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
