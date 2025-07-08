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


  {/* Recent Predictions Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col space-y-12">
                        {/* Section Header */}
                        <div className="text-center">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Expert Predictions
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
                                Access our winning predictions with proven success rates. Upgrade to VIP for premium insights.
                            </p>
                        </div>

                        <div className="w-full grid grid-cols-1 xl:grid-cols-3 gap-8">

                            <div className="flex flex-col w-full xl:col-span-2 gap-16">
                                {/* VIP Predictions */}
                                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 h-max">
                                    <div className="p-6 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-200">
                                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                                            <h3 className="text-sm sm:text-xl font-bold text-white flex items-center gap-2">
                                                VIP Predictions
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-400 text-gray-900">
                                                    Premium
                                                </span>
                                            </h3>
                                            <Link
                                                href="/pricing"
                                                className="px-4 py-2 text-sm font-medium text-gray-900 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300"
                                            >
                                                {content.isSubscriptionActive ? "View All VIP Odds" : "Upgrade to VIP"}
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="">
                                        {!content.isSubscriptionActive && <div className="grid gap-6 md:grid-cols-2 p-6">
                                            {/* VIP Features */}
                                            <div className="space-y-4">
                                                <h4 className="font-medium text-gray-900">Premium Features</h4>
                                                {[
                                                    'Exclusive high-probability predictions',
                                                    'Detailed match analysis',
                                                    'In-depth statistics',
                                                    'Expert betting strategies',
                                                    'Priority support',
                                                    'Early access to tips'
                                                ].map((feature, index) => (
                                                    <div key={index} className="flex items-center gap-2 text-gray-600">
                                                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        <span>{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            {/* Preview (Blurred) */}
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
                                                    {!content.isSubscriptionActive && <div className="text-center">
                                                        <div className="w-12 h-12 mx-auto mb-4 text-orange-400">
                                                            <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                            </svg>
                                                        </div>
                                                        <p className="font-medium text-gray-900">Unlock Premium Content</p>
                                                        <p className="text-sm text-gray-600 mt-1">Subscribe to access VIP predictions</p>
                                                    </div>}
                                                    {content.isSubscriptionActive && <div className="text-center">
                                                        <div className="w-12 h-12 mx-auto mb-4 text-orange-400">
                                                            <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                                                                <path
                                                                    d="M2 8l4 10h12l4-10-6 5-4-7-4 7-6-5z"
                                                                    fill="#FFD700"
                                                                    stroke="#FBBF24"
                                                                    strokeWidth="1"
                                                                />
                                                                <circle cx="4" cy="8" r="1.5" fill="#FFD700" />
                                                                <circle cx="12" cy="4" r="1.5" fill="#FFD700" />
                                                                <circle cx="20" cy="8" r="1.5" fill="#FFD700" />
                                                            </svg>
                                                        </div>
                                                        <p className="font-medium text-gray-900">Unlock Premium Content</p>
                                                        <p className="text-sm text-gray-600 mt-1">Use the button below to view VIP predictions and analysis</p>
                                                        <br />
                                                        <Link
                                                            href="/pricing"
                                                            className="px-4 py-2 mt-16 text-sm font-medium text-gray-900 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300"
                                                        >
                                                            Goto Premium Predictions
                                                        </Link>
                                                    </div>}
                                                </div>
                                                <div className="space-y-4">
                                                    {[1, 2].map((index) => (
                                                        <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                            <div className="flex justify-between items-center mb-2">
                                                                <div className="w-1/2 h-4 bg-gray-200 rounded" />
                                                                <div className="w-16 h-4 bg-gray-200 rounded" />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <div className="w-3/4 h-3 bg-gray-200 rounded" />
                                                                <div className="w-2/3 h-3 bg-gray-200 rounded" />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>}
                                        {content.isSubscriptionActive && <div className=" bg-white rounded-xl overflow-hidden h-max">
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prediction</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Odds</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200 bg-white">
                                                        {currentPredictions
                                                            .filter(prediction => prediction.result === "PENDING" && !prediction.isFree)
                                                            .slice(0, 5)
                                                            .map((prediction, index) => (
                                                                <tr key={index} className="hover:bg-gray-50 transition-colors odd:bg-neutral-100">
                                                                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-600">
                                                                        {moment(prediction.publishedAt).format('LL')}
                                                                        <br />
                                                                        {moment(prediction.publishedAt).format('LT')}
                                                                    </td>
                                                                    <td className="px-6 py-2 whitespace-nowrap">
                                                                        <div className="text-sm font-medium text-gray-900">
                                                                            {prediction.sportType} &bull; {prediction.league || 'Unknown League'}
                                                                        </div>
                                                                        <div className="text-sm text-gray-600 w-44 truncate">
                                                                            {prediction.homeTeam} vs {prediction.awayTeam}
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-600 w-20 truncate">
                                                                        {prediction.tip || 'No prediction available'}
                                                                    </td>
                                                                    <td className="px-6 py-2 whitespace-nowrap">
                                                                        <span className="px-2 py-1 text-xs font-medium text-neutral-800 bg-neutral-100 rounded-full">
                                                                            {prediction.odds || 'N/A'}
                                                                        </span>
                                                                    </td>

                                                                    <td className="px-6 py-2 whitespace-nowrap">
                                                                        {prediction.result === "WON" && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                            Won ✓
                                                                        </span>}
                                                                        {prediction.result === "LOST" && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                            Lost ✗
                                                                        </span>}
                                                                        {prediction.result === "PENDING" && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                            Pending ⏳
                                                                        </span>}

                                                                    </td>
                                                                </tr>
                                                            ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="p-4 border-t border-gray-200 bg-gray-50">
                                                {/* Pagination Controls */}
                                                {/* <div className="flex items-center justify-between">
                                                    <p className="text-sm text-gray-600">
                                                        Showing {Math.min((currentPage - 1) * pageSize + 1, totalPages)}-
                                                        {Math.min(currentPage * pageSize, totalPages)} of {totalPages} results
                                                    </p>
                                                    <div className="flex gap-2">
                                                        <button
                                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                            disabled={currentPage === 1}
                                                        >
                                                            Previous
                                                        </button>
                                                        <button
                                                            className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 disabled:opacity-50"
                                                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                                            disabled={currentPage === totalPages}
                                                        >
                                                            Next
                                                        </button> 
                                                    </div>
                                                </div> */}
                                            </div>
                                        </div>}
                                    </div>
                                </div>

                                {/* Custom Predictions */}
                                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 h-max">
                                    <div className="relative p-6 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-200">
                                        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                                            <h3 className="text-sm sm:text-xl font-bold text-white flex items-center justify-center gap-2">
                                                {predictions.filter(prediction => prediction.isCustom)[0]?.customTitle || title}
                                                {user?.role === "ADMIN" && <span className="inline-flex cursor-pointer items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-400 text-gray-900"
                                                    onClick={() => setOpenEdit(true)}>
                                                    <Edit2 className="size-4" />&nbsp;Edith
                                                </span>}
                                            </h3>
                                            <Link
                                                href="/dashboard/predictions/create"
                                                className="px-4 py-2 text-sm font-medium text-gray-900 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg hover:from-orange-500 hover:to-orange-600 transition-all duration-300"
                                            >
                                                {user?.role === "ADMIN" && <PlusCircle className='text-white' />}
                                            </Link>

                                            {openEdit && <div className="absolute flex items-center gap-8 w-full max-w-md overflow-hidden">
                                                <input
                                                    type="text"
                                                    name="title"
                                                    className="w-full rounded-lg px-4 py-2 border outline-0  bg-white border-gray-300 focus:ring-orange-500 focus:border-orange-500"
                                                    value={title}
                                                    onChange={handleTitleChange}
                                                    placeholder="Enter the custum prediction title here"
                                                />
                                                <X className='absolute right-22 hover:text-red-600 transition-all duration-100 delay-75 rounded-r-lg text-neutral-400'
                                                    onClick={() => setOpenEdit(false)}
                                                />

                                                <button className='absolute right-0 bg-orange-500 hover:bg-orange-600 transition-all duration-100 delay-75 px-4 py-2.5 rounded-r-lg text-white'
                                                    onClick={() => {
                                                        if (!title && title.length < 5) {
                                                            toast.error('Input a custom prediction title')
                                                            return
                                                        }
                                                        setLoading(true)
                                                        updateTitle(currentPredictions.filter(prediction => prediction.isCustom)[0]?.id, title).then((e) => {
                                                            setPredictions([
                                                                ...predictions.filter(pred => pred.id !== currentPredictions.filter(prediction => prediction.isCustom)[0]?.id),
                                                                e.data
                                                            ])
                                                            setOpenEdit(false)
                                                            setLoading(false)
                                                        })
                                                    }
                                                    }>{loading ? <FaSpinner className='size-6 animate-spin text-white' /> : "Update"}</button>
                                            </div>}
                                        </div>
                                    </div>
                                    <div className="">

                                        {content.isSubscriptionActive && <div className=" bg-white rounded-xl overflow-hidden h-max">
                                            <div className="overflow-x-auto">
                                                <table className="w-full">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prediction</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Odds</th>
                                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200 bg-white">
                                                        {currentPredictions
                                                            .filter(prediction => prediction.result === "PENDING" && prediction.isCustom)
                                                            .slice(0, 5)
                                                            .map((prediction, index) => (
                                                                <tr key={index} className="hover:bg-gray-50 transition-colors odd:bg-neutral-100">
                                                                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-600">
                                                                        {moment(prediction.publishedAt).format('LL')}
                                                                        <br />
                                                                        {moment(prediction.publishedAt).format('LT')}
                                                                    </td>
                                                                    <td className="px-6 py-2 whitespace-nowrap">
                                                                        <div className="text-sm font-medium text-gray-900">
                                                                            {prediction.sportType} &bull; {prediction.league || 'Unknown League'}
                                                                        </div>
                                                                        <div className="text-sm text-gray-600 w-44 truncate">
                                                                            {prediction.homeTeam} vs {prediction.awayTeam}
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-600 w-20 truncate">
                                                                        {prediction.tip || 'No prediction available'}
                                                                    </td>
                                                                    <td className="px-6 py-2 whitespace-nowrap">
                                                                        <span className="px-2 py-1 text-xs font-medium text-neutral-800 bg-neutral-100 rounded-full">
                                                                            {prediction.odds || 'N/A'}
                                                                        </span>
                                                                    </td>

                                                                    <td className="px-6 py-2 whitespace-nowrap">
                                                                        {prediction.result === "WON" && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                            Won ✓
                                                                        </span>}
                                                                        {prediction.result === "LOST" && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                            Lost ✗
                                                                        </span>}
                                                                        {prediction.result === "PENDING" && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                                            Pending ⏳
                                                                        </span>}

                                                                    </td>

                                                                </tr>
                                                            ))}
                                                        {currentPredictions.filter(prediction => prediction.result === "PENDING" && prediction.isCustom).length === 0 && (
                                                            <tr>
                                                                <td colSpan={5} className="text-center text-gray-400 py-6">
                                                                    No custom predictions available.
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="p-4 border-t border-gray-200 bg-gray-50">
                                                {/* Pagination Controls */}
                                                {/* <div className="flex items-center justify-between">
                                                    <p className="text-sm text-gray-600">
                                                        Showing {Math.min((currentPage - 1) * pageSize + 1, totalPages)}-
                                                        {Math.min(currentPage * pageSize, totalPages)} of {totalPages} results
                                                    </p>
                                                    <div className="flex gap-2">
                                                        <button
                                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                            disabled={currentPage === 1}
                                                        >
                                                            Previous
                                                        </button>
                                                        <button
                                                            className="px-4 py-2 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 disabled:opacity-50"
                                                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                                            disabled={currentPage === totalPages}
                                                        >
                                                            Next
                                                        </button> 
                                                    </div>
                                                </div> */}
                                            </div>
                                        </div>}
                                    </div>
                                </div>



                                {/* Previousely won odds */}
                                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 h-max">
                                    <div className="p-6 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-200">
                                        <h3 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
                                            Previously Won Predictions
                                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prediction</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Odds</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {currentPredictions
                                                    .filter(prediction => prediction.result !== "PENDING")
                                                    .map((prediction, index) => (
                                                        <tr key={index} className="hover:bg-gray-50 transition-colors odd:bg-neutral-100">
                                                            <td className="px-6 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                                                                {moment(prediction.publishedAt).format('LL')}
                                                                <br />
                                                                {moment(prediction.publishedAt).format('LT')}
                                                            </td>
                                                            <td className="px-6 py-2 whitespace-nowrap">
                                                                <div className="text-xs sm:text-sm font-medium text-gray-900">
                                                                    {prediction.sportType} &bull; {prediction.league || 'Unknown League'}
                                                                </div>
                                                                <div className="text-xs sm:text-sm text-gray-600 w-44 truncate">
                                                                    {prediction.homeTeam} vs {prediction.awayTeam}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-600 w-20 truncate">
                                                                {prediction.isFree ? "Free Odds" : "VIP Prediction"}
                                                            </td>
                                                            <td className="px-6 py-2 whitespace-nowrap text-xs sm:text-sm text-gray-600 w-20 truncate">
                                                                {prediction.tip || 'No prediction available'}
                                                            </td>
                                                            <td className="px-6 py-2 whitespace-nowrap">
                                                                <span className="px-2 py-1 text-xs font-medium text-neutral-800 bg-neutral-100 rounded-full">
                                                                    {prediction.odds || 'N/A'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-2 whitespace-nowrap">
                                                                {prediction.result === "WON" && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                    Won ✓
                                                                </span>}
                                                                {prediction.result === "LOST" && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                    Lost ✗
                                                                </span>}

                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                                        {/* Pagination Controls */}
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs sm:text-sm text-gray-600">
                                                Showing {Math.min((currentPage - 1) * pageSize + 1, totalPages)}-
                                                {Math.min(currentPage * pageSize, totalPages)} of {totalPages} results
                                            </p>
                                            <div className="flex gap-2">
                                                <button
                                                    className="px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                    disabled={currentPage === 1}>
                                                    Previous
                                                </button>
                                                <button
                                                    className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 disabled:opacity-50"
                                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                                    disabled={currentPage === totalPages}>
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Free Hot Odds */}
                                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 h-max">
                                    <div className="p-6 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-200">
                                        <h3 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
                                            Free Hot Odds
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                Live
                                            </span>
                                        </h3>


                                    </div>
                                    <div className="p-0">
                                        <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                                            {/* <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="font-bold text-gray-900 text-xs sm:">Today's Special Bet Slip</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs sm:text-sm font-medium text-gray-500">Code:</span>
                                                    <span suppressHydrationWarning className="text-xs sm:text-sm font-mono font-bold text-orange-600">HOT-{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                                                </div>
                                            </div> */}
                                            <div className="space-y-3">
                                                {predictions
                                                    .filter((bet) => bet.result === "PENDING")
                                                    .slice(0, 20)
                                                    .map((bet, index) => (
                                                        <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg border border-orange-200 px-4">
                                                            <div>
                                                                <p className="font-thin text-gray-900"></p>
                                                                <p className="text-xs sm:text-sm font-medium text-gray-900"> <span className='text-violet-500'>{bet.league} &bull; <br /> </span>{bet.homeTeam} vrs {bet.awayTeam}</p>
                                                                <p className="text-xs sm:text-sm text-gray-600">{bet.tip}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-bold text-green-600"><span className='text-neutral-500 text-sm font-normal'>Odd: </span>{bet.odds}</p>
                                                                <p className="text-sm text-gray-500">{moment(bet.publishedAt).format("LLL")}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                {/*  <div className="mt-4 p-3 bg-orange-100 rounded-lg">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-xs sm:text-sm font-medium text-gray-900">Total Odds:</span>
                                                        {predictions
                                                            .filter((bet) => bet.result === "PENDING")
                                                            .slice(0, 20)
                                                            .reduce((sum, bet) => {
                                                                const odds = typeof bet.odds === 'number' ? bet.odds : parseFloat(bet.odds!);
                                                                return sum + (isNaN(odds) ? 0 : odds);
                                                            }, 0)
                                                            .toFixed(2)}
                                                    </div>
                                                </div> */}

                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Midnight Oracle */}
                                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 h-max">
                                    <div className="p-6 bg-gradient-to-r from-purple-50 to-white border-b border-gray-200">
                                        <h3 className="text-xs sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                                            Midnight Oracle
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                {new Date().getHours() >= 0 && new Date().getHours() < 5 ? 'Active' : 'Returns at Midnight'}
                                            </span>
                                        </h3>
                                    </div>
                                    <div className="p-6">
                                        {new Date().getHours() >= 0 && new Date().getHours() < 5 ? (
                                            <div className="space-y-4">
                                                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                                                        <p className="text-xs sm:text-lg font-medium text-purple-900">Special Midnight Predictions</p>
                                                    </div>
                                                    <table className="w-full mt-4">
                                                        <thead className="bg-purple-100/50">
                                                            <tr>
                                                                <th className="px-4 py-2 text-left text-xs font-medium text-purple-900">Match</th>
                                                                <th className="px-4 py-2 text-left text-xs font-medium text-purple-900">Prediction</th>
                                                                <th className="px-4 py-2 text-left text-xs font-medium text-purple-900">Odds</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-purple-100">
                                                            {predictions
                                                                .slice(0, 5).map((game, index) => (
                                                                    <tr key={index}>
                                                                        <td className="px-4 py-3 text-xs sm:text-sm text-gray-900">{game.homeTeam} vrs {game.awayTeam} <br /> {moment(game.publishedAt).format("LLL")}</td>
                                                                        <td className="px-4 py-3 text-xs sm:text-sm text-gray-900">{game.tip}</td>
                                                                        <td className="px-4 py-3 text-xs sm:text-sm font-medium text-purple-700">{game.odds}</td>
                                                                    </tr>
                                                                ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <div className="w-20 h-20 mx-auto mb-6 text-gray-400">
                                                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-xs sm:text-xl font-medium text-gray-900 mb-2">Predictions Unavailable</h3>
                                                <p className="text-xs sm:text-base text-gray-600">Our Midnight Oracle predictions are only available from 12 AM to 5 AM.</p>
                                                <p className="text-xs sm:text-sm text-purple-600 mt-2">Returns in {23 - new Date().getHours()} hours - {60 - new Date().getMinutes()} mins</p>
                                            </div>
                                        )}
                                    </div>
                                </div>



                            </div>

                            <div className="flex flex-col w-full lg:col-span-2 xl:col-span-1 rounded-xl bg-white shadow-sm p-4 sm:p-6 h-max relative gap-8">

                                {/* Gradient Border */}
                                <div className="absolute inset-0 rounded-xl pointer-events-none z-0" style={{
                                    padding: '2px',
                                    background: 'linear-gradient(135deg, #101828 0%, #1e2939 50%, #f59e42 100%)'
                                }} />
                                <div className="relative z-10 bg-white rounded-xl p-4 sm:p-8 lg:p-4 w-full">
                                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 text-center">Major Sporting Games</h1>
                                    <p className="text-xs sm:textbase text-neutral-400 text-center mt-1">We are glad to offer you popolur and even less popular range of sporting activies accross the globe</p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 flex-col mt-8 gap-4">
                                        {sportTypeOptions.slice(0, -1).map((sport) => (
                                            <p className={`text-xs sm:text-sm md:text-base text-black hover:text-orange-500 transition-all delay-300 cursor-default hover:scale-[1.1] font-semibold `}
                                                key={sport.label}
                                                onClick={() => setGames(sport.label.toLowerCase())}
                                                onMouseEnter={() => setGames(sport.label.toLowerCase())}
                                            >&bull; {sport.label}
                                            </p>
                                        ))}
                                    </div>
                                    <div className="mt-8 p-2 sm:p-4 bg-orange-50 border border-orange-200 rounded-lg text-orange-900 text-xs sm:text-sm text-center">
                                        <strong>Betting Advice:</strong> Please gamble responsibly. Only bet what you can afford to lose. Our predictions are based on expert analysis, but no outcome is guaranteed. If you feel your betting is becoming a problem, seek help from a professional or visit a responsible gambling resource.
                                    </div>
                                </div>

                                <h1 className="text-white z-10 text-center font-bold">{games.toUpperCase()}</h1>

                                {/* Gradient Border */}
                                <div className="absolute inset-0 rounded-xl pointer-events-none z-0" style={{
                                    padding: '2px',
                                    background: 'linear-gradient(135deg, #101828 0%, #1e2939 50%, #f59e42 100%)'
                                }} />
                                <div className="relative z-10 bg-white rounded-xl p-4 sm:p-8 lg:p-4 w-full">
                                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 text-center">Major {games.toUpperCase()} Games</h1>
                                    <div className="flex flex-wrap mt-8 gap-4">
                                        {sportTypeOptions.find((sport) => sport.label.toLowerCase() === games)?.league.slice(0, -1).map((sport) => (
                                            <p className="text-xs md:text-sm text-black hover:text-orange-500 transition-all delay-300 cursor-default" key={sport.label}> &bull; {sport.label}</p>
                                        ))}
                                    </div>

                                </div>
                            </div>

                            {/* TODO: duplicate to make adds */}
                        </div>
                    </div>
                </div>
            </section >
