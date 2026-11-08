# laravel-bkash-tokenize

Polished **bKash Tokenized Checkout v2** integration for Laravel 10 and 11: config publishing, facade, HTTP client with token caching, callback route scaffold, and PHPUnit tests.

## Requirements

- PHP 8.2+
- Laravel 10.x or 11.x

## Installation

```bash
composer require libraries/laravel-bkash-tokenize
```

Laravel auto-discovers `BkashServiceProvider`. Publish configuration:

```bash
php artisan vendor:publish --tag=bkash-config
```

## Environment variables

Add credentials from the bKash merchant portal — **never commit real secrets**.

```dotenv
BKASH_SANDBOX=true

BKASH_APP_KEY=
BKASH_APP_SECRET=
BKASH_USERNAME=
BKASH_PASSWORD=

BKASH_CALLBACK_URL="${APP_URL}/bkash/callback"
BKASH_SUCCESS_CALLBACK_URL=
BKASH_FAIL_CALLBACK_URL=

# Optional overrides
BKASH_BASE_URL=
BKASH_SANDBOX_URL=https://tokenized.sandbox.bka.sh/tokenized/checkout
BKASH_LIVE_URL=https://tokenized.pay.bka.sh/tokenized/checkout

BKASH_ROUTES_ENABLED=true
BKASH_ROUTE_PREFIX=bkash
BKASH_ROUTE_CALLBACK=callback
```

## Usage

### Create payment

```php
use Libraries\BkashTokenize\Facades\Bkash;

$payment = Bkash::createPayment([
    'amount' => '100.00',
    'currency' => 'BDT',
    'merchantInvoiceNumber' => 'INV-'.now()->timestamp,
    'payerReference' => '01700000000',
]);

// Redirect customer to $payment['bkashURL']
```

### Execute after customer returns

```php
$result = Bkash::executePayment($paymentId);
```

### Query status

```php
$status = Bkash::queryPayment($paymentId);
```

### Refund (API availability depends on merchant setup)

```php
$refund = Bkash::refund(
    paymentId: $paymentId,
    amount: '50.00',
    trxId: $trxId,
    reason: 'Customer request',
);
```

### Dependency injection

```php
use Libraries\BkashTokenize\BkashClient;

public function checkout(BkashClient $bkash)
{
    return $bkash->createPayment([/* ... */]);
}
```

## Callback route

When `BKASH_ROUTES_ENABLED=true`, the package registers:

- `GET|POST /{prefix}/{callback}` (default: `/bkash/callback`, name: `bkash.callback`)

`CallbackController` is a **scaffold**: it attempts `executePayment()` when `paymentID` is present. Replace with your redirects, events, and idempotency logic.

## Error handling

Failed API calls throw `Libraries\BkashTokenize\Exceptions\BkashException` with `statusCode` and parsed `response` when available.

```php
use Libraries\BkashTokenize\Exceptions\BkashException;

try {
    Bkash::queryPayment($paymentId);
} catch (BkashException $e) {
    logger()->error('bKash error', [
        'code' => $e->statusCode,
        'body' => $e->response,
    ]);
}
```

## Testing

Package tests use `Http::fake()` and Orchestra Testbench:

```bash
cd laravel-bkash-tokenize
composer install
./vendor/bin/phpunit
```

## License

MIT
