import Banner from "../components/Home/Banner"
import Header from "../components/Home/Header"
import SpecialityMenu from "../components/Home/SpecialityMenu"
import TopDoctors from "../components/Home/TopDoctors"


function Home() {
  return (
    <div>
      <Header/>
      <SpecialityMenu />
      <TopDoctors />
      <Banner />
    </div>
  )
}

export default Home
