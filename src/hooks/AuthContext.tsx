import React, { createContext, useState } from 'react'


export const UserContext = createContext(null);

const AuthContext = ({ children }) => {
  const [credentials, setCredentials] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );
  return (
    <UserContext.Provider value={{ credentials, setCredentials }}>
      {children}
    </UserContext.Provider>
  )
}

export default AuthContext