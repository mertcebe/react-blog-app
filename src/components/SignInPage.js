import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { auth } from '../firebase/firebaseConfig';
import { toast } from 'react-toastify';
import { addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import database from '../firebase/firebaseConfig'

const SignInPage = ({ active }) => {
    let [name, setName] = useState();
    let [email, setEmail] = useState();
    let [password, setPassword] = useState();

    let navigate = useNavigate();

    const signInFunc = (e) => {
        e.preventDefault();
        if (email && password) {
            signInWithEmailAndPassword(auth, email, password)
                .then(async (userCredentials) => {
                    await getDoc(doc(database, `users/${userCredentials.user.uid}`))
                        .then((snapshot) => {
                            if (snapshot.exists()) {
                                toast.success(`Successfully signed in, welcome back ${userCredentials.user.displayName}!`);
                            }
                            else {
                                toast.success(`Successfully signed in, welcome ${userCredentials.user.displayName}!`);
                            }
                        })
                    setDoc(doc(database, `users/${userCredentials.user.uid}`), { name: userCredentials.user.displayName, email: userCredentials.user.email, lastAccess: new Date().getTime() });
                    navigate(`/`)
                })
        }
        else {
            toast.error("Please fill the empty inputs!");
        }
    }
    const registerFunc = async (e) => {
        e.preventDefault();
        await createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredentials) => {
                await updateProfile(userCredentials.user, {
                    displayName: name
                })
                await getDoc(doc(database, `users/${userCredentials.user.uid}`))
                    .then((snapshot) => {
                        if (snapshot.exists()) {
                            toast.success(`Successfully signed up, welcome back ${userCredentials.user.displayName}!`);
                        }
                        else {
                            toast.success(`Successfully signed up, welcome ${userCredentials.user.displayName}!`);
                        }
                    })
                setDoc(doc(database, `users/${userCredentials.user.uid}`), { name: userCredentials.user.displayName, email: userCredentials.user.email, lastAccess: new Date().getTime() });
                navigate(`/`)
            })
    }
    const forgotFunc = (e) => {
        e.preventDefault();
        sendPasswordResetEmail(auth, email)
            .then(() => {
                toast.info(`Successfully send reset password email to ${email} account!`);
            })
    }
    return (
        <div className='container d-flex justify-content-center my-3'>
            <form className='w-50' onSubmit={active === "signIn" ? signInFunc : active === "register" ? registerFunc : active === "forgot" && forgotFunc}>
                {
                    active === "forgot" ?
                        <div className="form-group mb-3">
                            <input type="email" className="form-control" onChange={(e) => {
                                setEmail(e.target.value);
                            }} id="exampleInputEmail1" placeholder="Email" />
                        </div>
                        :
                        <>
                            {
                                active === "register" ?
                                    <div className="form-group mb-3">
                                        <input type="text" className="form-control" onChange={(e) => {
                                            setName(e.target.value);
                                        }} placeholder="Full name" />
                                    </div>
                                    :
                                    <></>
                            }
                            <div className="form-group mb-3">
                                <input type="email" className="form-control" onChange={(e) => {
                                    setEmail(e.target.value);
                                }} id="exampleInputEmail1" placeholder="Email" />
                            </div>
                            <div className="form-group mb-4">
                                <input type="password" className="form-control" onChange={(e) => {
                                    setPassword(e.target.value);
                                }} id="exampleInputPassword1" placeholder="Password" />
                            </div>
                        </>

                }

                <div className='d-flex'>
                    {active === "signIn" &&
                        <div className='d-flex justify-content-between w-100'>
                            <small>Don't have an account? <NavLink to={`/register`} style={{ textDecoration: "none", color: "red" }}>register</NavLink></small>
                            <NavLink to={`/forgot-password`} style={{ textDecoration: "none", color: "darkblue", fontSize: "14px" }}>forgot password</NavLink>
                        </div>
                    }
                    {active === "register" &&
                        <div className='d-flex justify-content-between w-100'>
                            <small>Already have an account? <NavLink to={`/sign-in`} style={{ textDecoration: "none", color: "red" }}>sign in</NavLink></small>
                            <NavLink to={`/forgot-password`} style={{ textDecoration: "none", color: "darkblue", fontSize: "14px" }}>forgot password</NavLink>
                        </div>
                    }
                    {active === "forgot" &&
                        <div className='d-flex justify-content-between w-100'>
                            <small>Don't have an account? <NavLink to={`/register`} style={{ textDecoration: "none", color: "red" }}>register</NavLink></small>
                            <small>Instead <NavLink to={`/sign-in`} style={{ textDecoration: "none", color: "red" }}>sign in</NavLink></small>
                        </div>
                    }
                </div>

                <div className='d-flex justify-content-center'>
                    <button type="submit" className="btn btn-sm btn-warning text-light px-4">{active === "signIn" && "Sign In"}{active === "register" && "Sign Up"}{active === "forgot" && "Send Email"}</button>
                </div>
            </form>
        </div>
    )
}

export default SignInPage