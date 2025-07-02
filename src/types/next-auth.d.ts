import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      direccion: any;
      telefono: any;
      /** Default user props */
      name?: string | null;
      email?: string | null;
      image?: string | null;
      /** ✅ Tu campo extra */
      role?: string | null;
    };
  }
}
