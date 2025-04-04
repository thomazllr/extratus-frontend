import LoginForm from "@/components/login-form";

export default function Home() {
  // In a real application, you would check if the user is already authenticated
  // and redirect them to the dashboard if they are
  // For demo purposes, we'll just show the login form

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-teal-50 to-white p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-teal-700">Extratus</h1>
          <p className="mt-2 text-gray-600">
            Sistema de Gestão de Estoque de Remédios
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
