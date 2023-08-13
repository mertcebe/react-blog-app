import React from 'react'
import Moment from 'react-moment';
import { NavLink } from 'react-router-dom';
import { auth } from '../firebase/firebaseConfig';
import { deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import database from '../firebase/firebaseConfig'

const Blog = ({ blog }) => {
    const deleteBlog = () => {
        deleteDoc(doc(database, `userBlogs/${auth.currentUser.uid}/blogs/${blog.id}`))
            .then(() => {
                deleteDoc(doc(database, `allBlogs/${blog.id}`))
                    .then(() => {
                        toast.warning("Successfully deleted!");
                    })
            })
        document.getElementById(blog.id).remove();
    }
    return (
        <div className='d-flex mb-4' id={`${blog.id}`} style={{ width: "800px", boxShadow: "2px 2px 2px #efefef", boxSizing: "border-box", padding: "10px" }}>
            <img src={blog.images[0].src} alt="" style={{ width: "300px", marginRight: "14px" }} />
            <div className='d-flex' style={{ width: "500px", flexDirection: "column", alignItems: "flex-start", justifyContent: "space-between" }}>
                <span class="badge bg-primary d-block my-0">{blog.tags[0]}</span>
                <p className='d-block my-0'><b>{blog.title}</b></p>
                <small className='d-block'><b style={{ fontSize: "12px" }}>{blog.owner}</b> - <Moment fromNow style={{ color: "gray" }}>{blog.dateAdded}</Moment></small>
                <small className='d-block text-muted'>{(blog.description).slice(0, 70)}{blog.description.length > 70?"...":""}</small>
                <div className='d-flex justify-content-between align-items-center w-100'>
                    <NavLink to={`/details/${blog.id}`} className='btn btn-sm btn-secondary' style={{ borderRadius: "0" }}>Read More</NavLink>
                    {
                        auth.currentUser.uid === blog.uid ?
                            <div className='d-flex'>
                                <NavLink to={`/edit/${blog.id}`} className='btn border-0 p-0' style={{ marginRight: "10px" }}><i class="fa-solid fa-pen"></i></NavLink>
                                <button className='btn border-0 p-0' onClick={deleteBlog}><i class="fa-solid fa-trash text-danger"></i></button>
                            </div>
                            :
                            <></>
                    }
                </div>
            </div>
        </div>
    )
}

export default Blog