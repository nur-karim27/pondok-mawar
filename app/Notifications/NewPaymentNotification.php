<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Payment;

class NewPaymentNotification extends Notification
{
    use Queueable;

    protected $payment;

    /**
     * Create a new notification instance.
     */
    public function __construct(Payment $payment)
    {
        $this->payment = $payment;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $student = $this->payment->studentBill->student;
        $amount = number_format($this->payment->amount, 0, ',', '.');
        
        $totalPaid = $this->payment->studentBill->payments()->sum('amount');
        $remaining = $this->payment->studentBill->amount - $totalPaid;
        
        $message = "Uang masuk Rp {$amount} dari {$student->name} ({$this->payment->studentBill->paymentType->name}).";
        if ($remaining > 0) {
            $message .= " Sisa tagihan/kurang: Rp " . number_format($remaining, 0, ',', '.');
        } else {
            $message .= " (Lunas)";
        }

        return [
            'message' => $message,
            'payment_id' => $this->payment->id,
            'url' => route('payments.index')
        ];
    }
}
