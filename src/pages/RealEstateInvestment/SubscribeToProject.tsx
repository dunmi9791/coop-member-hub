import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building2, MapPin, ArrowLeft, Loader2, Info, Home, CreditCard, CheckCircle2 } from 'lucide-react'
import { fetchProjectDetails, fetchProjectUnits, RealEstateUnit, RealEstateProject, subscribeToUnit } from '@/services/realEstateApi'
import { toast } from '@/components/ui/use-toast'
import { UserContext } from '@/hooks/AuthContext'
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

const SubscribeToProject = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { credentials } = useContext(UserContext)
  
  const [project, setProject] = useState<RealEstateProject | null>(null)
  const [units, setUnits] = useState<RealEstateUnit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [isSubscribeOpen, setIsSubscribeOpen] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState<RealEstateUnit | null>(null)
  const [paymentSource, setPaymentSource] = useState('cash')
  const [paymentProof, setPaymentProof] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      if (!id) return
      try {
        setLoading(true)
        // Fetch project details which now includes units
        const projectResponse = await fetchProjectDetails(parseInt(id))
        if (projectResponse.result) {
          setProject(projectResponse.result.project)
          
          if (projectResponse.result.units) {
            setUnits(projectResponse.result.units)
          } else {
            // Fallback to fetchProjectUnits if units are not in project_details
            const unitsResponse = await fetchProjectUnits(parseInt(id))
            if (unitsResponse.result) {
              setUnits(unitsResponse.result.units)
            }
          }
        }
      } catch (err) {
        setError('Failed to load project units.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id])

  const formatCurrency = (amount: number, currencyCode: string = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currencyCode || 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleOpenSubscribe = (unit: RealEstateUnit) => {
    setSelectedUnit(unit)
    setPaymentSource('cash')
    setPaymentProof(null)
    setIsSubscribeOpen(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove the prefix (e.g., "data:image/jpeg;base64,")
        const base64 = base64String.split(',')[1];
        setPaymentProof(base64);
      };
      reader.readAsDataURL(file);
    } else {
      setPaymentProof(null);
    }
  };

  const handleConfirmSubscription = async () => {
    if (!selectedUnit || !id || !credentials?.partner_id) return

    if (paymentSource === 'cash' && !paymentProof) {
      toast({
        title: "Proof of Payment Required",
        description: "Please upload your proof of payment to proceed.",
        variant: "destructive",
      })
      return
    }

    try {
      setSubmitting(true)
      const response = await subscribeToUnit(
        credentials.partner_id.toString(),
        parseInt(id),
        selectedUnit.id,
        paymentSource,
        paymentSource === 'cash' ? (paymentProof || undefined) : undefined
      )

      if (response.error) {
        toast({
          title: "Subscription Failed",
          description: response.error.message || "An error occurred during subscription.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Subscription Successful",
          description: `You have successfully subscribed to ${selectedUnit.name}.`,
        })
        setIsSubscribeOpen(false)
        // Refresh project and units list
        const projectResponse = await fetchProjectDetails(parseInt(id))
        if (projectResponse.result) {
          setProject(projectResponse.result.project)
          if (projectResponse.result.units) {
            setUnits(projectResponse.result.units)
          } else {
            const unitsResponse = await fetchProjectUnits(parseInt(id))
            if (unitsResponse.result) {
              setUnits(unitsResponse.result.units)
            }
          }
        }
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "A network error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading available units...</p>
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

  return (
    <div className="container mx-auto space-y-8 pb-12">
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

      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Subscribe to {project.name}
        </h1>
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <span>{typeof project.location === 'string' ? project.location : 'N/A'}</span>
          <span className="mx-2">•</span>
          <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5 uppercase text-[10px] font-bold">
            {project.type}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.length > 0 ? (
          units.map((unit) => (
            <Card key={unit.id} className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 bg-card">
              <CardHeader className="pb-3 bg-muted/30">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Home className="h-5 w-5 text-primary" />
                    {unit.name}
                  </CardTitle>
                  <Badge className={unit.state === 'available' ? "bg-green-500/20 text-green-700" : "bg-destructive/20 text-destructive"}>
                    {unit.state.charAt(0).toUpperCase() + unit.state.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Unit Number</span>
                  <span className="font-semibold">{unit.number}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(unit.unit_price, typeof unit.currency === 'object' ? unit.currency.name : 'NGN')}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/10 pt-4">
                <Button 
                  className="w-full font-semibold" 
                  disabled={unit.state !== 'available'}
                  onClick={() => handleOpenSubscribe(unit)}
                >
                  {unit.state === 'available' ? 'Select & Subscribe' : 'Unavailable'}
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-muted/20 rounded-3xl">
            <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-xl font-medium text-muted-foreground">No units are currently available for subscription in this project.</p>
          </div>
        )}
      </div>

      {/* Subscription Dialog */}
      <Dialog open={isSubscribeOpen} onOpenChange={setIsSubscribeOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Confirm Subscription</DialogTitle>
            <DialogDescription>
              You are about to subscribe to <strong>{selectedUnit?.name}</strong> in {project.name}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 space-y-6">
            <div className="bg-primary/5 p-4 rounded-2xl space-y-2 border border-primary/10">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Unit Price</span>
                <span className="font-bold text-primary">
                  {selectedUnit && formatCurrency(selectedUnit.unit_price, typeof selectedUnit.currency === 'object' ? selectedUnit.currency.name : 'NGN')}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                Select Payment Source
              </label>
              <Select value={paymentSource} onValueChange={setPaymentSource}>
                <SelectTrigger className="w-full h-12 rounded-xl">
                  <SelectValue placeholder="Select payment source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash/Bank</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="loan">Loan</SelectItem>
                </SelectContent>
              </Select>

              {paymentSource === 'cash' && (
                <div className="space-y-2 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    Upload Proof of Payment (JPEG, PNG, or PDF)
                  </label>
                  <input 
                    type="file" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    onChange={handleFileChange} 
                    accept=".jpg,.jpeg,.png,.pdf" 
                    required
                  />
                </div>
              )}
              
              <p className="text-xs text-muted-foreground italic">
                * Your subscription request will be reviewed by the cooperative administrator.
              </p>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              className="w-full sm:w-auto rounded-xl"
              onClick={() => setIsSubscribeOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              className="w-full sm:w-auto rounded-xl bg-gradient-primary"
              onClick={handleConfirmSubscription}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm Subscription'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SubscribeToProject
