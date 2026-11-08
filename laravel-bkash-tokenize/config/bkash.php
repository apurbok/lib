<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Environment
    |--------------------------------------------------------------------------
    |
    | When true, requests use the bKash sandbox base URL. Set BKASH_SANDBOX=false
    | in production.
    |
    */
    'sandbox' => (bool) env('BKASH_SANDBOX', true),

    'base_url' => env('BKASH_BASE_URL', null),

    'sandbox_url' => env(
        'BKASH_SANDBOX_URL',
        'https://tokenized.sandbox.bka.sh/tokenized/checkout'
    ),

    'live_url' => env(
        'BKASH_LIVE_URL',
        'https://tokenized.pay.bka.sh/tokenized/checkout'
    ),

    /*
    |--------------------------------------------------------------------------
    | Merchant credentials (never commit real values)
    |--------------------------------------------------------------------------
    */
    'app_key' => env('BKASH_APP_KEY'),
    'app_secret' => env('BKASH_APP_SECRET'),
    'username' => env('BKASH_USERNAME'),
    'password' => env('BKASH_PASSWORD'),

    /*
    |--------------------------------------------------------------------------
    | Callback URLs
    |--------------------------------------------------------------------------
    |
    | Used as defaults when creating payments. Individual createPayment() calls
    | may override callbackURL.
    |
    */
    'callback_url' => env('BKASH_CALLBACK_URL'),
    'success_callback_url' => env('BKASH_SUCCESS_CALLBACK_URL'),
    'fail_callback_url' => env('BKASH_FAIL_CALLBACK_URL'),

    /*
    |--------------------------------------------------------------------------
    | HTTP client
    |--------------------------------------------------------------------------
    */
    'timeout' => (int) env('BKASH_HTTP_TIMEOUT', 30),
    'retry' => [
        'times' => (int) env('BKASH_HTTP_RETRY_TIMES', 2),
        'sleep_ms' => (int) env('BKASH_HTTP_RETRY_SLEEP_MS', 200),
    ],

    /*
    |--------------------------------------------------------------------------
    | Token cache
    |--------------------------------------------------------------------------
    |
    | Access tokens expire in ~3600s. Cache key prefix and TTL buffer in seconds.
    |
    */
    'token_cache_key' => env('BKASH_TOKEN_CACHE_KEY', 'bkash.tokenized.id_token'),
    'token_ttl_buffer' => (int) env('BKASH_TOKEN_TTL_BUFFER', 60),

    /*
    |--------------------------------------------------------------------------
    | Routes
    |--------------------------------------------------------------------------
    */
    'routes' => [
        'enabled' => (bool) env('BKASH_ROUTES_ENABLED', true),
        'prefix' => env('BKASH_ROUTE_PREFIX', 'bkash'),
        'middleware' => ['web'],
        'callback' => env('BKASH_ROUTE_CALLBACK', 'callback'),
    ],

];
