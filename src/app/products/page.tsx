import { db } from "@/db";
import { Products } from "@/db/schema";

const ProductsPage = async () => {
  // fetch products
  const products = await db.select().from(Products).limit(3);

  if (!products || products.length === 0) {
    return <p className='my-8'>No products found.</p>;
  }

  return (
    <div className='flex flex-col mx-auto gap-8 items-center my-12'>
      <h1 className='text-5xl'>Products</h1>
      <p>Here are all the products</p>
      <div className='flex flex-col gap-4 items-start justify-start w-full '>
        {products.map((product) => (
          <div key={product.id}>Name: {product.name}</div>
        ))}
      </div>
    </div>
  );
};
export default ProductsPage;
