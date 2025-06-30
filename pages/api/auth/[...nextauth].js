import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { 
          label: "Email", 
          type: "email",
          placeholder: "correo@ejemplo.com"
        },
        password: { 
          label: "Password", 
          type: "password" 
        }
      },
      async authorize(credentials) {
        try {
          // Validación básica de credenciales
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email y contraseña son requeridos");
          }

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            }),
            headers: { 
              "Content-Type": "application/json",
              "Accept": "application/json"
            }
          });
          
          const data = await response.json();

          // Manejo de errores del backend
          if (!response.ok) {
            throw new Error(data.message || "Error de autenticación");
          }

          if (data?.cliente) { // Cambiado de empleado a cliente
            return {
              id: data.cliente.id,
              email: data.cliente.email,
              name: data.cliente.nombre,
              role: data.cliente.role,
              telefono: data.cliente.telefono,
              direccion: data.cliente.direccion,
              token: data.token
            };
          }
          
          return null;
        } catch (error) {
          console.error("Error en autorización:", error.message);
          throw new Error(error.message || "No se pudo iniciar sesión");
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 día de duración de sesión
  },
  callbacks: {
  async session({ session, token }) {
    session.user.role = token.role; // <--- agrega el campo
    return session;
  },
  async jwt({ token, user }) {
    if (user) {
      token.role = user.role; // <--- viene de DB o auth provider
    }
    return token;
  },
    async session({ session, token }) {
      // Enviar propiedades necesarias al cliente
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.telefono = token.telefono;
        session.user.direccion = token.direccion;
        session.accessToken = token.accessToken;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Manejo seguro de redirecciones
      return url.startsWith(baseUrl) ? url : baseUrl;
    }
  },
  pages: {
    signIn: "/auth/login",
    signUp: "/auth/register",
    error: "/auth/login", // Página para mostrar errores
  },
  debug: process.env.NODE_ENV === "development", // Solo en desarrollo
  secret: process.env.NEXTAUTH_SECRET, // Clave secreta obligatoria
};

export default NextAuth(authOptions);