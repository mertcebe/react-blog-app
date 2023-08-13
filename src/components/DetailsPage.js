import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import database, { auth } from '../firebase/firebaseConfig';
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Scrollbar, A11y, EffectFade, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Moment from 'react-moment';
import { NavLink } from 'react-router-dom';

const DetailsPage = () => {
    let { id } = useParams();
    let [blog, setBlog] = useState();
    useEffect(() => {
        const getBlog = () => {
            getDoc(doc(database, `allBlogs/${id}`))
                .then((snapshot) => {
                    setBlog({
                        ...snapshot.data(),
                        id: snapshot.id
                    });
                })
        }
        getBlog();
    }, []);
    if (!blog) {
        return (
            <h5>loading...</h5>
        )
    }
    return (
        <div style={{ position: "relative" }}>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, Autoplay, EffectFade]}
                spaceBetween={50}
                slidesPerView={1}
                autoplay={{ delay: 4000 }}
            >
                {blog.images.map((item) => {
                    return (
                        <SwiperSlide key={item.id}>
                            <div className='w-100' style={{ height: "400px", background: `url(${item.src}) center no-repeat`, backgroundSize: "cover", filter: "brightness(0.5)" }}>
                            </div>
                        </SwiperSlide>
                    )
                })}
            </Swiper>
            <div className="container">
                <p style={{ position: "absolute", zIndex: "100", fontSize: "34px", left: "50%", top: "320px", transform: "translateX(-50%)", color: "white" }}>{blog.title}</p>
                <small className='d-block my-3'><b style={{ fontSize: "14px" }}>By <NavLink to={`/profile/${blog.uid}`} style={{textDecoration: "none", color: "ThreeDDarkShadow"}}>{blog.owner}</NavLink></b> - <Moment calendar style={{ color: "gray" }}>{blog.dateAdded}</Moment></small>
                <span>{blog.likes}</span>
                <hr />
                <small className='d-block text-muted'>{blog.description}</small>
            </div>
        </div>
    )
}

export default DetailsPage