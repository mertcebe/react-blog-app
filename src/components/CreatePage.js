import React, { useReducer } from 'react'
import { reducer, setValues } from '../actions/CreateAction';

const CreatePage = () => {
  const initialState = {
    title: "",
    tags: [],
    isTrending: false,
    category: "",
    description: "",
    images: []
  };

  let [state, dispatch] = useReducer(reducer, initialState);

  const submitFunc = (e) => {
    e.preventDefault();
    console.log(state)
    // files kısmını yap
  }
  
  return (
    <>
      <h4 className='text-center'>Create Blog</h4>
      <div className='container d-flex justify-content-center my-4'>
        <form style={{ width: "50%" }} onSubmit={submitFunc}>
          
          <div className="form-group mb-3">
            <input type="text" className="form-control" onChange={(e) => {
              setValues(dispatch, "title", e.target.value);
            }} placeholder="Title" />
          </div>

          <div className="form-group">
            <input type="text" className="form-control" placeholder="Tags" />
          </div>

          <div className='container d-flex justify-content-between my-4'>
            <small>Is it trending blog?</small>
            <div>
              <input type="radio" name='rd1' id='radio1' onChange={(e) => {
                setValues(dispatch, "isTrending", true);
              }}/>
              <label htmlFor="radio1" style={{ marginRight: "10px" }}>yes</label>
              <input type="radio" name='rd1' id='radio2' onChange={(e) => {
                setValues(dispatch, "isTrending", false);
              }}/>
              <label htmlFor="radio2">no</label>
            </div>
          </div>

          <select className="custom-select w-100" onChange={(e) => {
            setValues(dispatch, "category", e.target.value);
          }}>
            <option value="0">Please select categories</option>
            <option value="fashion">Fashion</option>
            <option value="technology">Technology</option>
            <option value="food">Food</option>
            <option value="politics">Politics</option>
            <option value="sports">Sports</option>
            <option value="business">Business</option>
          </select>

          <textarea onChange={(e) => {
            setValues(dispatch, "description", e.target.value);
          }} style={{ width: "100%", height: "150px", maxHeight: "260px", minHeight: "100px", margin: "20px 0" }} placeholder='message'></textarea>

          <input type="file" multiple accept='.jpg, .png, .jpeg' onChange={(e) => {
            setValues(dispatch, "images", e.target.files);
          }} style={{width: "100%", boxShadow: "3px 3px 1px #efefef"}}/>
          <div className='d-flex justify-content-center'>
            <button type="submit" className="btn btn-sm btn-warning text-light px-4 my-4">Create blog</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default CreatePage