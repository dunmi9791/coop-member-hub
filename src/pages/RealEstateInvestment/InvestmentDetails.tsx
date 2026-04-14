import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building2, MapPin, ArrowLeft, Loader2, Info, Image as ImageIcon, Home, Calendar, Layout, TrendingUp, CheckCircle2 } from 'lucide-react'
import { fetchProjectDetails, RealEstateUnit, RealEstateProject, RealEstateMilestone } from '@/services/realEstateApi'
import { toast } from '@/components/ui/use-toast'
import { UserContext } from '@/hooks/AuthContext'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const InvestmentDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [project, setProject] = useState<RealEstateProject | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      if (!id) return
      try {
        setLoading(true)
        const response = await fetchProjectDetails(parseInt(id))

        if (response.error) {
          setError(response.error.message)
        } else if (response.result) {
          setProject(response.result.project)
        }
      } catch (err) {
        setError('Failed to load project information.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading project details...</p>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive mb-4">{error || 'Project not found'}</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    )
  }

  const galleryImages = project.photo_gallery && project.photo_gallery.length > 0 
    ? project.photo_gallery.map(img => img.url)
    : project.gallery_urls || [];

  const mainImage = project.main_picture_url && typeof project.main_picture_url === 'string'
    ? project.main_picture_url
    : project.picture_url;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard/real-estate')}
          className="flex items-center gap-2 -ml-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 uppercase tracking-wider font-semibold">
            {project.type}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Active
          </Badge>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          {project.name}
        </h1>
        <div className="flex items-center gap-2 text-xl text-muted-foreground">
          <MapPin className="h-5 w-5 text-primary" />
          <span>{typeof project.location === 'string' ? project.location : 'N/A'}</span>
        </div>
      </div>

      <Card className="overflow-hidden border-none shadow-2xl rounded-3xl bg-black">
        <CardContent className="p-0">
          <div className="relative aspect-[16/9] md:aspect-[21/9] flex items-center justify-center overflow-hidden">
            {galleryImages.length > 0 ? (
              <Carousel className="w-full h-full" opts={{ loop: true }}>
                <CarouselContent className="h-full -ml-0">
                  {galleryImages.map((url, index) => (
                    <CarouselItem key={index} className="pl-0 h-full">
                      <div className="relative h-full w-full">
                        <img 
                          src={url} 
                          alt={`${project.name} gallery ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="absolute inset-x-0 bottom-8 flex items-center justify-center gap-4 z-10">
                  <CarouselPrevious className="static h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-md translate-x-0" />
                  <CarouselNext className="static h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-md translate-x-0" />
                </div>
              </Carousel>
            ) : mainImage ? (
              <img 
                src={mainImage} 
                alt={project.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-white p-20">
                <ImageIcon className="h-20 w-20 mb-4 opacity-20" />
                <p className="text-xl font-medium opacity-50">No project visuals available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-4">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Layout className="h-6 w-6 text-primary" />
              Project Description
            </h3>
            <div className="prose prose-blue max-w-none text-lg leading-relaxed text-muted-foreground">
              {project.description || "Detailed description for this project is currently unavailable. Please check back soon for more information about the property features, community, and investment potential."}
            </div>
          </section>

          {project.milestone_template && project.milestone_template.length > 0 && (
            <section className="space-y-4">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                Project Milestones
              </h3>
              <div className="space-y-6 bg-muted/30 p-6 rounded-3xl">
                {project.milestone_template.map((milestone, index) => (
                  <div key={milestone.id} className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
                          {index + 1}
                        </div>
                        <span className="font-semibold text-lg">{milestone.name}</span>
                      </div>
                      <span className="text-primary font-bold">{milestone.percentage}%</span>
                    </div>
                    <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-1000"
                        style={{ width: `${milestone.percentage}%` }}
                      />
                    </div>
                    {milestone.description && (
                      <p className="mt-2 text-sm text-muted-foreground ml-10">
                        {milestone.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {galleryImages.length > 0 ? (
            <section className="space-y-4">
              <h3 className="text-2xl font-bold flex items-center gap-2">
                <ImageIcon className="h-6 w-6 text-primary" />
                Photo Gallery
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map((url, index) => (
                  <div key={index} className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300">
                    <img 
                      src={url} 
                      alt={`${project.name} gallery ${index + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white/90 p-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        <ImageIcon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            mainImage && (
              <section className="space-y-4">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <ImageIcon className="h-6 w-6 text-primary" />
                  Photo Gallery
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300">
                    <img 
                      src={mainImage} 
                      alt={`${project.name} main`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white/90 p-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        <ImageIcon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )
          )}

          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-muted/50 border-none rounded-2xl p-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <Home className="h-6 w-6 text-primary" />
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Units</p>
                <p className="text-2xl font-bold">{project.total_units || 'N/A'}</p>
              </div>
            </Card>
            <Card className="bg-muted/50 border-none rounded-2xl p-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Completion</p>
                <p className="text-2xl font-bold">{typeof project.estimated_completion_date === 'string' ? project.estimated_completion_date : 'N/A'}</p>
              </div>
            </Card>
            <Card className="bg-muted/50 border-none rounded-2xl p-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <TrendingUp className="h-6 w-6 text-green-500" />
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Potential ROI</p>
                <p className="text-2xl font-bold text-green-500">15-20%</p>
              </div>
            </Card>
          </section>
        </div>

        <div className="space-y-6">
          <Card className="overflow-hidden border-none shadow-lg rounded-3xl bg-muted/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="aspect-square w-full">
                {project.map_location_url ? (
                  <iframe 
                    title="Project Location"
                    src={project.map_location_url}
                    className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center bg-muted">
                    <MapPin className="h-10 w-10 mb-2 opacity-20" />
                    <p>Map location unavailable</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-4 bg-muted/50">
               <p className="text-sm text-center w-full text-muted-foreground">
                 {typeof project.location === 'string' ? project.location : 'Location details not provided'}
               </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default InvestmentDetails
