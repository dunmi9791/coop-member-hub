import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Building2, MapPin, TrendingUp, Calendar, Users, Loader2 } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { fetchActiveProjects, RealEstateProject } from '@/services/realEstateApi'

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
  const navigate = useNavigate()
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadInvestments = async () => {
      try {
        setLoading(true)
        const response = await fetchActiveProjects()
        
        if (response.error) {
          setError(response.error.message)
          return
        }

        const mappedInvestments: Investment[] = response.result.projects.map((project: RealEstateProject) => ({
          id: project.id,
          name: project.name,
          location: typeof project.location === 'string' ? project.location : 'N/A',
          type: project.type,
          minimumInvestment: 0, // Not provided in API sample, defaulting to 0
          expectedReturn: 0, // Not provided in API sample, defaulting to 0
          duration: 'N/A', // Not provided in API sample, defaulting to N/A
          totalSlots: project.total_units || 0,
          availableSlots: project.available_units || 0,
          image: project.picture_url || '/placeholder.svg',
          status: (project.available_units || 0) > 0 ? 'open' : 'closed',
        }))

        setInvestments(mappedInvestments)
      } catch (err) {
        setError('Failed to load investments. Please try again later.')
        console.error('Error loading investments:', err)
      } finally {
        setLoading(false)
      }
    }

    loadInvestments()
  }, [])

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
    navigate(`/dashboard/real-estate/${investment.id}`)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading investments...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  if (investments.length === 0) {
    return (
      <div className="text-center py-20">
        <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No active real estate investments available at the moment.</p>
      </div>
    )
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
    </div>
  )
}

export default AvailableInvestments
