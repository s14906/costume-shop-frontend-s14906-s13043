export interface UserLoginResponse {
  id: number;
  token: string;
  username: string;
  email: string;
  roles: string[];
  success: boolean;
  message: string;
}
