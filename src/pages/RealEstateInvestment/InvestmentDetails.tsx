import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building2, MapPin, ArrowLeft, Loader2, Info } from 'lucide-react'
import { fetchProjectDetails, RealEstateUnit, RealEstateProject, subscribeToUnit } from '@/services/realEstateApi'
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

const InvestmentDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { details } = useContext(UserContext)
  const [units, setUnits] = useState<RealEstateUnit[]>([])
  const [project, setProject] = useState<RealEstateProject | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState<RealEstateUnit | null>(null)
  const [paymentSource, setPaymentSource] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      if (!id) return
      try {
        setLoading(true)
        const response = await fetchProjectDetails(parseInt(id))

        if (response.error) {
          setError(response.error.message)
        } else if (response.result) {
          setUnits(response.result.units || [])
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleSubscribe = (unit: RealEstateUnit) => {
    setSelectedUnit(unit)
    setIsDialogOpen(true)
  }

  const confirmSubscription = async () => {
    if (!selectedUnit || !paymentSource || !id) return
    if (!details?.member?.member_id) {
      toast({
        title: 'Error',
        description: 'Member information not found. Please log in again.',
        variant: 'destructive',
      })
      return
    }

    try {
      setSubmitting(true)
      const response = await subscribeToUnit(
        details.member.member_id,
        parseInt(id),
        selectedUnit.id,
        paymentSource
      )

      if (response.error) {
        toast({
          title: 'Subscription Failed',
          description: response.error.message,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Subscription Successful',
          description: `You have successfully subscribed to ${selectedUnit.name}.`,
        })
        setIsDialogOpen(false)
        setPaymentSource('')
        // Optionally refresh units or navigate
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'An error occurred while processing your subscription.',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading units...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/dashboard/real-estate')}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{project ? project.name : 'Project Units'}</h2>
          <div className="flex items-center gap-2 text-muted-foreground">
            {project && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{typeof project.location === 'string' ? project.location : 'N/A'}</span>
              </div>
            )}
            {!project && <p>Select a unit to invest in this project</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map((unit) => (
          <Card key={unit.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{unit.name}</CardTitle>
                <Badge variant={unit.state === 'available' ? 'default' : 'secondary'}>
                  {unit.state.charAt(0).toUpperCase() + unit.state.slice(1)}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                {typeof unit.house_type === 'string' ? unit.house_type : 'N/A'}
              </div>
            </CardHeader>
            <CardContent>
              <div className="py-2">
                <p className="text-sm text-muted-foreground">Unit Price</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(unit.unit_price)}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                disabled={unit.state !== 'available'}
                onClick={() => handleSubscribe(unit)}
              >
                {unit.state === 'available' ? 'Subscribe Now' : 'Sold Out'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subscribe to {selectedUnit?.name}</DialogTitle>
            <DialogDescription>
              Please select your preferred payment source to complete the subscription for this unit.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Source</label>
              <Select onValueChange={setPaymentSource} value={paymentSource}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash/bank">Cash/Bank</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                  <SelectItem value="loan">Loan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={confirmSubscription} 
              disabled={!paymentSource || submitting}
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

export default InvestmentDetails
