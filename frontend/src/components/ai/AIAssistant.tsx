import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Send, Bot, User, TrendingUp, AlertTriangle, Package } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  suggestions?: string[];
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Bonjour ! Je suis votre assistant IA SmartChantier. Comment puis-je vous aider aujourd'hui ?",
      sender: "ai",
      timestamp: new Date(),
      suggestions: [
        "Analyser mon chantier A",
        "Quels matériaux commander ?",
        "État de sécurité global"
      ]
    }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date()
    };

    // Simuler une réponse IA
    const aiResponses = [
      {
        text: "Selon mon analyse, vous aurez besoin de 50 sacs de ciment d'ici 3 jours pour respecter le planning du chantier A.",
        suggestions: ["Voir les fournisseurs", "Planifier la livraison", "Calculer le budget"]
      },
      {
        text: "Le scoring de sécurité de votre chantier B est de 85%. Je détecte un manque d'EPI sur la zone 3.",
        suggestions: ["Voir le rapport détaillé", "Commander des EPI", "Programmer une formation"]
      },
      {
        text: "Voici l'état de vos commandes : 3 en cours, 2 livrées cette semaine, 1 en retard.",
        suggestions: ["Voir les détails", "Contacter le fournisseur", "Suivre les livraisons"]
      }
    ];

    const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
    
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse.text,
        sender: "ai",
        timestamp: new Date(),
        suggestions: randomResponse.suggestions
      };
      setMessages(prev => [...prev, userMessage, aiMessage]);
    }, 1000);

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setNewMessage(suggestion);
    sendMessage();
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-construction hover:shadow-glow transition-all duration-300"
        style={{ background: "var(--gradient-secondary)" }}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 h-96 shadow-construction border-0 animate-scale-in">
      <CardHeader className="pb-3 bg-gradient-to-r from-primary to-primary-light text-primary-foreground rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 bg-secondary">
              <AvatarFallback className="bg-secondary text-secondary-foreground">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-sm">Assistant IA SmartChantier</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-primary-foreground hover:bg-white/20 h-6 w-6 p-0"
          >
            ×
          </Button>
        </div>
        <Badge variant="secondary" className="w-fit text-xs">
          <TrendingUp className="h-3 w-3 mr-1" />
          Intelligence active
        </Badge>
      </CardHeader>

      <CardContent className="p-0 flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] p-2 rounded-lg ${
                message.sender === "user" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
              }`}>
                <div className="flex items-start gap-2">
                  {message.sender === "ai" && (
                    <Bot className="h-4 w-4 mt-0.5 text-secondary" />
                  )}
                  {message.sender === "user" && (
                    <User className="h-4 w-4 mt-0.5 text-primary-foreground" />
                  )}
                  <p className="text-xs">{message.text}</p>
                </div>
                
                {message.suggestions && (
                  <div className="mt-2 space-y-1">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs px-2 hover:bg-secondary/20"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t bg-accent/30">
          <div className="flex gap-2">
            <Input
              placeholder="Posez votre question..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="text-xs"
            />
            <Button size="sm" onClick={sendMessage} className="bg-secondary hover:bg-secondary-dark">
              <Send className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}