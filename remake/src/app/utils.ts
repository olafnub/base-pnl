export const fetchTemplate = async (name: string, url: string) => {
    const response = await fetch(url, {
      next: {
        revalidate: 60
      }
    })
  
    if (!response) {
      console.log("Error in fetching reponse", name)
      return
    }
  
    return await response.json(); // data
  }