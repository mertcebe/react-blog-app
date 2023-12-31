import React, { useEffect, useState } from 'react'
import ProfilePage from './ProfilePage'
import { collection, getDocs, query } from 'firebase/firestore';
import database, { auth } from '../firebase/firebaseConfig';
import { Navigate, useParams } from 'react-router';

const MyLikesPage = () => {
    let {uid} = useParams();
    let [myLikesBlogs, setMyLikesBlogs] = useState();
    useEffect(() => {
        const getMyLikes = async () => {
            getDocs(query(collection(database, `userBlogs/${auth.currentUser.uid}/myLikes`)))
                .then((snapshot) => {
                    let blogs = [];
                    snapshot.forEach((blog) => {
                        blogs.push({
                            ...blog.data(),
                            id: blog.id
                        });
                    })
                    setMyLikesBlogs(blogs);
                })
        }
        getMyLikes();
    }, []);
    if (!myLikesBlogs) {
        return (
            <h5>loading...</h5>
        )
    }
    else if (auth.currentUser.uid !== uid) {
        return (
            <>
                <Navigate to={`/profile/${uid}`} />
            </>
        )
    }
    return (
        <ProfilePage likes={true} myLikesBlogs={myLikesBlogs} />
    )
}

export default MyLikesPage