import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilAddressBook,
  cilCalendar,
  cilDescription,
  cilEnvelopeLetter,
  cilHouse,
  cilImagePlus,
  cilLockLocked,
  cilMoney,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'
import { toast } from 'react-toastify'
import { AuthApiController } from '../../../api/AuthApiController'
import { imgdbApiKey } from '../../../assets/constants/constants'
import axios from 'axios'
import { VenuApiController } from '../../../api/VenuApiController'

const CreateVenue = ({ site }) => {
  const [validated, setValidated] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    const form = event.currentTarget

    if (form.checkValidity() === false) {
      event.stopPropagation()
      setValidated(true)
      return
    }
    const formData = new FormData()
    formData.set('key', imgdbApiKey)
    formData.append('image', event.target.image.files[0])

    const formDataJson = {}
    const realFormData = new FormData(form)
    for (const [key, value] of realFormData.entries()) {
      formDataJson[key] = value
    }

    const imageres = await axios.post('https://api.imgbb.com/1/upload', formData)

    if (imageres.data.data.url === undefined) {
      toast.error(imageres.data.message)
      return
    }

    formDataJson['imageVenue'] = imageres.data.data.url

    new VenuApiController()
      .createVenue(formDataJson)
      .then((res) => {
        toast.success('Venue created successfully')
      })
      .catch((err) => {
        console.log(err)
        toast.error(err.response.data.message)
      })
  }
  return (
    <div className="bg-body-tertiary">
      <CContainer>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>Create a new venue</CCardHeader>
              <CCardBody>
                <CForm
                  noValidate
                  validated={validated}
                  onSubmit={handleSubmit}
                  onReset={() => setValidated(false)}
                >
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilHouse} />
                    </CInputGroupText>
                    <CFormInput
                      feedbackValid="Looks good!"
                      feedbackInvalid="Please enter name for venue."
                      name="name"
                      required
                      placeholder="Venue Name"
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilAddressBook} />
                    </CInputGroupText>
                    <CFormInput
                      required
                      name="address"
                      placeholder="Venue Address"
                      feedbackValid="Looks good!"
                      feedbackInvalid="Please enter address for venue."
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilDescription} />
                    </CInputGroupText>
                    <CFormTextarea
                      required
                      rows="3"
                      name="description"
                      placeholder="Description"
                      feedbackValid="Looks good!"
                      feedbackInvalid="Please enter description for venue."
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol md={6}>
                      <CInputGroup className="mb-5">
                        <CInputGroupText>
                          <CIcon icon={cilMoney} />
                        </CInputGroupText>
                        <CFormInput
                          required
                          name="ticketPrice"
                          min={0.01}
                          placeholder="Ticket Price"
                          feedbackValid="Looks good!"
                          feedbackInvalid="Please enter a ticket price for venue."
                        />
                      </CInputGroup>
                    </CCol>
                    <CCol md={6}>
                      <CInputGroup className="mb-5">
                        <CInputGroupText>
                          <CIcon icon={cilImagePlus} />
                        </CInputGroupText>
                        <CFormInput
                          type="file"
                          id="imageVenue"
                          name="image"
                          aria-label="Upload an image for venue"
                          accept="image/*"
                          feedbackValid="Looks good!"
                          feedbackInvalid="Please upload an image for venue."
                          required
                        />
                      </CInputGroup>
                    </CCol>
                  </CRow>

                  <hr className="mb-3" />
                  <p className="h6 mb-3">Manager Login Details</p>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      required
                      name="managerName"
                      placeholder="Manager Name"
                      autoCorrect="off"
                      autoComplete="off"
                      feedbackValid="Looks good!"
                      feedbackInvalid="Please enter manager name for venue."
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilEnvelopeLetter} />
                    </CInputGroupText>
                    <CFormInput
                      required
                      name="managerEmail"
                      placeholder="Manager login email"
                      autoCorrect="off"
                      autoComplete="off"
                      feedbackValid="Looks good!"
                      feedbackInvalid="Please enter manager email to login."
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      required
                      type="password"
                      name="managerPassword"
                      placeholder="Manager Password"
                      autoCorrect="off"
                      autoComplete="off"
                      feedbackValid="Looks good!"
                      feedbackInvalid="Please enter manager password for venue."
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      required
                      type="password"
                      name="managerConfirmPassword"
                      placeholder="Confirm Password"
                      autoCorrect="off"
                      autoComplete="off"
                      feedbackValid="Looks good!"
                      feedbackInvalid="Please confirm manager password for venue."
                    />
                  </CInputGroup>

                  <CRow>
                    <CCol xs={6}>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUserFemale} />
                        </CInputGroupText>
                        <CFormSelect name="managerGender" aria-label="Select gender">
                          <option value={''}>Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </CFormSelect>
                      </CInputGroup>
                    </CCol>
                    <CCol xs={6}>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilCalendar} />
                        </CInputGroupText>
                        <CFormInput name="managerDob" type="date" placeholder="Date of birth" />
                      </CInputGroup>
                    </CCol>
                  </CRow>

                  <hr className="mb-3" />

                  <p className="h6 mb-3">Staff Login Details</p>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      required
                      name="staffName"
                      placeholder="Staff Name"
                      autoCorrect="off"
                      autoComplete="off"
                      feedbackValid="Looks good!"
                      feedbackInvalid="Please enter staff name for venue."
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilEnvelopeLetter} />
                    </CInputGroupText>
                    <CFormInput
                      required
                      name="staffEmail"
                      placeholder="Staff login email"
                      autoCorrect="off"
                      autoComplete="off"
                      feedbackValid="Looks good!"
                      feedbackInvalid="Please enter staff email to login."
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      required
                      type="password"
                      placeholder="Staff Password"
                      name="staffPassword"
                      autoCorrect="off"
                      autoComplete="off"
                      feedbackValid="Looks good!"
                      feedbackInvalid="Please enter staff password for venue."
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      required
                      type="password"
                      name="staffConfirmPassword"
                      placeholder="Confirm Password"
                      autoCorrect="off"
                      autoComplete="off"
                      feedbackValid="Looks good!"
                      feedbackInvalid="Please confirm staff password for venue."
                    />
                  </CInputGroup>

                  <CRow>
                    <CCol xs={6}>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUserFemale} />
                        </CInputGroupText>
                        <CFormSelect name="staffGender" aria-label="Select gender">
                          <option value={''}>Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </CFormSelect>
                      </CInputGroup>
                    </CCol>
                    <CCol xs={6}>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilCalendar} />
                        </CInputGroupText>
                        <CFormInput name="staffDob" type="date" placeholder="Date of birth" />
                      </CInputGroup>
                    </CCol>
                  </CRow>

                  <CRow>
                    <CCol xs={6}>
                      <CButton color="primary" className="col-12" type="submit">
                        Create Venue
                      </CButton>
                    </CCol>
                    <CCol xs={6}>
                      <CButton color="secondary" className="col-12" type="reset">
                        Reset
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default CreateVenue
