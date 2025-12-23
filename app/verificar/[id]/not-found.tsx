import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, Home } from "lucide-react";
import moment from "moment-timezone";

const TIMEZONE_ARGENTINA = 'America/Argentina/Buenos_Aires';

export default function DocumentoNoEncontrado() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header con colores del proyecto */}
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Terra Energy Services</h1>
              <p className="text-xs text-primary-foreground/80">Verificación de Documento</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 max-w-md">
        <Card className="border-destructive border-2">
          <CardHeader className="bg-destructive/10 rounded-t-lg text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="h-16 w-16 text-destructive" />
            </div>
            <CardTitle className="text-2xl text-destructive">
              Documento No Encontrado
            </CardTitle>
            <CardDescription className="text-destructive/80">
              El código QR escaneado no corresponde a ningún documento válido
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
              <p className="text-sm text-foreground font-medium">
                Posibles causas:
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
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
          <p className="text-primary font-medium">
            © {moment.tz(TIMEZONE_ARGENTINA).year()} Terra Energy Services. Todos los derechos reservados.
          </p>
        </div>
      </main>
    </div>
  );
}
