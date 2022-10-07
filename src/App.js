import './App.css';
import React from 'react';

import swal from '@sweetalert/with-react';


//import LoadingOverlay from 'react-loading-overlay';
import LoadingOverlay from '@ronchalant/react-loading-overlay';
//import { isEditable } from '@testing-library/user-event/dist/utils';
const production = false
const API = production ? 'https://api.easi.boxpower.cloud/api/v1': 'https://dev.api.easi.boxpower.cloud/api/v1'

const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiM2I3YWM1YjNjZjhmZWZjYzljNmEwNjU1ZWQ0Yjc5ZTUwZGRmNTUyNmJkYmQ0YzZhMTFkNzNiMjhmYjJmMDU4ZDllYjk0YzE3NDRkODFiY2YiLCJpYXQiOjE2NjUxMzYwODIuMzA0OTc1LCJuYmYiOjE2NjUxMzYwODIuMzA0OTc4LCJleHAiOjE2NjU3NDA4ODIuMTczNDkxLCJzdWIiOiIyIiwic2NvcGVzIjpbXX0.Lseeaa9_6CSc5BE9sIVC9DIEWIovR8eCRqj0L4CAsPv6lDdfQY1Gk-1iZa3y5OAbZbS_GGsg6BtIcnuhJ04io7BXSnc6UqjYJXAAjZsCfurt3BUCKF4Jh037DDWKmi6a1l5eKnBDdO7ZHDknpxqhd-eNxU-2WEfFeXqIbWK2qZmayBw4fzRvuaM2PrcR_k4p0-GLILAglv_hGXbNrbhc_8WucYR_eDgaqNnBX-dy_kuplOvDmZl9fGwzHLfMHhH9wyU2VYXdZCBqBcxkRrKvgsK6WBOG-Yp-UuHiTNC1N0uykQ7t87U2zhBk5z2gvmFhpuVGXSFYdQsGfk6WMwdr1WvhDkNZowKzS72Nv58WXi2WG_UT7BTFWW6w7Kaabh2ooF1iGTMj1Rkdfqm4jJLe-o8T0Gp_5cw5CaEnBHvat5mBtpFH55qCGl4bcMNLubZ9lQSZRng2XN9vRw49kjk3gfZsS2fngehYmUYgKDQy8vdfKcKQBA2YIBu293O70DaNat5kYZdsAQJKFgMdLturUxuJpFvQffhha4PcjtVxhQkhrI26F32LlbwHDF87iq7YJyQ6XmXZ5qIIb3RGUt5-tLYvIRhdUz2RnWA6K_weoqR5rP16yL4Lgt0eFc3PPjHXepWprk0U5wIrx8jl6ZUVbMQaPs-bCXdshPUHkd3eFcA";


const App = () => {
  const [ overlayActive, setOverlayActive ] = React.useState(false);
  const [ overlayText, setOverlayText ] = React.useState('');
  const [ sites, setSites ] = React.useState([]);
  
  const [ site, setSite ] = React.useState({ site_name: "", customer_name: "", customer_email: "" });
  const [ reason, setReason ] = React.useState('');

  React.useEffect(() => {
    fetch(`${API}/service-outage-emails`,{
      method: "GET",
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    }).then((res) => res.json()).then( async (res) => {
      //console.log("res", res.data.data);
      if (res.status) {
        setSites(res.data.data);
      }
    }).catch((error) => {
      console.log("Error: ", error);
    });
  }, []);

  const _onChangeSite = (e) => {
    const index = sites.findIndex(x => x.site_name === e.target.value );

    setSite(sites[index]);
  }
  const _onChangeText = (e) => {
    const data = { ...site };
    data[e.target.name] = e.target.value;
    setSite(data);
  }
  const _onChangeReason = (e) => {
    setReason(e.target.value)
  }

  const sendEmail = () => {
    const payload = { name: site.customer_name, email: site.customer_email, reason };

    if (site.customer_name.length && site.customer_email.length && reason.length) {

      setOverlayActive(true);
      setOverlayText(`Sending e-mail to ${site.customer_email}...`);

      fetch(`${API}/service-outage-emails/send-email`,{
        method: "POST",
        headers: { Accept: "application/json", 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      }).then((res) => res.json()).then( async (res) => {
        //console.log("res", res);
        if (res.status) {
          //alert(res.message);
          
          swal(`${res.message} to: ${site.customer_email}!`, { icon: "success" });
          setReason('')
          setSite({ site_name: "", customer_name: "", customer_email: "" });
        }
        setOverlayActive(false);
        setOverlayText('');
      }).catch((error) => {
        console.log("Error: ", error);
        
        swal(`An error occor, please try again`, { icon: "error" });
        setOverlayActive(false);
      });
    } else {
      //alert("All fields are required.");
      
      swal(`All fields are required.`, { icon: "error" });
    }
  }
  
  return (
    <LoadingOverlay active={overlayActive} className="loading-overlay" spinner text={overlayText} >
      <div className="App">
        <nav className="navbar navbar-expand-lg bg-light">
          <div className="container">
            <a className="navbar-brand" href="/">
              <img style={{ width: 60 }} src="/logo-256.png" alt='' /> 
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent"></div>
          </div>
        </nav>

        <h1>Service Outage Email Portal</h1>

        <div className="container mail-form-control">
          <div className="mb-3">
            <label htmlFor="select-site" className="form-label">Select Site</label>
            <select id="select-site" onChange={_onChangeSite} className="form-select" value={site.site_name} aria-label="Select Site">
              <option value="">Select Site</option>
              { sites.map((item, i) => <option key={i} value={item.site_name}>{item.site_name}</option> )}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="customer-name" className="form-label">Customer Name</label>
            <input type="text" onChange={_onChangeText} name="customer_name" value={site.customer_name} className="form-control" id="customer-name" placeholder="Customer Name" />
          </div>
          <div className="mb-3">
            <label htmlFor="customer-email" className="form-label">Customer Email</label>
            <input type="email" onChange={_onChangeText} name="customer_email" value={site.customer_email} className="form-control" id="customer-email" placeholder="Customer Email" />
          </div>
          <div className="mb-3">
            <label htmlFor="reason-for-outage" className="form-label">Reason For Outage</label>
            <textarea value={reason} className="form-control" onChange={_onChangeReason} id="reason-for-outage" rows="6"></textarea>
          </div>
          <div className="mb-3">
            <button type="button" onClick={sendEmail} className="btn btn-outline-secondary">Send</button>
          </div>
        </div>
      </div>
    </LoadingOverlay>
  );
}

export default App;
