"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createInvoice } from "@/app/actions";
import { useState, startTransition } from "react";
import SubmitBtn from "@/components/SubmitBtn";
// import Form from "next/form";

const NewInvoice = () => {
  const [state, setState] = useState("ready");
  // handle form submission
  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (state === "pending") {
      e.preventDefault();
      return;
    }
    setState("pending");

    // const target = e.target as HTMLFormElement;
    // startTransition(async () => {
    //   const formData = new FormData(target);
    //   await createInvoice(formData);
    // });
  };

  return (
    <main className='flex flex-col items-center gap-12 my-8'>
      {/* heading */}
      <h1 className='text-3xl font-semibold my-4'>Create Invoice</h1>

      {/* form */}
      <form
        action={createInvoice}
        onSubmit={handleOnSubmit}
        className='grid gap-4 max-w-md w-full'>
        <div className=''>
          <Label htmlFor='name' className='block mb-2 font-semibold'>
            Billing Name
          </Label>
          <Input name='name' id='name' type='text' className='mb-4' />
        </div>
        <div className=''>
          <Label htmlFor='email' className='block mb-2 font-semibold'>
            Email
          </Label>
          <Input name='email' id='email' type='text' className='mb-4' />
        </div>
        <div className=''>
          <Label htmlFor='value' className='block mb-2 font-semibold'>
            Value
          </Label>
          <Input name='value' id='value' type='text' className='mb-4' />
        </div>

        <div className=''>
          <Label htmlFor='description' className='block mb-2 font-semibold'>
            Description
          </Label>
          <Textarea name='description' id='description' className='mb-4' />
        </div>

        <div className='mx-auto w-full flex justify-center my-4'>
          {" "}
          <SubmitBtn />
        </div>
      </form>
    </main>
  );
};

export default NewInvoice;
