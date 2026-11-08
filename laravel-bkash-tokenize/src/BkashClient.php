<?php

namespace Libraries\BkashTokenize;

use Illuminate\Contracts\Cache\Repository as CacheRepository;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use Libraries\BkashTokenize\Exceptions\BkashException;

class BkashClient
{
    public function __construct(
        protected array $config,
        protected ?CacheRepository $cache = null,
    ) {}

    public function createPayment(array $payload): array
    {
        $body = array_merge([
            'mode' => '0011',
            'currency' => 'BDT',
            'intent' => 'sale',
            'callbackURL' => $this->config['callback_url'],
        ], $payload);

        foreach (['amount', 'merchantInvoiceNumber', 'payerReference'] as $required) {
            if (! Arr::has($body, $required) || $body[$required] === null || $body[$required] === '') {
                throw new BkashException("Missing required createPayment field: {$required}");
            }
        }

        if (empty($body['callbackURL'])) {
            throw new BkashException('callbackURL is required. Set BKASH_CALLBACK_URL or pass callbackURL in the payload.');
        }

        return $this->request('POST', '/create', $body);
    }

    public function executePayment(string $paymentId): array
    {
        return $this->request('POST', '/execute', [
            'paymentID' => $paymentId,
        ]);
    }

    public function queryPayment(string $paymentId): array
    {
        return $this->request('POST', '/payment/status', [
            'paymentID' => $paymentId,
        ]);
    }

    /**
     * Refund API varies by merchant onboarding; structure is ready for v2 refund when enabled.
     *
     * @see https://developer.bka.sh/docs/refund-api-2
     */
    public function refund(string $paymentId, string $amount, string $trxId, ?string $sku = null, ?string $reason = null): array
    {
        return $this->request('POST', '/payment/refund', array_filter([
            'paymentID' => $paymentId,
            'amount' => $amount,
            'trxID' => $trxId,
            'sku' => $sku,
            'reason' => $reason,
        ], fn ($value) => $value !== null));
    }

    public function grantToken(bool $forceRefresh = false): string
    {
        $cacheKey = $this->config['token_cache_key'];

        if (! $forceRefresh && $this->cache !== null && $this->cache->has($cacheKey)) {
            $token = $this->cache->get($cacheKey);

            if (is_string($token) && $token !== '') {
                return $token;
            }
        }

        $response = $this->http()
            ->withHeaders($this->authHeaders())
            ->post($this->url('/token/grant'), [
                'app_key' => $this->config['app_key'],
                'app_secret' => $this->config['app_secret'],
            ]);

        $body = $this->parseResponse($response);

        $token = $body['id_token'] ?? null;
        if (! is_string($token) || $token === '') {
            throw BkashException::fromResponse($body, $response->status());
        }

        if ($this->cache !== null) {
            $expiresIn = (int) ($body['expires_in'] ?? 3600);
            $buffer = (int) ($this->config['token_ttl_buffer'] ?? 60);
            $ttl = max(60, $expiresIn - $buffer);
            $this->cache->put($cacheKey, $token, $ttl);
        }

        return $token;
    }

    public function baseUrl(): string
    {
        if (! empty($this->config['base_url'])) {
            return rtrim((string) $this->config['base_url'], '/');
        }

        return $this->config['sandbox']
            ? rtrim((string) $this->config['sandbox_url'], '/')
            : rtrim((string) $this->config['live_url'], '/');
    }

    protected function request(string $method, string $path, array $payload = []): array
    {
        $token = $this->grantToken();

        $pending = $this->http()->withHeaders($this->authorizedHeaders($token));

        $response = match (strtoupper($method)) {
            'POST' => $pending->post($this->url($path), $payload),
            'GET' => $pending->get($this->url($path), $payload),
            default => $pending->send($method, $this->url($path), ['json' => $payload]),
        };

        return $this->parseResponse($response);
    }

    protected function http(): PendingRequest
    {
        $retry = $this->config['retry'] ?? ['times' => 2, 'sleep_ms' => 200];

        return Http::acceptJson()
            ->asJson()
            ->timeout((int) ($this->config['timeout'] ?? 30))
            ->retry(
                (int) ($retry['times'] ?? 0),
                (int) ($retry['sleep_ms'] ?? 200),
                throw: false,
            );
    }

    protected function authHeaders(): array
    {
        return [
            'username' => (string) $this->config['username'],
            'password' => (string) $this->config['password'],
        ];
    }

    protected function authorizedHeaders(string $idToken): array
    {
        return [
            'Authorization' => $idToken,
            'X-App-Key' => (string) $this->config['app_key'],
        ];
    }

    protected function url(string $path): string
    {
        return $this->baseUrl().'/'.ltrim($path, '/');
    }

    protected function parseResponse(Response $response): array
    {
        if ($response->failed() && ! $response->json()) {
            throw new BkashException(
                'bKash HTTP error: '.$response->status(),
                response: ['body' => $response->body()],
                code: $response->status(),
            );
        }

        /** @var array<string, mixed>|null $body */
        $body = $response->json();

        if (! is_array($body)) {
            throw new BkashException(
                'Invalid JSON response from bKash',
                response: ['body' => $response->body()],
                code: $response->status(),
            );
        }

        $statusCode = (string) ($body['statusCode'] ?? '');
        $successCodes = ['0000', '0', ''];

        if (! in_array($statusCode, $successCodes, true)) {
            throw BkashException::fromResponse($body, $response->status());
        }

        return $body;
    }
}
