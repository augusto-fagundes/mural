import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Settings, Send, User, X, ChevronUp, Lock } from "lucide-react";
import { useSuggestions, InternalComment, InternalCommentInput } from "@/hooks/useSuggestions";

interface InternalCommentsProps {
  suggestionId: string;
}

const InternalComments = ({ suggestionId }: InternalCommentsProps) => {
  const [comments, setComments] = useState<InternalComment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [authorRole, setAuthorRole] = useState<'admin' | 'dev'>('admin');
  const [loading, setLoading] = useState(false);
  const { fetchInternalComments, addInternalComment } = useSuggestions();
  const [showNewCommentForm, setShowNewCommentForm] = useState(false);

  const loadComments = async () => {
    if (showComments && comments.length === 0) {
      setLoading(true);
      try {
        const commentsData = await fetchInternalComments(suggestionId);
        setComments(commentsData);
      } catch (error) {
        console.error("Error loading internal comments:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (showComments) {
      loadComments();
    }
  }, [showComments]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim() || !authorEmail.trim()) {
      return;
    }
    setLoading(true);
    try {
      const comment = await addInternalComment({
        suggestion_id: suggestionId,
        author_name: authorName,
        author_email: authorEmail,
        content: newComment,
        author_role: authorRole,
      });
      if (comment) {
        setComments((prev) => [...prev, comment]);
        setNewComment("");
        setShowNewCommentForm(false);
      }
    } catch (error) {
      console.error("Error submitting internal comment:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: 'admin' | 'dev') => {
    return role === 'admin' ? <Shield className="w-3 h-3" /> : <Settings className="w-3 h-3" />;
  };

  const getRoleColor = (role: 'admin' | 'dev') => {
    return role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  };

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        onClick={() => setShowComments((prev) => !prev)}
        className="flex items-center gap-2 border-orange-200 text-orange-700 hover:bg-orange-50"
      >
        {showComments ? (
          <>
            <ChevronUp className="w-4 h-4" /> Fechar comentários internos
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" /> Ver comentários internos ({comments.length || 2})
          </>
        )}
      </Button>

      {showComments && (
        <div className="space-y-6 bg-orange-50 dark:bg-orange-950 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
          {/* Lista de comentários internos */}
          {loading && comments.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-orange-600">Carregando comentários internos...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-orange-600">Nenhum comentário interno ainda. Seja o primeiro a comentar!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {comments.map((comment) => (
                <Card key={comment.id} className="bg-white dark:bg-gray-900 border-orange-200 dark:border-orange-800">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getRoleColor(comment.author_role)}`}>
                        {getRoleIcon(comment.author_role)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                            {comment.author_name}
                          </span>
                          <Badge variant="secondary" className={`text-xs ${getRoleColor(comment.author_role)}`}>
                            {comment.author_role === 'admin' ? 'Admin' : 'Dev'}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Separador visual */}
          <hr className="my-2 border-orange-200 dark:border-orange-700" />

          {/* Botão para abrir o formulário de novo comentário */}
          {!showNewCommentForm && (
            <Button
              variant="outline"
              onClick={() => setShowNewCommentForm(true)}
              className="flex items-center gap-2 border-orange-200 text-orange-700 hover:bg-orange-100"
            >
              <Send className="w-4 h-4" /> Adicionar comentário interno
            </Button>
          )}

          {/* Formulário para novo comentário interno */}
          {showNewCommentForm && (
            <Card className="border-dashed border-orange-300 dark:border-orange-700">
              <CardContent className="p-4">
                <form onSubmit={handleSubmitComment} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Seu nome"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      required
                    />
                    <Input
                      type="email"
                      placeholder="Seu email"
                      value={authorEmail}
                      onChange={(e) => setAuthorEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Select value={authorRole} onValueChange={(value: 'admin' | 'dev') => setAuthorRole(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu papel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Administrador
                        </div>
                      </SelectItem>
                      <SelectItem value="dev">
                        <div className="flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          Desenvolvedor
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Escreva seu comentário interno..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[80px]"
                    required
                  />
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={loading || !newComment.trim() || !authorName.trim() || !authorEmail.trim()}
                      className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700"
                    >
                      <Send className="w-4 h-4" />
                      {loading ? "Enviando..." : "Comentar"}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowNewCommentForm(false)}
                    >
                      Fechar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default InternalComments;