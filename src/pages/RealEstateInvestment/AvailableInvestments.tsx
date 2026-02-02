import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building2, MapPin, TrendingUp, Calendar, Users } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Investment {
  id: number
  name: string
  location: string
  type: string
  minimumInvestment: number
  expectedReturn: number
  duration: string
  totalSlots: number
  availableSlots: number
  image: string
  status: 'open' | 'closing_soon' | 'closed'
}

const AvailableInvestments = () => {
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null)
  const [subscribeDialogOpen, setSubscribeDialogOpen] = useState(false)
  const [units, setUnits] = useState(1)

  const investments: Investment[] = [
    {
      id: 1,
      name: 'Lekki Gardens Phase 3',
      location: 'Lekki, Lagos',
      type: 'Residential',
      minimumInvestment: 500000,
      expectedReturn: 25,
      duration: '24 months',
      totalSlots: 100,
      availableSlots: 45,
      image: '/placeholder.svg',
      status: 'open',
    },
    {
      id: 2,
      name: 'Abuja Metro Plaza',
      location: 'Wuse, Abuja',
      type: 'Commercial',
      minimumInvestment: 1000000,
      expectedReturn: 30,
      duration: '36 months',
      totalSlots: 50,
      availableSlots: 12,
      image: '/placeholder.svg',
      status: 'closing_soon',
    },
    {
      id: 3,
      name: 'Port Harcourt Towers',
      location: 'GRA, Port Harcourt',
      type: 'Mixed Use',
      minimumInvestment: 750000,
      expectedReturn: 22,
      duration: '18 months',
      totalSlots: 80,
      availableSlots: 60,
      image: '/placeholder.svg',
      status: 'open',
    },
    {
      id: 4,
      name: 'Ibadan Industrial Park',
      location: 'Ibadan, Oyo',
      type: 'Industrial',
      minimumInvestment: 2000000,
      expectedReturn: 35,
      duration: '48 months',
      totalSlots: 30,
      availableSlots: 28,
      image: '/placeholder.svg',
      status: 'open',
    },
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">Open</Badge>
      case 'closing_soon':
        return <Badge className="bg-amber-500/20 text-amber-700 hover:bg-amber-500/30">Closing Soon</Badge>
      case 'closed':
        return <Badge className="bg-destructive/20 text-destructive hover:bg-destructive/30">Closed</Badge>
      default:
        return null
    }
  }

  const handleSubscribe = (investment: Investment) => {
    setSelectedInvestment(investment)
    setUnits(1)
    setSubscribeDialogOpen(true)
  }

  const confirmSubscription = () => {
    if (selectedInvestment) {
      toast({
        title: 'Subscription Successful!',
        description: `You have subscribed to ${selectedInvestment.name} with ${units} unit(s) worth ${formatCurrency(selectedInvestment.minimumInvestment * units)}`,
      })
      setSubscribeDialogOpen(false)
      setSelectedInvestment(null)
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {investments.map((investment) => (
          <Card key={investment.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 bg-muted">
              <img
                src={investment.image}
                alt={investment.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                {getStatusBadge(investment.status)}
              </div>
              <div className="absolute top-3 left-3">
                <Badge variant="secondary">{investment.type}</Badge>
              </div>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                {investment.name}
              </CardTitle>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {investment.location}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-muted-foreground">Expected Return</p>
                    <p className="font-semibold text-green-600">{investment.expectedReturn}% p.a.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-muted-foreground">Duration</p>
                    <p className="font-semibold">{investment.duration}</p>
                  </div>
                </div>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Min. Investment</span>
                  <span className="font-bold text-primary">{formatCurrency(investment.minimumInvestment)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {investment.availableSlots} of {investment.totalSlots} slots available
                  </span>
                </div>
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${((investment.totalSlots - investment.availableSlots) / investment.totalSlots) * 100}%` }}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleSubscribe(investment)}
                disabled={investment.status === 'closed'}
              >
                Subscribe Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={subscribeDialogOpen} onOpenChange={setSubscribeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subscribe to Investment</DialogTitle>
            <DialogDescription>
              {selectedInvestment && (
                <>You are about to subscribe to <strong>{selectedInvestment.name}</strong></>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedInvestment && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Minimum Investment</p>
                  <p className="font-semibold">{formatCurrency(selectedInvestment.minimumInvestment)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Expected Return</p>
                  <p className="font-semibold text-green-600">{selectedInvestment.expectedReturn}% p.a.</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="units">Number of Units</Label>
                <Input
                  id="units"
                  type="number"
                  min={1}
                  max={selectedInvestment.availableSlots}
                  value={units}
                  onChange={(e) => setUnits(Number(e.target.value))}
                />
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Investment</span>
                  <span className="text-xl font-bold text-primary">
                    {formatCurrency(selectedInvestment.minimumInvestment * units)}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubscribeDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmSubscription}>
              Confirm Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AvailableInvestments
