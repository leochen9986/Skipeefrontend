import React, { useEffect, useState } from 'react'
import './ApplyForm.css'
import '../event/events.scss'
import loginBg from 'src/assets/images/login_image.png'
import { CButton, CForm, CFormInput, CFormSelect } from '@coreui/react'
import { cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { AuthApiController } from '../../../api/AuthApiController'
import { useNavigate } from 'react-router-dom'
import { VenuApiController } from '../../../api/VenuApiController'
import { storage } from '../../../firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { toast } from 'react-toastify'

// const ApplyForm = () => {

//     const [name, setName] = useState('');
//     const [file, setFile] = useState(null)
//     const [phone, setPhone] = useState('')
//     const [imageUrl, setImageUrl] = useState(null)
//     const [email, setEmail] = useState('')

//     const nav = useNavigate();

//     useEffect (()=>{
//         new AuthApiController().getProfile().then((res)=>{
//             if(res.message){
//                 toast.error(res.message)
//                 new AuthApiController().logout();
//             }else{
//                 if(res && res.worksIn){
//                     nav('/dashboard')
//                 }
//                 // console.log(res)
//             }
//         })
//     }, [])
//     const handleFireBaseUpload = async (e) => {

//         e.preventDefault()
//         console.log('start of upload')
//         if (file === null) {
//           toast.error('No event image selected')
//           return
//         }
//         // async magic goes here...
//         if (file === '') {
//           toast.error(`not an image, the image file is a ${typeof file}`)
//         }

//         toast.info('Hold on we are creatign events for you...')
//         const currentTime = Date.now()
//         const uploadref = ref(storage, `/images/${currentTime}_${file.name}`)
//         await uploadBytes(uploadref, file).then((snapshot) => {
//           console.log(snapshot)
//           //set image url now
//           // form publicly usable url here and then only add it to setImageUrl
//           getDownloadURL(snapshot.ref).then((url) => {
//             setImageUrl(url)
//             handleSubmit(url);
//           })
//         })
//       }

//     const handleSubmit = async (logo) => {

//         if (!name) {
//             toast.warning('Please enter your name')
//             return
//         }

//         if (!email) {
//             toast.warning('Please enter your email')
//             return
//         }

//         if (!phone) {
//             toast.warning('Please enter your phone number')
//             return
//         }

//         new VenuApiController().createVenue({name, email, phone, logo}).then((res)=>{
//             if(res.message){
//                 toast.error(res.message)
//             }else{
//                 nav('/dashboard')
//             }
//         })

//         // new AuthApiController().register({ firstName, lastName, email, password })

//     }
//   return (
//     <div className="apply-container" style={{ backgroundImage: `url(${loginBg})`, backgroundSize:'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' }}>
//       <div className="apply-form">
//         <h1 className="logo">Skipee</h1>
//         <h2>Apply</h2>
//         <p>Add your new organization now. You'll be able to set up an event in just a minute</p>

//         <CForm className="w-80 px-4">
//             <div>
//                 <h3 className="input-lbl-md">Organizer Name</h3>
//                 <CFormInput
//                     onChange={(e) => setName(e.target.value)}
//                     value={name}
//                     placeholder="Enter organizer name"
//                     autoComplete="organizer-name"
//                     size="lg"
//                     className="input-comp-md"
//                     />
//             </div>

//             <div>
//                 <h3 className="input-lbl-md">Organizer Email</h3>
//                 <CFormInput
//                     onChange={(e) => setEmail(e.target.value)}
//                     value={email}
//                     type='email'
//                     placeholder="Enter organizer email"
//                     autoComplete="organizer-email"
//                     size="lg"
//                     className="input-comp-md"
//                     />
//             </div>
//             <div>
//                 <h3 className="input-lbl-md">Phone Number</h3>
//                 <CFormInput
//                     onChange={(e) => setPhone(e.target.value)}
//                     value={phone}
//                     placeholder="Enter phone number"
//                     autoComplete="phone-number"
//                     size="lg"
//                     className="input-comp-md"
//                     />
//             </div>
//           <div className="mt-4 image-upload-container">
//             <h3 className="input-lbl-md">Organizer Logo</h3>
//             <div className="image-upload-box">
//               <CIcon
//                 style={{
//                   position: 'absolute',
//                   top: '10px',
//                   right: '10px',
//                   cursor: 'pointer',
//                   color: 'red',
//                 }}
//                 icon={cilTrash}
//                 size="xl"
//                 onClick={() => setFile(null)}
//               />
//               {file ? (
//                 <img src={URL.createObjectURL(file)} alt="Logo" className="uploaded-image" />
//               ) : (
//                 <p>
//                   Images can be up to 1MB, Accepted Format(s) .jpg, .png, .gif <br /> and Size(s):
//                   312px by 312px
//                 </p>
//               )}
//               <label htmlFor="file-upload" className="upload-label">
//                 Upload Logo
//               </label>
//               <CFormInput
//                 type="file"
//                 id="file-upload"
//                 onChange={(e) => setFile(e.target.files[0])}
//                 accept=".jpg,.png,.gif"
//                 className="file-input"
//               />
//             </div>
//           </div>

//           <CButton color="success" className="mt-4 w-80 text-white" onClick={handleFireBaseUpload}>Apply Now</CButton>
//         </CForm>
//       </div>
//     </div>
//   );
// }

const ApplyForm = ({ onError }) => {
  const [name, setName] = useState('')
  const [file, setFile] = useState(null)
  const [phone, setPhone] = useState('')
  const [imageUrl, setImageUrl] = useState(null)
  const [category, setCategory] = useState('')
  const [email, setEmail] = useState('')

  const nav = useNavigate()

  useEffect(() => {
    new AuthApiController()
      .getProfile()
      .then((res) => {
        if (res.message) {
          toast.error(res.message)
          new AuthApiController().logout()
          nav('/register?step=0')
        } else {
          if (res && res.worksIn) {
            nav('/dashboard')
          }
          // console.log(res)
        }
      })
      .catch((err) => {
        console.log(err)
        onError()
      })
  }, [])
  const handleFireBaseUpload = async (e) => {
    e.preventDefault()
    console.log('start of upload')
    if (file === null) {
      toast.error('No event image selected')
      return
    }
    // async magic goes here...
    if (file === '') {
      toast.error(`not an image, the image file is a ${typeof file}`)
    }

    toast.info('Hold on we are creating your page...')
    const currentTime = Date.now()
    const uploadref = ref(storage, `/images/${currentTime}_${file.name}`)
    await uploadBytes(uploadref, file).then((snapshot) => {
      console.log(snapshot)
      //set image url now
      // form publicly usable url here and then only add it to setImageUrl
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrl(url)
        handleSubmit(url)
      })
    })
  }

  const handleSubmit = async (logo) => {
    if (!name) {
      toast.warning('Please enter your name')
      return
    }

    if (!email) {
      toast.warning('Please enter your email')
      return
    }

    if (!phone) {
      toast.warning('Please enter your phone number')
      return
    }

    new VenuApiController().createVenue({ name, email, phone, logo }).then((res) => {
      if (res.message) {
        toast.error(res.message)
      } else {
        nav('/dashboard')
      }
    })

    // new AuthApiController().register({ firstName, lastName, email, password })
  }
  return (
    <div>
      <h1 className="logo">Skipee</h1>
      <h2 className="text-center">Apply</h2>
      <p className="text-center">
        Add your new organization now. You'll be able to set up an event in just a minute
      </p>

      <CForm className="w-80 px-4">
        <div>
          <h3 className="input-lbl-md">Organizer Name</h3>
          <CFormInput
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="Enter organizer name"
            autoComplete="organizer-name"
            size="lg"
            className="input-comp-md"
          />
        </div>

        <div className="mt-4">
          <h3 className="input-lbl-md">Organizer Email</h3>
          <CFormInput
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            placeholder="Enter organizer email"
            autoComplete="organizer-email"
            size="lg"
            className="input-comp-md"
          />
        </div>
        <div className="mt-4">
          <h3 className="input-lbl-md">Phone Number</h3>
          <CFormInput
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
            placeholder="Enter phone number"
            autoComplete="phone-number"
            size="lg"
            className="input-comp-md"
          />
        </div>
        <div>
          <h3 className="input-lbl-md">Category</h3>
          <CFormSelect
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            options={[
              'Select a category',
              { label: 'Club', value: 'club' },
              { label: 'Pub', value: 'pub' },
              { label: 'Restaurant', value: 'restaurant' },
              { label: 'Bingo', value: 'bingo' },
              { label: 'Other', value: 'other' },
            ]}
            className="input-comp-md"
          />
        </div>
        <div className="mt-4 image-upload-container">
          <h3 className="input-lbl-md">Organizer Logo</h3>
          <div className="image-upload-box">
            <CIcon
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                cursor: 'pointer',
                color: 'red',
              }}
              icon={cilTrash}
              size="xl"
              onClick={() => setFile(null)}
            />
            {file ? (
              <img src={URL.createObjectURL(file)} alt="Logo" className="uploaded-image" />
            ) : (
              <p>
                Images can be up to 1MB, Accepted Format(s) .jpg, .png, .gif <br /> and Size(s):
                312px by 312px
              </p>
            )}
            <label htmlFor="file-upload" className="upload-label">
              Upload Logo
            </label>
            <CFormInput
              type="file"
              id="file-upload"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".jpg,.png,.gif"
              className="file-input"
            />
          </div>
        </div>

        <CButton color="success" className="mt-4 w-80 text-white" onClick={handleFireBaseUpload}>
          Apply Now
        </CButton>
      </CForm>
    </div>
  )
}

export default ApplyForm
