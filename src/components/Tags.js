import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import database from '../firebase/firebaseConfig'
import { NavLink } from 'react-router-dom';

const Tags = ({val}) => {
    let [tags, setTags] = useState();
    useEffect(() => {
        getDocs(query(collection(database, `allBlogs`), val&&limit(val)))
        .then((snapshot) => {
            let blogs = [];
            snapshot.forEach((blog) => {
                blogs.push(...blog.data().tags);
            })
            setTags(Array.from(new Set(blogs)));
        })
    }, []);
    console.log(tags)
    if(!tags){
        return (
            <></>
        )
    }
    return (
        <div className='d-flex' style={{flexWrap: "wrap"}}>
            {
                tags.map((tag) => {
                    return (
                        <NavLink to={`/tags/${tag}`} style={{textDecoration: "none", fontSize: "16px", backgroundColor: "#efefef", margin: "5px", padding: "5px 10px", color: "#000"}}>
                            {tag}
                        </NavLink>
                    )
                })
            }
        </div>
    )
}

export default Tags