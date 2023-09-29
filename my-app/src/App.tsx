import React, { useEffect, useState } from "react";
import { CategoryItem } from "./types"; 
import "./App.css";

function App() {

  const [categories, setCategories] = useState<any>(null)
  const [username, setUsername] = useState<string>("")
  const [userSector, setUserSector] = useState<string[]>([]) // stores user selected options
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false)


  useEffect(() => {
      // Fetch sectors on page load and when userSector changes
      fetch("http://localhost:4000/api/get-sectors")
      .then(res => res.json())
      .then(data => setCategories(data.data))
      .catch((err) => console.log(err));
    }, [userSector]);


  useEffect(() => {
    // Fetch user data on page load and set username and user sectors
    fetch("http://localhost:4000/api/get-user", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(res => res.json())
    .then(resJson => {
      const userSectors: any = [] // Stores user sectors
      if (resJson.data){
        // iterates through user sectors and adds them to userSectors array
        resJson.data.forEach((element: any) => {
          userSectors.push(element.sector)
        });
        setUsername(resJson.data[0].name)
        setUserSector(userSectors)
      }
      console.log(userSectors)
    })
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitLoading(true)

    fetch("http://localhost:4000/api/save-user", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({name: username, sectors: userSector}),
    })
    .then(res => {
      alert("User saved successfully")
    })
    .catch( err => {
      alert("Error saving user, please try again!\nError:" + err)
    })
    .finally(() => {
      setIsSubmitLoading(false)
    })
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSector = e.target.value

    if (userSector.includes(selectedSector)){
      // if userSector already includes selected sector, remove it from array
      const newSectors = userSector.filter((sector: string) => sector !== selectedSector)
      setUserSector(newSectors)
      return
    }
    
    // add selected sector to userSector array
    setUserSector([...userSector, selectedSector])
  }

  let categoryOptions: React.ReactNode  = []
  if (categories)  {

      // iterate through categories and create options
      categoryOptions = categories.map((item: CategoryItem, value: number) => {
      
      const sector = item.sector.replace('&amp;', '&')
      const subcategory = item.subcategory.replace('&amp;', '&')
      const category = item.category.replace('&amp;', '&')
      const children = item.children

      if (category && !subcategory && !sector){
          return <option disabled key={value} value={category} className="category">{category}</option>
      }

      if (subcategory && !sector){
        return <option key={value} value={subcategory} disabled={true ? children === 1 : false} className="subcategory">{subcategory}</option>
      }

      if (sector) {
        return <option key={value} value={sector} className="sector">{sector}</option>
      }
  })
}
  return (
    <main>
      Please enter your name and pick the Sectors you are currently involved in.
      <br />
      <br />
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Name:</label>
        <input onChange={handleUsernameChange} required id="username" type="text" value={username}/>
        <br />
        <br />
        {categories && (
          <>
          <label htmlFor="select-sectors">Sectors:</label>
          <select onChange={handleSelectChange} id="select-sectors" value={userSector} multiple size={5}>
            {categoryOptions}
          </select>
          </>
        )}
        <br />
        <br />
        <label htmlFor="agree-to-terms">Agree to terms </label>
        <input id="agree-to-terms" required type="checkbox" /> Agree to terms
        <br />
        <br />
        <input required type="submit" value="Save" />
      </form>
    </main>
  );
}

export default App;
