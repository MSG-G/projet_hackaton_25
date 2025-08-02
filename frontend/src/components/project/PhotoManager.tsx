import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Camera, Upload, X, Eye, Download, Tag, Calendar,
  MapPin, AlertTriangle, CheckCircle, Clock, Image as ImageIcon
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const photoSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  category: z.string().min(1, "La catégorie est requise"),
  location: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

type PhotoFormData = z.infer<typeof photoSchema>;

interface Photo {
  id: string;
  title: string;
  description?: string;
  category: string;
  location?: string;
  tags: string[];
  file: File;
  url: string;
  timestamp: Date;
  size: number;
}

const categories = [
  "Avancement général",
  "Fondations", 
  "Structure",
  "Gros œuvre",
  "Second œuvre",
  "Finitions",
  "Problème/Défaut",
  "Sécurité",
  "Équipements",
  "Livraisons",
  "Réunion chantier",
  "Avant/Après"
];

const commonTags = [
  "urgent", "validé", "à corriger", "terminé", "en cours",
  "qualité", "sécurité", "retard", "conformité", "inspection"
];

interface PhotoManagerProps {
  projectId?: string;
}

interface AddPhotoDialogProps {
  children: React.ReactNode;
  onPhotoAdded?: (photo: Photo) => void;
}

const AddPhotoDialog = ({ children, onPhotoAdded }: AddPhotoDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<PhotoFormData>({
    resolver: zodResolver(photoSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      location: "",
      tags: [],
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (currentTag.trim() && !selectedTags.includes(currentTag.trim())) {
      setSelectedTags(prev => [...prev, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  const addCommonTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onSubmit = async (data: PhotoFormData) => {
    if (selectedFiles.length === 0) {
      toast.error("Veuillez sélectionner au moins une photo");
      return;
    }

    try {
      // Simuler l'upload des photos
      for (const file of selectedFiles) {
        const photo: Photo = {
          id: Date.now().toString() + Math.random(),
          title: data.title,
          description: data.description,
          category: data.category,
          location: data.location,
          tags: selectedTags,
          file,
          url: URL.createObjectURL(file),
          timestamp: new Date(),
          size: file.size,
        };

        onPhotoAdded?.(photo);
      }

      toast.success(`${selectedFiles.length} photo(s) ajoutée(s) avec succès!`);
      
      // Reset form
      form.reset();
      setSelectedFiles([]);
      setSelectedTags([]);
      setOpen(false);
    } catch (error) {
      toast.error("Erreur lors de l'ajout des photos");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter des photos</DialogTitle>
          <DialogDescription>
            Ajouter des photos du chantier avec descriptions et catégories
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Sélection de fichiers */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-20 flex flex-col space-y-2"
                >
                  <Upload className="h-6 w-6" />
                  <span>Choisir des photos</span>
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => cameraInputRef.current?.click()}
                  className="h-20 flex flex-col space-y-2"
                >
                  <Camera className="h-6 w-6" />
                  <span>Prendre une photo</span>
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />
              
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileSelect}
              />

              {/* Aperçu des fichiers sélectionnés */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Photos sélectionnées ({selectedFiles.length})</h4>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
                          {formatFileSize(file.size)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Titre */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre de la photo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Coulage dalle niveau 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Catégorie */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Localisation */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localisation (optionnel)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: RDC - Hall principal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags */}
            <div className="space-y-3">
              <FormLabel>Tags</FormLabel>
              
              {/* Tags communs */}
              <div className="flex flex-wrap gap-2">
                {commonTags.map((tag) => (
                  <Button
                    key={tag}
                    type="button"
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    size="sm"
                    onClick={() => addCommonTag(tag)}
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Button>
                ))}
              </div>

              {/* Ajout de tag personnalisé */}
              <div className="flex space-x-2">
                <Input
                  placeholder="Ajouter un tag personnalisé"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  Ajouter
                </Button>
              </div>

              {/* Tags sélectionnés */}
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Commentaires, observations, notes techniques..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" variant="construction">
                Ajouter les photos
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const PhotoManager = ({ projectId }: PhotoManagerProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const addPhoto = (photo: Photo) => {
    setPhotos(prev => [photo, ...prev]);
  };

  const deletePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(p => p.id !== photoId));
    toast.success("Photo supprimée");
  };

  const downloadPhoto = (photo: Photo) => {
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = `${photo.title}_${photo.timestamp.toLocaleDateString()}.jpg`;
    link.click();
  };

  const filteredPhotos = selectedCategory === "all" 
    ? photos 
    : photos.filter(p => p.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Problème/Défaut": return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "Sécurité": return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "Avant/Après": return <CheckCircle className="h-4 w-4 text-success" />;
      default: return <ImageIcon className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">Photos du chantier</h2>
          <Badge variant="outline">{photos.length} photos</Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filtrer par catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <AddPhotoDialog onPhotoAdded={addPhoto}>
            <Button variant="construction">
              <Camera className="h-4 w-4 mr-2" />
              Ajouter des photos
            </Button>
          </AddPhotoDialog>
        </div>
      </div>

      {/* Grille de photos */}
      {filteredPhotos.length === 0 ? (
        <div className="text-center py-12">
          <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {selectedCategory === "all" 
              ? "Aucune photo ajoutée pour le moment" 
              : `Aucune photo dans la catégorie "${selectedCategory}"`
            }
          </p>
          <AddPhotoDialog onPhotoAdded={addPhoto}>
            <Button variant="outline" className="mt-4">
              <Camera className="h-4 w-4 mr-2" />
              Ajouter la première photo
            </Button>
          </AddPhotoDialog>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => (
            <Card key={photo.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Overlay avec actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setSelectedPhoto(photo)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => downloadPhoto(photo)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deletePhoto(photo.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Badge catégorie */}
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="text-xs">
                      {getCategoryIcon(photo.category)}
                      <span className="ml-1">{photo.category}</span>
                    </Badge>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-semibold truncate">{photo.title}</h3>
                  
                  {photo.location && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      {photo.location}
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {photo.timestamp.toLocaleDateString('fr-FR')}
                  </div>

                  {photo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {photo.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {photo.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{photo.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de visualisation de photo */}
      {selectedPhoto && (
        <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {getCategoryIcon(selectedPhoto.category)}
                <span>{selectedPhoto.title}</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="w-full max-h-96 object-contain rounded-lg border"
              />
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><span className="font-medium">Catégorie:</span> {selectedPhoto.category}</p>
                  {selectedPhoto.location && (
                    <p><span className="font-medium">Localisation:</span> {selectedPhoto.location}</p>
                  )}
                  <p><span className="font-medium">Date:</span> {selectedPhoto.timestamp.toLocaleString('fr-FR')}</p>
                </div>
                <div>
                  <p><span className="font-medium">Taille:</span> {formatFileSize(selectedPhoto.size)}</p>
                  {selectedPhoto.tags.length > 0 && (
                    <div>
                      <p className="font-medium mb-2">Tags:</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedPhoto.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {selectedPhoto.description && (
                <div>
                  <p className="font-medium mb-2">Description:</p>
                  <p className="text-sm text-muted-foreground">{selectedPhoto.description}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PhotoManager;