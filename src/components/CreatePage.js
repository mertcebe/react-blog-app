import React, { useReducer, useState } from 'react'
import { reducer, setValues } from '../actions/CreateAction';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth } from '../firebase/firebaseConfig';
import { addDoc, collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import database from '../firebase/firebaseConfig'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import { TagsInput } from "react-tag-input-component";
import gif from '../images/creatingGif.gif'

const CreatePage = ({ editBlog, id }) => {
  const [selected, setSelected] = useState(editBlog ? editBlog.tags : []);
  const [loading, setLoading] = useState(true);
  const [editImg, setEditImg] = useState(false);

  const initialState = {
    title: editBlog ? editBlog.title : "",
    tags: editBlog ? editBlog.tags : [],
    isTrending: editBlog ? editBlog.isTrending : false,
    category: editBlog ? editBlog.category : "null",
    description: editBlog ? editBlog.description : "",
    images: editBlog ? editBlog.images : [],
    dateAdded: editBlog ? editBlog.dateAdded : "",
    owner: editBlog ? editBlog.owner : "",
    uid: editBlog ? editBlog.uid : ""
  };
  let [state, dispatch] = useReducer(reducer, initialState);

  let navigate = useNavigate();

  const submitFunc = (e) => {
    setLoading(false)
    e.preventDefault();
    state.tags = selected;
    if (editBlog) {
      if (!editImg) {
        state.dateAdded = new Date().getTime();
        updateDoc(doc(database, `allBlogs/${id}`), state)
          .then(() => {
            updateDoc(doc(database, `userBlogs/${state.uid}/blogs/${id}`), state)
              .then(() => {
                setLoading(true);
                toast.success("Successfully edited!");
                navigate(`/profile/${auth.currentUser.uid}`);
              })
          })
      }
      else {
        submitImageToStorage(state.images)
          .then(async (snapshot) => {
            state.images = await snapshot;
            state.dateAdded = new Date().getTime();
            state.owner = auth.currentUser.displayName;
            state.uid = auth.currentUser.uid;
            setTimeout(() => {
              updateDoc(doc(database, `allBlogs/${id}`), state)
                .then(() => {
                  updateDoc(doc(database, `userBlogs/${state.uid}/blogs/${id}`), state)
                    .then(() => {
                      setLoading(true);
                      toast.success("Successfully edited!");
                      navigate(`/profile/${auth.currentUser.uid}`);
                    })
                })
            }, 2000);
          })
      }
    }
    else {
      submitImageToStorage(state.images)
        .then(async (snapshot) => {
          state.images = await snapshot;
          state.dateAdded = new Date().getTime();
          state.owner = auth.currentUser.displayName;
          state.uid = auth.currentUser.uid;
          setTimeout(() => {
            addDoc(collection(database, `userBlogs/${auth.currentUser.uid}/blogs`), state)
              .then((snapshot) => {
                setDoc(doc(database, `allBlogs/${snapshot.id}`), state)
              })
              .then(() => {
                toast.success("Created a blog!");
                setLoading(true);
                navigate(`/`);
              })
          }, 3000);
        })
    }
  }

  const submitImageToStorage = async (files) => {
    return new Promise((resolve, reject) => {

      const storage = getStorage();
      let images = [];

      files.map(async (file) => {
        let { self, name, type } = file;
        const metadata = {
          contentType: type
        };

        const storageRef = ref(storage, 'imagesForBlogApp/' + `${auth.currentUser.uid}-${name}`);
        const uploadTask = await uploadBytesResumable(storageRef, self, metadata).then(async (snapshot) => {
          await getDownloadURL(snapshot.ref).then((downloadURL) => {
            images.push({
              name: name,
              src: downloadURL
            });
            if (files[files.length - 1] === file) {
              resolve(images);
            }
          })
        })

      })

    })
  }
  if (!loading) {
    return (
      <div className='d-flex justify-content-center align-items-center w-100' style={{ height: "90vh" }}>
        <img src={gif} alt="" style={{ width: "20%" }} />
      </div>
    )
  }
  return (
    <>
      <h4 className='text-center'>{editBlog?"Edit":"Create"} Blog</h4>
      <div className='container d-flex justify-content-center my-4'>
        <form id='createForm' style={{ width: "50%" }} onSubmit={submitFunc}>

          <div className="form-group mb-3">
            <input type="text" className="form-control" defaultValue={state.title} required onChange={(e) => {
              setValues(dispatch, "title", e.target.value);
            }} placeholder="Title" />
          </div>

          <div className="form-group">
            <div>
              <TagsInput
                classNames={"form-control"}
                value={selected}
                onChange={setSelected}
                name="tags"
                placeHolder="enter tags"
              />
            </div>
          </div>

          <div className='container d-flex justify-content-between my-4'>
            <small>Is it trending blog?</small>
            <div>
              <input type="radio" name='rd1' id='radio1' defaultChecked={state.isTrending ? true : false} onChange={(e) => {
                setValues(dispatch, "isTrending", true);
              }} />
              <label htmlFor="radio1" style={{ marginRight: "10px" }}>yes</label>
              <input type="radio" name='rd1' id='radio2' defaultChecked={state.isTrending ? false : true} onChange={(e) => {
                setValues(dispatch, "isTrending", false);
              }} />
              <label htmlFor="radio2">no</label>
            </div>
          </div>

          <select className="custom-select w-100" defaultValue={state.category} onChange={(e) => {
            setValues(dispatch, "category", e.target.value);
          }}>
            <option value="null">Please select categories</option>
            <option value="fashion">Fashion</option>
            <option value="technology">Technology</option>
            <option value="food">Food</option>
            <option value="politics">Politics</option>
            <option value="sports">Sports</option>
            <option value="business">Business</option>
          </select>

          <textarea id='myTeaxtArea' defaultValue={state.description} onChange={(e) => {
            setValues(dispatch, "description", e.target.value);
          }} style={{ width: "100%", height: "150px", maxHeight: "260px", minHeight: "100px", margin: "20px 0" }} placeholder='message'></textarea>

          {
            editBlog ?
              <small className='text-muted'><i>If you choose a new file or files, your previous files will disappear. If you don't, your previous files will load again!</i></small>
              :
              <></>
          }
          <input type="file" required={editBlog ? false : true} multiple accept='.jpg, .png, .jpeg' onChange={(e) => {
            let images = [];
            for (let file of e.target.files) {
              images.push({
                self: file,
                name: file.name,
                type: file.type
              });
            }
            setValues(dispatch, "images", images);
            setEditImg(true);
          }} style={{ width: "100%", boxShadow: "3px 3px 1px #efefef" }} />
          <div className='d-flex justify-content-center'>
            <button type="submit" className="btn btn-sm btn-warning text-light px-4 my-4">{editBlog?"Edit":"Create"} blog</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default CreatePage