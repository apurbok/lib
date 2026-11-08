<?php

namespace Libraries\BkashTokenize\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Libraries\BkashTokenize\BkashClient;
use Libraries\BkashTokenize\Exceptions\BkashException;

/**
 * Scaffold for bKash redirect/callback handling.
 *
 * bKash sends the customer back to your callbackURL with query parameters after
 * wallet authorization. Finalize the payment with executePayment() when paymentID
 * is present, then dispatch your own domain events or redirect the user.
 */
class CallbackController extends Controller
{
    public function __construct(
        protected BkashClient $bkash,
    ) {}

    public function handle(Request $request): JsonResponse
    {
        $paymentId = $request->query('paymentID')
            ?? $request->input('paymentID');

        if (! is_string($paymentId) || $paymentId === '') {
            return response()->json([
                'status' => 'ignored',
                'message' => 'No paymentID supplied.',
            ], 422);
        }

        try {
            $executed = $this->bkash->executePayment($paymentId);

            return response()->json([
                'status' => 'executed',
                'payment' => $executed,
            ]);
        } catch (BkashException $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
                'statusCode' => $e->statusCode,
            ], 422);
        }
    }
}
