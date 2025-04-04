import LoginForm from "@/components/login-form";
import { ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-white to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <ShieldCheck className="h-12 w-12 text-teal-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-teal-800 tracking-tight">
            Extratus
          </h1>
          <p className="mt-1 text-gray-600 text-sm">
            Sistema de Gestão de Estoque de Remédios
          </p>
        </div>

        <LoginForm />

        <p className="text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Extratus. Todos os direitos
          reservados.
        </p>
      </div>
    </div>
  );
}
