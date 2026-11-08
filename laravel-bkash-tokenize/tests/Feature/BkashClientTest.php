<?php

namespace Libraries\BkashTokenize\Tests\Feature;

use Illuminate\Support\Facades\Http;
use Libraries\BkashTokenize\BkashClient;
use Libraries\BkashTokenize\Exceptions\BkashException;
use Libraries\BkashTokenize\Facades\Bkash;
use Libraries\BkashTokenize\Tests\TestCase;

class BkashClientTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->app['cache']->forget('bkash.tokenized.id_token');
    }

    public function test_create_payment_returns_checkout_url(): void
    {
        $base = 'https://tokenized.sandbox.bka.sh/tokenized/checkout';

        Http::fake([
            "{$base}/token/grant" => Http::response([
                'statusCode' => '0000',
                'statusMessage' => 'Successful',
                'id_token' => 'mock-id-token',
                'expires_in' => '3600',
            ]),
            "{$base}/create" => Http::response([
                'statusCode' => '0000',
                'statusMessage' => 'Successful',
                'paymentID' => 'TR0001TEST123',
                'bkashURL' => 'https://sandbox.payment.bkash.com/?paymentId=TR0001TEST123',
            ]),
        ]);

        $result = Bkash::createPayment([
            'amount' => '250.00',
            'merchantInvoiceNumber' => 'INV-1001',
            'payerReference' => '01711111111',
        ]);

        $this->assertSame('TR0001TEST123', $result['paymentID']);
        $this->assertStringContainsString('bkash.com', $result['bkashURL']);

        Http::assertSent(function ($request) use ($base) {
            return $request->url() === "{$base}/create"
                && $request->hasHeader('Authorization', 'mock-id-token')
                && $request->hasHeader('X-App-Key', 'test_app_key')
                && $request['amount'] === '250.00'
                && $request['mode'] === '0011'
                && $request['callbackURL'] === 'https://example.test/bkash/callback';
        });
    }

    public function test_query_payment_returns_transaction_status(): void
    {
        $base = 'https://tokenized.sandbox.bka.sh/tokenized/checkout';
        $paymentId = 'TR0001QUERY456';

        Http::fake([
            "{$base}/token/grant" => Http::response([
                'statusCode' => '0000',
                'id_token' => 'cached-token',
                'expires_in' => '3600',
            ]),
            "{$base}/payment/status" => Http::response([
                'statusCode' => '0000',
                'statusMessage' => 'Successful',
                'paymentID' => $paymentId,
                'transactionStatus' => 'Completed',
                'trxID' => '8N7A5RPMFUT',
                'amount' => '250.00',
                'currency' => 'BDT',
            ]),
        ]);

        $status = Bkash::queryPayment($paymentId);

        $this->assertSame('Completed', $status['transactionStatus']);
        $this->assertSame($paymentId, $status['paymentID']);
    }

    public function test_api_errors_throw_bkash_exception(): void
    {
        $base = 'https://tokenized.sandbox.bka.sh/tokenized/checkout';

        Http::fake([
            "{$base}/token/grant" => Http::response([
                'statusCode' => '0000',
                'id_token' => 'mock-id-token',
                'expires_in' => '3600',
            ]),
            "{$base}/payment/status" => Http::response([
                'statusCode' => '2044',
                'statusMessage' => 'Invalid payment ID',
            ]),
        ]);

        $this->expectException(BkashException::class);
        $this->expectExceptionMessage('Invalid payment ID');

        Bkash::queryPayment('INVALID');
    }

    public function test_create_payment_requires_invoice_number(): void
    {
        $this->expectException(BkashException::class);

        /** @var BkashClient $client */
        $client = $this->app->make(BkashClient::class);

        $client->createPayment([
            'amount' => '10.00',
            'payerReference' => '01700000000',
        ]);
    }
}
