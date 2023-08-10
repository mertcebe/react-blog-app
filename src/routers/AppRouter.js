import React from 'react'
import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom'
import '../style/style.scss'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/firebaseConfig'
import { useAuthorized } from '../components/useAuthorized'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from '../components/PrivateRoute'
import HomePage from '../components/HomePage'
import CreatePage from '../components/CreatePage'
import AboutPage from '../components/AboutPage'
import PublicRoute from '../components/PublicRoute'
import SignInPage from '../components/SignInPage'
import profileImg from '../images/blogAppprofileImg.png'

const Navbar = () => {
    let { isAuthorized } = useAuthorized();
    console.log(auth.currentUser)
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
                <Link to={`/`} className="navbar-brand">Blog App</Link>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto w-100 d-flex justify-content-between px-3">
                        <div className='d-flex align-items-center'>
                            <li className="nav-item">
                                <NavLink to={`/`} className="nav-link">Home</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to={`/create`} className="nav-link">Create</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to={`/about`} className="nav-link">About</NavLink>
                            </li>
                        </div>
                        <li className="nav-item">
                            {isAuthorized ?
                                <div className='d-flex align-items-center'>
                                    <NavLink to={`/profile`} style={{textDecoration: "none", marginRight: "10px"}}>
                                        <img src={profileImg} alt="..." style={{width: "25px", height: "25px", borderRadius: "50%", marginRight: "5px"}}/>
                                        <small style={{color: "black", display: "inline-block", position: "relative", top: "2px"}}>{auth.currentUser.displayName}</small>
                                    </NavLink>
                                    <button className='nav-link' onClick={() => {
                                        signOut(auth);
                                    }}>Sign Out</button>
                                </div>
                                : <NavLink to={`/sign-in`} className="nav-link">Sign In</NavLink>}
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    )
}

const AppRouter = () => {
    let { isAuthorized } = useAuthorized();
    console.log(auth.currentUser)
    return (
        <>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route element={<PrivateRoute isAuthorized={isAuthorized}/>}>
                        <Route path='/' element={<HomePage />} />
                        <Route path='/create' element={<CreatePage />} />
                        <Route path='/about' element={<AboutPage />} />
                    </Route>

                    <Route element={<PublicRoute isAuthorized={isAuthorized}/>}>
                        <Route path='/sign-in' element={<SignInPage active={"signIn"} />} />
                        <Route path='/register' element={<SignInPage active={"register"} />} />
                        <Route path='/forgot-password' element={<SignInPage active={"forgot"} />} />
                    </Route>
                </Routes>
            </BrowserRouter>
            <ToastContainer
                position="bottom-left"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
        </>
    )
}

export default AppRouter