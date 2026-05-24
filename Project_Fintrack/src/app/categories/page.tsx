"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { getCategoryIcon } from "@/lib/category-icons";
import { Plus, Trash2, Lock } from "lucide-react";
import type { Category } from "@/types";

const PRESET_COLORS = [
  "#f97316", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899",
  "#ef4444", "#06b6d4", "#eab308", "#10b981", "#6b7280",
  "#f59e0b", "#84cc16", "#14b8a6", "#a855f7", "#fb923c",
];

export default function CategoriesPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#6366f1");
  const [loading, setLoading] = useState(false);

  async function fetchCategories() {
    const res = await fetch("/api/categories");
    setCategories(await res.json());
  }

  useEffect(() => { fetchCategories(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), color, icon: "tag" }),
      });
      if (!res.ok) throw new Error("Erro");
      toast({ title: "Categoria criada!", variant: "success" as any });
      setName(""); setColor("#6366f1");
      setModalOpen(false);
      fetchCategories();
    } catch {
      toast({ title: "Erro ao criar categoria", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("has transactions");
      toast({ title: "Categoria excluída", variant: "success" as any });
      fetchCategories();
    } catch {
      toast({ title: "Não é possível excluir: categoria possui transações", variant: "destructive" });
    }
  }

  const defaultCats = categories.filter((c) => c.isDefault);
  const customCats = categories.filter((c) => !c.isDefault);

  return (
    <div className="px-4 pt-6 space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Organização</p>
          <h1 className="text-2xl font-bold mt-0.5">Categorias</h1>
        </div>
        <Button onClick={() => setModalOpen(true)} size="icon" className="rounded-2xl h-11 w-11 shadow-lg shadow-primary/20">
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Default categories */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Lock className="h-3.5 w-3.5 text-muted-foreground" />
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Padrão</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {defaultCats.map((cat) => {
            const Icon = getCategoryIcon(cat.icon);
            return (
              <Card key={cat.id} className="overflow-hidden">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${cat.color}25` }}>
                      <Icon className="h-4.5 w-4.5" style={{ color: cat.color }} />
                    </div>
                    <span className="text-sm font-medium">{cat.name}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Custom categories */}
      {customCats.length > 0 && (
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">Personalizadas</p>
          <div className="grid grid-cols-2 gap-2">
            {customCats.map((cat) => {
              const Icon = getCategoryIcon(cat.icon);
              return (
                <Card key={cat.id} className="overflow-hidden group">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${cat.color}25` }}>
                          <Icon className="h-4.5 w-4.5" style={{ color: cat.color }} />
                        </div>
                        <span className="text-sm font-medium">{cat.name}</span>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir categoria?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Isso irá excluir a categoria &quot;{cat.name}&quot;. Só é possível se não houver transações associadas.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(cat.id)}>Excluir</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Create modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Categoria</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                placeholder="Ex: Pets, Academia..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Cor</Label>
              <div className="grid grid-cols-5 gap-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className="w-full aspect-square rounded-xl transition-transform duration-150 hover:scale-110"
                    style={{
                      backgroundColor: c,
                      outline: color === c ? `3px solid ${c}` : "none",
                      outlineOffset: "2px",
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Cancelar</Button>
              <Button type="submit" className="flex-1" disabled={loading}>{loading ? "Criando..." : "Criar"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
