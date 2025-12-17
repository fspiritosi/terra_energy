import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, Home } from "lucide-react";

export default function DocumentoNoEncontrado() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-amber-800">Terra Energy Services</h1>
              <p className="text-xs text-muted-foreground">Verificación de Documento</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-md">
        <Card className="border-red-200 border-2">
          <CardHeader className="bg-red-50 rounded-t-lg text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <CardTitle className="text-2xl text-red-700">
              Documento No Encontrado
            </CardTitle>
            <CardDescription className="text-red-600">
              El código QR escaneado no corresponde a ningún documento válido
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">
                <strong>Posibles causas:</strong>
              </p>
              <ul className="text-sm text-red-600 mt-2 space-y-1 list-disc list-inside">
                <li>El código QR está dañado o incompleto</li>
                <li>El documento ha sido revocado o eliminado</li>
                <li>El enlace ha expirado o es inválido</li>
              </ul>
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              Si cree que esto es un error, por favor contacte a Terra Energy Services 
              para verificar la autenticidad del documento.
            </p>

            <div className="flex justify-center pt-4">
              <Button asChild variant="outline">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Ir al inicio
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="text-center text-xs text-muted-foreground mt-8">
          <p>
            © {new Date().getFullYear()} Terra Energy Services. Todos los derechos reservados.
          </p>
        </div>
      </main>
    </div>
  );
}

