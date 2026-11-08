<?php

namespace Libraries\BkashTokenize\Exceptions;

use Exception;
use Throwable;

class BkashException extends Exception
{
    public function __construct(
        string $message,
        public readonly ?string $statusCode = null,
        public readonly ?array $response = null,
        int $code = 0,
        ?Throwable $previous = null,
    ) {
        parent::__construct($message, $code, $previous);
    }

    public static function fromResponse(array $body, int $httpStatus = 0): self
    {
        $statusCode = isset($body['statusCode']) ? (string) $body['statusCode'] : null;
        $message = $body['statusMessage'] ?? $body['errorMessage'] ?? 'bKash API request failed';

        return new self(
            message: $message,
            statusCode: $statusCode,
            response: $body,
            code: $httpStatus,
        );
    }
}
