import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import database from '../firebase/firebaseConfig'
import DailyBlogs from './DailyBlogs';

const BlogsOrderByTags = () => {
    let {tag} = useParams();
    let [blogs, setBlogs] = useState();
    useEffect(() => {
        getDocs(query(collection(database, `allBlogs`), where('tags', 'array-contains', `${tag}`)))
            .then((snapshot) => {
                let blogs = [];
                snapshot.forEach((blog) => {
                    blogs.push(blog.data());
                })
                setBlogs(blogs);
            })
    }, []);
    if (!blogs) {
        return (
            <></>
        )
    }
    return (
        <div className='container'>
            <small className='d-block m-4'><b>'{tag}' related blogs</b></small>
            <DailyBlogs blogs={blogs}/>
        </div>
    )
}

export default BlogsOrderByTags