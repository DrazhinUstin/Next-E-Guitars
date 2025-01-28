import { orders } from '@wix/ecom';
import { cn, formatDate, mapObject } from '@/app/lib/utils';
import Badge from '@/app/components/badge';
import WixImage from '@/app/components/wix-image';
import Link from 'next/link';
import { SUPPORT_EMAIL } from '@/app/lib/constants';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion';

const paymentStatuses = mapObject(
  orders.PaymentStatus,
  (val) => val[0] + val.slice(1).toLowerCase().split('_').join(' ')
);

const fulfillmentStatuses = mapObject(
  orders.FulfillmentStatus,
  (val) => val[0] + val.slice(1).toLowerCase().split('_').join(' ')
);

export default function OrderCard({ order }: { order: orders.Order }) {
  const {
    number,
    _createdDate,
    priceSummary,
    paymentStatus,
    fulfillmentStatus,
    recipientInfo,
    shippingInfo,
    lineItems,
  } = order;
  const address = shippingInfo?.logistics?.shippingDestination?.address;
  return (
    <article className="mx-auto w-full max-w-2xl space-y-4 rounded-lg border bg-card p-4 text-card-foreground shadow-md">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="font-medium">Order #{number}</h4>
          {!!_createdDate && (
            <p className="text-sm text-muted-foreground">{formatDate(_createdDate)}</p>
          )}
        </div>
        {fulfillmentStatus && (
          <Badge
            className={cn(
              fulfillmentStatus === orders.FulfillmentStatus.NOT_FULFILLED && 'bg-destructive'
            )}
          >
            {fulfillmentStatuses[fulfillmentStatus]}
          </Badge>
        )}
      </header>
      <hr />
      <div className="space-y-2 text-sm">
        <div className="flex flex-wrap items-center gap-2 text-base">
          <h4 className="font-medium">Total: {priceSummary?.total?.formattedAmount}</h4>
          {paymentStatus && (
            <Badge
              className={cn(
                paymentStatus === orders.PaymentStatus.NOT_PAID && 'bg-destructive',
                paymentStatus === orders.PaymentStatus.PENDING && 'bg-yellow-500'
              )}
            >
              {paymentStatuses[paymentStatus]}
            </Badge>
          )}
        </div>
        <p>Subtotal: {priceSummary?.subtotal?.formattedAmount}</p>
        <p>Shipping: {priceSummary?.shipping?.formattedAmount}</p>
        <p>Tax: {priceSummary?.tax?.formattedAmount}</p>
      </div>
      <hr />
      <ul className="space-y-2 text-sm">
        {lineItems?.map((lineItem) => (
          <li key={lineItem._id} className="grid grid-cols-[auto_1fr] items-start gap-2">
            <Link href={`/products/${lineItem.catalogReference?.catalogItemId}`}>
              <WixImage
                wixMediaIdentifier={lineItem.image}
                targetWidth={100}
                targetHeight={100}
                scaleToFill
                alt={lineItem.productName?.translated}
                className="size-24 rounded-sm border"
              />
            </Link>
            <div className="space-y-2">
              <h4 className="font-medium">
                <Link href={`/products/${lineItem.catalogReference?.catalogItemId}`}>
                  {lineItem.productName?.translated}
                </Link>
              </h4>
              {!!lineItem.descriptionLines?.length && (
                <ul className="flex flex-wrap items-center gap-x-1">
                  {lineItem.descriptionLines.map(({ name, colorInfo, plainText }, index, arr) => (
                    <li key={name?.translated} className="flex items-center gap-x-1">
                      <span className="font-medium">{name?.translated}:</span>
                      {colorInfo ? (
                        <>
                          <span
                            className="size-3 shrink-0 rounded-full border"
                            style={{ backgroundColor: colorInfo.code ?? undefined }}
                          />
                          {colorInfo.translated}
                        </>
                      ) : (
                        plainText?.translated
                      )}
                      {index < arr.length - 1 && ','}
                    </li>
                  ))}
                </ul>
              )}
              <p>
                {lineItem.quantity} * {lineItem.price?.formattedAmount}
                {lineItem.price?.amount !== lineItem.priceBeforeDiscounts?.amount && (
                  <span className="text-destructive line-through">
                    {lineItem.priceBeforeDiscounts?.formattedAmount}
                  </span>
                )}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Delivery address:</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p>
                {recipientInfo?.contactDetails?.firstName} {recipientInfo?.contactDetails?.lastName}
              </p>
              <p>{recipientInfo?.contactDetails?.phone}</p>
              <p>
                {address?.addressLine1}
                {', '}
                {address?.city}
                {', '}
                {address?.country}
                {', '}
                {address?.postalCode}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Shipping details:</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p>
                {shippingInfo?.title}
                {', '}
                {shippingInfo?.logistics?.deliveryTime}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <footer className="text-center">
        <a
          href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Tell us about your problem')}&body=${encodeURIComponent('[Describe here]')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
        >
          Need help with an order?
        </a>
      </footer>
    </article>
  );
}
