export interface ResetPasswordWithOtpRequest {
  email: string;
  otp: string;
  newPassword: string;
}
