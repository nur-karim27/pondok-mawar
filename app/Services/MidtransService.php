<?php

namespace App\Services;

class MidtransService
{
    /**
     * Create Midtrans Transaction (Dummy)
     * 
     * @param array $params
     * @return array
     */
    public function createTransaction(array $params)
    {
        // TODO: Implement actual Midtrans API call here when account is ready.
        // For now, returning a mock response.
        return [
            'token' => 'mock_token_' . uniqid(),
            'redirect_url' => 'https://app.sandbox.midtrans.com/snap/v2/vtweb/mock_token_' . uniqid(),
        ];
    }

    /**
     * Handle Midtrans Notification/Webhook (Dummy)
     * 
     * @param array $notificationPayload
     * @return bool
     */
    public function handleNotification(array $notificationPayload)
    {
        // TODO: Implement actual webhook verification and handling
        return true;
    }
}
