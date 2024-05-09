import { BrowserRouter, Routes, Route, } from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import SignInForm from "./components/auth/Signinform";
import SignUpForm from './components/auth/Signupform';
import Homepage from './components/home/homepage';
import Profile from './components/profile/profilepage';
import SearchPage from './components/search/searchPage';
import { TokenProvider } from './components/miscellaneous/tokenContext';
import EditProfile from './components/profile/editprofile';
import NoPage from './components/miscellaneous/404';
import App from './App';
import CreatePosts from './components/posts/createposts';
import EditPost from './components/posts/editpost';
import ProfileCard from './components/profile/profilecard';
import SavedPosts from './components/savedposts/savedposts';
import { ThemeProvider } from './components/miscellaneous/themecontext';
import Message from './components/message/message';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
    <TokenProvider>
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<App/>}>
      <Route path='home' element={<Homepage/>}/>
      <Route path='profile/:userName' element={<Profile/>}/>
      <Route path='search' element={<SearchPage/>}/>
      <Route path=':userName/edit' element={<EditProfile/>}/>
      <Route path='createpost' element={<CreatePosts/>}/>
      <Route path='editPost/:id' element={<EditPost/>}/>
      <Route path='message/:userName' element={<Message/>}/>
      <Route path='*' element={<NoPage/>}/>
      <Route path='profile/:userName/followers' element={<ProfileCard/>}/>
      <Route path='savedposts' element={<SavedPosts/>}/>
      </Route>
      <Route path='/sign-up' element={<SignUpForm/>}/>
      <Route path='/sign-in' element={<SignInForm/>}/>
    </Routes>
    </BrowserRouter>
    </TokenProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
