import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import database, { auth } from '../firebase/firebaseConfig'
import DailyBlogs from './DailyBlogs';
import Moment from 'react-moment';
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Scrollbar, A11y, EffectFade, Autoplay, EffectCube, EffectCoverflow, EffectCards } from 'swiper/modules';
import { NavLink } from 'react-router-dom';

import 'swiper/css';
import "swiper/css/effect-cards";

const ProfilePage = () => {
  let { uid } = useParams();
  let [user, setUser] = useState();
  let [blogs, setBlogs] = useState();
  useEffect(() => {
    const getUser = async () => {
      await getDoc(doc(database, `users/${uid}`))
        .then((snapshot) => {
          console.log(snapshot.data());
          setUser(snapshot.data());
        })
    }
    const getBlogs = async () => {
      getDocs(query(collection(database, `userBlogs/${uid}/blogs`), orderBy("dateAdded", "desc")))
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
    getBlogs();
    getUser();
  }, []);
  if (!user || !blogs) {
    return (
      <h5>loading...</h5>
    )
  }
  return (
    <div className='container d-flex align-items-baseline my-4'>
      <div style={{ width: "18rem" }}>
        <div className="card-body">
          <h5 className="card-title">{user.name}</h5>
          <p className="card-text">{user.email}</p>
          <small>{user.name} went online <Moment fromNow>{user.lastAccess}</Moment></small>
        </div>
      </div>
      <div>
        <h5 className='my-2'>Blogs</h5>
        <DailyBlogs blogs={blogs} />
        {/* <Swiper
          style={{ width: "300px", height: "400px" }}
          modules={[EffectCards]}
          effect={'cards'}
          grabCursor={true}
        >
          {blogs.map((item) => {
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
                  <div style={{ width: "300px", height: "400px", background: `url(${item.images[0].src}) center no-repeat` }}>
                  </div>
                </NavLink>
              </SwiperSlide>
            )
          })}
        </Swiper> */}
      </div>
    </div>
  )
}

export default ProfilePage