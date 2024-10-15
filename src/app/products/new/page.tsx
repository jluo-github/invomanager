import { createProduct } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const NewProduct = () => {
  return (
    <div className='my-12'>
      {" "}
      <h2 className='text-2xl font-semibold mb-8'>Create Product</h2>
      <form action={createProduct} className='flex flex-col gap-8 max-w-sm mx-auto'>
        <Input type='text' name='name' placeholder='Name' />
        <Button type='submit' className='w-2/3 mx-auto'>
          Create Product
        </Button>
      </form>
    </div>
  );
};
export default NewProduct;
