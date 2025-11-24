
// Autonomous Data Merging using Vite's import.meta.glob
// This automatically imports all .js files in the current directory (excluding index.js)

const modules = import.meta.glob('./*.js', { eager: true });

export const categories = {};
export let allProducts = [];

for (const path in modules) {
  // Extract category name from filename (e.g., "./nameplate.js" -> "nameplate")
  const fileName = path.split('/').pop().replace('.js', '');
  
  if (fileName === 'index') continue;

  // Assumes each file exports 'types' array as seen in nameplate.js
  const productList = modules[path].types || [];
  
  // Add category field to each product if missing (useful for global search)
  const productsWithCategory = productList.map(p => ({
    ...p,
    category: fileName
  }));

  categories[fileName] = productsWithCategory;
  allProducts = [...allProducts, ...productsWithCategory];
}

export default { categories, allProducts };
