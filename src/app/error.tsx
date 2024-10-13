"use client";

import NextError from "next/error";

const ErrorPage = ({ error }: { error: Error }) => {
  return (
    <div>
      <NextError statusCode={500} title={error.message} />
      <p>Error: {error.message}</p>
    </div>
  );
};
export default ErrorPage;
