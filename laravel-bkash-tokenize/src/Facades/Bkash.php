<?php

namespace Libraries\BkashTokenize\Facades;

use Illuminate\Support\Facades\Facade;
use Libraries\BkashTokenize\BkashClient;

/**
 * @method static array createPayment(array $payload)
 * @method static array executePayment(string $paymentId)
 * @method static array queryPayment(string $paymentId)
 * @method static array refund(string $paymentId, string $amount, string $trxId, ?string $sku = null, ?string $reason = null)
 * @method static string grantToken(bool $forceRefresh = false)
 * @method static string baseUrl()
 *
 * @see BkashClient
 */
class Bkash extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return BkashClient::class;
    }
}
