<?php

namespace Libraries\BkashTokenize\Tests;

use Libraries\BkashTokenize\BkashServiceProvider;
use Orchestra\Testbench\TestCase as Orchestra;

abstract class TestCase extends Orchestra
{
    protected function getPackageProviders($app): array
    {
        return [BkashServiceProvider::class];
    }

    protected function defineEnvironment($app): void
    {
        $app['config']->set('bkash', [
            'sandbox' => true,
            'base_url' => null,
            'sandbox_url' => 'https://tokenized.sandbox.bka.sh/tokenized/checkout',
            'live_url' => 'https://tokenized.pay.bka.sh/tokenized/checkout',
            'app_key' => 'test_app_key',
            'app_secret' => 'test_app_secret',
            'username' => 'test_username',
            'password' => 'test_password',
            'callback_url' => 'https://example.test/bkash/callback',
            'success_callback_url' => null,
            'fail_callback_url' => null,
            'timeout' => 5,
            'retry' => ['times' => 0, 'sleep_ms' => 0],
            'token_cache_key' => 'bkash.tokenized.id_token',
            'token_ttl_buffer' => 60,
            'routes' => [
                'enabled' => false,
                'prefix' => 'bkash',
                'middleware' => ['web'],
                'callback' => 'callback',
            ],
        ]);
    }
}
