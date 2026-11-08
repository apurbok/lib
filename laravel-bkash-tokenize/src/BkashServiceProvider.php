<?php

namespace Libraries\BkashTokenize;

use Illuminate\Contracts\Cache\Repository as CacheRepository;
use Illuminate\Support\ServiceProvider;
class BkashServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(
            __DIR__.'/../config/bkash.php',
            'bkash'
        );

        $this->app->singleton(BkashClient::class, function ($app) {
            $cache = $app->bound('cache.store')
                ? $app->make(CacheRepository::class)
                : null;

            return new BkashClient(
                config: $app['config']->get('bkash', []),
                cache: $cache,
            );
        });

    }

    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->publishes([
                __DIR__.'/../config/bkash.php' => config_path('bkash.php'),
            ], 'bkash-config');
        }

        $this->registerRoutes();
    }

    protected function registerRoutes(): void
    {
        $config = $this->app['config']->get('bkash.routes', []);

        if (! ($config['enabled'] ?? true)) {
            return;
        }

        $this->loadRoutesFrom(__DIR__.'/../routes/web.php');
    }
}
