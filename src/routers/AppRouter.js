import React, { useEffect, useState } from 'react'
import { BrowserRouter, Link, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import '../style/style.scss'
import { signOut } from 'firebase/auth'
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
import ProfilePage from '../components/ProfilePage'
import { auth } from '../firebase/firebaseConfig'
import DetailsPage from '../components/DetailsPage'
import EditPage from '../components/EditPage'
import TagsPage from '../components/TagsPage'
import BlogsOrderByTags from '../components/BlogsOrderByTags'
import TagsLayout from '../components/TagsLayout'
import MyLikesPage from '../components/MyLikesPage'
import MostPopularPage from '../components/MostPopularPage'

const Navbar = () => {
    let { isAuthorized } = useAuthorized();
    return (
        <div>
            <nav className="navbar navbar-expand-md navbar-light bg-light px-4">
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
                                    <NavLink to={`/profile/${auth.currentUser.uid}`} style={{ textDecoration: "none", marginRight: "10px" }}>
                                        <img src={profileImg} alt="..." style={{ width: "25px", height: "25px", borderRadius: "50%", marginRight: "5px" }} />
                                        <small style={{ color: "black", display: "inline-block", position: "relative", top: "2px" }}>{auth.currentUser.displayName}</small>
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
    if(!isAuthorized){
        return (
            <h5>loading...</h5>
        )
    }
    return (
        <>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route element={<PrivateRoute isAuthorized={isAuthorized} />}>
                        <Route path='/' element={<HomePage />} />
                        <Route path='/details/:id' element={<DetailsPage />} />
                        <Route path='/create' element={<CreatePage />} />
                        <Route path='/about' element={<AboutPage />} />
                        <Route path='/profile/:uid' element={<ProfilePage />} />
                        <Route path='/profile/:uid/likes' element={<MyLikesPage/>} />
                        <Route path='/edit/:id' element={<EditPage />} />
                        <Route path='/tags' element={<TagsLayout />}>
                            <Route index element={<TagsPage />} />
                            <Route path=':tag' element={<BlogsOrderByTags />} />
                        </Route>
                        <Route path='/most-popular-blogs' element={<MostPopularPage />} />
                    </Route>

                    <Route element={<PublicRoute isAuthorized={isAuthorized} />}>
                        <Route path='/sign-in' element={<SignInPage active={"signIn"} />} />
                        <Route path='/register' element={<SignInPage active={"register"} />} />
                        <Route path='/forgot-password' element={<SignInPage active={"forgot"} />} />
                    </Route>
                    {/* <Route path='*' element={<Navigate to={`/`} />} /> */}
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