import { Link, Outlet, useLocation } from 'react-router-dom'

const Statements = () => {
const {pathname}= useLocation()
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-5">
        <h1 className="text-3xl font-bold text-foreground">Statements</h1>
      </div>
      <div className="flex gap-3 items-center">
      <Link to='' className={ pathname === '/dashboard/statements' ? 'bg-gradient-primary active-selector' : 'inactive'}>
      Saving statement</Link>
      <Link to='loan-statement' className={ pathname === '/dashboard/statements/loan-statement' ? 'bg-gradient-primary active-selector' : 'inactive'}>Loan statement</Link>
    </div>
    <Outlet/>
      </div>
  )
}

export default Statements