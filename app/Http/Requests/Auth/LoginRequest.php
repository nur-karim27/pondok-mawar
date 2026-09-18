<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $loginField = filter_var($this->input('name'), FILTER_VALIDATE_EMAIL) ? 'email' : 'name';
        $credentials = [
            $loginField => $this->input('name'),
            'password' => $this->input('password')
        ];

        if (! Auth::attempt($credentials, $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'name' => trans('auth.failed'),
            ]);
        }

        $user = Auth::user();
        if ($user->role === 'Wali Santri') {
            // Find student by user_id (since user_id in students table links to the Wali Santri login account)
            $student = \App\Models\Student::where('user_id', $user->id)->first();
            
            // Block login if student status is boyong or nonaktif
            if ($student && in_array($student->status, ['boyong', 'nonaktif'])) {
                Auth::logout();
                throw ValidationException::withMessages([
                    'name' => 'Akun dinonaktifkan karena status santri adalah Boyong atau Nonaktif.',
                ]);
            }
            
            // Also check is_active flag if exists
            if (!$user->is_active) {
                Auth::logout();
                throw ValidationException::withMessages([
                    'name' => 'Akun Anda telah dinonaktifkan.',
                ]);
            }
        }

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'name' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('name')).'|'.$this->ip());
    }
}
