export async function generateEmail(data:any) {

    const response = await fetch("http://localhost/leavecraft/backend/generate_email.php",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify(data)
    })
  
    const result = await response.json()
  
    return result
  }