import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { X, Upload, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useModules } from "@/contexts/ModulesContext";
import { useSuggestionStatuses } from "@/hooks/useSuggestionStatuses";
import { supabase } from "@/integrations/supabase/client";

interface SuggestionFormProps {
  onSubmit: (suggestion: any) => void;
  onCancel: () => void;
}

const SuggestionForm = ({ onSubmit, onCancel }: SuggestionFormProps) => {
  const { modules, loading: loadingModules } = useModules();
  const { statuses, loading: loadingStatuses } = useSuggestionStatuses();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    module: "",
    email: "",
    youtubeUrl: "",
    isPublic: true,
  });
  const { toast } = useToast();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Automação para emails @mksolution.com
  useEffect(() => {
    if (formData.email.endsWith("@mksolution.com")) {
      setFormData((prev) => ({ ...prev, isPublic: false }));
    }
  }, [formData.email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.description.length < 200) {
      toast({
        title: "Descrição muito curta",
        description: "A descrição deve ter pelo menos 200 caracteres.",
        variant: "destructive",
      });
      return;
    }

    // Buscar o id do módulo pelo nome
    const selectedModule = modules.find((m) => m.nome === formData.module);
    if (!selectedModule) {
      toast({
        title: "Selecione um módulo válido",
        description: "Por favor, selecione um módulo existente.",
        variant: "destructive",
      });
      return;
    }

    // Buscar o id do status 'Recebido'
    const statusRecebido = statuses.find((s) => s.nome === "Recebido");
    if (!statusRecebido) {
      toast({
        title: "Erro ao enviar sugestão",
        description: "Status padrão 'Recebido' não encontrado.",
        variant: "destructive",
      });
      return;
    }

    const imageUrls: string[] = [];
    if (imageFiles.length > 0) {
      try {
        for (const file of imageFiles) {
          const ext = file.name.split(".").pop();
          const filePath = `suggestions/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
          const { error: uploadError } = await supabase.storage.from("suggestion-images").upload(filePath, file);
          if (uploadError) throw uploadError;
          const { data } = supabase.storage.from("suggestion-images").getPublicUrl(filePath);
          if (!data.publicUrl) {
            throw new Error("URL pública não retornada pelo Supabase");
          }
          imageUrls.push(data.publicUrl);
          console.log("Imagem enviada:", data.publicUrl);
        }
        console.log("Todas as imagens enviadas:", imageUrls);
      } catch (err) {
        toast({
          title: "Erro ao enviar imagens",
          description: "Não foi possível fazer upload das imagens.",
          variant: "destructive",
        });
        return;
      }
    }
    console.log("Enviando para onSubmit:", { ...formData, image_urls: imageUrls });
    onSubmit({
      ...formData,
      module_id: selectedModule.id,
      status_id: statusRecebido.id,
      module: undefined, // não enviar o nome
      image_urls: imageUrls,
    });

    toast({
      title: "Sugestão enviada com sucesso!",
      description: "Sua sugestão foi recebida e será analisada pela nossa equipe.",
    });
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full dark:bg-[#282a36] dark:border-[#44475a]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl dark:text-[#f8f8f2]">Nova Sugestão</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-[#f8f8f2]">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="seu@email.com"
                required
                className="dark:bg-[#44475a] dark:text-[#f8f8f2] dark:placeholder:text-[#6272a4] dark:border-[#6272a4]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="module" className="dark:text-[#f8f8f2]">Produto/Módulo *</Label>
              <Select value={formData.module} onValueChange={(value) => handleChange("module", value)} required>
                <SelectTrigger className="dark:bg-[#44475a] dark:text-[#f8f8f2] dark:border-[#6272a4]">
                  <SelectValue placeholder="Selecione o módulo" />
                </SelectTrigger>
                <SelectContent className="dark:bg-[#282a36] dark:text-[#f8f8f2]">
                  {modules.map((module) => (
                    <SelectItem key={module.id} value={module.nome} className="dark:hover:bg-[#bd93f9] dark:hover:text-[#282a36] dark:focus:bg-[#bd93f9] dark:focus:text-[#282a36]">
                      {module.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="dark:text-[#f8f8f2]">Título da Sugestão *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Descreva sua sugestão em poucas palavras"
              required
              className="dark:bg-[#44475a] dark:text-[#f8f8f2] dark:placeholder:text-[#6272a4] dark:border-[#6272a4]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="dark:text-[#f8f8f2]">
              Descrição * (mínimo 200 caracteres)
              <span className="text-sm text-gray-500 dark:text-[#8be9fd] ml-2">{formData.description.length}/200</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Descreva detalhadamente sua sugestão, incluindo o problema atual, a solução proposta e os benefícios esperados..."
              rows={6}
              className="resize-none dark:bg-[#44475a] dark:text-[#f8f8f2] dark:placeholder:text-[#6272a4] dark:border-[#6272a4]"
              required
            />
          </div>

          {/* Opção Público/Privado
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Visibilidade da Sugestão</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formData.isPublic
                    ? "Esta sugestão será visível para todos os usuários no mural público"
                    : "Esta sugestão será visível apenas internamente (não aparece no mural público)"}
                </p>
                {formData.email.endsWith("@mksolution.com") && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    ℹ️ Emails @mksolution.com são automaticamente definidos como privados
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="visibility" className="text-sm">
                  {formData.isPublic ? "Público" : "Privado"}
                </Label>
                <Switch id="visibility" checked={formData.isPublic} onCheckedChange={(checked) => handleChange("isPublic", checked)} />
              </div>
            </div>
          </div> */}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-[#f8f8f2]">Imagens (opcional)</label>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  setImageFiles(Array.from(e.target.files));
                }
              }}
            />
            <div
              className="border-2 border-dashed border-gray-300 dark:border-[#bd93f9] rounded-lg p-4 text-center bg-gray-50 dark:bg-[#44475a] w-full cursor-pointer hover:border-blue-400 dark:hover:border-[#ff79c6]"
              onClick={() => imageInputRef.current?.click()}
            >
              <svg className="w-8 h-8 text-gray-400 dark:text-[#bd93f9] mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828l6.586-6.586a2 2 0 00-2.828-2.828z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7V3a1 1 0 00-1-1h-4a1 1 0 00-1 1v4" />
              </svg>
              <p className="text-sm text-gray-600 dark:text-[#f8f8f2]">Clique para selecionar imagens (.jpg, .png, .webp)</p>
              <p className="text-xs text-gray-400 dark:text-[#8be9fd] mt-1">Máximo 5MB por imagem. Você pode selecionar múltiplas imagens.</p>
            </div>
            {imageFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {imageFiles.map((file, idx) => (
                  <div key={idx} className="relative w-20 h-20">
                    <img src={URL.createObjectURL(file)} alt={`preview-${idx}`} className="w-20 h-20 object-cover rounded border dark:border-[#bd93f9]" />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFiles((prev) => prev.filter((_, i) => i !== idx));
                      }}
                      className="absolute top-1 right-1 bg-white dark:bg-[#ff79c6] bg-opacity-80 rounded-full p-1 hover:bg-red-500 hover:text-white dark:hover:bg-[#bd93f9] dark:text-[#282a36] transition-colors"
                      title="Remover imagem"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="space-y-2 mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-[#f8f8f2]">Link do vídeo (opcional)</label>
            <input
              id="youtubeUrl"
              name="youtubeUrl"
              type="url"
              value={formData.youtubeUrl}
              onChange={(e) => handleChange("youtubeUrl", e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-gray-900 dark:text-[#f8f8f2] bg-white dark:bg-[#44475a] border-gray-300 dark:border-[#6272a4] focus:outline-none focus:ring-2 focus:ring-dark_blue_mk dark:focus:ring-[#bd93f9] placeholder:text-gray-400 dark:placeholder:text-[#6272a4]"
              placeholder="Cole o link do YouTube, Vimeo, etc."
            />
            <div className="text-xs text-gray-500 dark:text-[#8be9fd]">
              Envie seu vídeo para uma plataforma como <b>YouTube</b>, <b>Vimeo</b> ou similar e cole o link acima. Não é possível fazer upload direto
              de vídeo.
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-[#6272a4]">
            <Button type="button" variant="outline" onClick={onCancel} className="dark:border-[#bd93f9] dark:text-[#bd93f9] dark:hover:bg-[#44475a]">
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white dark:from-[#bd93f9] dark:to-[#ff79c6] dark:hover:from-[#bd93f9] dark:hover:to-[#ff79c6] dark:text-[#282a36]"
              disabled={formData.description.length < 200}
            >
              Enviar Sugestão
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SuggestionForm;
