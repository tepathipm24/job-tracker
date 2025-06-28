import router from "../router";
import Swal from 'sweetalert2';

const appUrl = 'http://localhost:3000/applications'
const statusUrl = 'http://localhost:3000/status'

export async function getAllList() {
    try {
      const res = await fetch(appUrl,{
        method: 'GET',
        credentials: 'include'
    });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (err) {
      alert(err);
    }
  }

export async function getListPerPage(page, limit){
  try {
    const res = await fetch(`${appUrl}?page=${page}&limit=${limit}`,{
      credentials: 'include'
    });
    if(res.ok) {
      const data = await res.json();
      return data
    }
  } catch (err){
    alert(err)
  }
}
  
export async function getAllStatus() {
  try {
    const res = await fetch(statusUrl,{
      method: 'GET',
      credentials: 'include'
  });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    alert(err);
  }
}

export async function getSpecificApp(id){
  try{
    const res = await fetch(`${appUrl}/${id}`,{
      method: 'GET',
      credentials: 'include'
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    alert(err)
  }
}

export async function updateApplicationStatus(applicationId, statusId) {
  try {
    const res = await fetch(`${appUrl}/${applicationId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ statusId: statusId }),
      credentials: 'include'
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    alert(err);
  }
}

export async function updateApplication(id, application) {
  try {
    const res = await fetch(appUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(application),
      credentials: 'include'
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      const error = await res.text();
      throw new Error(error);
    }
  } catch (err) {
    alert(err);
    throw err;
  }
}

export async function addApplication(application) {
  try {
    const res = await fetch(appUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(application),
      credentials: 'include'
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    } else {
      const error = await res.text();
      throw new Error(error);
    }
  } catch (err) {
    console.error('Error update application:', err);
    throw err;
  }
}

export async function deleteApplication(id) {
  try {
    const res = await fetch(`${appUrl}/${id}`, {
      method: 'DELETE',
      credentials: 'include' 
    });

    if (res.ok) {
      return true; 
    } else {
      const errorText = await res.text();
      throw new Error(`Failed to delete application: ${errorText || res.statusText}`);
    }
  } catch (err) {
    console.error('Error deleting application:', err);
    throw err;
  }
}