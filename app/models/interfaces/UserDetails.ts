import { User } from "next-auth";

export interface UserDetails extends User {
  id_user_postgres: number;
}
