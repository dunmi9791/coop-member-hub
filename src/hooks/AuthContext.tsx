import { MemberDashboardResponse } from '@/pages/Index';
import React, { createContext, useState } from 'react'


export const UserContext = createContext(null);

const AuthContext = ({ children }) => {
  const [details, setDetails] =useState<MemberDashboardResponse | null>(null)
  const [credentials, setCredentials] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );
  return (
    <UserContext.Provider value={{ credentials, setCredentials, details, setDetails }}>
      {children}
    </UserContext.Provider>
  )
}

export default AuthContext