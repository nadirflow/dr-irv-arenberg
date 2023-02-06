<?php
namespace GuzzleHttp\Promise;

/**
 * Interface used with src that return a promise.
 */
interface PromisorInterface
{
    /**
     * Returns a promise.
     *
     * @return PromiseInterface
     */
    public function promise();
}
