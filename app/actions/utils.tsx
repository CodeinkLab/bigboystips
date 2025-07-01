'use server'
import { get } from "http"
import { getData, getDataWithOption } from "../lib/database"
import { getDateRange } from "../lib/function"
import { getCurrentUser } from "../lib/jwt"

export const homeData = async () => {
    try {
        const currentuser = await getCurrentUser()
        console.log('Current User:', currentuser)

        const [predictions, pricings, blogs, subscriptions, payments, currencyrate] = await Promise.all([
            await getDataWithOption('prediction', {
                createdBy: true,
                league_rel: true,
                Share: true,
                Save: true,
                Like: true,
                Comment: true,
                View: true,
            }),
            await getData('pricing'),
            await getDataWithOption('blogPost', {
                author: true,
                Share: true,
                Save: true,
                Like: true,
                Comment: true,
                View: true,
            }),
            currentuser ? await getData('subscription', { userId: currentuser?.id }) : null,
            currentuser ? await getData('payment', { userId: currentuser?.id }) : null,
            await fetch(`https://fxds-public-exchange-rates-api.oanda.com/cc-api/currencies?base=GHS&quote=${currentuser?.location?.currencycode}&data_type=general_currency_pair&${getDateRange()}`, {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
                },
                "referrer": "https://www.oanda.com/",
            })
        ])

        const rate = await currencyrate.json()
        const cr = rate?.response?.[0] || null
        return {
            predictions: predictions.data,
            blogPost: blogs.data,
            pricing: pricings.data,
            payments: payments?.data || [],
            subscriptions: subscriptions?.data,
            currencyrate: cr,
            isSubscriptionActive: await checkSubscriptionStatus(subscriptions?.data || [])
        }
    } catch (error) {
        console.error('Error fetching home data:', error)
        return {
            prediction: [],
            blog: [],
            pricing: [],
            payment: [],
            subscription: [],
            currencyrate: null,
        }
    }
}
const checkSubscriptionStatus = async (subs: any) => {
    let hasActive = false;
    const now = new Date();

    if (Array.isArray(subs)) {
        for (const sub of subs) {
            if (sub.status === 'ACTIVE') {
                const expiry = new Date(sub.expiresAt);
                if (expiry > now) {
                    hasActive = true;
                    console.log(`Subscription ${sub.id} is ACTIVE and valid until ${expiry}`);
                } else {
                    // Expired but still marked ACTIVE, update to EXPIRED
                    await fetch(`/api/subscription/${sub.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: 'EXPIRED' }),
                    });
                }
            }
        }
    }
    return hasActive;
}
