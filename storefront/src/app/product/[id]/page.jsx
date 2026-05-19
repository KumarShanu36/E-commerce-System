import ProductDetailClient from "./ProductDetailClient";

export async function generateStaticParams() {
  const fallbackIds = [
    "69fc8f0b69c68607be054381",
    "69fc8f0b69c68607be054382",
    "69fc8f0b69c68607be054383",
    "69fc8f0b69c68607be054384",
    "69fc8f0b69c68607be054385",
    "69fc8f0b69c68607be054386",
    "69fc8f0b69c68607be054387",
    "69fc8f0b69c68607be054388",
    "69fc8f0b69c68607be054389",
    "69fc8f0b69c68607be05438a",
  ];
  try {
    const res = await fetch("http://localhost:5000/api/v1/products");
    if (res.ok) {
      const products = await res.json();
      if (Array.isArray(products) && products.length > 0) {
        return products.map((product) => ({
          id: String(product.id || product._id),
        }));
      }
    }
  } catch (error) {
    console.warn("Backend not running or products fetch failed, using fallback IDs for static export.");
  }
  return fallbackIds.map((id) => ({ id }));
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  return <ProductDetailClient id={id} />;
}
