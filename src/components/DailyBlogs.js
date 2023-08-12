import React from 'react'
import Blog from './Blog'

const DailyBlogs = ({ blogs }) => {
    console.log(blogs)
    return (
        <div>
            <div>
                {
                    blogs.map((blog, index) => {
                        return <Blog blog={blog} key={index} />
                    })
                }
            </div>
        </div>
    )
}

export default DailyBlogs