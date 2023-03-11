import type { Stripe } from 'stripe';
import type { ActionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import type { SupabaseClient } from '@supabase/supabase-js';

import getStripeInstance from '~/core/stripe/get-stripe';
import StripeWebhooks from '~/core/stripe/stripe-webhooks.enum';
import getLogger from '~/core/logger';

import {
  throwBadRequestException,
  throwInternalServerErrorException,
} from '~/core/http-exceptions';

import {
  addSubscription,
  deleteSubscription,
  updateSubscriptionById,
} from '~/lib/subscriptions/mutations';

import getSupabaseServerClient from '~/core/supabase/server-client';
import { setOrganizationSubscriptionData } from '~/lib/organizations/database/mutations';

const STRIPE_SIGNATURE_HEADER = 'stripe-signature';

const webhookSecretKey = process.env.STRIPE_WEBHOOK_SECRET as string;

/**
 * @description Handle the webhooks from Stripe related to checkouts
 */
export async function action(props: ActionArgs) {
  const req = props.request;
  const signature = req.headers.get(STRIPE_SIGNATURE_HEADER);

  if (!webhookSecretKey) {
    return throwInternalServerErrorException(
      `The variable STRIPE_WEBHOOK_SECRET is unset. Please add the STRIPE_WEBHOOK_SECRET environment variable`
    );
  }

  // verify signature header is not missing
  if (!signature) {
    return throwBadRequestException();
  }

  const logger = getLogger();
  const rawBody = await req.text();
  const stripe = await getStripeInstance();

  // create an Admin client to write to the subscriptions table
  const client = getSupabaseServerClient(req, {
    admin: true,
  });

  // build the event from the raw body and signature using Stripe
  const event = stripe.webhooks.constructEvent(
    rawBody,
    signature,
    webhookSecretKey
  );

  logger.info(
    {
      type: event.type,
    },
    `[Stripe] Received Stripe Webhook`
  );

  try {
    switch (event.type) {
      case StripeWebhooks.Completed: {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscriptionId = session.subscription as string;

        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId
        );

        await onCheckoutCompleted(client, session, subscription);

        break;
      }

      case StripeWebhooks.SubscriptionDeleted: {
        const subscription = event.data.object as Stripe.Subscription;

        await deleteSubscription(client, subscription.id);

        break;
      }

      case StripeWebhooks.SubscriptionUpdated: {
        const subscription = event.data.object as Stripe.Subscription;

        await updateSubscriptionById(client, subscription);

        break;
      }
    }

    return json({ success: true });
  } catch (error) {
    logger.error(
      {
        type: event.type,
        error,
      },
      `[Stripe] Webhook handling failed`
    );

    return throwInternalServerErrorException();
  }
}

/**
 * @description When the checkout is completed, we store the order. The
 * subscription is only activated if the order was paid successfully.
 * Otherwise, we have to wait for a further webhook
 */
async function onCheckoutCompleted(
  client: SupabaseClient,
  session: Stripe.Checkout.Session,
  subscription: Stripe.Subscription
) {
  const organizationId = getOrganizationIdFromClientReference(session);
  const customerId = session.customer as string;

  // build organization subscription and set on the organization document
  // we add just enough data in the DB, so we do not query
  // Stripe for every bit of data
  // if you need your DB record to contain further data
  // add it to {@link buildOrganizationSubscription}
  const { error, data } = await addSubscription(client, subscription);

  if (error) {
    return Promise.reject(
      `Failed to add subscription to the database: ${error}`
    );
  }

  return setOrganizationSubscriptionData(client, {
    organizationId,
    customerId,
    subscriptionId: data.id,
  });
}

/**
 * @name getOrganizationIdFromClientReference
 * @description Get the organization ID from the client reference ID
 * @param session
 */
function getOrganizationIdFromClientReference(
  session: Stripe.Checkout.Session
) {
  return Number(session.client_reference_id);
}
