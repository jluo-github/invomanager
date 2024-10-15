import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import React from "react";
import Home from "../../src/app/page";

vi.mock("@clerk/nextjs/server", () => ({
  auth: () => ({
    userId: "mock-user-id", // Mocked userId
  }),
}));

test("Home Page", () => {
  render(<Home />);
  // Check if the heading is in the document
  const heading = screen.getByRole("heading", {
    level: 1,
    name: /InvoManager/i,
  });

  expect(heading).toBeDefined();
});
