This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

### Useful commands

When working on a branch and there's changes made in your branch that you want to pull, you can:
a. If you want to have your changes but also the changes made from github
    1. git stash
    2. git pull
    3. git stash pop
b. If you don't want to save the changes you have locally and only want the changes from github
    1. git reset --hard
    2. git pull
    3. check Source control if there's anything you need to fix

## Future

- Be ENS compatible
- Available with different languages
- Account for gas during transaction
- Account for transactions sent to the wallet

## Tasks

### Extra, for easier development
- Figure out how to change components in aliases for components.json. Everytime we add from shadcn, it creates a new file, we want it to instead go straight to ./src/app/components/ui

### UX
- We want to have a bit of a delay when user clicks onto a new page. Having too fast of a page load is bad user experience. [concept but not exact copy](https://youtu.be/fx6KMItwJAw?si=DbZQkVOwmm5UW_gk)
- Have the "view transactions" button disbaled until the three forms are filled

## Documentation

### Nextjs
- [How the Link component in Nextjs works - we don't use <a href>](https://nextjs.org/docs/pages/api-reference/components/link)

### Reactjs
- [Learn React by watching then doing](https://v2.scrimba.com/learn-react-c0e)
- [What useContext is for and how it works](https://youtu.be/HYKDUF8X3qI?si=mTaO92BrpHHRAk59)
- [Differences between default and named exports](https://youtu.be/RMl-ystfzoY?si=-KFOzY5b5gRr_bof)

### Tailwind
- [Only certain px from tailwind width adjustments](https://tailwindcss.com/docs/width)
- [Making website responsive using Tailwind CSS](https://youtu.be/PuovsjZN11Y?si=8wMLdVxhjI_DBwKF)

### Shadcn
- [Using shadcn](https://youtu.be/ABbww4CFQSo?si=JDVDMJ15UXTd_aAH)

### Namecheap
- [Buying a domain for cheap](https://youtu.be/a2Jh00ZXYrc?si=baS2DUxaM8zTL4Ah)
