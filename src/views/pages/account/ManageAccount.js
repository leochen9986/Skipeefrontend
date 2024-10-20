import React, { useState, useEffect, useRef } from 'react';
import PageTopBar from '../../../components/PageTopBar'
import {
  CAlert,
  CButton,
  CForm,
  CFormInput,
  CImage,
  CSpinner,
  CTab,
  CTabContent,
  CTabList,
  CTabPanel,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTabs,
  CFormSelect,
  CTableFoot 
} from '@coreui/react'
import './account.scss'
import '../event/events.scss'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import { AuthApiController } from '../../../api/AuthApiController'
import PopupModelBase from '../../popup/PopupModelBase'
import { VenuApiController } from '../../../api/VenuApiController'
import Register from '../register/Register'
import { toast } from 'react-toastify'
import chosen_fileIcon from 'src/assets/icon_svg/chosen_file.svg';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import stripeIcon from 'src/assets/icon_svg/stripe.svg';

export const ManageAccountPage = () => {
  const [profile, setProfile] = useState(null)
  useEffect(() => {
    new AuthApiController().getProfile().then((res) => {
      if (res.message) {
        toast.error(res.message)
        new AuthApiController().logout()
      } else {
        if (res && !res.worksIn) {
          nav('/apply-now')
        }
        console.log('account page', res)
        setProfile(res)
      }
    })
    
  }, [])
  
  return (
    <>
      <PageTopBar />
      <div className='title-bold'>Manage Users</div>
      <div className="py-5 mb-5 paper">
        <CTabs activeItemKey={1}>
          <CTabList variant="underline-border" color="success">
            <CTab aria-controls="all-events-pane" itemKey={1} className='tab-color'>
              Settings
            </CTab>
            <CTab aria-controls="upcoming-tab-pane" itemKey={2} className='tab-color'>
              My Employees
            </CTab>
            <CTab aria-controls="draft-tab-pane" itemKey={3} className='tab-color'>
              Payouts
            </CTab>
          </CTabList>
          <CTabContent>
            <CTabPanel className="py-3" aria-labelledby="all-events-pane" itemKey={1}>
              <SettingsTab profile={profile} />
            </CTabPanel>
            <CTabPanel className="py-3" aria-labelledby="upcoming-tab-pane" itemKey={2}>
              <AdminAccountTab siteId={profile?.worksIn?._id} />
            </CTabPanel>
            <CTabPanel className="py-3" aria-labelledby="draft-tab-pane" itemKey={3}>
              <PayoutTab profile={profile} />
            </CTabPanel>
          </CTabContent>
        </CTabs>
      </div>
    </>
  )
}

const SettingsTab = ({ profile }) => {
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const fileInputRef = useRef(null); 


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setImageUrl(URL.createObjectURL(e.target.files[0]));  // Show image preview
  };


  const handleButtonClick = () => {
    fileInputRef.current.click(); // Trigger click on the hidden file input
  };

  const handleUploadLogo = async () => {
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await new VenuApiController().uploadLogo(profile.worksIn._id, formData);
      setImageUrl(response.logo); // Update the logo after a successful upload
      toast.success('Logo updated successfully');
    } catch (error) {
      toast.error('Failed to upload logo');
    }
  };

  useEffect(() => {
    if (profile) {
      setName(profile.worksIn.name);
      setPhone(profile.worksIn.phone);
      setEmail(profile.worksIn.email);
      setImageUrl(profile.worksIn.logo);
    }
  }, [profile]);

  return (
    <CForm className="w-50 px-4">
      <div>
      <div className="image-container">
          <CImage src={imageUrl} fluid style={{ maxWidth: '100px', maxHeight: '100px' }} />

          <div className="image-upload-box">
          <h3 className="setting-label">Organisation Logo</h3> 
            {/* <label htmlFor="file-upload" className="upload-label">
              Upload Logo
            </label> */}
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', minWidth:'100%'}}>
              <input
                type="text"
                readOnly
                value={file ? file.name : ''}
                placeholder="No file chosen"
                className='setting-input'
              />
              <button
                onClick={handleButtonClick}
                className='setting-btn'
              >
                <img 
                  src={chosen_fileIcon} 
                  alt="Choose file" 
                  className='setting-input-img'
                />
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".jpg,.png,.gif"
              style={{ display: 'none' }} // Hide the default input
            />
          </div>
        </div>

        <br/>

        <h3 className="setting-label">Organisation Name</h3> 
        <CFormInput
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder="Enter organizer name"
          autoComplete="organizer-name"
          size="lg"
          disabled={true} // You may want to change this if you want to allow editing
          className="setting-input"
        />

      <br/>

      <div>
        <h3 className="setting-label">Phone Number</h3>
        <CFormInput
          onChange={(e) => setPhone(e.target.value)}
          value={phone}
          placeholder="Enter phone number"
          autoComplete="phone-number"
          size="lg"
          disabled={true} // You may want to change this if you want to allow editing
          className="setting-input"
        />
      </div>

      <br/>

      <div>
        <h3 className="setting-label">Email</h3>
        <CFormInput
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="Enter email"
          autoComplete="email"
          size="lg"
          disabled={true} // You may want to change this if you want to allow editing
          className="setting-input"
        />
      </div>
        
        </div>

        {/* <h3 className="input-lbl-md">Organizer Name</h3>
        <CFormInput
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder="Enter organizer name"
          autoComplete="organizer-name"
          size="lg"
          disabled={true} // You may want to change this if you want to allow editing
          className="input-comp-md"
        />
      

      <div>
        <h3 className="input-lbl-md">Phone Number</h3>
        <CFormInput
          onChange={(e) => setPhone(e.target.value)}
          value={phone}
          placeholder="Enter phone number"
          autoComplete="phone-number"
          size="lg"
          disabled={true} // You may want to change this if you want to allow editing
          className="input-comp-md"
        />
      </div>
      <div className="mt-4 image-upload-container">
        <h3 className="input-lbl-md">Organizer Logo</h3>
        {imageUrl ? (
          <CImage src={imageUrl} fluid style={{ maxWidth: '312px', maxHeight: '312px' }} />
        ) : (
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
        )}
      </div> */}
    </CForm>
  )
}

const AdminAccountTab = ({ siteId }) => {
  const [popupVisible, setPopupVisible] = useState(false)
  const [popupChildren, setPopupChildren] = useState(null)

  const [employees, setEmployees] = useState(null)

  useState(() => {
    new VenuApiController().getMyEmployees().then((res) => {
      setEmployees(res)
    })
  }, [])
  return (
    <>
      {/* <CButton
        color="success text-white"
        onClick={() => {
          setPopupChildren(<AddNewEmployee siteId={siteId} />)
          setPopupVisible(true)
        }}
      >
        Add An Employee
      </CButton> */}

      <br />
      <div style={{backgroundColor:'#ddd',borderRadius: '8px',}}>
      <CTable
          style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            overflow: 'hidden', // Ensures rounded corners are visible
          }}
        >
          <CTableHead>
            <CTableRow style={{ borderBottom: '2px solid #ddd' }}>
              <CTableHeaderCell className='table-header-cell'>Name</CTableHeaderCell>
              <CTableHeaderCell className='table-header-cell'>Email</CTableHeaderCell>
              <CTableHeaderCell className='table-header-cell'>Role</CTableHeaderCell>
              <CTableHeaderCell className='table-header-cell'>Last Seen</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {employees?.map((emp, index) => {
              return (
                <CTableRow key={index} style={{ borderBottom: '1px solid #ddd' }}>
                  <CTableDataCell className='table-data-cell'>{emp.name}</CTableDataCell>
                  <CTableDataCell className='table-data-cell'>{emp.email}</CTableDataCell>
                  <CTableDataCell className='table-data-cell'>{emp.role}</CTableDataCell>
                  <CTableDataCell className='table-data-cell'>
                    {(() => {
                      const [year, month, day] = emp.lastSeen.split('T')[0].split('-');
                      return `${day}/${month}/${year}`;
                    })()}
                  </CTableDataCell>
                </CTableRow>
              );
            })}
          </CTableBody>

          <CTableFoot>
            <CTableRow>
              <CTableHeaderCell className='table-header-cell-end'></CTableHeaderCell>
              <CTableHeaderCell className='table-header-cell-end'></CTableHeaderCell>
              <CTableHeaderCell className='table-header-cell-end'></CTableHeaderCell>
              <CTableHeaderCell
                className='table-header-cell-end'
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  padding: '0px 20px 0px 0px',
                }}
              >
                <CButton
                  color="success text-white"
                  onClick={() => {
                    setPopupChildren(<AddNewEmployee siteId={siteId} />);
                    setPopupVisible(true);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    borderRadius: '20px',
                    padding: '0px 20px',
                  }}
                >
                  Add An Employee
                  <span style={{ fontSize: '2rem', marginLeft: '5px', fontWeight: '200' }}>+</span>
                </CButton>
              </CTableHeaderCell>
            </CTableRow>
          </CTableFoot>
        </CTable>
        </div>

      <PopupModelBase
        visible={popupVisible}
        onClose={() => {
          setPopupVisible(false)
        }}
        title="Add Users"
        children={popupChildren}
      />
    </>
  )
}

const PayoutTab = ({ profile }) => {
  const [accountObject, setAccountObject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile) {
      return
    }
    new VenuApiController().getAccountLinks().then((res) => {
      setAccountObject(res)
      setLoading(false)
    })
  }, [profile])

  const translateRequirement = (requirement) => {
    const translations = {
      'business_profile.mcc': 'Business category',
      'business_profile.url': 'Business website',
      business_type: 'Type of business',
      external_account: 'Bank account information',
      'representative.address.city': 'City of business representative',
      'representative.address.line1': 'Address of business representative',
      'representative.address.postal_code': 'Postal code of business representative',
      'representative.dob.day': 'Day of birth of business representative',
      'representative.dob.month': 'Month of birth of business representative',
      'representative.dob.year': 'Year of birth of business representative',
      'representative.email': 'Email of business representative',
      'representative.first_name': 'First name of business representative',
      'representative.last_name': 'Last name of business representative',
      'representative.phone': 'Phone number of business representative',
      'tos_acceptance.date': 'Date of Terms of Service acceptance',
      'tos_acceptance.ip': 'IP address of Terms of Service acceptance',
      'company.address.city': 'Company city',
      'company.address.line1': 'Company address',
      'company.address.postal_code': 'Company postal code',
      'company.directors_provided': 'Company directors information',
      'company.executives_provided': 'Company executives information',
      'company.name': 'Company name',
      'company.owners_provided': 'Company owners information',
      'company.phone': 'Company phone number',
      'company.tax_id': 'Company tax ID',
      'directors.dob.day': 'Day of birth of company director',
      'directors.dob.month': 'Month of birth of company director',
      'directors.dob.year': 'Year of birth of company director',
      'directors.email': 'Email of company director',
      'directors.first_name': 'First name of company director',
      'directors.last_name': 'Last name of company director',
      'directors.relationship.title': 'Title of company director',
      'executives.address.city': 'City of company executive',
      'executives.address.line1': 'Address of company executive',
      'executives.address.postal_code': 'Postal code of company executive',
      'executives.dob.day': 'Day of birth of company executive',
      'executives.dob.month': 'Month of birth of company executive',
      'executives.dob.year': 'Year of birth of company executive',
      'executives.email': 'Email of company executive',
      'executives.first_name': 'First name of company executive',
      'executives.last_name': 'Last name of company executive',
      'owners.address.city': 'City of company owner',
      'owners.address.line1': 'Address of company owner',
      'owners.address.postal_code': 'Postal code of company owner',
      'owners.dob.day': 'Day of birth of company owner',
      'owners.dob.month': 'Month of birth of company owner',
      'owners.dob.year': 'Year of birth of company owner',
      'owners.email': 'Email of company owner',
      'owners.first_name': 'First name of company owner',
      'owners.last_name': 'Last name of company owner',
    }

    return translations[requirement] || null
  }

  const renderRequirements = () => {
    if (!accountObject.account.requirements.currently_due.length) {
      return null
    }
    return (
      <CAlert color="warning" style={{color:'#ff9800'}}>
        <p>
          To complete your account setup and start accepting payments, we need the following
          information:
        </p>
        <ul>
          {accountObject.account.requirements.currently_due.map(
            (item, index) =>
              translateRequirement(item) && <li key={index}>{translateRequirement(item)}</li>,
          )}
        </ul>
      </CAlert>
    )
  }

  if (loading) {
    return <CSpinner color="primary" />
  }

  return (
    <>

      {!accountObject.canAcceptPayments && (
        <>
          {/* {renderRequirements()} */}
          <CAlert color="warning" >
            <p style={{color:'#ff9800'}}>Your account is not fully set up to accept payments.</p>
          </CAlert>
          <p >Please complete the Stripe account setup to start receiving payments.</p>

          {accountObject.accountLink && (
            <CButton
              color="primary"
              href={accountObject.accountLink}
              target="_blank"
              rel="noopener noreferrer"
              className='text-white'
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                borderRadius: '20px',
                padding: '0px 20px',
                width: '25%',
                border:'none',
              }}
            >
              Complete Stripe Account Setup
            </CButton>
          )}
        </>
      )}

      {accountObject.canAcceptPayments && (
        <>
          <CAlert color="success" style={{ color: '#1DB954', backgroundColor: '#E8F8EE' }}>
            Your account is fully set up to accept payments. You can now add payment methods to receive funds.
          </CAlert>
          {/* Parent div to hold the buttons */}
          <div
            style={{
              display: 'flex',         // Use flexbox for alignment
              justifyContent: 'flex-end', // Align items to the right
              gap: '10px',            // Space between buttons
              marginTop: '10px',       // Optional: space above buttons

            }}
          >

            <CButton
              color="success"
              className="text-white"
              href={accountObject.accountLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                borderRadius: '20px',
                padding: '0px 20px',
                width: '20%',
              }}
            >
              Add Payment Method
              <span style={{ fontSize: '2rem', marginLeft: '5px', fontWeight: '200' }}>+</span>
            </CButton>

            {accountObject.dashboardLink && (
              <CButton
                color="info"
                href={accountObject.dashboardLink}
                target="_blank"
                rel="noopener noreferrer"
                className="dashboard-button ml-2" 
              >
                Go to Stripe Dashboard
                {/* Add the SVG icon */}
                <img
                  src={stripeIcon}
                  alt="Stripe Icon"
                  style={{ width: '20px', height: '20px', marginLeft: '10px' }}
                />
              </CButton>

            )}
          </div>
        </>
      )}

      
    </>
  )
}

const AddNewEmployee = ({ siteId }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('employee')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [worksIn, setWorksIn] = useState(siteId)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Toggle visibility for password
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle visibility for confirm password
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name) {
      toast.warning('Please enter name')
      return
    }

    if (!email) {
      toast.warning('Please enter email')
      return
    }

    if (!role) {
      toast.warning('Please enter role')
      return
    }

    if (!password) {
      toast.warning('Please enter password')
      return
    }

    if (!confirmPassword) {
      toast.warning('Please confirm password')
      return
    }

    if (password !== confirmPassword) {
      toast.warning('Passwords do not match')
      return
    }

    new AuthApiController().register({ name, email, password, role, worksIn }).then((res) => {
      if (res.message) {
        toast.error(res.message)
      } else {
        toast.success('Employee added successfully. Please login with your credentials')
        setName('')
        setEmail('')
        setRole('')
        setPassword('')
        setConfirmPassword('')
      }
    })
  }

  return (
    <CForm className="w-100 px-4" style={{backgroundColor:'white'}}>
      <div className="mb-3" >
        <h3 className="setting-label">Name</h3>
        <CFormInput
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder="Enter name"
          autoComplete="name"
          size="lg"
          className="setting-input"
        />
      </div>
      <div className="mb-3">
        <h3 className="setting-label">Email</h3>
        <CFormInput
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="Enter email"
          autoComplete="email"
          size="lg"
          className="setting-input"
        />
      </div>
      <div className="mb-3">
      <h3 className="setting-label">Role</h3>
      <div className="custom-select-container">
      <CFormSelect
        onChange={(e) => setRole(e.target.value)}
        value={role}
        size="lg"
        className="setting-input custom-select-icon"
      >
        <option value="employee">employee</option>
        <option value="admin">admin</option>
      </CFormSelect>

    </div>

    </div>

      {/* Password Field */}
      <div className="mb-3 position-relative" >
        <h3 className="setting-label">Password</h3>
        <div className="mb-3 position-relative">
        <CFormInput
          type={showPassword ? 'text' : 'password'} // Toggle between text and password type
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          placeholder="Enter password"
          autoComplete="password"
          size="lg"
          className="setting-input"
        />
        {/* Eye Icon */}
        <span
          className="position-absolute end-0 top-50 translate-middle-y pe-3"
          style={{ cursor: 'pointer', color: '#A6A6A9' }}  // Icon color
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <AiFillEyeInvisible size={24} /> : <AiFillEye size={24} />}
        </span>
        </div>
      </div>

      {/* Confirm Password Field */}
      <div className="mb-3 position-relative">
        <h3 className="setting-label">Confirm Password</h3>
        <div className="mb-3 position-relative">
        <CFormInput
            type={showConfirmPassword ? 'text' : 'password'}
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            placeholder="Enter confirm password"
            autoComplete="confirm-password"
            size="lg"
            className="setting-input-confirm"
            style={{
              borderColor: confirmPassword && password !== confirmPassword ? 'red' : '#ccc',  
            }}
          />
        {/* Eye Icon */}
        <span
          className="position-absolute end-0 top-50 translate-middle-y pe-3"
          style={{ cursor: 'pointer', color: '#A6A6A9'}}  // Icon color
          onClick={toggleConfirmPasswordVisibility}
        >
          {showConfirmPassword ? <AiFillEyeInvisible size={24} /> : <AiFillEye size={24} />}
        </span>
        </div>
                {/* Warning Message */}
                {password && password.length < 8 && (
                  <div style={{ marginTop: '20px',marginBottom:'-10px', color: 'black' }}> 
                    Minimum 8 characters
                  </div>

        )}

      </div>

      <div style={{padding:'15px 0px',}}>
      <CButton color="success text-white" className='model-save-btn' onClick={handleSubmit}>
        Save
      </CButton>
      </div>
    </CForm>
  )
}
