import { CButton, CCol, CForm, CFormCheck, CFormInput, CFormTextarea, CRow } from '@coreui/react'
import React, { useState, useEffect, useRef } from 'react'
import './events.scss'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import { storage } from '../../../firebase'
import { toast } from 'react-toastify'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { VenuApiController } from '../../../api/VenuApiController'
import { useNavigate, useParams } from 'react-router-dom'
const CreateEvent = () => {
  const [showDescriptionInput, setShowDescriptionInput] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [infinitely, setInfinitely] = useState(true)
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [venueLocation, setVenueLocation] = useState('')
  const [file, setFile] = useState(null)
  const [lastEntryTime, setLastEntryTime] = useState('')
  const [ageRestriction, setAgeRestriction] = useState('')
  const [imageUrl, setImageUrl] = useState(null)
  const [event, setEvent] = useState(null)
  const nav = useNavigate()

  const locationInputRef = useRef(null)

  const { id } = useParams()

  const submitEvent = async (url) => {
    console.log('submitting event')
    const eventBody = {
      name,
      description,
      date,
      startTime,
      endTime,
      endDate: infinitely ?  new Date('2028-01-01').setHours(23, 59, 59) :null,
      location: venueLocation,
      image: url,
      lastEntryTime,
      minAgeLimit: ageRestriction,
    }

    if (event) {
      new VenuApiController().updateEvent(event._id, eventBody).then((res) => {
        console.log(res)
        toast.success('Event updated successfully')
        nav(`/event/detail/${event._id}`)
      })
    } else {
      new VenuApiController().createEvent(eventBody).then(async (res) => {
        console.log(res)
        const confirmSaveTicket = await window.confirm(
          'Event has been saved as a draft. Do you want to continue to create a ticket?',
        )
        if (confirmSaveTicket) {
          toast.success('Event created successfully')
          nav(`/event/create/ticket/${res._id}`)
        } else {
          nav(`/event/detail/${res._id}`)
        }
      })
    }
  }

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

    toast.info('Hold on we are creating events for you...')
    const currentTime = Date.now()
    const uploadref = ref(storage, `/images/${currentTime}_${file.name}`)
    await uploadBytes(uploadref, file).then((snapshot) => {
      console.log(snapshot)
      //set image url now
      // form publicly usable url here and then only add it to setImageUrl
      getDownloadURL(snapshot.ref).then((url) => {
        setImageUrl(url)
        submitEvent(url)
      })
    })
  }

  const checkEventEdit = async () => {
    if (!id) return

    await getEvent()
  }

  const getEvent = async () => {
    new VenuApiController().getEvent(id).then((res) => {
      if (res.message) {
        console.log(res)
        toast.error(res.message)
      } else {
        setEvent(res)
        if (res) {
          setName(res.name)
          setDescription(res.description)
          setDate(res.date.split('T')[0])
          setStartTime(res.startTime)
          setEndTime(res.endTime)
          setInfinitely(res.endDate !== null)
          setVenueLocation(res.location)
          setLastEntryTime(res.lastEntryTime)
          setAgeRestriction(res.minAgeLimit)
          setImageUrl(res.image)
        }
      }
    })
  }

  useEffect(() => {
    checkEventEdit()
    if (window.google && window.google.maps && locationInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(locationInputRef.current)
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        setVenueLocation(place.formatted_address)
      })
    }
  }, [])

  const updateEvent = (e) => {
    console.log('updating event')
    e.preventDefault()

    if (file) {
      handleFireBaseUpload()
    } else {
      submitEvent(imageUrl)
    }
  }

  return (
    <>
      <h2>Create Event</h2>

      <div className="py-5 paper d-flex justify-content-center align-items-center mb-5">
        <CRow className="w-100 justify-content-center">
          <CCol md={9}>
            <CForm>
              <div>
                <h3 className="input-lbl-md">Event Name</h3>
                <CFormInput
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  placeholder="Enter event name"
                  autoComplete="event-name"
                  size="lg"
                  className="input-comp-md"
                />
              </div>
              {showDescriptionInput ? (
                <div className="mt-4">
                  <h3 className="input-lbl-md">Event Description</h3>
                  <CFormTextarea
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    placeholder="Enter event description"
                    autoComplete="event-description"
                    rows={3}
                    size="lg"
                    className="input-comp-md"
                  />
                </div>
              ) : (
                <CButton
                  className="mt-2 text-white"
                  color="success"
                  onClick={() => setShowDescriptionInput(true)}
                >
                  Add Description
                </CButton>
              )}

              <div className="mt-4">
                <h3 className="input-lbl-md">Date</h3>

                <CRow className="d-flex justify-content-between align-items-center">
                  <CCol md={7}>
                    <p style={{ margin: 0, padding: 0 }}>Start Date</p>
                    <CFormInput
                      type="date"
                      onChange={(e) => setDate(e.target.value)}
                      value={date}
                      placeholder="Enter event date"
                      size="lg"
                      className="input-comp-md"
                    />
                  </CCol>

                  <CCol md={5} className="d-flex justify-content-between">
                    <div>
                      <p style={{ margin: 0, padding: 0 }}>Start Time</p>
                      <CFormInput
                        type="time"
                        onChange={(e) => setStartTime(e.target.value)}
                        value={startTime}
                        placeholder="Enter event start time"
                        size="lg"
                        className="input-comp-md"
                      />
                    </div>
                    &nbsp; &nbsp;
                    <div>
                      <p style={{ margin: 0, padding: 0 }}>End Time</p>
                      <CFormInput
                        type="time"
                        onChange={(e) => setEndTime(e.target.value)}
                        value={endTime}
                        placeholder="Enter event end time"
                        size="lg"
                        className="input-comp-md"
                      />
                    </div>
                  </CCol>
                </CRow>

                <CFormCheck
                  inline
                  value={infinitely}
                  onChange={(e) => setInfinitely(e.target.checked)}
                  label="Run this event infinitely (Skipping Only)"
                  type="checkbox"
                  className="mt-2"
                />
              </div>
              <div className="mt-4">
                <h3 className="input-lbl-md">Last Entry Time</h3>
                <CFormInput
                  type="time"
                  onChange={(e) => {
                    if (
                      new Date(`1970-01-01T${e.target.value}`) > new Date(`1970-01-01T${endTime}`)
                    ) {
                      toast.error('Last entry time cannot be later than the end time')
                      return
                    }
                    setLastEntryTime(e.target.value)
                  }}
                  value={lastEntryTime}
                  placeholder="Enter last entry time"
                  size="lg"
                  className="input-comp-md"
                />
              </div>
              <div className="mt-4">
                <h3 className="input-lbl-md">Venue Location</h3>
                <CFormInput
                  ref={locationInputRef}
                  onChange={(e) => setVenueLocation(e.target.value)}
                  value={venueLocation}
                  placeholder="Enter venue location"
                  autoComplete="off"
                  size="lg"
                  className="input-comp-md"
                />
              </div>
              <div className="mt-4 image-upload-container">
                <h3 className="input-lbl-md">Event Image</h3>
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
                  {file || imageUrl ? (
                    <img
                      src={imageUrl ? imageUrl : URL.createObjectURL(file)}
                      alt="Event"
                      className="uploaded-image"
                    />
                  ) : (
                    <p>
                      Images can be up to 1MB, Accepted Format(s) .jpg, .png, .gif <br /> and
                      Size(s): 1600px by 900px
                    </p>
                  )}
                  <label htmlFor="file-upload" className="upload-label">
                    Upload Image
                  </label>
                  <CFormInput
                    type="file"
                    id="file-upload"
                    onChange={(e) => {
                      setFile(e.target.files[0])
                      setImageUrl(null)
                    }}
                    accept=".jpg,.png,.gif"
                    className="file-input"
                  />
                </div>
                <div className="mt-4">
                  <h2 className="input-lbl"> Further Details</h2>
                </div>

                <div className="mt-4">
                  <h3 className="input-lbl-md">Age Restriction</h3>
                  <CFormInput
                    type="number"
                    onChange={(e) => setAgeRestriction(e.target.value)}
                    value={ageRestriction}
                    placeholder="Enter age restriction"
                    size="lg"
                    className="input-comp-md"
                  />
                </div>
              </div>
              <div className="my-4 d-flex justify-content-end">
                {event ? (
                  <CButton color="success" className="signin-btn px-4 mt-5" onClick={updateEvent}>
                    Update
                  </CButton>
                ) : (
                  <CButton
                    color="success"
                    className="signin-btn px-4 mt-5"
                    onClick={handleFireBaseUpload}
                  >
                    Save and Continue
                  </CButton>
                )}
              </div>
            </CForm>
          </CCol>
        </CRow>
      </div>
    </>
  )
}

export default CreateEvent
