zamwel: You are an expert full-stack developer. Generate a complete Next.js + TypeScript project (with Tailwind CSS) for a sports prediction (bet listing) website, similar in functionality to sites like Enokay69, with the following requirements and details:

1. PROJECT SETUP
   - Use Next.js (latest stable) with TypeScript. You may choose App Router or Pages Router; ensure consistency.
   - Tailwind CSS for styling and responsive design.
   - Prisma ORM with PostgreSQL as the database.
   - JWT-based authentication for users (signup/login). You may optionally integrate NextAuth, but JWT is acceptable.
   - Organize code into clear folders: `pages` or `app`, `components`, `lib`, `prisma`, `hooks`, etc.
   - Provide scripts for development (`dev`), building (`build`), and starting (`start`).
   - Include ESLint/Prettier configuration for code consistency.

2. DATA MODELS (Prisma Schema)
   - **User**:
     - `id` (String @id @default(uuid()))
     - `email` (String @unique)
     - `passwordHash` (String)
     - `role` (Enum: USER, VIP, ADMIN)
     - `createdAt`, `updatedAt` (DateTime)
   - **Prediction**:
     - `id` (String @id @default(uuid()))
     - `league` (String)
     - `homeTeam` (String)
     - `awayTeam` (String)
     - `tip` (String)  // e.g., “Home or Draw”, “Over 1.5 Goals”
     - `analysis` (String?) // detailed explanation
     - `odds` (Float?) // optional
     - `result` (Enum: PENDING, WON, LOST) // default PENDING
     - `publishedAt` (DateTime)
     - `createdBy` (relation → User)
     - `isFree` (Boolean) // free vs VIP-only
   - **Subscription**:
     - `id` (String @id @default(uuid()))
     - `user` (relation → User)
     - `plan` (Enum or String: “monthly”, “yearly”, etc.)
     - `status` (Enum: ACTIVE, EXPIRED, CANCELLED)
     - `startedAt`, `expiresAt` (DateTime)
     - `flutterwavePaymentId` (String?) // record for reconciliation
   - **Payment** (for record-keeping, via Flutterwave):
     - `id` (String @id @default(uuid()))
     - `user` (relation → User)
     - `amount` (Float)
     - `currency` (String, e.g., “NGN”, “USD”)
     - `provider` (String, set to “Flutterwave”)
     - `status` (Enum: PENDING, SUCCESS, FAILED)
     - `createdAt` (DateTime)
     - `reference` (String) // Flutterwave payment reference
   - **League** (optional normalization):
     - `id` (String @id @default(uuid()))
     - `name` (String @unique)
   - **Config** or **Settings**:
     - Global settings like free prediction limit, site title, etc.

3. AUTHENTICATION & AUTHORIZATION
   - **Signup/Login** APIs:
     - Hash passwords with bcrypt (or Argon2) on signup.
     - On login, verify password and return a JWT stored in an HttpOnly cookie.
     - Protect subsequent API calls by validating JWT.
   - **Middleware** (Next.js middleware or HOC) for:
     - Guarding pages/routes: e.g., VIP-only pages, Admin dashboard.
     - Checking `role` and subscription status.
   - **Password reset** (optional): generate a token, send email via a mailer (e.g., SendGrid).
   - Secure environment variables: `JWT_SECRET`, `DATABASE_URL`, `FLW_SECRET_KEY`, `FLW_ENCRYPTION_KEY`, `FLW_PUBLIC_KEY`, etc.

4. PUBLIC PAGES & ROUTES
   - **Home**: 
     - Display featured free predictions (e.g., latest 5).
     - CTA to sign up / join VIP.
   - **Predictions Listing** (`/predictions`):
     - Show upcoming predictions, filterable by league, date, risk level.
     - Free items visible to all; VIP-only items show blurred summary or “Subscribe to view details”.
   - **Prediction Details** (`/predictions/[id]`):
     - If free: show full details.
     - If VIP-only and user not VIP: show partial info or prompt to subscribe.
     - If VIP: show full analysis, odds, and any additional content.
   - **Results Page** (`/results`):
     - List past predictions with their outcomes. Accessible to logged-in users; free vs VIP access as desired.
   - **About Us / Contact Us**:
     - Static pages; contact form submits to `/api/contact`, which emails site admin.
   - **Pricing / VIP Page** (`/pricing`):
     - Describe subscription plans, benefits, pricing tiers.
     - A “Subscribe” button triggers Flutterwave checkout.
   - **Auth Pages**:
     - `/signup`, `/login`, `/logout`.
   - **User Dashboard** (`/dashboard`):
     - Show user info, subscription status, next renewal date.
     - Option to manage subscription (cancel, if supported by Flutterwave).
     - History of payments and predictions viewed.
   - **Social Sharing**:
     - Include share buttons (use libraries like `next-share`) on public/free predictions.

5. ADMIN DASHBOARD
   - Route: `/admin` (or `/dashboard/admin`), protected: only role=ADMIN.
   - **Layout**: Sidebar navigation: Predictions, Users, Subscriptions, Payments, Settings, Analytics.
   - **Predictions Management**:
     - List all predictions in a table: filter/search by league, status, date.
     - “Create Prediction” form: fields for league (select or text), home/away teams, tip, analysis, odds, isFree flag, publish date/time.
     - “Edit Prediction”: update fields; after match, update `result` to WON/LOST.
     - “Delete/Archive”: soft-delete or remove.
   - **Users Management**:
     - List users: email, role, subscription status, joined date.
     - Actions: change role (e.g., grant/revoke ADMIN or VIP), manually adjust subscription expiry.
   - **Subscriptions**:
     - View active subscriptions with user, plan, start & expiry dates.
     - Option to manually expire or extend.
   - **Payments**:
     - View all Flutterwave payments: reference, amount, currency, status, date, linked user.
     - Retry failed payments or investigate.
   - **Analytics / Stats**:
     - Show metrics: total users, active VIP users, prediction performance stats (win/loss ratio), revenue over time.
     - Use charts (e.g., Recharts) for visualization.
   - **Bulk Upload** (optional):
     - Upload CSV/JSON to create multiple predictions at once.
   - **Settings**:
     - Site title, free-limit count, contact email, allowed leagues list.
     - Can be stored in a Settings table or environment variables.
   - **Notifications**:
     - Send an email to all users about new features or promotions (integrate with a mail service).
   - **Export Data**:
     - Export lists (users, predictions, payments) as CSV.

6. FLUTTERWAVE PAYMENT INTEGRATION
   - **Environment Variables**:
     - `FLW_PUBLIC_KEY`, `FLW_SECRET_KEY`, `FLW_ENCRYPTION_KEY`, `FLW_BASE_URL` (if using test vs live).
   - **Frontend**:
     - On “Subscribe” button click, call backend endpoint to create a Flutterwave payment request.
   - **Backend API**:
     - `/api/payment/create`: Accepts userId & plan; computes amount; calls Flutterwave’s “Create Payment” endpoint (e.g., via server-side fetch to `https://api.flutterwave.com/v3/payments` or using Flutterwave SDK). Provide redirect URL back to site after payment.
     - Return payment link or embed Flutterwave inline modal as per Flutterwave docs.
   - **Webhook Endpoint**:
     - `/api/webhooks/flutterwave`: Handle Flutterwave callbacks. Verify signature (using `FLW_SECRET_KEY` or `FLW_ENCRYPTION_KEY` as required).
     - On successful payment: create or update Subscription record, create Payment record with status SUCCESS.
     - On failed/cancelled: record status, notify user if needed.
   - **Subscription Logic**:
     - When payment is successful, set `startedAt = now`, compute `expiresAt` based on plan duration.
     - If user already has active subscription, extend expiry or handle pro-rata as per business rules.
     - On expiry: you may schedule a background job or check on each protected request; if expired, downgrade access.
   - **Cancellation / Refunds**:
     - Provide admin UI to trigger refunds or cancellations via Flutterwave API if necessary.
   - **Testing**:
     - Use Flutterwave test mode keys; simulate webhook calls locally (e.g., via ngrok).
   - **Security**:
     - Use server-side calls for secret keys; never expose `FLW_SECRET_KEY` in frontend.
     - Validate all incoming webhook data; verify signature/encryption per Flutterwave docs.

7. API ROUTES & LIBRARIES
   - **Database Client**: `lib/prisma.ts` exports a singleton PrismaClient.
   - **Auth Helpers**: `lib/auth.ts` for hashing, signing JWT, verifying JWT middleware.
   - **Flutterwave Helpers**: `lib/flutterwave.ts` with functions to create payments, verify webhooks.
   - **Email Helpers**: `lib/email.ts` if sending emails.
   - **Validation**: Use Zod or Joi for request body validation in API routes.
   - **API Endpoints**:
     - `/api/auth/signup`, `/api/auth/login`, `/api/auth/logout`
     - `/api/predictions` (GET public, POST create if admin)
     - `/api/predictions/[id]` (GET detail, PUT update if admin, DELETE if admin)
     - `/api/user/subscription` (GET status, POST to initiate payment)
     - `/api/payment/create` (initiates Flutterwave payment), `/api/webhooks/flutterwave`
     - `/api/contact` (POST contact form)
     - `/api/admin/...` if desired separate namespace
   - **Middleware**:
     - Next.js Middleware (in `middleware.ts`) or custom HOC to protect pages/API routes by checking JWT and roles/subscription.

8. FRONTEND COMPONENTS & PAGES
   - **Layout**: Global header (nav links: Home, Predictions, About, Contact, Login/Signup or User menu), footer.
   - **PredictionCard**: displays teams, date, tip summary; shows lock/blur UI if VIP-only and user not VIP.
   - **Forms**: SignupForm, LoginForm, ContactForm.
   - **Dashboard**: User dashboard page with subscription info, payment history.
   - **Admin Dashboard Layout**: Sidebar menu, main content area. Use a table component for listings. Provide modals or separate pages for create/edit forms.
   - **Payment Flow UI**: Button “Subscribe”, loading states, success/failure handling.
   - **Notifications/Toasts**: Show success/error messages (e.g., with a lightweight toast component).
   - **Responsive Design**: Use Tailwind utilities (`flex`, `grid`, breakpoints). Design at a base resolution (e.g., 1366×768) but ensure responsiveness.
   - **Electron Adaptation** (if wrapping in Electron): Keep layout fluid (`w-screen h-screen`), or apply scaling logic in Electron as previously discussed.

9. RESPONSIVENESS & UI SCALING
   - Use CSS `flex`/`grid`, `vw`/`vh`, relative units for fonts and spacing.
   - If targeting Electron wrapper: design for a base resolution, then apply transform-scale logic (via `window.electronAPI.getScreenSize()`) to adapt to actual window size.
   - Avoid fixed pixel widths on critical containers; allow scaling via CSS or JS.

10. ADMIN DASHBOARD DETAILS
    - **Auth Guard**: Only ADMIN role can access; redirect others.
    - **Sidebar Links**: Predictions, Users, Subscriptions, Payments, Analytics, Settings.
    - **Predictions Table**:
      - Columns: League, Teams, Tip, Odds, PublishedAt, CreatedBy, isFree, Result, Actions.
      - Actions: Edit (opens form), Delete/Archive, View Details.
    - **Create/Edit Form**:
      - Fields with validation; date/time picker for publish date.
    - **Users Table**:
      - Columns: Email, Role, Subscription Status, JoinedAt, Actions (Promote/Demote, Adjust Subscription).
    - **Subscriptions Table**:
      - List active/expired subscriptions; allow manual override.
    - **Payments Table**:
      - List with filters: status, date range; view details.
    - **Analytics Page**:
      - Fetch aggregated data: number of users, active VIP count, total revenue (from Payment records), prediction success rates.
      - Charts: bar chart, line chart (e.g., using Recharts).
    - **Settings Page**:
      - Form to update site-wide settings (e.g., free-limit count, site name). Can store in a Settings table or JSON in DB.
    - **Bulk Upload**:
      - CSV/JSON file upload component; parse on client or backend; create multiple predictions.
    - **Export**:
      - Button to export current table view as CSV. Use server-side API to generate CSV and send as file download.
    - **User Impersonation** (optional):
      - Admin can “login as” a user for troubleshooting; generate a temporary token.

11. DEPLOYMENT & ENVIRONMENT
    - **Environment Variables**:
      - `DATABASE_URL`, `JWT_SECRET`, `FLW_SECRET_KEY`, `FLW_PUBLIC_KEY`, `FLW_ENCRYPTION_KEY`, `FLW_BASE_URL` (test/live), `EMAIL_API_KEY`, etc.
    - **Migrations & Seeding**:
      - Provide `prisma migrate dev` steps and a seed script to create default admin user (use env vars for admin credentials), some leagues.
    - **Hosting**:
      - Next.js on Vercel or similar.
      - PostgreSQL on a managed host (Supabase, Railway, etc.).
      - If using Electron wrapper, build Next.js first and serve static files or point BrowserWindow to remote URL.
    - **CI/CD**:
      - On push to main: run lint/tests, prisma migrate deploy, build Next.js.
    - **HTTPS**:
      - Ensure production uses HTTPS for security.
    - **Webhooks**:
      - Flutterwave webhook endpoint must be publicly reachable (use ngrok for local testing).
    - **Logging & Monitoring**:
      - Log errors server-side; integrate Sentry or similar if desired.

12. SECURITY & BEST PRACTICES
    - Hash passwords securely.
    - Store JWT in HttpOnly cookies with Secure flag.
    - Validate/sanitize all inputs; use Zod for schemas.
    - Rate-limit auth endpoints.
    - Verify Flutterwave webhook signatures.
    - Do not expose secret keys in frontend.
    - Use CORS appropriately if Next.js API is consumed elsewhere.
    - Use helmet or similar security headers if serving static.
    - Use HTTPS in production.

13. OPTIONAL ADVANCED FEATURES
    - **Email Notifications**: send daily/weekly free predictions, subscription renewal reminders.
    - **Push Notifications**: integrate a push service for web or Electron native notifications.
    - **Referral System**: users can refer friends for free days of VIP.
    - **Multi-language / i18n**: support multiple locales.
    - **Search & Filtering**: advanced search on predictions (Elasticsearch or simple text search).
    - **Real-time Updates**: websockets for live score updates or prediction alerts.
    - **Mobile App**: later reuse API for React Native or Flutter.
    - **AI-assisted Analysis**: integrate a service or prompt to generate prediction analysis text.
    - **User Preferences**: favorite leagues, notification settings.
    - **Dark Mode**: theme toggling.

14. CODE GENERATION INSTRUCTIONS
    - Generate file-by-file code blocks, starting with:
      - `package.json` dependencies.
      - `tailwind.config.js` and `postcss.config.js`.
      - `prisma/schema.prisma`.
      - `lib/prisma.ts`, `lib/auth.ts`, `lib/flutterwave.ts`, `lib/email.ts`.
      - Next.js config: `next.config.js`, middleware if needed.
      - Pages/components: structured in folders; include comments explaining logic.
      - API route files with request validation, error handling, and comments for Flutterwave integration.
      - Provide seed script for initial data.
      - Provide example `.env.example` with placeholder variable names.
      - Show how to test Flutterwave integration locally.
    - For Admin Dashboard, generate UI components (tables, forms, charts).
    - Include guidance on how to wrap Next.js in Electron if desired (scaling logic, preload).
    - After code generation, include brief instructions on how to run migrations, start dev server, test payments, deploy.

15. DOCUMENTATION & README
    - Generate a `README.md` that explains:
      - Project overview and features.
      - Setup steps: environment variables, database setup, Prisma migrate & seed.
      - Running dev server, building for production.
      - How to configure Flutterwave keys in test vs live.
      - How to access Admin Dashboard (initial admin credentials).
      - How to wrap in Electron if applicable.
      - How to test webhook locally (using ngrok).
      - Security notes and best practices.

End of prompt.


 <section className="flex flex-col justify-center items-center relative min-h-[65vh] md:min-h-[80vh] 2xl:min-h-[95vh] 3xl:min-h-[90vh] bg-gradient-to-r from-neutral-600/40 to-neutral-800/40 text-white w-full bg-url(/stadium.webp) bg-cover bg-center"
                style={{
                    backgroundImage: 'linear-gradient(to right, #1a1818c0, #111010cb), url(/stadium.webp)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}>

                <div className="flex items-center justify-center w-full my-auto container px-4 py-8 mt-24 h-full overflow-hidden">
                    <div className="w-full flex items-center justify-center flex-col lg:flex-row lg:justify-between gap-2 h-full">
                        <div className="flex flex-col w-full h-full justify-center lg:w-1/2 text-center lg:text-left z-20 gap-4 ">
                            <p className="text-xl sm:text-3xl md:text-5xl font-thin italic text-white ">Welcome, {user?.username || "User"}</p>

                            <h1 className="text-3xl md:text-5xl lg:text-5xl 2xl:text-7xl font-bold sm:leading-16 md:leading-20 lg:leading-16 2xl:leading-24 lg:mt-8 ">
                                Welcome to the Expert BigBoysTips <span className="text-orange-400">Odds </span> Hub!
                            </h1>
                            <p className="text-sm sm:text-lg md:text-base text-white mt-4 sm:mt-8">
                                Join thousands of successful bettors who trust our expert analysis and predictions.
                                Get access to premium tips and increase your winning potential.
                            </p>
                            <div className="flex flex-col lg:flex-row items-center justify-center">
                                <div className="flex flex-col xl:flex-row justify-center items-center lg:justify-start gap-4 pt-4 w-full lg:mt-8">
                                    <Link
                                        href="https://t.me/bigboyzg" target='_blank'
                                        className="flex bg-orange-500 uppercase w-72 font-bold justify-center items-center gap-2 hover:scale-[1.05] transition-all text-white px-4 py-2 rounded-lg text-xs sm:text-base text-center"
                                    >
                                        <svg className="size-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.227-.535.227l.19-2.712 4.94-4.465c.215-.19-.047-.296-.332-.106l-6.103 3.854-2.623-.816c-.57-.18-.582-.57.12-.843l10.238-3.948c.473-.174.887.104.605 1.337z" />
                                        </svg>
                                        Join Telegram Channel
                                    </Link>
                                    <Link
                                        href="/pricing"
                                        className="flex justify-center relative bg-orange-500 w-72 uppercase border border-orange-500 gap-2 items-center hover:scale-[1.05] transition-all text-white px-4 py-2 rounded-lg font-bold text-xs sm:text-base text-center"
                                    >
                                        <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path
                                                d="M2 8l4 10h12l4-10-6 5-4-7-4 7-6-5z"
                                                fill="white"
                                                stroke="white"
                                                strokeWidth="1"
                                            />
                                            <circle cx="4" cy="8" r="1.5" fill="white" />
                                            <circle cx="12" cy="4" r="1.5" fill="white" />
                                            <circle cx="20" cy="8" r="1.5" fill="white" />
                                        </svg>
                                        Get Vip Games
                                        <div className="absolute top-2 right-2">
                                            <div className="relative w-2 h-2">
                                                <div className="absolute inset-0 rounded-full bg-orange-100 opacity-0 group-hover:scale-[6] group-hover:opacity-10 transition-all duration-500" />
                                                <div className="absolute inset-0 rounded-full bg-orange-100 animate-ping group-hover:opacity-0 transition-opacity" />
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            {/* <div className="flex items-center justify-center lg:justify-start gap-6 sm:gap-8 pt-8 bg-background-blur bg-white/10 backdrop-blur-sm rounded-lg p-4 sm:p-6 w-full lg:w-max">
                <StatCard value="95%" label="Accuracy Rate" />
                <StatCard value="10k+" label="Active Users" />
                <StatCard value="50k+" label="Predictions Made" />
              </div> */}
                        </div>
                        <div className="hidden lg:block w-full lg:w-1/2 px-4 sm:px-8 lg:px-0 blur-md lg:blur-none">
                            <div className="relative max-w-[500px] mx-auto lg:max-w-none">
                                <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-400/20 rounded-full blur-xl animate-pulse" />
                                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-orange-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
                                <Image
                                    src="/hero-img.png"
                                    alt="Sports prediction illustration"
                                    width={600}
                                    height={400}
                                    className="rounded-lg w-full h-full relative z-10 hover:scale-[1.02] transition-all duration-500 "
                                    priority
                                />
                                {/* <div className="hidden lg:block absolute bottom-24 sm:bottom-28 lg:bottom-0 -right-2 sm:-right-0 bg-gradient-to-br from-orange-400 to-orange-500 p-3 sm:p-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer group">
                                    <p className="text-gray-900 font-bold text-sm sm:text-base">Today&apos;s Win Rate</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 group-hover:scale-105 transition-transform">92%</p>
                                </div> */}
                                {/* Live Stats Floating Card */}
                                {/*  <div className="hidden lg:block absolute bottom-24 lg:bottom-0 -left-2 sm:-left-8 bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-lg border border-white/20 transform hover:scale-105 transition-all duration-300">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <p className="text-gray-100 text-sm font-medium">Live Stats</p>
                                    </div>
                                    <div className="mt-2 space-y-1">
                                        <p className="text-xs text-gray-200">Active Users: <span className="text-green-400">1.2k</span></p>
                                        <p className="text-xs text-gray-200">Pending Tips: <span className="text-orange-400">23</span></p>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                        <div className="lg:hidden w-full lg:w-1/2 absolute top-10 px-4  lg:px-0 blur-md lg:blur-none">
                            <div className="relative max-w-[500px] mx-auto lg:max-w-none">
                                <div className="absolute -top-4 -left-4 w-24 h-24 bg-orange-400/20 rounded-full blur-xl animate-pulse" />
                                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-orange-400/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
                                <Image
                                    src="/hero-img.png"
                                    alt="Sports prediction illustration"
                                    width={600}
                                    height={400}
                                    className="rounded-lg w-full h-auto relative z-10 hover:scale-[1.02] transition-all duration-500 "
                                    priority
                                />
                                {/* <div className="hidden lg:block absolute bottom-24 sm:bottom-28 lg:bottom-0 -right-2 sm:-right-0 bg-gradient-to-br from-orange-400 to-orange-500 p-3 sm:p-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer group">
                                    <p className="text-gray-900 font-bold text-sm sm:text-base">Today&apos;s Win Rate</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 group-hover:scale-105 transition-transform">92%</p>
                                </div> */}
                                {/* Live Stats Floating Card */}
                                {/*  <div className="hidden lg:block absolute bottom-24 lg:bottom-0 -left-2 sm:-left-8 bg-white/10 backdrop-blur-md p-4 rounded-lg shadow-lg border border-white/20 transform hover:scale-105 transition-all duration-300">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <p className="text-gray-100 text-sm font-medium">Live Stats</p>
                                    </div>
                                    <div className="mt-2 space-y-1">
                                        <p className="text-xs text-gray-200">Active Users: <span className="text-green-400">1.2k</span></p>
                                        <p className="text-xs text-gray-200">Pending Tips: <span className="text-orange-400">23</span></p>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </section>