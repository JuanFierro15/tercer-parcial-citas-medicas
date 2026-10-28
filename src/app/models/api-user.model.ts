export interface ApiUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: {
    city: string;
  };
  company: {
    name: string;
  };
}
