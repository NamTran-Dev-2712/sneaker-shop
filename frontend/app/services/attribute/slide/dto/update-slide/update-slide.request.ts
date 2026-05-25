export interface UpdateSlideRequest {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image?: File;
  buttonText: string;
  buttonUrl: string;
}
