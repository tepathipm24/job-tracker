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