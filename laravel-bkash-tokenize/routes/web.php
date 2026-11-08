<?php

use Illuminate\Support\Facades\Route;
use Libraries\BkashTokenize\Http\Controllers\CallbackController;

$routeConfig = config('bkash.routes', []);
$prefix = $routeConfig['prefix'] ?? 'bkash';
$middleware = $routeConfig['middleware'] ?? ['web'];
$callback = $routeConfig['callback'] ?? 'callback';

Route::middleware($middleware)
    ->prefix($prefix)
    ->group(function () use ($callback): void {
        Route::match(['get', 'post'], $callback, [CallbackController::class, 'handle'])
            ->name('bkash.callback');
    });
