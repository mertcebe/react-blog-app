import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import database from '../firebase/firebaseConfig'
import DailyBlogs from './DailyBlogs';
import Moment from 'react-moment';
import { NavLink } from 'react-router-dom';

const MostPopularBlogs = ({all}) => {
    let [blogs, setBlogs] = useState();
    const getMostPopularBlogs = () => {
        let blogs = [];
        getDocs(query(collection(database, `allBlogs`), orderBy('likes', 'desc'), where('likes', '!=', 0), all?limit():limit(5)))
            .then((snapshot) => {
                snapshot.forEach((blog) => {
                    blogs.push({
                        ...blog.data(),
                        id: blog.id
                    });
                });
                setBlogs(blogs);
            })
    }
    useEffect(() => {
        getMostPopularBlogs();
    })
    if (!blogs) {
        return (
            <h5>loading...</h5>
        )
    }
    return (
        <div>
            {
                blogs.map((blog) => {
                    return (
                        <NavLink to={`/details/${blog.id}`} style={{textDecoration: "none"}}>
                            <div className='d-flex mb-3'>
                                <div style={{ width: "90px", marginRight: "10px" }}>
                                    <img src={blog.images[0].src} alt="" style={{ width: "100%", height: "60px" }} />
                                </div>
                                <div className='d-flex justify-content-between w-100'>
                                    <div>
                                        <small className='d-block text-dark'><b>{blog.title}</b></small>
                                        <small className='d-block text-muted' style={{ fontSize: "10px" }}><Moment calendar>{blog.dateAdded}</Moment></small>
                                    </div>
                                    <p style={{fontSize: "14px"}}><i className="fa-solid fa-heart text-dark"></i><b className='text-dark'>{blog.likes}</b></p>
                                </div>
                            </div>
                        </NavLink>
                    )
                })
            }
        </div>
    )
}

export default MostPopularBlogs