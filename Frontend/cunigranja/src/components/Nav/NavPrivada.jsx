// NavPrivada.js
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut } from "lucide-react";
import { Sidebar } from "./Sidebar";

export function NavPrivada({  children }) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64">
        <Sidebar />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Encabezado */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-end px-4 py-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <User className="h-10 w-10" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-lg font-medium leading-none">Usuario</p>
                    <p className="text-sm leading-none text-muted-foreground">
                      usuario@ejemplo.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-6 w-6" />
                  <span className="text-lg">Configuración de cuenta</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-6 w-6" />
                  <a className="text-lg "  href="/user/login">Cerrar sesión</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Área de trabajo */}
        <main className="flex-1 p-6 bg-gray-100">
          <h1 className="text-2xl font-bold mb-4"></h1>
          {children}
        </main>
      </div>
    </div>
  );
}
