import React, { useEffect, useState } from 'react'
import DailyBlogs from './DailyBlogs'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import database, { auth } from '../firebase/firebaseConfig'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Scrollbar, A11y, EffectFade, Autoplay, EffectCube, EffectCoverflow, EffectCards } from 'swiper/modules';
import { NavLink } from 'react-router-dom';

import "swiper/css/effect-coverflow";
// import "swiper/components/navigation/navigation.scss";
// import "swiper/components/pagination/pagination.scss";
// import "swiper/components/effect-coverflow/effect-coverflow.scss";


const HomePage = () => {
  let [blogs, setBlogs] = useState();
  let [trendBlogs, setTrendBlogs] = useState();
  useEffect(() => {
    const getBlogs = async () => {
      getDocs(query(collection(database, `allBlogs`), orderBy("dateAdded", "desc")))
        .then((snapshot) => {
          let blogs = [];
          snapshot.forEach((blog) => {
            blogs.push({
              ...blog.data(),
              id: blog.id
            });
          })
          setBlogs(blogs);
        })
    }
    const getTrendBlogs = async () => {
      getDocs(query(collection(database, `allBlogs`), orderBy("dateAdded", "desc")))
        .then((snapshot) => {
          let blogs = [];
          snapshot.forEach((blog) => {
            if (blog.data().isTrending === true) {
              blogs.push({
                ...blog.data(),
                id: blog.id
              });
            }
          })
          console.log(blogs)
          setTrendBlogs(blogs);
        })
    }
    getTrendBlogs();
    getBlogs();
  }, []);
  if (!blogs || !trendBlogs) {
    return (
      <h5>loading...</h5>
    )
  }
  return (
    <div>
      <p>Trend Blogs</p>
      <Swiper
        pagination={{ clickable: true }}
        effect="coverflow"
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: false
        }}
        slidesPerView={2}
        centeredSlides
        style={{ height: "500px" }}
      >
        {trendBlogs.map((item) => {
          return (
            <SwiperSlide key={item.id} style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "18px",
              fontSize: "22px",
              fontWeight: "bold",
              color: "#fff"
            }}>
              <NavLink to={`/details/${item.id}`}>
                <div style={{ position: "relative",width: "700px", height: "400px", background: `url(${item.images[0].src}) center no-repeat`, backgroundSize: "cover" }}>
                  <div style={{position: "absolute", left: "50%", bottom: "0", transform: "translateX(-50%)"}}>
                    <small className='d-block text-light m-0 p-0' style={{fontSize: "20px", textShadow: "1px 1px 2px #000"}}>{item.title}</small>
                    <small className='text-light' style={{fontSize: "12px"}}>by {item.owner}</small>
                  </div>
                </div>
              </NavLink>
            </SwiperSlide>
          )
        })}
      </Swiper>
      <p className='mt-4'>Daily Blogs</p>
      <hr />
      <DailyBlogs blogs={blogs} />
    </div >
  )
}

export default HomePage