import React from 'react'
import { Navigate, Outlet } from 'react-router';

const PrivateRoute = ({isAuthorized}) => {
    return (
        <>
            {isAuthorized?
                <Outlet />
            :
                <Navigate to={`/sign-in`} />
            }
        </>
    )
}

export default PrivateRoute