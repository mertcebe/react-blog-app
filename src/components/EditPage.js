import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import database, { auth } from '../firebase/firebaseConfig'
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import CreatePage from './CreatePage';

const EditPage = () => {
    let { id } = useParams();
    let [editBlog, setEditBlog] = useState();
    let navigate = useNavigate();
    useEffect(() => {
        const getBlog = async () => {
            getDoc(doc(database, `userBlogs/${auth.currentUser.uid}/blogs/${id}`))
                .then((snapshot) => {
                    if (snapshot) {
                        setEditBlog(snapshot.data());
                    }
                    else{
                        toast.error("You can't edit this blog!");
                        navigate(`/`);
                    }
                })
        };
        getBlog();
    }, []);
    if(!editBlog){
        return (
            <h4>loading...</h4>
        )
    }
    return (
        <CreatePage editBlog={editBlog} id={id}/>
    )
}

export default EditPage