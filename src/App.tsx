// import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
// import Header from './component/Header'
import Home from './pages/Home'
import Result from './component/Result'
import Search from './component/Search'
import Details from './pages/Details'
import SignUpPage from './pages/Signuppage'
import SignInPage from './pages/Signinpage'
import ProtectedRoute from './protected/Protectedroute'
import TravelerDetails from './pages/Travelerdetails'
import SavedFlights from './pages/Savedflights'


function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/results" element={<Result />} />
        <Route path="/flights/:id" element={<Details />} />
        <Route path="/traveler-details" element={<TravelerDetails />} />


        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />

        // only the authenticated users can access the details page, if not they will be redirected to the sign-in page
        <Route path="/flights" element={ProtectedRoute({ children: <SavedFlights /> })} />
        {/* <Route path="/traveler-details" element={ProtectedRoute({ children: <TravelerDetails /> })} /> */}
      </Routes>
    </>
  )
}

export default App
