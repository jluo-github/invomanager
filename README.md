Please visit [InvoManager](https://invomanager.vercel.app) for details.

### Skills and Tools Used

- **Next.js:** Utilized for building server-side rendered React applications.
- **React:** Used for building the frontend of the website.
- **TypeScript:** Added for type safety and improving code quality.
- **Drizzle:** Used for database operations and data modeling.
- **Tailwind CSS:** Used for rapidly styling the user interface with utility classes.
- **Shadcn-ui:** Implemented for designing and developing UI components.
- **Clerk:** Integrated for authentication and user management.
- **Stripe:** Used for handling payments and financial transactions.
- **Resend:** Used for email marketing and communication.
- **GitHub Actions:** Utilized for automating CI/CD workflows.
- **vitest:** Utilized for unit testing.

### shadcn

```
npx shadcn@latest init -d

```

### dark mode

```
npm install next-themes
npx shadcn@latest add dropdown-menu

```

### shadcn components

```
npx shadcn@latest add button table toast sonner alert-dialog dialog avatar card input label textarea separator skeleton menubar

npx shadcn@latest add badge
npx shadcn@latest add pagination

```

### toast sonner

```
npx shadcn@latest add toast sonner

```

### lucide-react

```
npm i lucide-react

```

### xato drizzle db

[xato](https://app.xata.io/workspaces/J-L-s-workspace-s1u9qf/dbs/invoice-app:us-west-2/branches/main)

[xato-drizzle](https://xata.io/docs/integrations/drizzle)

```
npm i drizzle-orm pg

npm i -D drizzle-kit @types/pg

npm i dotenv --save


<!-- Generate migrations: -->
npx drizzle-kit generate

<!-- Apply migrations: -->
npx drizzle-kit migrate

```

### next rc

```
npm install next@rc react@rc react-dom@rc --legacy-peer-deps

```

### next@canary

```
npm i next@canary --legacy-peer-deps

```

### clerk

```
npm install @clerk/nextjs

```

### @clerk/elements

```
npm install @clerk/elements

```

### stripe

[stripe](https://github.com/stripe/stripe-node)
[checkout](https://docs.stripe.com/checkout/quickstart)
[after-payment](https://docs.stripe.com/payments/checkout/custom-success-page)

```
npm install stripe --save

```

### resend email

[react-email](https://demo.react.email/preview/magic-links/linear-login-code?view=source)

```
npm i resend
npx create-email@latest
npm install resend @react-email/components

```

### html2pdf

[pdf](https://ekoopmans.github.io/html2pdf.js/)

```
npm install --save html2pdf.js

```

### vitest

```
npm install vitest @testing-library/react @testing-library/jest-dom --save-dev

```
