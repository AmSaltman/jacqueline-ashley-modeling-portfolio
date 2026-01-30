# Jacqueline Ashley Modeling Portfolio

A simple, elegant modeling portfolio built with Next.js, Tailwind CSS, and Framer Motion.

## Features

- **Masonry Layout**: Automatically arranges images in optimal columns.
- **Interactive Slider**: Adjust the size of images (and number of columns) dynamically.
- **Lightbox**: Full-screen image viewing with keyboard and button navigation.
- **Responsive**: Works perfectly on mobile and desktop.

## Getting Started

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Run the development server:
    ```bash
    npm run dev
    ```

## Adding Your Images

Since the Google Drive link cannot be accessed programmatically without authentication:

1.  Download your images from Google Drive.
2.  Place them in the `public/images` folder (create it if it doesn't exist).
3.  Update `components/data.ts` with the filenames of your images.

```typescript
// components/data.ts
export const images: PortfolioImage[] = [
  { id: "1", src: "/images/your-photo-1.jpg", width: 800, height: 1200, alt: "Description" },
  // ...
];
```

## Deployment on Vercel

To deploy this project to your Vercel account:

1.  Push this code to a Git repository (GitHub, GitLab, or Bitbucket).
2.  Import the project in your Vercel dashboard.
3.  Deploy!

Alternatively, use the Vercel CLI:

```bash
vercel
```
