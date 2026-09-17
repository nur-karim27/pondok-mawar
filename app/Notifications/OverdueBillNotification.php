<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\StudentBill;

class OverdueBillNotification extends Notification
{
    use Queueable;

    protected $bill;
    protected $remaining;

    /**
     * Create a new notification instance.
     */
    public function __construct(StudentBill $bill)
    {
        $this->bill = $bill;
        
        $totalPaid = $bill->payments()->sum('amount');
        $this->remaining = $bill->amount - $totalPaid;
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
        $student = $this->bill->student;
        $remainingFormatted = number_format($this->remaining, 0, ',', '.');
        
        $message = "Peringatan: {$student->name} menunggak / kurang bayar tagihan {$this->bill->paymentType->name}. Sisa: Rp {$remainingFormatted}";

        return [
            'message' => $message,
            'bill_id' => $this->bill->id,
            'url' => route('payments.index') . '?gender=semua'
        ];
    }
}
