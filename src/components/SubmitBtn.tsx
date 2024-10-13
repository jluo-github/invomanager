"use client";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";

const SubmitBtn = () => {
  const { pending } = useFormStatus();
  // console.log("pending", pending);

  return (
    <Button className='w-2/3' disabled={pending}>
      {pending ? (
        <div className='flex gap-2 items-center'>
          <Loader className='h-6 w-6 animate-spin' /> Submitting
        </div>
      ) : (
        "Submit"
      )}
    </Button>
  );
};
export default SubmitBtn;
