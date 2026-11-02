# Khaiju Studio Team

https://github.com/biyamkhaiju/khaiju-studio-ledger.git
Continue my existing Khaiju Studio Ledger project without rebuilding it or changing its current design.

Add a beautiful, modern Our Team page to the dashboard where I can manage and showcase our workers.

Features:

Display workers in attractive animated profile cards with smooth hover effects and subtle entrance animations.

Allow uploading, changing, and removing each worker's profile picture.

Store worker information and image paths in my existing Supabase database and Storage.

Each worker should have a name, role, profile photo, short description, and work status: Available, Working, or On Leave.

Show status badges with distinct colors and a live-looking status indicator.

Add search, status filters, and an admin-only form to add, edit, and delete workers.

Make the page responsive, polished, and consistent with the existing dark/light themes.

Create only the necessary database migration and Storage policies. Protect worker-management actions with appropriate authentication and Row Level Security.

Use the existing Supabase project; do not create another database or insert fake worker records.

Verify that changes persist after refreshing the website.

First inspect the existing code and Supabase configuration. Preserve all existing features and data.
preview it here

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/296f93bf-c0e7-4ed5-b404-eecef97dc6e7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
